# Task: Milestone 4 — Interactive Festivities Components (Sections 05–08)

## Role
You are a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m4_festivities`

## File Boundaries (Exclusive Ownership)
You exclusively own and may create/edit these files:
- `templates/sheesh-mahal/components/EventWindows.tsx`
- `templates/sheesh-mahal/components/AstrolabeCountdown.tsx`
- `templates/sheesh-mahal/components/BangleRsvp.tsx`
- `templates/sheesh-mahal/components/ReflectingPool.tsx`
Do NOT modify files owned by Milestone 3 or existing templates.

## Mandatory Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md`
5. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\handoff.md` (Detailed DOM, CSS, animations, mechanics)
6. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md` (Tokens, keyframes, audio assets)

## Objectives & Component Specifications
1. **`EventWindows.tsx` (Section 05: Festivities & Jharokha Windows)**:
   - 4 festive celebrations (Mehndi, Nikah, Baraat, Walima) styled as carved Mughal arched windows (`.ev-win`, `/templates/sheesh-mahal/assets/events/arch.webp`, `frame.webp`).
   - 3D opening wooden shutters (`.ev-leaf-l`, `.ev-leaf-r`, `shutters.webp`). Tap/click swings shutters open (`rotateY(-85deg)` and `rotateY(85deg)`), plays `sfx-window-open.mp3`.
   - Artwork paintings inside windows:
     * Mehndi: `/templates/sheesh-mahal/assets/events/mehndi.webp` (Brass thaal of henna & marigolds, Yellow & green dress code)
     * Nikah: `/templates/sheesh-mahal/assets/events/nikah.webp` (Ivory divan, rose petals, Soft pastels & ivory dress code)
     * Baraat: `/templates/sheesh-mahal/assets/events/baraat.webp` (Ruby & gold royal doli, Formal eastern in reds & golds)
     * Walima: `/templates/sheesh-mahal/assets/events/walima.webp` (Silver settee, white lilies & pearls, Silver & pearl pastels)
   - Action buttons with minimum 44×44px touch targets:
     * Google Maps Directions link opening venue location query in new tab.
     * Add-to-Calendar button (`.ev-btn-cal`) generating standard `.ics` file download and Google Calendar web link.

2. **`AstrolabeCountdown.tsx` (Section 06: Celestial Astrolabe Countdown)**:
   - Celestial antique brass astrolabe instrument (`.cd-astro`, `/templates/sheesh-mahal/assets/countdown/ceiling.webp`, `frame.webp`, `ring1.webp`, `ring2.webp`, `ring3.webp`, `rete.webp`).
   - Interactive touch/mouse drag rotation dial: uses `Math.atan2` on pointermove to calculate rotation angle and angular velocity, playing metallic gear click sound `sfx-tick.mp3`.
   - Date alignment lock: When dial converges onto the target wedding date (`2026-12-12T20:00:00+05:00` Baraat), plays date lock chime `sfx-lock.mp3` with radial glow flare.
   - Live 2D canvas flip-tile matrix display (`canvas.cd-unit` with `/templates/sheesh-mahal/assets/countdown/tile-on.webp` and `tile-off.webp`) or SVG digit matrix rendering live countdown for Days, Hours, Minutes, and Seconds.

3. **`BangleRsvp.tsx` (Section 07: Royal Postal Desk & Bangle Stand RSVP)**:
   - Royal postal desk with cardstock parchment texture (`/templates/sheesh-mahal/assets/rsvp/paper.webp`, `stand.webp`).
   - 4 event attendance toggles modeled as traditional bangles (`.rs-toggle`, `bangle-mehndi.webp`, `bangle-nikah.webp`, `bangle-baraat.webp`, `bangle-walima.webp`). Tap slips bangle onto brass stand with glass clink sound `sfx-bangle.mp3`.
   - Party size stepper (`.rs-step`, `-` and `+` buttons) with minimum 44×44px touch targets, bounded between 1 and allocated guest limit.
   - Wishes textarea, guest name input with HTML5 validation, and honeypot spam protection.
   - Submission transition: Form paper rolls into scroll (`.rs-roll`, `roll.webp`, `ribbon.webp`, `sfx-roll.mp3`), white carrier dove flaps wings and takes flight (`.rs-flyer`, `dove.webp`, `dove-fly.webp`, `sfx-dove.mp3`).
   - Shukriya confirmation card (`.rs-thanks`) displaying attendee summary and "Change my reply" trigger. Local storage persistence in `sm:rsvp`.

4. **`ReflectingPool.tsx` (Section 08: Midnight Reflecting Pool & Replay)**:
   - Midnight palace terrace overlooking tranquil water pond under glowing silver-gold crescent moon (`/templates/sheesh-mahal/assets/closing/scene.webp`, `moon.webp`).
   - Closing blessing dua: Baraka Allahu Lakuma dua in Arabic and English.
   - Interactive floating brass diyas: Tapping water surface spawns illuminated diya (`diya-0.webp`, `diya-1.webp`, `diya-2.webp`, `diya-3.webp`) with concentric expanding water ripples and gentle sinusoidal vertical bobbing physics (`sfx-diya.mp3`). Concurrency capped to prevent DOM saturation.
   - Replay Invitation controller button (`.cl-replay`, minimum 44x44px touch target) smoothly scrolling page to top and re-engaging the entrance gate.

## Quality & Build Verification
- Run `npx.cmd tsc --noEmit` to ensure 0 TypeScript diagnostic errors.
- Run `node --test tests/e2e/sheesh-mahal-e2e.test.mjs` to ensure 100% test pass.

## Output
Write your execution report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m4_festivities\handoff.md`

## 2026-10-29T16:33:52Z
You are worker_m4_festivities, a teamwork_worker subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m4_festivities
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m4_festivities\DISPATCH.md
Also read:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\handoff.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md

Your exclusive file boundaries:
- templates/sheesh-mahal/components/EventWindows.tsx
- templates/sheesh-mahal/components/AstrolabeCountdown.tsx
- templates/sheesh-mahal/components/BangleRsvp.tsx
- templates/sheesh-mahal/components/ReflectingPool.tsx

Ensure:
- 44x44px minimum touch targets on all interactive elements (steppers, bangles, replay).
- Astrolabe touch/drag angular calculation (atan2) with date snap/lock chime.
- 4 Jharokha window cards (Mehndi, Nikah, Baraat, Walima) with 3D opening wooden shutters, directions, and .ics / Google Calendar exports.
- Bangle stand RSVP switches with glass clink SFX, dove flight submission, and local storage recovery.
- Reflecting pool interactive diyas with ripple physics and replay controller.
- Clean TypeScript compilation via npx.cmd tsc --noEmit.
- All 91 E2E tests pass via node --test tests/e2e/sheesh-mahal-e2e.test.mjs.

Write your report to d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m4_festivities\handoff.md and notify your parent.
