# Separate Enterprise plan & add Plan Detail confirmation screen


## What we'll change

### 1. Separate the Enterprise plan visually on the paywall ✅
- [x] Keep the existing 6 tiers (Starter through Super Event at $499.99) as they are
- [x] Remove the "Mega Event" tier from the flat tier list
- [x] Add a clearly separated "Custom Enterprise" section below the regular tiers with its own heading, different card styling, and distinct messaging
- [x] The Enterprise card will show "2,000+ guests", "Dedicated support", "Custom pricing" with a "Contact Us" button that opens email
- [x] Visual separation through a section divider, different background treatment, and enterprise-oriented copy

### 2. Build a Plan Detail confirmation screen ✅
- [x] After a user selects a paid tier and taps the CTA, show a new screen explaining exactly what they're getting
- [x] Shows the plan name, price, guest capacity, and storage at the top in a hero card
- [x] Clear feature checklist: premium invitation templates, HD photo exports, custom branding, RSVP analytics, AI invitation writer, priority support
- [x] Pricing details: "One-time payment — no subscription, no auto-renewal" and "You'll confirm via Apple or Google Pay on the next screen"
- [x] A reassuring trust badge: "Secure payment · Cancel anytime before confirming · 30-day storage included"
- [x] Bottom has the purchase button ("Pay $24.99 — One Time") and a "Go back to plans" link
- [x] For the free Starter plan, simply confirms "You're all set!" and returns to the app
- [x] For the Enterprise plan, shows the contact-us flow with email details

### 3. Wire the new flow ✅
- [x] Paywall CTA navigates to the new Plan Detail screen instead of triggering purchase directly
- [x] Plan Detail screen's "Pay" button triggers the actual RevenueCat purchase flow
- [x] Back navigation returns to the paywall tier selection
