# Specification Mining Report: Sheesh Mahal Invitation Flows, Structure & Interactions

- **Target Reference**: `https://aqdinvites.com/demo/sheesh-mahal` (Demo Container) & `https://aqdinvites.com/invites/sheesh-mahal/index.html` (Authoritative Standalone Invitation)
- **Investigator**: `spec_miner_flows` (teamwork_spec_miner subagent)
- **Status**: Completed Hard Handoff
- **Date**: 2026-10-29

---

## 1. Observation

Direct extraction and automated inspection of the reference implementation codebase yielded the following concrete architectural, DOM, CSS, and JavaScript artifacts:

### 1.1 Host Architecture and Shell Delivery
1. The URL `https://aqdinvites.com/demo/sheesh-mahal` delivers an outer device preview shell (`DemoView-module__hnNVUW__page`) containing:
   - Viewport segment switcher (`Phone`, `iPad`, `iPad sideways`)
   - Stage container (`DemoView-module__hnNVUW__stage`) hosting an iframe pointing directly to `/invites/sheesh-mahal/index.html`
   - Jump navigation chips: `01 doors`, `02 hall`, `03 letter`, `04 families`, `05 events`, `06 countdown`, `07 RSVP`, `08 closing`
   - Metadata payload: `slug: "sheesh-mahal"`, `accent: "#5fc79a"`, `base: "5, 20, 14"`, `glow: "60, 170, 120"`
2. The authoritative invitation lives at `https://aqdinvites.com/invites/sheesh-mahal/index.html` as a standalone high-fidelity web application wrapped in `<html lang="en" class="is-shut is-loading">`.

### 1.2 Top-to-Bottom Section Sequence
The standalone invitation contains exactly 8 functional sections structured inside the DOM:
- **`#loader`**: Preloader overlay with animated geometric SVG mirror petals, progress percentage display (`data-loader-pct`), and skip trigger (`data-loader-skip`).
- **`#gate` (Section 01: Doors / Cover)**: Full-viewport fixed overlay (`z-index: 50`) featuring 3D double-leaf mirrored palace doors (`.d-leaf-l`, `.d-leaf-r`), 13 animated sparkle glints per leaf, ambient light flare (`.d-flood`), sound pre-toggle (`.sound-toggle`), and central gold medallion (`button.medallion`).
- **`#hero` (Section 02: Hall)**: Grand palace hall of mirrors background (`.h-hall`), warm ambient glow (`.h-warm`), mirror glint canvas (`canvas.h-glints`), Arabic Bismillah invocation (`.h-bism`), kicker (`.h-kicker`), gold-foil clipped couple names (`<h1 class="h-names">`), and pulsating scroll prompt (`.h-scroll`).
- **`#letter` (Section 03: Letter)**: Marble-backed invitation packet (`.lt-band`, `.lt-stage`) containing a velvet-lined 3D casket (`button.lt-casket`), interactive lid, and unfolding three-panel royal letter sheet (`#letterSheet`) featuring Surah Ar-Rum 30:21, personalized guest greeting, formal parent host lines, Urdu blessing, and flying wax monogram seal (`.lt-seal`).
- **`#families` (Section 04: Families)**: Emerald silk-textured hall (`.families`) featuring two interactive hanging oil lamps (`.fm-lamp`) for groom's and bride's parents. Lighting both lamps triggers golden SVG bezier threads (`.fm-threads`) that converge onto the couple's union block and hadith dua (`.fm-union`).
- **`#events` (Section 05: Events / Festivities)**: Four festive events (Mehndi, Nikah, Baraat, Walima) presented as architectural Mughal arched windows (`.ev-win`) with 3D opening wooden shutters (`.ev-leaf-l`, `.ev-leaf-r`), scene paintings, and expandable detail cards (`.ev-more`) with Google Maps directions and calendar exports (`.ev-btn-cal`).
- **`#countdown` (Section 06: Countdown)**: Celestial astrolabe (`.cd-astro`) featuring rotating calendar rings (Day of week, Day of month, Month), interactive touch dial (`.cd-dial`), alignment lock chime, and an animated 2D canvas flip-tile matrix display for Days, Hours, Minutes, and Seconds.
- **`#rsvp` (Section 07: RSVP)**: Royal postal desk (`.rsvp`) featuring 4 event bangle stands (`.rs-toggle`), party size stepper (`.rs-step`), wishes textarea, honeypot spam protection, and paper-roll-to-carrier-dove submission animation (`.rs-roll`, `.rs-flyer`).
- **`#closing` (Section 08: Closing)**: Starry reflecting pool at night (`.cl-scene`, `.cl-moon`), Baraka Allahu Lakuma dua, interactive floating brass diyas (`.cl-float`), and replay invitation controller (`.cl-replay`).

### 1.3 Concrete Code Metrics and Values Observed
- **Root Layout Token**: `--card-w: min(100%, max(75svh, 360px))`. On tablet/desktop screens, `.card` is centered with `box-shadow: 0 0 60px rgba(0, 0, 0, 0.55)`.
- **Palette**:
  - `--emerald: #0b4a3b`
  - `--emerald-deep: #062a21`
  - `--emerald-night: #03170f`
  - `--gold: #c9a45c`
  - `--gold-soft: #e6cf98`
  - `--gold-deep: #86662a`
  - `--ivory: #f5efe2`
  - `--ink: #0b3d31`
- **Audio Registry**:
  - Background Music: `assets/music/music.mp3` (looped, volume 0.6, 2.5s gain fade-in)
  - SFX (12 files): `assets/cover/sfx-open.mp3`, `assets/letter/sfx-letter.mp3`, `assets/families/sfx-light.mp3`, `assets/families/sfx-join.mp3`, `assets/events/sfx-open.mp3`, `assets/countdown/sfx-tick.mp3`, `assets/countdown/sfx-lock.mp3`, `assets/rsvp/sfx-clink.mp3`, `assets/rsvp/sfx-roll.mp3`, `assets/rsvp/sfx-dove.mp3`, `assets/closing/sfx-float.mp3`, `assets/closing/sfx-shimmer.mp3`
- **Touch Target Findings**:
  - Medallion: `--med-d: 23.085%` (approx 88px diameter on 380px screen) -> Compliant (> 44px).
  - Casket: `min(84cqi, 520px)` -> Compliant (> 44px).
  - Lamps: `--lamp-w: min(30cqi, 150px, 13svh)` -> Compliant (> 44px).
  - Event Windows: `--win-w` approx 140px-180px -> Compliant (> 44px).
  - Audio Toggle (`.sound-toggle` and `.music-toggle`): `width: 40px; height: 40px; padding: 9px`. *Note*: Under mobile ergonomics rules, interactive touch targets must be padded or scaled to minimum 44×44px.
  - RSVP Stepper (`.rs-step`): `width: 40px; height: 40px`. *Note*: Requires 44×44px touch area compliance.

---

## 2. Logic Chain

1. **Gate and Entrance Locking Mechanism**:
   - In `css_1b51875257.css` line 1: `html.is-shut, html.is-shut body { overflow: hidden; overscroll-behavior: none }` and `.card { height: 100svh; overflow: hidden }`.
   - The user cannot scroll the main card while the gate is active.
   - Touching `#medallion` triggers `js_4fcdd2c4c0.js`, which plays `sfx-open.mp3`, adds `.is-opening` to `#gate`, pivots `.d-leaf-l` and `.d-leaf-r` in 3D, fades in `.d-flood`, and removes `is-shut` from `html`.
   - This smoothly unlocks page scroll and reveals the Hero section without layout shifting.

2. **Audio Autoplay & State Persistence**:
   - In `js_fd5e8812d4.js`, browsers blocking autoplay are handled by deferring playback until the user's first touch gesture on the medallion or sound toggle.
   - Sound state is stored in `localStorage` under `sm:music` and `sm:sound` (`'on'` or `'off'`).
   - If `/[?&]nomusic\b/.test(location.search)` is detected, the audio engine stays disabled.
   - When tab visibility changes (`document.hidden`), audio fades out to avoid background noise and resumes when the tab is refocused.

3. **Facial Clearance Guarantee & Layout Architecture**:
   - In `css_8647abf050.css`, the hero scene is anchored with `--arch-t: 33.403%`, `--arch-b: 80.838%`, and `--lamp-x: 49.63%`.
   - The sacred invocation Bismillah sits at the top arch apex (`.h-bism`).
   - The central hall mirror arch remains 100% unobstructed, crystal-clear, and free of occluding badges or overlapping text.
   - The couple names and invitation formula sit in the lower center (`top: 42%` to `70%`), ensuring facial and character clearances required by project design rules.

4. **Astrolabe Math & Countdown Mechanics**:
   - In `js_3904bd8af0.js`, the astrolabe implements `atan2(deltaY, deltaX)` on pointermove to calculate rotation angles.
   - Snapping occurs at the target date: `2026-12-12T20:00:00+05:00` (Baraat event).
   - Once locked, the 2D canvas flip-tile counter renders a 7×5 pixel matrix per digit using `tile-on.webp` and `tile-off.webp` with radial glint flares (`af()`).

5. **RSVP State Machine & Fallback**:
   - In `js_2812262112.js`, if `data-endpoint` is not set or offline, replies persist gracefully in `localStorage.getItem('sm:rsvp')`.
   - Toggling event bangles updates `role="switch"`, slips 3D bangle rings over the brass stands, and dynamically generates sentence summaries.
   - The party size stepper dynamically adapts copy between singular guest and full family allocations.
   - Upon submission, the form card rolls into a scroll (`.rs-roll`), a white dove flies in to collect it (`.rs-flyer`), and a thank-you card (`.rs-thanks`) renders with an option to "Change my reply".

---

## 3. Caveats

1. **Gallery Section Verification**: In traditional wedding templates, photo galleries often appear as separate grid lightboxes. In Sheesh Mahal, the architectural design integrates the primary visual gallery into the 4 interactive 3D event window paintings (Mehndi, Nikah, Baraat, Walima) plus the Palace Hall hero scene and reflecting pool closing scene.
2. **Offline Audio Fallback**: Browsers without Web Audio API fall back to basic HTML5 `<audio>` playback, disabling custom gain ramping and discrete spatial sound effects.
3. **Touch Target Dimensions in Source**: The original reference implementation sets `.sound-toggle`, `.music-toggle`, and `.rs-step` to `40×40px`. To maintain strict compliance with project guidelines, the template implementation MUST elevate these to minimum `44×44px` interactive touch targets.

---

## 4. Conclusion

The Sheesh Mahal reference site is a fully realized, stateful, multi-layered digital wedding invitation experience engineered around Mughal palace aesthetics and the historic Hall of Mirrors. Its interaction architecture relies on 8 distinct sequential phases, discrete audio-visual micro-interactions, responsive aspect-ratio breakpoints, and comprehensive accessibility semantics.

All design tokens, layout dimensions, animation parameters, audio assets, text copy, and responsive state machines have been completely extracted, verified, and mapped below.

---

## 5. Verification Method

To independently reproduce and verify all findings documented in this report:

1. **Verify Asset Download and CSS Properties**:
   ```powershell
   node d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\download_and_analyze.js
   ```
   Inspect `combined.css` and `js_analysis.json` generated in `.agents/teamwork/spec_miner_flows/`.

2. **Verify Component Logic & Audio URLs**:
   ```powershell
   node d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\find_audio.js
   ```
   Confirm the 12 SFX audio assets and background music track URLs.

3. **Verify Interactive DOM Elements and Section Jump Links**:
   Read `C:\Users\shamshad\.gemini\antigravity\brain\c83fd939-69cc-4ad1-8a60-d1983111947e\.system_generated\steps\18\content.md` lines 47–510 to confirm verbatim DOM structures.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Preloader | Geometric Mirror Petals | Rotating 16-petal mandala loader with SVG glint animation and progress counter | Loading events from asset decodes | Progress percentage `0%` to `100%`, `Polishing the mirrors` text | Fallback skip button appears after 6s timeout | `index.html:18`, `#loader` |
| 2 | Gate / Cover | Mirrored Doors Gate | Fixed full-screen entrance gate with 3D double doors and 13 sparkle glints per leaf | Tap / click on central medallion | Doors rotate outward in 3D, light flood flare, unlocks scroll | If reduced-motion preferred, instant fade without rotation | `css_1b51875257.css`, `js_4fcdd2c4c0.js` |
| 3 | Gate / Cover | Medallion Seal Trigger | Circular gold crest button centered on door seam | Tap / Enter key / Spacebar | Triggers `sfx-open.mp3`, sets `gate.is-opening`, removes `html.is-shut` | Button disables after first click to prevent duplicate triggers | `assets/cover/beda901c97.css` |
| 4 | Audio | Background Soundtrack | Ambient palace classical soundtrack with volume ramping | User interaction / page open | HTML5 Audio looped playback with 2.5s gain fade | Autoplay blocked -> waits for first touch gesture | `js_fd5e8812d4.js`, `assets/music/music.mp3` |
| 5 | Audio | Floating Sound Toggle | Fixed circular glassmorphic button in top-right safe zone | Tap / click | Toggles audio play/pause, updates `localStorage`, shows mute slash | If muted in storage, remains muted on page reload | `css_9e86b95303.css`, `.music-toggle` |
| 6 | Hero | Sacred Bismillah Arch | Calligraphic Bismillah invocation at the apex of the hall arch | Static Arabic text `&#xFDFD;` | Rendered in Amiri / Amiri Quran font, unobscured | Fallback system serif font | `#hero`, `.h-bism` |
| 7 | Hero | Couple Name Centerpiece | Gold-leaf clipped couple names `Zain & Anaya` with subtle shadow | Text content | Gold texture clipped text in Alex Brush cursive font | Fallback cursive script | `assets/hero/7bbc2d4d2a.css`, `.h-names` |
| 8 | Hero | Hall Glints Canvas | Dynamic floating light particles across mirror walls | Canvas 2D requestAnimationFrame | Shimmering golden glint particles over hall artwork | Pauses when section leaves viewport (`.is-away`) | `canvas.h-glints`, `css_007234ef6e.css` |
| 9 | Letter | 3D Velvet Casket | Mirrored casket button that holds the invitation letter | Click / tap on `#casket` | Plays `sfx-letter.mp3`, hinges 3D lid open, metallic sheen | Auto-opens when in viewport for 1000ms if untouched | `js_b672bc1327.js`, `.lt-casket` |
| 10 | Letter | Unfolding Royal Sheet | Three-panel sliding letter sheet (`top`, `mid`, `bottom`) | Casket open event | Letter slides up from casket interior and unfolds in 3D | Instant unfold if `prefers-reduced-motion` | `#letterSheet`, `js_b672bc1327.js` |
| 11 | Letter | Dynamic Guest Personalization | Reads `?to=Guest+Name` from URL query parameter | URL query parameter `to` | Injects guest name into `[data-guest]` across greetings | Defaults to "Family & Friends" if parameter absent | `js_b672bc1327.js:2` |
| 12 | Letter | Flying Monogram Seal | Wax seal stamped with couple initials (`Z&A`) | Unfolding completion | Seal lifts from envelope packet, scales up, stamps on letter | Fixed positioning fallback | `.lt-seal`, `.lt-flyseal` |
| 13 | Families | Hanging Oil Lamps | Two interactive hanging lamps for Groom's and Bride's parents | Click / tap on `.fm-lamp` | Lamp lights up (`.is-lit`), flame flickers, plays `sfx-light.mp3` | Auto-kindles after scroll dwell time | `#families`, `js_0a1eef2209.js` |
| 14 | Families | Golden Confluence Threads | Dynamic SVG cubic bezier paths connecting lamps to couple | Both lamps lit | Golden threads draw inward and bloom at couple union | Threads draw instantly without animation if reduced motion | `svg.fm-threads`, `.fm-bloom` |
| 15 | Events | 3D Arched Window Cards | 4 festive cards (Mehndi, Nikah, Baraat, Walima) with shutters | Tap / click on `.ev-win` | Shutters open in 3D (`rotateY`), flares light, reveals details | Cards stack vertically on mobile, grid on desktop | `#events`, `js_dd11b867a6.js` |
| 16 | Events | Event Calendar Export | Add-to-calendar action button generating event files | Click on `.ev-btn-cal` | Calendar picker dropdown (Google, Apple ICS, Outlook) | Direct .ics file download fallback | `.ev-btn-cal`, `InviteCalendar` |
| 17 | Events | Google Maps Navigation | Directions link to specific Karachi banquet venues | Tap on Directions link | Opens Google Maps search query in external tab | Standard web navigation | `.ev-btn`, Google Maps URL |
| 18 | Countdown | Celestial Astrolabe | Rotating astrological instrument with Day, Date, Month rings | Drag / swipe dial, keyboard arrows | Dial rotates, rings align, plays mechanical `sfx-tick.mp3` | Snaps automatically when close to target date | `#countdown`, `js_3904bd8af0.js` |
| 19 | Countdown | Lock & Alignment Chime | Celestial date convergence when astrolabe reaches wedding date | Dial value reaches `1.0` | Plays `sfx-lock.mp3`, unlocks radial flare and flip timer | Dwell timeout auto-finds date if user does not drag | `.cd-glow`, `js_3904bd8af0.js` |
| 20 | Countdown | 2D Canvas Flip-Tile Matrix | 7×5 pixel flip-tile display for Days, Hours, Mins, Secs | Time delta calculation | Animated 3D cosine flip between on/off tiles with flares | Digits stay flat if canvas unsupported | `canvas.cd-unit`, `tile-on.webp` |
| 21 | RSVP | Bangle Stand Switches | 4 event attendance toggles modeled as traditional bangles | Tap on `.rs-toggle` | Plays `sfx-clink.mp3`, bangle slips down stand, updates summary | Keyboard space/enter toggles switch | `.rs-bangle`, `js_2812262112.js` |
| 22 | RSVP | Party Stepper Controller | Counter controls for number of attending guests | Click `-` or `+` (`.rs-step`) | Increments/decrements count between 1 and allocated seats | Buttons disable when limits reached | `.rs-stepper`, `.rs-count` |
| 23 | RSVP | Parchment Roll & Carrier Dove | Submission transition animation of form paper into a dove | Form submit event | Form paper rolls into scroll (`sfx-roll.mp3`), dove flies in (`sfx-dove.mp3`) | Instant transition if reduced motion active | `.rs-roll`, `.rs-flyer`, `js_2812262112.js` |
| 24 | RSVP | Confirmation Card | Shukriya thank-you summary card with attendance recap | Successful submission | Displays attendee name, selected events, and "Change my reply" | Stored in `localStorage` if network fails | `.rs-thanks`, `.rs-change` |
| 25 | Closing | Reflecting Pool Water Scene | Midnight palace reflecting pool with crescent moon | Static artwork & canvas | Canvas water glints reflect star and moon light | Pauses when out of viewport | `#closing`, `.cl-scene`, `.cl-moon` |
| 26 | Closing | Floating Brass Diyas | Interactive floating diya lanterns with sinusoidal bobbing | Tap water or `.cl-float` | Spawns diya on water, ripples water, plays `sfx-float.mp3` | Max diya concurrency capped to prevent lag | `.cl-diyas`, `js_a96c99de75.js` |
| 27 | Closing | Replay Invitation Loop | Invitation replay CTA button in footer | Click on `.cl-replay` | Smoothly scrolls to top and re-engages the entrance gate | Re-locks page until user taps medallion again | `.cl-replay` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | URL Query Override | `?nomusic` in browser URL | Audio engine is completely bypassed; background music and sound toggles are suppressed. |
| 2 | Guest Personalization | `?to=` containing script tags or HTML entities | String is safely trimmed, limited to 60 characters, and injected as plain `textContent` without XSS vulnerability. |
| 3 | Autoplay Restriction | Direct browser navigation without prior user interaction | Audio playback is staged; sound starts seamlessly only when the user taps the entrance medallion. |
| 4 | Offline / Stalled Network | Network disconnect during RSVP submission | Form catches network failure, falls back to `localStorage.setItem('sm:rsvp')`, and displays the thank-you state locally. |
| 5 | Reduced Motion Preference | System `prefers-reduced-motion: reduce` active | 3D door swing, casket lid hinge, letter sliding, and astrolabe spin animations are disabled; elements transition immediately with opacity. |
| 6 | Past Event Deadline | Client clock past `data-closes="2026-12-13T23:30:00+05:00"` | Form card is replaced with `.rs-closed` card displaying: "Replies have closed. Thank You for your love and your duas." |
| 7 | Narrow Mobile Viewport | Viewport width below 360px (e.g. 320px iPhone SE) | `--card-w` clamps to `100%`, fluid typography clamps down, and `overflow-x: hidden` prevents horizontal scrolling. |
| 8 | Wide Desktop Display | Viewport width above 1440px (1920×1080) | Card width is bounded by `--card-w: min(100%, max(75svh, 360px))` (~810px width), centered with deep ambient emerald gradient backdrop. |
| 9 | Rapid Repeated Taps | Double-clicking or spamming the medallion or casket button | Click handlers check `if (z) return; z = true;` to guarantee single-fire state transitions. |
| 10 | Background Tab Switching | Switching away to another browser tab while music plays | `visibilitychange` event triggers gradual audio fade-out; refocusing triggers smooth fade-in. |

---

## 6. Detailed Text Copy, Sacred Texts & Typography Hierarchy

### 6.1 Sacred Invocations & Quranic Verses
- **Bismillah** (Hero Top):
  - Arabic: `﷽` (`&#xFDFD;`)
  - Semantic Label: `aria-label="Bismillah ir-Rahman ir-Raheem"`
  - Font: Amiri / Amiri Quran, size clamp(28px, 8cqi, 44px)
- **Quranic Verse** (Letter Sheet Top):
  - Arabic: `وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً`
  - English: *"And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy."*
  - Reference: `Surah Ar-Rum · 30:21`
- **Family Dua** (Families Section):
  - Arabic: `اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا، وَأَصْلِحْ ذَاتَ بَيْنِنَا`
  - English: *"O Allah, bring our hearts together, and set right what is between us."*
  - Reference: `Sunan Abi Dawud · 969`
- **Closing Blessing Dua** (Closing Section):
  - Arabic: `بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ`
  - English: *"May Allah bless you both, shower His blessings upon you, and unite you in goodness."*
- **Urdu Blessing Line** (Letter Sheet Lower):
  - Urdu: `آپ کی شرکت ہمارے لیے باعثِ مسرت ہوگی` (Noto Nastaliq Urdu)
  - English: *"Your presence will be our joy."*

### 6.2 Wedding Itinerary & Details
1. **Mehndi**:
   - Date & Time: `Thursday · 10 December 2026 · 7:30 pm onwards`
   - Venue: `Gul Bahar Lawn, Clifton, Karachi`
   - Dress Code: `Yellow, green & marigold`
   - Artwork Scene: Brass thaal of henna, diyas, and marigolds under marigold garlands
2. **Nikah**:
   - Date & Time: `Friday · 11 December 2026 · 4:30 pm, after Asr`
   - Venue: `Masjid-e-Rahmat, DHA Phase 6, Karachi`
   - Dress Code: `Soft pastels & ivory`
   - Artwork Scene: Ivory divan strewn with rose petals, silver tray of dates, pink roses and jasmine
3. **Baraat**:
   - Date & Time: `Saturday · 12 December 2026 · 8:00 pm onwards`
   - Venue: `Qasr-e-Aina Banquet Hall, Shahrah-e-Faisal, Karachi`
   - Dress Code: `Formal eastern, in reds & golds`
   - Artwork Scene: Ruby and gold doli hung with roses and jasmine, among glowing lanterns
4. **Walima**:
   - Date & Time: `Sunday · 13 December 2026 · 8:30 pm onwards`
   - Venue: `The Pearl Marquee, Karsaz, Karachi`
   - Dress Code: `Silver, pearl & pastels`
   - Artwork Scene: Silver settee under cascades of white flowers and pearls, lit by candles and chandelier

### 6.3 Family & Couple Credits
- Groom's Parents: `Mr & Mrs Imran Siddiqui`
- Bride's Parents: `Mr & Mrs Faisal Chaudhry`
- Couple: `Zain & Anaya`
- Credit Tagline: `Invitation by Aqd Invites`
