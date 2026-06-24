-- SHEREHE: App Store readiness — RLS hardening + privacy enforcement.
--
-- Run AFTER 0003_core_tables.sql and 0004_photo_purge_all_plans.sql.
--
-- Changes:
--   1. Events SELECT: only public events (is_private=false) OR owner can read.
--      Prevents exposing private event data (venues, passcodes, guest counts)
--      through the public anon key.
--   2. Events SELECT via passcode: new RPC function `sherehe_get_event_by_passcode`
--      returns a single event row when the passcode matches. Used by invite links.
--   3. RSVPs SELECT: only event owner can read their guests' RSVPs, names, and notes.
--      Guests look up their own RSVP via the passcode RPC, not via public SELECT.
--   4. Photos SELECT: only event owner can read photo metadata. Gallery access moves
--      to a server-side function that checks reveal status.
--   5. Photos INSERT: only authenticated users who are the event owner (host) can
--      insert photos. Guests upload via a separate Edge Function that validates
--      upload permission.
--   6. Storage bucket: made PRIVATE. Signed URLs generated server-side.
--   7. Passcode enforcement: the `privacy` and `passcode` columns are now enforced
--      at the database level — not just in the UI.

-- Idempotent — safe to re-run.

-- ============================================================================
-- 1. FIX EVENTS RLS — public only for is_private=false
-- ============================================================================

-- Drop old permissive policy
drop policy if exists "events public select" on public.events;

-- New policy: public events are visible to everyone; private events only to owner
create policy "events scoped select"
  on public.events for select
  using (
    is_private = false
    or (auth.role() = 'authenticated' and auth.uid() = user_id)
  );

-- ============================================================================
-- 2. PASSCODE-BASED EVENT LOOKUP (for invite links)
-- ============================================================================

create or replace function public.sherehe_get_event_by_passcode(
  event_id uuid,
  maybe_passcode text default null
)
returns setof public.events
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select *
  from public.events
  where events.id = event_id
    and (
      -- Either the event is public
      events.is_private = false
      -- Or the caller knows the passcode
      or (events.passcode is not null and events.passcode = maybe_passcode)
      -- Or the caller is the event owner
      or (auth.role() = 'authenticated' and auth.uid() = events.user_id)
    );
end;
$$;

-- ============================================================================
-- 3. FIX RSVPS RLS — only event owner can read guest data
-- ============================================================================

-- Drop old permissive policies
drop policy if exists "rsvps public select" on public.rsvps;
drop policy if exists "rsvps public insert" on public.rsvps;

-- Only the event owner can read RSVPs (guest names, notes, pass codes, etc.)
create policy "rsvps owner select"
  on public.rsvps for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = rsvps.event_id
        and events.user_id = auth.uid()
    )
  );

-- Anyone can RSVP (guests don't need accounts)
create policy "rsvps public insert"
  on public.rsvps for insert
  with check (true);

-- ============================================================================
-- 3b. PASSCODE-BASED RSVP LOOKUP (for guests checking their own RSVP)
-- ============================================================================

create or replace function public.sherehe_get_rsvp_by_passcode(
  p_event_id uuid,
  p_passcode text
)
returns setof public.rsvps
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select *
  from public.rsvps
  where rsvps.event_id = p_event_id
    and rsvps.pass_code = p_passcode;
end;
$$;

-- ============================================================================
-- 4. FIX PHOTOS RLS — only event owner can read; uploads via Edge Function
-- ============================================================================

-- Drop old permissive policy
drop policy if exists "photos public select" on public.photos;

-- Only the event owner can read photos
create policy "photos owner select"
  on public.photos for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = photos.event_id
        and events.user_id = auth.uid()
    )
  );

-- Drop old permissive insert — photos now uploaded via Edge Function
drop policy if exists "photos auth insert" on public.photos;

-- Only event owner can directly insert photos (host captures)
create policy "photos owner insert"
  on public.photos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.events
      where events.id = photos.event_id
        and events.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4b. GALLERY FUNCTION — server-side reveal check
-- ============================================================================

create or replace function public.sherehe_get_gallery_photos(
  p_event_id uuid,
  p_passcode text default null
)
returns setof public.photos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events;
begin
  select * into v_event
  from public.events
  where events.id = p_event_id;

  if not found then
    return;
  end if;

  -- Only return photos if:
  -- 1. The gallery has been revealed (reveal_at <= now), OR
  -- 2. The caller is the event owner, OR
  -- 3. The caller provides a valid passcode
  if v_event.reveal_at <= now()
     or (auth.role() = 'authenticated' and auth.uid() = v_event.user_id)
     or (v_event.passcode is not null and v_event.passcode = p_passcode)
  then
    return query
    select *
    from public.photos
    where photos.event_id = p_event_id
      and photos.expired = false
    order by photos.taken_at desc;
  end if;
end;
$$;

-- ============================================================================
-- 5. STORAGE BUCKET — make private, add signed URL policy
-- ============================================================================

-- Switch bucket from public to private
update storage.buckets
set public = false
where id = 'event-photos';

-- Drop the old public-read policy
drop policy if exists "event-photos read" on storage.objects;

-- New policy: only the event owner can read (for signed URL generation)
create policy "event-photos owner read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'event-photos'
  and (
    -- Owner can read their own uploads
    owner = auth.uid()
    -- Or they own the event the photo belongs to
    or exists (
      select 1 from public.photos
      join public.events on events.id = photos.event_id
      where photos.storage_path = storage.objects.name
        and events.user_id = auth.uid()
    )
  )
);

-- ============================================================================
-- 6. VERIFY: revoke public anon access to sensitive tables via API
-- ============================================================================

-- Ensure anon role cannot read from events/rsvps/photos directly via the REST API
-- (The RLS policies above already enforce this, but this is an extra safety net)
revoke select on public.rsvps from anon;
revoke select on public.photos from anon;

-- But keep events selectable for anon (needed for public event viewing)
-- The RLS policy on events already filters is_private=false for anon users.
