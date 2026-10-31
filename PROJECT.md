# Project: Sheesh Mahal Digital Wedding Invitation Template

## Architecture
The Sheesh Mahal template is an authentic, luxury digital wedding invitation inspired by the historic Hall of Mirrors. It is engineered as a modular, self-contained Next.js 16 App Router / React 19 component inside `templates/sheesh-mahal/`, consuming local typography tokens, Motion v12 transitions, HTML5 canvas glints, WebAudio soundscapes, and container-query responsive breakpoints.

### Core Architecture Principles
1. **Strict Platform Isolation**:
   - All Sheesh Mahal components live under `templates/sheesh-mahal/` and `public/templates/sheesh-mahal/`.
   - Styles are strictly scoped under the `.sheesh-mahal-root` root container in `templates/sheesh-mahal/style.css`.
   - Zero modification to existing templates (`templates/azure-nikah`, `templates/celestial-rose`, etc.) or global stylesheets (`app/globals.css`).
2. **Externalized Props Data Model**:
   - The template accepts an optional `data?: any` prop matching the platform's `Invitation` schema.
   - Incoming data is deep-merged over a complete, authentic fallback dataset defined in `templates/sheesh-mahal/data.json`.
3. **Mobile-First & Facial Clearance Foundation**:
   - Container query root `--card-w: min(100%, max(75svh, 360px))`.
   - Guaranteed clear sightlines in hero, letter, and portrait sections: faces, crowns, and jewelry are never occluded by floating text cards.
   - All interactive controls have minimum $44 \times 44\text{px}$ touch targets.
   - Global horizontal scroll prevented (`max-width: 100vw; overflow-x: hidden`).
4. **WebAudio & Interaction Pipeline**:
   - Autoplay handling: Audio context initialized on first user gesture (opening the medallion).
   - Ambient Shehnai/Sitar background soundtrack with smooth gain fading.
   - 12 bespoke interaction SFX mapped to discrete user actions.

---

## Feature Inventory

Every feature discovered in Phase 0 Survey is cataloged below with its assigned milestone.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Asset Manifest & Pipeline | Download and verify all 76 public assets (63 visual + 13 audio) into `public/templates/sheesh-mahal/` | M1 | spec_miner_assets |
| 2 | Template Props & Data Model | Implement `data.json`, props interface, and default fallback data model | M2 | explorer_codebase |
| 3 | Platform Registry Integration | Wire up the 10 platform integration touchpoints (`TEMPLATES_MAP`, metadata, catalog, preview, PDF, footer) | M2 | explorer_codebase |
| 4 | Entrance Gate (Double Doors) | 3D double-leaf mirrored palace doors with 13 sparkle glints per leaf and lighting flood | M3 | spec_miner_flows |
| 5 | Medallion Seal Trigger | Circular gold crest button centered on door seam with opening animation and scroll unlock | M3 | spec_miner_flows |
| 6 | Background Music Player | Ambient palace soundtrack with volume gain ramping, tab visibility handling, and `?nomusic` support | M3 | spec_miner_flows |
| 7 | Floating Sound Toggle | Fixed glassmorphic button in safe zone (>= 44x44px touch target) for audio mute/unmute | M3 | spec_miner_flows |
| 8 | Sacred Bismillah Arch | Calligraphic Bismillah invocation (`&#xFDFD;`) at the apex of the hall arch | M3 | spec_miner_flows |
| 9 | Gold Foil Couple Centerpiece | Couple names in cursive script with subtle gold foil sheen and zero face occlusion | M3 | spec_miner_flows |
| 10 | Hall Glints Canvas | Dynamic floating light particles across mirror walls using 2D canvas | M3 | spec_miner_flows |
| 11 | Velvet Letter Casket | 3D mirrored casket with interactive lid and metallic sheen opening animation | M3 | spec_miner_flows |
| 12 | Unfolding Royal Parchment | Three-panel sliding letter sheet with Surah Ar-Rum 30:21 and Urdu blessing | M3 | spec_miner_flows |
| 13 | Dynamic Guest Personalization | Reads `?to=` query parameter to inject personalized guest greeting with sanitization | M3 | spec_miner_flows |
| 14 | Flying Wax Monogram Seal | Animated couple monogram seal (`Z&A`) stamping upon letter unfold | M3 | spec_miner_flows |
| 15 | Family Hanging Lamps | Interactive brass hanging lanterns for groom's and bride's parents with lighting flame | M3 | spec_miner_flows |
| 16 | Golden Confluence Threads | Dynamic SVG cubic bezier paths connecting parent lamps to couple's union block | M3 | spec_miner_flows |
| 17 | 3D Jharokha Window Cards | 4 festive cards (Mehndi, Nikah, Baraat, Walima) with 3D opening wooden shutters | M4 | spec_miner_flows |
| 18 | Event Calendar Export | Add-to-calendar action button generating standard `.ics` downloads and Google links | M4 | spec_miner_flows |
| 19 | Google Maps Navigation | Directions links opening external Google Maps for Karachi venue locations | M4 | spec_miner_flows |
| 20 | Celestial Astrolabe Dial | Rotating brass astrological dial with touch/mouse drag mechanics and gear clicks | M4 | spec_miner_flows |
| 21 | Alignment Lock & Chime | Date convergence lock when dial reaches wedding date with chime SFX | M4 | spec_miner_flows |
| 22 | Canvas Flip-Tile Countdown | 7x5 matrix flip-tile display for Days, Hours, Minutes, and Seconds | M4 | spec_miner_flows |
| 23 | Bangle Stand RSVP Switches | 4 event attendance toggles modeled as traditional bangles slipping onto stands with clink SFX | M4 | spec_miner_flows |
| 24 | Guest Party Stepper | Minimum 44x44px stepper buttons for party size allocation | M4 | spec_miner_flows |
| 25 | Parchment Roll & Carrier Dove | Submission transition rolling form paper and launching a carrier dove with note | M4 | spec_miner_flows |
| 26 | RSVP Confirmation State | Shukriya thank-you summary card with attendance recap and edit reply action | M4 | spec_miner_flows |
| 27 | Midnight Reflecting Pool | Night palace pool under crescent moon with interactive floating brass diyas and ripple physics | M4 | spec_miner_flows |
| 28 | Replay Invitation Controller | CTA button in footer resetting state and smoothly scrolling to top gate | M4 | spec_miner_flows |
| 29 | Mobile-First & Touch Targets | 44x44px touch targets, fluid clamp typography, zero horizontal overflow | M5 | user_rules |
| 30 | E2E Testing Suite (Tiers 1-4) | Opaque-box automated test suite verifying all 8 sections across 4 viewports | M6 | prompt_reqs |
| 31 | Visual & Responsive Regression | Pixel & layout comparison across 375x812, 390x844, 768x1024, 1440x900 | M6 | prompt_reqs |
| 32 | TypeScript & Build Cleanliness | Strict compilation check (`npx.cmd tsc --noEmit`) with 0 errors | M6 | prompt_reqs |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Asset Pipeline & Media Repository | Download, verify, and organize all 77 public assets (images, SVGs, audio, fonts) in `public/templates/sheesh-mahal/` | none | DONE |
| M2 | Data Model & Platform Registration | Author `data.json`, props types, and connect the 10 platform registry touchpoints without disrupting existing templates | M1 | DONE |
| M3 | Core Experience Components (Sections 01-04) | Implement Entrance Gate, Medallion, Audio Controller, Hero Hall, Letter Casket, and Family Lamps | M2 | DONE |
| M4 | Interactive Festivities Components (Sections 05-08) | Implement Jharokha Event Windows, Celestial Astrolabe Countdown, Bangle RSVP, and Reflecting Pool Diyas | M2 | DONE |
| M5 | Template Integration, Mobile Polish & Styling Isolation | Integrate all sections into `templates/sheesh-mahal/page.tsx`, author scoped `style.css`, enforce mobile rules & touch targets | M3, M4 | DONE |
| M6 | Final Verification, Adversarial Hardening & Completion Report | Run E2E test suite (100% pass), multi-viewport responsive checks, visual regression, clean build, forensic audit, completion report | M5 | DONE |

---

## Interface Contracts

### 1. `templates/sheesh-mahal/index.ts` ↔ Platform Registry (`templates/index.ts`)
```typescript
import SheeshMahal from "./page";
import defaultData from "./data.json";

export default SheeshMahal;
export { defaultData as sheeshMahalData, SheeshMahal };
```

### 2. Template Component Props Contract
```typescript
export interface SheeshMahalProps {
  data?: Partial<SheeshMahalData>;
}

export interface SheeshMahalData {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  weddingDate: string; // ISO date or formatted
  weddingTime: string;
  venue: {
    name: string;
    address: string;
    mapUrl?: string;
  };
  events: Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    dressCode?: string;
    mapUrl?: string;
    calendarDate?: {
      start: string;
      end: string;
    };
  }>;
  musicTrack?: string;
  sacred?: {
    bismillah?: string;
    verseArabic?: string;
    verseTranslation?: string;
    verseReference?: string;
    urduPoem?: string;
  };
  rsvpDeadline?: string;
}
```

### 3. Audio Controller Contract
```typescript
interface AudioControllerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  toggleMusic: () => void;
  playSfx: (sfxName: SfxIdentifier) => void;
}
```

---

## Code Layout

```
public/templates/sheesh-mahal/
├── audio/
│   ├── music.mp3
│   ├── sfx-door-open.mp3
│   ├── sfx-letter.mp3
│   ├── sfx-light.mp3
│   ├── sfx-join.mp3
│   ├── sfx-window-open.mp3
│   ├── sfx-tick.mp3
│   ├── sfx-lock.mp3
│   ├── sfx-bangle.mp3
│   ├── sfx-roll.mp3
│   ├── sfx-dove.mp3
│   ├── sfx-diya.mp3
│   └── sfx-shimmer.mp3
└── assets/
    ├── cover/      (doors, medallion, mirrors variants)
    ├── hero/       (hall, mirrors, gold accents)
    ├── letter/     (casket, parchment, seal, marble)
    ├── families/   (wall, lanterns, flame glow, chain)
    ├── events/     (jharokha arch, shutters, mehndi, nikah, baraat, walima)
    ├── countdown/  (ceiling, brass rings, rete, dial)
    ├── rsvp/       (dove, sprite sheet, stand, bangles, roll)
    └── closing/    (moon, lake scene, diyas 0-3)

templates/sheesh-mahal/
├── index.ts        (public exports)
├── page.tsx        (main modular client component)
├── style.css       (scoped stylesheet with container queries and keyframes)
├── data.json       (canonical fallback dataset)
└── components/
    ├── EntranceGate.tsx
    ├── AudioDock.tsx
    ├── HeroHall.tsx
    ├── LetterCasket.tsx
    ├── FamilyLamps.tsx
    ├── EventWindows.tsx
    ├── AstrolabeCountdown.tsx
    ├── BangleRsvp.tsx
    └── ReflectingPool.tsx
```
