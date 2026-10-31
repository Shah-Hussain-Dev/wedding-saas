# E2E Test Infrastructure: Sheesh Mahal Digital Wedding Invitation

> **Target Project:** WedInvites (`d:\practice\projects-S\invitation\wedding-saas`)  
> **Template:** Sheesh Mahal (`templates/sheesh-mahal/`)  
> **Reference Oracle:** `https://aqdinvites.com/demo/sheesh-mahal` & `https://aqdinvites.com/invites/sheesh-mahal/`  
> **Test Harness:** Dual-Engine (Node.js 22 Native Test Runner + Playwright Browser Runner)  
> **Specification Standard:** Opaque-Box, Contract-Driven, Mobile-First  

---

## 1. Architecture & Testing Philosophy

The Sheesh Mahal test suite is designed as an **opaque-box, contract-driven test system**. It validates template behavior entirely from the perspective of an external consumer, guest user, or platform orchestrator without coupling to private internal implementation details.

### Core Testing Tenets:
1. **Opaque-Box Observability**: All assertions evaluate observable artifacts — rendered DOM tags, ARIA attributes, SVG vectors, Canvas contexts, WebAudio states, URL parameters, `localStorage` entries, CSS computed variables, and touch target dimensions.
2. **Authoritative Output Derivation**: Expected values are strictly derived from the reference website oracle (`https://aqdinvites.com/demo/sheesh-mahal`), `.agents/teamwork/PROJECT.md`, `.agents/teamwork/design.md`, and project user rules (`AGENTS.md`).
3. **Mobile-First & Ergonomics Verification**: The suite enforces strict mobile layout rules (320px–430px base canvas), guaranteed facial clearance in hero/portrait zones (33%–68% height unobstructed), zero horizontal scroll (`overflow-x: hidden`), and minimum $44 \times 44\text{px}$ touch targets.
4. **Zero-Dependency Core Execution**: The primary test runner utilizes Node.js 22 built-in `node:test` and `node:assert/strict`, ensuring instantaneous, deterministic execution in any CI/CD or local developer environment without requiring multi-gigabyte browser downloads.

---

## 2. Target Entry Points & Surface Contracts

The test infrastructure targets four distinct surface levels:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHEESH MAHAL ENTRY POINTS                       │
├─────────────────────────┬──────────────────────────┬───────────────────┤
│ Surface Level           │ Path / Route             │ Testing Objective │
├─────────────────────────┼──────────────────────────┼───────────────────┤
│ 1. Standalone Demo      │ /preview/sheesh-mahal    │ Default catalog   │
│                         │                          │ preview & audio   │
├─────────────────────────┼──────────────────────────┼───────────────────┤
│ 2. Interactive Custom   │ /preview/sheesh-mahal/   │ Live custom data, │
│                         │ interactive              │ faith switching   │
├─────────────────────────┼──────────────────────────┼───────────────────┤
│ 3. Live Tenant Slug     │ /[slug]                  │ Production invite │
│                         │                          │ guest experience  │
├─────────────────────────┼──────────────────────────┼───────────────────┤
│ 4. Module Interface     │ templates/sheesh-mahal/  │ Props contract &  │
│                         │ (index.ts, data.json)    │ fallback data     │
└─────────────────────────┴──────────────────────────┴───────────────────┘
```

### URL Search Parameter Contracts:
- `?nomusic=1` / `?nomusic=true`: Audio engine suppression flag.
- `?to=<encoded_name>`: Dynamic guest greeting injection.
- `?faith=muslim` | `hindu` | `universal`: Multi-faith adaptation layer.
- `?embed=1`: Embedded iframe mode inside preview stage.

---

## 3. Test Runner Design & Directory Structure

```
tests/
└── e2e/
    ├── sheesh-mahal-e2e.test.mjs    # Core standalone executable test suite (Node:test)
    ├── sheesh-mahal.spec.ts         # Playwright headless browser E2E test specification
    └── fixtures/
        ├── sample-custom-data.json  # Mock customizer wizard inputs
        └── malicious-inputs.json    # XSS and fuzzing payload vectors
```

### Dual-Engine Execution Pipeline:
1. **Engine A: Node.js 22 Native Test Suite (`sheesh-mahal-e2e.test.mjs`)**:
   - Executes contract validation, props merging, URL query parsing, sanitization, mathematical models (astrolabe `atan2`), time delta calculations, state machine transitions, touch ergonomics, and DOM structure verification.
   - Run command: `node --test tests/e2e/sheesh-mahal-e2e.test.mjs`
2. **Engine B: Playwright Browser Test Suite (`sheesh-mahal.spec.ts`)**:
   - Spins up headless Chromium, navigates to running preview server, simulates mouse/touch drags, verifies WebAudio playback states, and captures visual snapshots.
   - Run command: `npx.cmd playwright test tests/e2e/sheesh-mahal.spec.ts`

---

## 4. 4-Tier Systematic Test Matrix

The test suite organizes 91 test cases across 4 hierarchical tiers:

### Tier 1: Feature Coverage (45 Tests — >=5 per feature)
Exhaustively exercises the 9 core functional sections in complete isolation:
- **Section 01 (Entrance Gate & Mirrored Doors)**: 5 tests (Double-leaf 3D layout, 26 sparkle glints, central medallion seal trigger, open rotation transform, body scroll unlock).
- **Section 02 (Audio Controller & Dock)**: 5 tests (Safe-zone placement, deferred autoplay compliance, mute/unmute toggle, localStorage persistence, 2.5s volume gain ramp).
- **Section 03 (Hero Hall & Sacred Apex)**: 5 tests (Bismillah invocation `﷽`, Alex Brush couple names, facial clearance clearance zone, 60fps canvas glints, viewport dwell pause).
- **Section 04 (Velvet Letter Casket & Royal Sheet)**: 5 tests (Mirrored casket 3D lid hinge, viewport dwell auto-open, 3-panel parchment unfold, Surah Ar-Rum 30:21, wax seal stamping).
- **Section 05 (Family Hanging Lamps & Confluence)**: 5 tests (Dual brass lanterns, groom lamp ignition, bride lamp ignition, SVG bezier confluence threads, marriage dua convergence).
- **Section 06 (3D Jharokha Event Windows)**: 5 tests (4 festive window cards, 3D shutter opening, venue & dress code accuracy, add-to-calendar `.ics` export, Google Maps navigation link).
- **Section 07 (Celestial Astrolabe Countdown)**: 5 tests (Rotating brass calendar rings, touch/mouse drag angular velocity, date lock snap & chime, 2D flip-tile matrix digits, countdown time math).
- **Section 08 (Bangle Stand RSVP Desk)**: 5 tests (Traditional bangle switches, switch state animation, party size stepper controls, parchment roll & dove flight, Shukriya confirmation card).
- **Section 09 (Reflecting Pool & Replay)**: 5 tests (Midnight pool scene, interactive floating diyas, concentric ripples & sinusoidal bobbing, replay CTA reset, gate re-locking).

### Tier 2: Boundary & Corner Cases (30 Tests — >=5 per feature)
Stresses the system at limits, edge conditions, and adversarial inputs:
- **Gate & Motion**: Rapid double-clicking debounce, Enter/Space keyboard accessibility, `prefers-reduced-motion` instantaneous transitions, scroll prevention while shut, page reload state retention.
- **Audio & Silence**: `?nomusic` suppression, `?nomusic=1` vs `?nomusic=true`, background tab switching (`visibilitychange` audio fade), unsupported audio fallback, rapid mute click debouncing.
- **Query Sanitization**: `<script>` tag XSS escaping in `?to=`, HTML entity neutralization, 200+ character truncation, unicode Urdu character rendering, missing parameter fallback.
- **Responsive & Ergonomics**: 320px narrow mobile viewport without horizontal scroll (`scrollWidth <= clientWidth`), fluid typography `clamp()`, ultra-wide 1920px+ card bounding, safe-area-insets, touch target bounding boxes >= 44×44px.
- **RSVP Validation**: Empty name rejection, whitespace-only name rejection, stepper bounds [1, max], zero-event selection alert, past event deadline closed state, honeypot spam bot trapping.
- **Resource Stress**: Diya concurrency throttling, rapid multi-touch concurrency, window resize canvas preservation.

### Tier 3: Cross-Feature Pairwise Combinations (10 Tests)
Tests multi-component interactions and state dependencies:
- Gate open sequence paired with audio engine unlock.
- Audio mute setting retained across full-page replay loop.
- Dynamic guest personalization propagating into unfolded letter sheet beneath wax seal.
- Multi-faith preset switching adapting sacred texts without breaking layout.
- Event window opening dynamically populating calendar `.ics` download payload.
- Bangle attendance toggles dynamically populating Shukriya confirmation summary.
- RSVP network failure triggering localStorage fallback with graceful UI state.
- "Change my reply" action restoring previously entered RSVP state.
- Astrolabe wedding alignment date synchronization with Baraat event date.
- Water touch in reflecting pool triggering spatial audio chime via Audio Dock.

### Tier 4: Real-World Application Scenarios (6 Tests)
Validates end-to-end guest journeys and platform workflows:
- **Scenario 1**: Complete Guest Happy Path (URL `?to=Auntie+Yasmin` -> Door -> Audio -> Casket -> Lamps -> Windows -> Astrolabe -> RSVP -> Pool -> Dua).
- **Scenario 2**: Quiet Workplace Guest (`?nomusic=1` -> Silent Journey -> Maps Navigation -> RSVP).
- **Scenario 3**: Multi-Device Responsive Sweep (iPhone SE 320px, iPhone 14 390px, iPad 768px, Desktop 1440px).
- **Scenario 4**: Platform Customizer Real-Time Injection (Custom names, dates, venues injected via props).
- **Scenario 5**: Multi-Faith Inclusivity Verification (`universal`, `hindu`, `muslim` faith presets).
- **Scenario 6**: RSVP Lifecycle & Local Storage Recovery (Submit -> Tab close -> Revisit -> Edit reply).

---

## 5. Verification Commands

To run the automated E2E test suite locally or in CI:

```powershell
# 1. Run Core Standalone E2E Test Suite (Node.js 22 built-in runner)
node --test tests/e2e/sheesh-mahal-e2e.test.mjs

# 2. Run with detailed verbose TAP output
node --test --test-reporter=tap tests/e2e/sheesh-mahal-e2e.test.mjs

# 3. Run Playwright Browser Suite (when Next.js dev server is running on :3000)
npx.cmd playwright test tests/e2e/sheesh-mahal.spec.ts
```
