# Task: Milestone 5 — Template Assembly, Mobile Polish & Styling Isolation

## Role
You are a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m5_integration`

## File Boundaries (Exclusive Ownership)
You exclusively own and may edit:
- `templates/sheesh-mahal/page.tsx`
- `templates/sheesh-mahal/style.css`
- `templates/sheesh-mahal/index.ts`
Do NOT modify existing templates or files outside `templates/sheesh-mahal/`.

## Mandatory Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md`
5. The 9 modular components in `templates/sheesh-mahal/components/`:
   - `EntranceGate.tsx`
   - `AudioDock.tsx`
   - `HeroHall.tsx`
   - `LetterCasket.tsx`
   - `FamilyLamps.tsx`
   - `EventWindows.tsx`
   - `AstrolabeCountdown.tsx`
   - `BangleRsvp.tsx`
   - `ReflectingPool.tsx`

## Objectives
1. **Assemble `templates/sheesh-mahal/page.tsx`**:
   - Compose the complete 8-section vertical experience seamlessly:
     1. Entrance Gate overlay (starts locked `is-shut`, user taps medallion -> swings open 3D doors, unlocks scroll, plays sfx, starts music).
     2. Floating AudioDock toggle in top-right safe zone with mute/unmute and shared `playSfx` pipeline.
     3. Hero Hall with sacred Bismillah apex, gold-foil couple names, 60fps canvas glints, and unobstructed middle facial clearance (33%-68% clear).
     4. Letter Casket on marble table with 3D hinged lid, unfolding royal parchment, Surah Ar-Rum 30:21, Urdu blessing, and wax monogram seal.
     5. Family Lamps with groom/bride parent hanging lanterns, flame kindle micro-interactions, and golden confluence threads meeting at the marriage union dua.
     6. Event Windows with 4 Mughal jharokha cards, 3D opening wooden shutters, directions, and .ics / Google Calendar exports.
     7. Astrolabe Countdown with touch/mouse angular rotation dial, gear ticks, wedding date snap lock chime, and live canvas flip-tile countdown.
     8. Bangle RSVP postal desk with traditional bangle attendance switches, party size stepper, honeypot protection, dove flight submission, and Shukriya confirmation.
     9. Midnight Reflecting Pool with floating brass diyas spawned on water click with ripple physics, and replay controller that scrolls to top and re-engages gate.
     10. Include `<TemplateMarketingFooter templateId="sheesh-mahal" />` at the bottom.
   - Deep-merge customized `data?: any` props over canonical `defaultData` from `./data.json`.

2. **Author Comprehensive Scoped `templates/sheesh-mahal/style.css`**:
   - Scope all styles strictly under `.sheesh-mahal-root` so other templates and global styles are 100% unaffected.
   - Define all design tokens (`--sm-emerald`, `--sm-emerald-deep`, `--sm-gold`, `--sm-gold-soft`, `--sm-ivory`, `--sm-ink`, `--card-w`).
   - Implement container queries and fluid typography clamp rules (`clamp(...)`).
   - Implement all 28 CSS keyframes:
     * Door opening 3D transforms (`d-open-l`, `d-open-r`)
     * Sparkle twinkles (`d-twinkle`)
     * Casket lid flip (`casket-open`) and parchment unfold
     * Lantern flame flicker (`fm-flicker`) and SVG thread draw (`dash`)
     * Window shutter swings (`win-open-l`, `win-open-r`)
     * Astrolabe glow pulsing (`astro-pulse`)
     * Bangle slide and dove flight (`dove-flap`)
     * Water ripple rings (`cl-ripple`) and sinusoidal diya bobbing (`cl-bob`)
   - **MANDATORY MOBILE-FIRST & USER RULES**:
     * Zero unwanted horizontal scroll (`overflow-x: hidden !important`, `max-width: 100vw`).
     * Guaranteed facial clearance: Middle focal zone (33%–68% height) in Hero/portrait sections 100% unobstructed.
     * Minimum 44×44px touch targets on ALL interactive controls.

3. **Verify Build & Test Health**:
   - Run `npx.cmd tsc --noEmit` -> 0 diagnostic errors.
   - Run `node --test tests/e2e/sheesh-mahal-e2e.test.mjs` -> 91 / 91 tests passing (100%).

## Output
Write your execution report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m5_integration\handoff.md`
and notify the orchestrator with `send_message`.
