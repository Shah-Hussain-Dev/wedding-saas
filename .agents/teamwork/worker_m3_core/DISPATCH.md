# Task: Milestone 3 — Core Experience Components (Sections 01–04)

## Role
You are a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m3_core`

## File Boundaries (Exclusive Ownership)
You exclusively own and may create/edit these files:
- `templates/sheesh-mahal/components/EntranceGate.tsx`
- `templates/sheesh-mahal/components/AudioDock.tsx`
- `templates/sheesh-mahal/components/HeroHall.tsx`
- `templates/sheesh-mahal/components/LetterCasket.tsx`
- `templates/sheesh-mahal/components/FamilyLamps.tsx`
Do NOT modify files owned by Milestone 4 or existing templates.

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
1. **`EntranceGate.tsx` (Section 01: Doors / Cover)**:
   - Double-leaf 3D palace doors (`.d-leaf-l`, `.d-leaf-r`) with carved archway and mirror facet overlay (`/templates/sheesh-mahal/assets/cover/doors.webp`, `mirrors.webp`).
   - Central gold medallion seal button (`button.medallion`, `/templates/sheesh-mahal/assets/cover/medallion.webp`) centered on seam. Minimum 44x44px touch target (actual ~80px).
   - 13 sparkle glints per leaf (26 total `.spark`) with pulsing glint animation.
   - Ambient flood light flare (`.d-flood`).
   - Click handler on medallion: triggers door opening sound (`/templates/sheesh-mahal/audio/sfx-door-open.mp3`), pivots door leaves in 3D (`rotateY(-105deg)` and `rotateY(105deg)`), unlocks page scroll, and starts background music.
   - Respect `prefers-reduced-motion`: instant fade if preferred. Debounce clicks to prevent double-firing.

2. **`AudioDock.tsx` (Section 02: Audio Controller)**:
   - Fixed floating sound toggle button (`.music-toggle`, `.sm-music-toggle`) in top-right safe zone with minimum 44×44px interactive area.
   - Plays ambient palace soundtrack (`/templates/sheesh-mahal/audio/music.mp3`) with 2.5s gain ramp-up (target volume ~0.6).
   - Handles browser autoplay policy: deferred until user's first touch on medallion or audio toggle.
   - Respects URL query parameter `?nomusic` / `?nomusic=1` (suppresses audio engine).
   - Handles tab visibility (`visibilitychange`): fades out when hidden, resumes when refocused.
   - Persists user mute preference in `localStorage` (`sm:music`).
   - Exposes sound effect trigger helper `playSfx(sfxPath)` for component interactions.

3. **`HeroHall.tsx` (Section 03: Grand Palace Hall of Mirrors)**:
   - Grand palace interior perspective (`/templates/sheesh-mahal/assets/hero/hall.webp`, `mirrors.webp`).
   - Arabic Bismillah calligraphic invocation (`.h-bism`, `&#xFDFD;`, `aria-label="Bismillah ir-Rahman ir-Raheem"`) at the apex of the arch in Amiri font.
   - Gold-foil couple names (`<h1 class="h-names">`) in Alex Brush cursive script with subtle metallic sheen.
   - **MANDATORY FACIAL CLEARANCE RULE**: The middle focal zone (33%–68% height) must remain 100% crystal-clear and unobstructed by cards or badges. Couple names sit in the lower pedestal area.
   - Lightweight 2D canvas light glints (`canvas.h-glints`) floating across mirrors, pausing when scrolled out of viewport.
   - Pulsating scroll indicator (`.h-scroll`) prompting downward journey.

4. **`LetterCasket.tsx` (Section 04: Velvet Casket & Royal Letter)**:
   - Ornate gold casket button (`.lt-casket`) on marble tabletop (`/templates/sheesh-mahal/assets/letter/casket-lid.webp`, `marble.webp`).
   - Tap/click flips casket lid open (`rotateX(-120deg)`), plays `sfx-letter.mp3`.
   - 3-panel royal parchment letter (`#letterSheet`, `paper.webp`) slides up and unfolds in 3D.
   - Letter contents: Quranic verse Surah Ar-Rum 30:21 in Arabic and English, personalized guest greeting reading `?to=` query parameter (sanitized against XSS), formal invitation formula from parents (Mr & Mrs Faisal Chaudhry, Mr & Mrs Imran Siddiqui), and Urdu blessing line (`آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی`).
   - Flying wax monogram seal (`.lt-seal`, `seal.webp`) with couple initials (`Z&A`).

5. **`FamilyLamps.tsx` (Section 05: Families & Confluence)**:
   - Emerald silk wall niche backdrop (`/templates/sheesh-mahal/assets/families/wall.webp`).
   - Two interactive hanging brass lanterns (`.fm-lamp`, `lantern-unlit.webp`, `lantern-lit.webp`) for Groom's family (Siddiqui) and Bride's family (Chaudhry). Minimum 44x44px touch targets.
   - Tapping either lantern plays `sfx-light.mp3`, kindles warm golden flame with flicker halo (`lantern-glow.webp`).
   - When both lanterns are kindled: golden SVG cubic bezier confluence threads (`svg.fm-threads`) draw inward and converge onto the couple's union block (`.fm-union`) with Sunan Abi Dawud 969 marriage dua, playing `sfx-join.mp3`.

## Quality & Build Verification
- Run `npx.cmd tsc --noEmit` to ensure 0 TypeScript diagnostic errors.
- Run `node --test tests/e2e/sheesh-mahal-e2e.test.mjs` to ensure 100% test pass.

## Output
Write your execution report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m3_core\handoff.md`
and notify the orchestrator with `send_message`.


## 2026-10-29T16:33:44Z
Received dispatch message:
Sender: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32
Content:
You are worker_m3_core, a teamwork_worker subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m3_core
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32
File Boundaries:
- templates/sheesh-mahal/components/EntranceGate.tsx
- templates/sheesh-mahal/components/AudioDock.tsx
- templates/sheesh-mahal/components/HeroHall.tsx
- templates/sheesh-mahal/components/LetterCasket.tsx
- templates/sheesh-mahal/components/FamilyLamps.tsx
Ensure:
- 44x44px minimum touch targets on all interactive elements.
- Unobstructed facial clearance in HeroHall (middle zone 33%-68% clear).
- Audio context starts on first gesture (medallion/toggle), respects ?nomusic and tab visibility.
- Clean TypeScript compilation via npx.cmd tsc --noEmit.
- All 91 E2E tests pass via node --test tests/e2e/sheesh-mahal-e2e.test.mjs.
