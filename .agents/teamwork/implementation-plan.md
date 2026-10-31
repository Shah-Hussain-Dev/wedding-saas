# Implementation Plan: Sheesh Mahal Digital Wedding Invitation Template

> **Author:** Project Orchestrator (`teamwork_orchestrator`)  
> **Target Project:** WedInvites (`d:\practice\projects-S\invitation\wedding-saas`)  
> **Specification References:** `.agents/teamwork/PROJECT.md`, `.agents/teamwork/design.md`  

---

## 1. Overview & Strategy

This implementation plan decomposes the reverse engineering and delivery of the **Sheesh Mahal** template into modular, testable, and strictly isolated phases. The template integrates into the existing Next.js 16 App Router / React 19 architecture without altering any existing templates or global styles.

We operate under **Dual-Track Execution**:
1. **Implementation Track**: Download assets, author configuration models, build the 8 modular sections, assemble the template, and polish mobile-first layout.
2. **E2E Testing Track**: Build an opaque-box automated test harness covering Tiers 1-4 across viewports (375x812, 390x844, 768x1024, 1440x900) before declaring final acceptance.

---

## 2. Milestone Decomposition & Task Breakdown

### Milestone 1: Asset Pipeline & Media Repository
- **Scope**: Download all 76 public assets (13 audio files + 63 image/texture files) from `https://aqdinvites.com/invites/sheesh-mahal/` directly into `public/templates/sheesh-mahal/`.
- **Tasks**:
  1. Create directory structure under `public/templates/sheesh-mahal/` (`audio/`, `assets/cover/`, `assets/hero/`, etc.).
  2. Execute Node.js download script with retry logic and file size / MIME validation.
  3. Verify all 76 assets exist locally and are not corrupt (valid WebP and MP3 headers).
  4. Write asset validation summary report.
- **Dependencies**: None.

### Milestone 2: Data Model, Props Interface & Platform Registration
- **Scope**: Author `data.json`, TypeScript props types, and wire the 10 registration touchpoints.
- **Tasks**:
  1. Author `templates/sheesh-mahal/data.json` with canonical details (Zain & Anaya, Karachi venues, 4 events, sacred texts, dress codes, music tracks).
  2. Author `templates/sheesh-mahal/types.ts` defining `SheeshMahalProps` and `SheeshMahalData`.
  3. Connect the 10 registration touchpoints:
     - `templates/sheesh-mahal/index.ts`
     - `templates/index.ts` (`TEMPLATES_MAP`, `TEMPLATE_DEFAULT_DATA`)
     - `lib/template-meta.ts` (`TemplateId`, `TEMPLATE_META`, `TEMPLATE_COMPONENTS`)
     - `lib/pdf-theme-tokens.ts` (`PDF_THEME_TOKENS`)
     - `lib/preview-faith-content.ts` (`getDefaultFaithForTemplate`)
     - `components/invitation/TemplateMarketingFooter.tsx` (`TEMPLATE_THEMES`)
     - `app/preview/[templateId]/page.tsx` (`KNOWN_TEMPLATE_IDS`, audio suppression)
     - `app/preview/[templateId]/interactive/page.tsx` (`ALL_16_TEMPLATES`)
     - `app/templates/page.tsx` (`TEMPLATES`)
     - `app/sitemap.ts` (`TEMPLATE_SLUGS`)
  4. Verify TypeScript compiles cleanly (`npx.cmd tsc --noEmit`).
- **Dependencies**: Milestone 1.

### Milestone 3: Modular Section Components — Part 1 (Sections 01–04)
- **Scope**: Build the opening sequence, audio controller, hero hall, letter casket, and families sections under `templates/sheesh-mahal/components/`.
- **Tasks**:
  1. `EntranceGate.tsx`: 3D mirrored double doors, central gold medallion trigger, 13 spark particles per leaf, ambient light flare, scroll unlock.
  2. `AudioDock.tsx`: Background music audio player with smooth gain ramp (2.5s), mute/unmute toggle (>= 44x44px), WebAudio autoplay handling, sound effect trigger pipeline.
  3. `HeroHall.tsx`: Palace hall of mirrors perspective, Bismillah arch apex (`&#xFDFD;`), gold foil couple names (Alex Brush cursive), 2D canvas light glints, pulsating scroll guide. Unobstructed central sightline guaranteed.
  4. `LetterCasket.tsx`: 3D velvet-lined casket button, top hinge lid rotation, three-panel sliding letter sheet, Surah Ar-Rum 30:21, Urdu blessing, flying wax seal (`Z&A`), dynamic `?to=` personalization.
  5. `FamilyLamps.tsx`: Hanging brass lanterns for groom's (Siddiqui) and bride's (Chaudhry) families, flame lighting micro-interaction, dynamic SVG bezier golden confluence threads.
- **Dependencies**: Milestone 2.

### Milestone 4: Modular Section Components — Part 2 (Sections 05–08)
- **Scope**: Build festivities, countdown astrolabe, RSVP postal desk, and reflecting pool under `templates/sheesh-mahal/components/`.
- **Tasks**:
  1. `EventWindows.tsx`: 4 festive Mughal jharokha window cards (Mehndi, Nikah, Baraat, Walima) with 3D opening wooden shutters, venue details, dress codes, Google Maps links, and `.ics` / Google Calendar exports.
  2. `AstrolabeCountdown.tsx`: Celestial brass astrolabe with interactive touch/mouse drag dial, alignment lock chime on wedding date, and 2D canvas flip-tile matrix for Days, Hours, Minutes, and Seconds.
  3. `BangleRsvp.tsx`: Royal postal desk, interactive bangle stands (slip bangles onto stands with clink SFX), party size stepper (>= 44x44px), wishes textarea, paper-roll and carrier dove flight submission animation, thank-you confirmation card with local storage persistence.
  4. `ReflectingPool.tsx`: Night palace pool under crescent moon, interactive floating brass diyas on water click with expanding ripples and sinusoidal bobbing physics, replay invitation CTA button.
- **Dependencies**: Milestone 2.

### Milestone 5: Template Integration, Mobile Polish & Platform Isolation
- **Scope**: Assemble `templates/sheesh-mahal/page.tsx` and `templates/sheesh-mahal/style.css`.
- **Tasks**:
  1. Combine sections into `templates/sheesh-mahal/page.tsx` with smooth state transitions, Lenis scroll coordination, and shared audio state.
  2. Author scoped `templates/sheesh-mahal/style.css` under `.sheesh-mahal-root` with container queries (`cqi`, `cqw`), all 28 CSS keyframes, 3D transform perspectives, and backdrop filters.
  3. Enforce Mobile-First constraints:
     - Viewports 360px – 430px tested as base canvas.
     - Facial clearance verified: zero occlusion of couple or character artwork.
     - 44×44px minimum interactive touch targets.
     - Zero unwanted horizontal scroll (`max-width: 100vw; overflow-x: hidden`).
- **Dependencies**: Milestones 3 & 4.

### Milestone 6: Final Verification, Adversarial Hardening & Completion Report
- **Scope**: Comprehensive verification across E2E tests, multi-device viewports, build validation, and forensic integrity audit.
- **Tasks**:
  1. Run 100% of the opaque-box E2E test suite (Tiers 1-4).
  2. Test responsive layouts and interaction states across viewports:
     - Mobile (375×812, 390×844)
     - Tablet (768×1024)
     - Desktop (1440×900)
  3. Verify audio behavior (autoplay restrictions respected, sound toggle functions, SFX play cleanly).
  4. Perform visual comparison against reference captures.
  5. Run TypeScript compilation (`npx.cmd tsc --noEmit`) and project build with 0 errors.
  6. Forensic Auditor verification (clean integrity verdict).
  7. Author and deliver final completion report.
- **Dependencies**: Milestone 5 & E2E Testing Track.

---

## 3. Parallel E2E Testing Track Architecture

The E2E Testing Track operates concurrently:
- **Test Harness**: Headless / automated browser runner targeting `/preview/sheesh-mahal`, `/preview/sheesh-mahal/interactive`, and `/[slug]`.
- **Tier 1 (Feature Coverage)**: >= 5 test cases per feature across all 8 template stages.
- **Tier 2 (Boundary & Corner Cases)**: Empty RSVP name, `?nomusic` query, `?to=` script tag escaping, screen widths 320px–1920px, touch target sizes >= 44px.
- **Tier 3 (Cross-Feature Combinations)**: Audio toggle + gate open, faith switching + letter text adaptation, RSVP submit + localStorage state.
- **Tier 4 (Real-World Application Scenarios)**: Complete end-to-end guest journey, customizer wizard preview, audio playback lifecycle.
- **Deliverables**: `TEST_INFRA.md` and `TEST_READY.md`.
