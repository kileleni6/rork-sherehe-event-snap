# QR check-in, guest passes, camera & gallery rules, and add-to-calendar

Here's what I'll build next so SHEREHE handles real-world events end-to-end — from invite to door scan to camera.

## New step in Create Event: "Camera & gallery rules"
A 6th step inserted before the preview so hosts can dial in the experience.
- [x] **Shots per guest** — quick picks (5 / 10 / 24 / 36). Default 10 (disposable-camera feel). Capped at 36 max, no unlimited.
- [x] **Reveal time** — choose when the gallery unlocks: at event start, +1h, +6h, +24h after event. Manual override available.
- [x] **Who can upload** — All guests / RSVP'd only / Host-approved only.
- [x] **Privacy** — Private link only / Public link / Password-protected (host sets a passcode shown on invite).
- [x] **Gallery visibility** — Everyone after reveal / RSVP'd only / Host-only.
- [x] **Check-in mode** — Off (default, open event) or On (track arrivals).
- [x] **30-day server storage** — Photos auto-deleted after 30 days. Download/export before then.
- [x] These settings show up as a summary card on the preview step.

## Guest pass screen (every invited guest gets one)
- [x] Each RSVP generates a unique guest pass with the guest's name, RSVP status, and a personal QR code.
- [x] Lives at a clean "My pass" screen inside the invite — guests can pull it up at the door.
- [x] Shows shot quota ("10 photos left"), check-in status ("Not checked in" → "Checked in 7:42 PM"), and a quick **Open camera** button once unlocked.
- [x] Adds the event to their calendar, shows venue + directions, and the schedule.

## Gatekeeper / check-in mode
- [x] New **"Check in guests"** button on the host's event screen (only visible when check-in is on).
- [x] Full-screen scanner using the device camera. Scans a guest pass QR → instantly shows the guest's name, RSVP status, +guests, and a big **Check in** button.
- [x] Manual search fallback for guests without a phone — host can tap a name in the list to mark them in.
- [x] Live arrivals counter ("47 of 120 arrived"), arrival timeline, and a "Not yet arrived" list.
- [x] Re-scan of an already-checked-in pass shows a friendly "Already checked in at 7:42 PM".
- [x] Optional rejection reason if host wants to flag a pass — inline reject button with reason input on each pending guest row; rejected guests shown in a separate section with undo.

## Add to calendar on invite
- [x] New **"Add to calendar"** button on the invite screen that builds a proper calendar entry (title, date/time, venue, description) and hands it to the guest's calendar app — works on iOS, Android, and web.
- [x] Also appears on the guest pass.

## How-it-works visible to users
- [x] A short "How SHEREHE works" card on the home tab (dismissible) explaining the host flow and guest flow in plain language.
- [x] Mirrored on the invite screen as a one-screen guest explainer.

## Polish & consistency
- [x] Update event detail screen to show the new rules (shot limit, reveal mode, check-in status) clearly.
- [x] Update RSVP flow to mention "You'll get a personal pass after you RSVP".
- [x] Translations added for all new screens (16 languages: en, es, fr, ar, sw, pt, hi, zh, de, it, ja, ru, ko, tr, id, nl).

After this pass the loop is: host creates → guest RSVPs → guest gets pass → host scans at door → guest shoots up to their limit → gallery unlocks at reveal time.

## Beyond PLAN.md (completed)
- [x] Supabase Storage for guest photo uploads with 30-day retention
- [x] Supabase edge function + pg_cron SQL migration for hourly photo purge
- [x] RevenueCat pricing wired: 5 tiers (Starter free → Super Event $499.99 one-time)
- [x] react-native-purchases purchase flow with Expo Go mock fallback
- [x] Pro gating throughout (locked screens, upgrade prompts all hidden when premium)
- [x] Swahili flag: Kenya → Tanzania
- [x] i18n system: 16 languages, RTL support, device language detection, locale-aware formatting
- [x] Full localization patches for all 16 languages (paywall/profile/gallery/pass/check-in/errors)
- [x] Push notifications: `expo-notifications` + `expo-device`, perms, Expo push token, local schedule helper, event-reminder scheduler
- [x] App Store hardening: iOS `buildNumber`, `infoPlist` permission strings (camera, photo library, notifications), `ITSAppUsesNonExemptEncryption=false`, Android `versionCode` + permissions, `expo-image-picker` + `expo-notifications` plugins
