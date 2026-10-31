# Design Specification: Sheesh Mahal Digital Wedding Invitation

> **Target:** `templates/sheesh-mahal/`  
> **Reference:** https://aqdinvites.com/demo/sheesh-mahal  
> **Source Base:** https://aqdinvites.com/invites/sheesh-mahal/  

---

## 1. Visual Theme & Royal Philosophy

The Sheesh Mahal (Palace of Mirrors) aesthetic is inspired by Mughal imperial architecture — carved white marble arches, mirror-mosaic walls (Aina-Kari), deep emerald silk textures, antique burnished gold foil accents, and delicate brass filigree.

### Key Visual Tenets:
1. **Lustrous Opulence**: Warm candle glows, specular light glints, and metallic golden sheens layered over deep emerald velvet backdrops.
2. **Architectural Depth**: Multi-layer 3D perspective — arched jharokha windows that swing open on brass hinges, jewel caskets with hinged lids, and rotating astrolabe instruments.
3. **Sacred Reverence**: Prominently placed, crystal-clear Arabic calligraphy (Bismillah, Surah Ar-Rum 30:21) and Urdu nastaliq greetings.
4. **Mobile-First Focal Clearance**: Guaranteed unobstructed sightlines for faces, crowns, and expressions in portraiture and hero scenes.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Palette

| Token | CSS Variable | Hex / RGB | Role & Usage |
|-------|--------------|-----------|--------------|
| Emerald Primary | `--sm-emerald` | `#0b4a3b` (`11, 74, 59`) | Primary accents, medallion fill, button background |
| Emerald Deep | `--sm-emerald-deep` | `#062a21` (`6, 42, 33`) | Section background gradients, theme meta color |
| Emerald Night | `--sm-emerald-night` | `#03170f` (`3, 23, 15`) | Outer card canvas, night sky backdrop |
| Base Dark | `--sm-base` | `#05140e` (`5, 20, 14`) | Base container canvas |
| Royal Antique Gold | `--sm-gold` | `#c9a45c` (`201, 164, 92`) | Borders, text highlights, couple names, icons |
| Soft Champagne Gold | `--sm-gold-soft` | `#e6cf98` (`230, 207, 152`) | Kickers, subheadings, filigree accents |
| Burnished Deep Gold | `--sm-gold-deep` | `#86662a` (`134, 102, 42`) | Astrolabe engravings, shadows, bevel borders |
| Handmade Ivory Parchment | `--sm-ivory` | `#f5efe2` (`245, 239, 226`) | Letter parchment background, contrast text |
| Deep Emerald Ink | `--sm-ink` | `#0b3d31` (`11, 61, 49`) | Text printed on ivory parchment |
| Pearl Shimmer | `--sm-soft-white` | `#eef3f0` (`238, 243, 240`) | Moonlight highlights, specular glints |
| Interactive Accent | `--sm-accent` | `#5fc79a` (`95, 199, 154`) | Active focus rings, toggle states |

### 2.2 Glassmorphic Overlays & Shadows

- **Entrance Medallion**: `box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 40px rgba(201,164,92,0.3);`
- **Frosted Glass Pedestal**: `background: rgba(6, 42, 33, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(201, 164, 92, 0.35);`
- **Parchment Shadow**: `box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);`
- **Gold Text Gradient**: `background: linear-gradient(135deg, #e6cf98 0%, #c9a45c 50%, #86662a 100%); -webkit-background-clip: text;`

---

## 3. Typography Hierarchy & Font Tokens

The template utilizes 5 primary typography families already bundled or loaded via webfonts:

1. **Alex Brush / Pinyon Script**:
   - Usage: Romantic couple names (`<h1 class="sm-names">`), initials in wax seal.
   - Styling: `font-family: 'Alex Brush', cursive; font-size: clamp(2.5rem, 8cqi, 4rem); line-height: 1.1; font-weight: 400;`
2. **Cinzel / Cormorant Garamond**:
   - Usage: Section kickers, event titles, venue headings, astrolabe markings.
   - Styling: `font-family: 'Cormorant Garamond', 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase;`
3. **Amiri / Amiri Quran**:
   - Usage: Bismillah (`﷽`), Quranic verses (Surah Ar-Rum 30:21), marriage dua.
   - Styling: `font-family: 'Amiri', 'Amiri Quran', serif; font-size: clamp(1.5rem, 5cqi, 2.5rem); direction: rtl;`
4. **Noto Nastaliq Urdu**:
   - Usage: Urdu blessing line (`آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی`).
   - Styling: `font-family: 'Noto Nastaliq Urdu', serif; font-size: 1.25rem; line-height: 2.2;`
5. **Plus Jakarta Sans / Montserrat**:
   - Usage: Body copy, event dates, dress codes, RSVP inputs, countdown labels.
   - Styling: `font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(0.875rem, 2.5cqi, 1rem); line-height: 1.6;`

---

## 4. Mobile-First Layout & Facial Clearance Specifications

### 4.1 Viewport Container Bounds
- **Mobile Portrait (360px – 430px)**: `--card-w: 100%`. Standard full-screen width with 0 horizontal overflow.
- **Tablet / Desktop (> 640px)**: Centered card container with `--card-w: min(100%, max(75svh, 420px))`. Max width bounded to ~460px-520px in preview mode to preserve the intimate vertical scroll invitation feel.

### 4.2 Facial Clearance Guarantee (Mandatory Rule)
In portrait and hero sections:
- **Top Zone (0% – 32% height)**: Reserved for arch framework, sacred Bismillah invocation, and ambient hanging fanoos lantern.
- **Middle Focal Zone (33% – 68% height)**: 100% unobstructed, crystal-clear view of the palace hall / couple artwork. Floating cards, banners, or badges are strictly prohibited from occluding this zone.
- **Bottom Zone (69% – 100% height)**: Frosted glass pedestal banner holding couple names, wedding date, and pulsating scroll indicator.

### 4.3 Thumb Zone & Touch Target Ergonomics
- Central Medallion Seal: Minimum 80×80px interactive area.
- Floating Sound Toggle: Minimum 44×44px touch target (positioned top-right with `safe-area-inset-top`).
- Event Windows & Shutters: Full window card touch area (> 120×160px).
- Astrolabe Dial: Multi-touch drag area covering minimum 200×200px.
- RSVP Bangles & Stepper: Minimum 44×44px per button.

---

## 5. Animation Mechanics & Timing Parameters

1. **Entrance Gate Open (`#gate`)**:
   - Left Leaf: `transform: perspective(1000px) rotateY(-105deg); transition: transform 1.8s cubic-bezier(0.25, 1, 0.5, 1);`
   - Right Leaf: `transform: perspective(1000px) rotateY(105deg); transition: transform 1.8s cubic-bezier(0.25, 1, 0.5, 1);`
   - Sparkle Glints: 13 particles per leaf, pulsing opacity `0` to `1` over `0.6s` with randomized delays.
   - Flood Light: Opacity fades in to `1` over `1.2s`, then fades out to reveal the Hero Hall.
2. **Hero Glints Canvas (`<canvas>`)**:
   - Lightweight 2D canvas running at 60fps.
   - Pauses execution (`is-away`) when scrolled out of viewport to preserve mobile battery.
3. **Casket Lid Hinge & Letter Slide (`#letter`)**:
   - Lid: `rotateX(-120deg)` on top hinge over `0.8s`.
   - Letter Sheet: Slides upward `translateY(-30%)` then unfolds 3 panels (`rotateX` 0deg) over `1.2s`.
4. **Hanging Lamps & Confluence Threads (`#families`)**:
   - Lamp ignition: Flame scale `0` to `1` with flicker keyframe over `0.5s`.
   - Golden Threads: SVG `stroke-dasharray` and `stroke-dashoffset` animating from `1000` to `0` over `1.5s` converging onto central dua.
5. **Jharokha Shutters (`#events`)**:
   - Shutters swing outward in 3D: `rotateY(-85deg)` (left) and `rotateY(85deg)` (right) over `0.6s`.
6. **Astrolabe Dial & Countdown (`#countdown`)**:
   - Dial drag physics: Angular velocity with smooth snap-to-target.
   - Flip-tile matrix: Cosine vertical flip between on/off dot matrix digits.
7. **RSVP Dove & Paper Roll (`#rsvp`)**:
   - Paper rolls into parchment cylinder: `scaleY(0.1)` over `0.6s`.
   - Dove flight: 4-frame sprite sheet translation across top-right viewport over `1.4s`.
8. **Reflecting Pool Diyas (`#closing`)**:
   - Water touch: Spawns diya at pointer coordinates with 3 concentric expanding ripples (`scale(0)` to `scale(3)`).
   - Diya physics: Gentle sinusoidal vertical bobbing (`translateY(±4px)` over `3s`).

---

## 6. Complete Verified Asset Manifest

### Audio Files (13 Total)
1. `music.mp3` -> `public/templates/sheesh-mahal/audio/music.mp3`
2. `sfx-open.mp3` (cover) -> `public/templates/sheesh-mahal/audio/sfx-door-open.mp3`
3. `sfx-letter.mp3` -> `public/templates/sheesh-mahal/audio/sfx-letter.mp3`
4. `sfx-light.mp3` -> `public/templates/sheesh-mahal/audio/sfx-light.mp3`
5. `sfx-join.mp3` -> `public/templates/sheesh-mahal/audio/sfx-join.mp3`
6. `sfx-open.mp3` (events) -> `public/templates/sheesh-mahal/audio/sfx-window-open.mp3`
7. `sfx-tick.mp3` -> `public/templates/sheesh-mahal/audio/sfx-tick.mp3`
8. `sfx-lock.mp3` -> `public/templates/sheesh-mahal/audio/sfx-lock.mp3`
9. `sfx-bangle.mp3` -> `public/templates/sheesh-mahal/audio/sfx-bangle.mp3`
10. `sfx-roll.mp3` -> `public/templates/sheesh-mahal/audio/sfx-roll.mp3`
11. `sfx-dove.mp3` -> `public/templates/sheesh-mahal/audio/sfx-dove.mp3`
12. `sfx-float.mp3` -> `public/templates/sheesh-mahal/audio/sfx-diya.mp3`
13. `sfx-shimmer.mp3` -> `public/templates/sheesh-mahal/audio/sfx-shimmer.mp3`

### Visual & Texture Assets (63 Files)
- **Cover**: `doors.webp`, `doors-tab.webp`, `doors-land.webp`, `medallion.webp`, `medallion-tab.webp`, `medallion-land.webp`, `mirrors.webp`, `mirrors-tab.webp`, `mirrors-land.webp`
- **Hero**: `hall.webp`, `hall-tab.webp`, `hall-land.webp`, `mirrors.webp`, `mirrors-tab.webp`, `mirrors-land.webp`, `gold.webp`
- **Letter**: `casket-lid.webp`, `casket-open.webp`, `paper.webp`, `paper-back.webp`, `seal.webp`, `band.webp`, `marble.webp`
- **Families**: `wall.webp`, `wall-mirrors.webp`, `lantern-unlit.webp`, `lantern-lit.webp`, `lantern-glow.webp`, `chain.webp`
- **Events**: `arch.webp`, `shutters.webp`, `frame.webp`, `frame-mirrors.webp`, `mehndi.webp`, `nikah.webp`, `baraat.webp`, `walima.webp`
- **Countdown**: `ceiling.webp`, `ceiling-mirrors.webp`, `frame.webp`, `ring1.webp`, `ring2.webp`, `ring3.webp`, `rete.webp`
- **RSVP**: `dove.webp`, `dove-fly.webp`, `paper.webp`, `stand.webp`, `bangle-mehndi.webp`, `bangle-nikah.webp`, `bangle-baraat.webp`, `bangle-walima.webp`, `roll.webp`, `ribbon.webp`
- **Closing**: `moon.webp`, `scene.webp`, `scene-tab.webp`, `scene-land.webp`, `diya-0.webp`, `diya-1.webp`, `diya-2.webp`, `diya-3.webp`
