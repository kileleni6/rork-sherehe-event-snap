# QR check-in, guest passes, camera & gallery rules, and add-to-calendar

Here's what I'll build next so SHEREHE handles real-world events end-to-end — from invite to door scan to camera.

## New step in Create Event: "Camera & gallery rules"
A 6th step inserted before the preview so hosts can dial in the experience.
- **Shots per guest** — slider with quick picks (5 / 10 / 24 / 36 / Unlimited). Default 10 (disposable-camera feel).
- **Reveal time** — choose when the gallery unlocks: at event start, +1h, +6h, +24h after event, or pick a custom date/time. Manual override stays available.
- **Who can upload** — All guests / RSVP'd only / Host-approved only.
- **Privacy** — Private link only / Public link / Password-protected (host sets a passcode shown on invite).
- **Gallery visibility** — Everyone after reveal / RSVP'd only / Host-only.
- **Check-in mode** — Off (default, open event) or On (track arrivals).

These settings show up as a summary card on the preview step so the host sees the final rules before publishing.

## Guest pass screen (every invited guest gets one)
- Each RSVP generates a unique guest pass with the guest's name, RSVP status, and a personal QR code.
- Lives at a clean "My pass" screen inside the invite — guests can pull it up at the door.
- Shows shot quota ("10 photos left"), check-in status ("Not checked in" → "Checked in 7:42 PM"), and a quick **Open camera** button once unlocked.
- Adds the event to their calendar, shows venue + directions, and the schedule.

## Gatekeeper / check-in mode
- New **"Check in guests"** button on the host's event screen (only visible when check-in is on).
- Full-screen scanner using the device camera. Scans a guest pass QR → instantly shows the guest's name, RSVP status, +guests, and a big **Check in** button.
- Manual search fallback for guests without a phone — host can tap a name in the list to mark them in.
- Live arrivals counter ("47 of 120 arrived"), arrival timeline, and a "Not yet arrived" list.
- Re-scan of an already-checked-in pass shows a friendly "Already checked in at 7:42 PM".
- Optional rejection reason if host wants to flag a pass.

## Add to calendar on invite
- New **"Add to calendar"** button on the invite screen that builds a proper calendar entry (title, date/time, venue, description) and hands it to the guest's calendar app — works on iOS, Android, and web.
- Also appears on the guest pass.

## How-it-works visible to users
- A short "How SHEREHE works" card on the home tab (dismissible) explaining the host flow and guest flow in plain language so new users get it immediately.
- Mirrored on the invite screen as a one-screen guest explainer the first time someone opens an invite.

## Polish & consistency
- Update event detail screen to show the new rules (shot limit, reveal mode, check-in status) clearly.
- Update RSVP flow to mention "You'll get a personal pass after you RSVP".
- Translations added for all new screens in the existing 12 languages.

After this pass the loop is: host creates → guest RSVPs → guest gets pass → host scans at door → guest shoots up to their limit → gallery unlocks at reveal time. Backend sync, real auth, and push notifications stay queued for the next round as you noted.