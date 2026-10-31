# Technical Architecture & Integration Inspection: 'Sheesh Mahal' Wedding Template

> **Author:** explorer_codebase (teamwork_explorer)  
> **Date:** 2026-10-29T16:05:00Z  
> **Target Project:** WedInvites (`wedinvites.in`)  
> **Working Directory:** `d:\practice\projects-S\invitation\wedding-saas`  
> **Scope:** Project structure, routing, template registry, data contracts, styling tokens, animation libraries, shared components, assets, build/test tooling, and exact integration points for the new 'Sheesh Mahal' template.

---

## 1. Observation

### 1.1 Project Structure & Core Framework Stack
Inspection of `package.json` (lines 1-58), `next.config.ts` (lines 1-17), `tsconfig.json` (lines 1-35), and `postcss.config.mjs` (lines 1-8) revealed:

- **Next.js:** `16.2.9` utilizing the **App Router** paradigm (`app/` directory).
- **React:** `19.2.4` and `react-dom: 19.2.4`.
- **TypeScript:** `^5` with strict checking (`"strict": true`), resolution `"bundler"`, and path alias `"@/*": ["./*"]` (`tsconfig.json:21-23`).
- **Tailwind CSS:** `tailwindcss: "^4"`, `@tailwindcss/postcss: "^4"` in `postcss.config.mjs`.
- **Animation & Motion Libraries:**
  - `motion`: `^12.42.0` (Framer Motion v12, imported via `motion/react` in components)
  - `gsap`: `^3.15.0` and `@gsap/react`: `^2.1.2`
  - `lenis`: `^1.3.25` (smooth scrolling enabled globally via `LenisProvider` in `app/layout.tsx:180`)
  - `lottie-react`: `^3.1.2`
  - `canvas-confetti`: `^1.9.4`
- **Icon System:** `@phosphor-icons/react`: `^2.1.10`.
- **Form Management & Validation:** `react-hook-form: ^7.80.0`, `@hookform/resolvers: ^5.4.0`, `zod: ^4.4.3`.
- **Database & Backend:** `prisma: 7.8.0`, `@prisma/client: 7.8.0`, `@prisma/adapter-pg: 7.8.0`, `pg: ^8.22.0`, `next-auth: ^4.24.14`, `razorpay: ^2.9.6`, `cloudinary: ^2.10.0`.
- **Redirects:** `next.config.ts:8-12` redirects `/templates/:slug` to `/preview/:slug`.

### 1.2 Routing & Slug Architecture
Inspection of the `app/` directory revealed the following route topology:

1. **`app/[slug]/page.tsx` (Live Invitation Route)**:
   - Client component (`"use client"`).
   - Dynamic route for couple invitations (e.g. `wedinvites.in/diya-shaan`).
   - Fetches public invitation via `/api/invitations/public?slug=${slug}` or checks `localStorage` cache (`unfold_invitation_${slug}`).
   - Falls back gracefully to demo mode if database is offline.
   - Dynamically resolves template component and default fallback via `TEMPLATES_MAP[invitation.templateId]` and `getTemplateDefaultData(invitation.templateId)` from `@/templates`.
   - Merges customized couple details (`brideName`, `groomName`, `weddingDate`, `events`, etc.) over `templateDefault`.
   - Renders `<SelectedTemplate data={mergedInvitation} />` wrapped in `<DemoBanner>` if unpaid.

2. **`app/preview/[templateId]/page.tsx` (Responsive Template Preview Route)**:
   - Resolves dynamic `templateId` parameter.
   - Defines `KNOWN_TEMPLATE_IDS` array (lines 20-37) currently containing 16 template slugs.
   - If `templateId` is known and `?custom=1` is not set: renders `<TemplateDemoPage templateId={normalizedId} />`.
   - If customized or previewing with mock data: renders `<CustomizedInvitationPreview>` wrapping `<SelectedTemplate data={...} />` with `<PreviewControlsDock>` (audio toggle, faith switcher, bottom sheet controls).
   - Global `<style jsx global>` hides native template audio buttons (`.celestial-audio-pill`, `.imperial-audio-pill`, `.luxury-audio-dock`, etc.) in preview mode to let the dock control audio cleanly.

3. **`app/preview/[templateId]/interactive/page.tsx` (Interactive Embed Route)**:
   - Direct interactive viewport iframe sandbox.
   - Defines `ALL_16_TEMPLATES` array (lines 19-36).
   - Renders `<SelectedTemplate data={sampleData} />` with `<PreviewControlsDock>`.

4. **`app/templates/page.tsx` (Public Template Catalog Route)**:
   - Displays all invitation designs with dynamic filters: "All Masterpieces (16)", "Universal Themes", "Hindu Weddings", "Muslim Weddings", "Best Sellers", "New Releases".
   - Defines catalog entries in `TEMPLATES` array (lines 30-220) with name, style, tags, prices, scenes, and media previews.

5. **`app/customize/[templateId]/page.tsx` (Couple Customization Wizard Route)**:
   - Houses `<InvitationCustomizerWizard templateId={templateId} />`.
   - 4-step wizard:
     1. Couple names, parental details, education/profession, wedding date/time, slug generator.
     2. Venue details, Google Map URL, multi-event schedule builder (Haldi, Mehendi, Sangeet, Ceremony, Reception).
     3. Media uploader (hero portrait, slideshow gallery) and curated audio track selector.
     4. Live preview, printable PDF preview card modal, Razorpay payment / save invitation.
   - Reads defaults via `getTemplateMeta(templateId)` and `getTemplateDefaultData(templateId)`.

6. **`app/sitemap.ts` (SEO Sitemap Generator)**:
   - Contains `TEMPLATE_SLUGS` array (lines 4-21) generating static canonical URLs for `/preview/${slug}`.

### 1.3 Existing Template Engine & Directory Structure
Inspection of `templates/` revealed **16 production templates**:
`azure-nikah`, `celestial-rose`, `crimson-royale`, `emerald-noir`, `emerald-qasr`, `gul-e-noor`, `imperial-palace`, `kitab-e-nikah`, `modern-minimal`, `noor-e-nikah`, `rose-gold-blush`, `royal-elegance`, `royal-grace`, `royal-heritage`, `royal-lotus`, `royal-majesty`.

Each template directory strictly follows an identical self-contained contract:
```
templates/<template-slug>/
├── index.ts      # Exports default component and defaultData (lines 1-6)
├── page.tsx      # Client component accepting `{ data?: any }` (self-contained layout & animations)
├── style.css     # Scoped CSS for keyframes, canvas overlays, and bespoke classes
└── data.json     # Authentic fallback data (couple, date, venue, dressCode, events, gallery, quotes)
```

Central registry `templates/index.ts` (lines 1-101):
- Imports all 16 template components and their `defaultData`.
- Exports `TEMPLATES_MAP`: `Record<string, React.ComponentType<{ data?: any }>>`.
- Exports `TEMPLATE_DEFAULT_DATA`: `Record<string, any>`.
- Exports helper functions:
  - `getTemplateComponent(templateId: string): React.ComponentType<{ data?: any }>` (defaults to `NoorNikah`)
  - `getTemplateDefaultData(templateId: string): any` (defaults to `noorNikahData`)

### 1.4 Data Models & Configuration Schemas
Inspection of `prisma/schema.prisma` (lines 1-167) and `lib/preview-faith-content.ts` (lines 1-460) revealed:

- **`Invitation` Model Schema**:
  - `id`: UUID
  - `templateId`: String (matches slug in registry)
  - `slug`: Unique string
  - `brideName`, `groomName`: String
  - `weddingDate`: DateTime (Date)
  - `weddingTime`: String
  - `venueName`, `venueAddress`: String
  - `venueLat`, `venueLng`: Decimal (nullable)
  - `heroImageUrl`: String (nullable)
  - `slideshowImages`: Json array of image URLs
  - `musicTrack`: String (URL or curated track ID)
  - `eventsJson`: Json array of `{ name, enabled, venue, time, date, description }`
  - `showDressCode`: Boolean, `dressCodeText`: String
  - `showTransport`: Boolean, `transportText`: String
  - `languages`: Json array (e.g. `["en"]`)
  - `translations`: Json dictionary for multilingual/faith overrides
  - `isPublished`: Boolean

- **Faith Switching Pipeline (`lib/preview-faith-content.ts`)**:
  - Defines `PreviewFaith`: `"universal" | "hindu" | "muslim"`.
  - `FAITH_VARIANTS` dictionary provides authentic sacred verses, Quranic Ayahs / Vedic Shlokas, bismillah/mantra invocations, hashtags, and default traditional events.
  - Function `getDefaultFaithForTemplate(templateId: string)` determines the native faith from template name.
  - Function `getFaithAdjustedTemplateData(baseData, faith, templateId, userCustomizedNames)` adapts data dynamically when couples toggle traditions.

- **Printable PDF Tokens (`lib/pdf-theme-tokens.ts`)**:
  - `PDF_THEME_TOKENS: Record<string, PdfCardStyleTokens>` defines dual-page printable card theme tokens:
    - Page 1 cover card: `coverBg`, `coverBorderColor`, `coverGoldAccent`, `coverFiligreeStyle`
    - Page 2 reception card: `receptionBg`, `receptionBorderColor`, `receptionGoldAccent`, `receptionDividerStyle`
    - Typography: `coupleFont`, `headingFont`, `bodyFont`
    - Traditions & Invocations: `tradition`, `sacredInvocation`, `baratEventTitle`, `receptionEventTitle`

### 1.5 Styling System, Fonts & Typography Tokens
Inspection of `app/globals.css` (lines 1-542) and `public/fonts/fonts.css` (lines 1-847) revealed:

- **Tailwind CSS v4 Configuration**:
  - `@import "tailwindcss";` at `app/globals.css:1`.
  - Theme variables defined in `@theme` block (`globals.css:40-66`):
    - `--color-canvas: #F7F4ED`, `--color-paper: #FCFAF6`, `--color-emerald: #073D31`, `--color-champagne: #C8A45E`, etc.
- **Font Assets in `public/fonts/fonts.css`**:
  - 94 local `.woff2` font files pre-bundled (zero external Google Fonts network dependencies at runtime).
  - Predefined typography utility classes in `globals.css:330-408`:
    - Scripts: `.font-great-vibes`, `.font-alex-brush`, `.font-pinyon`, `.font-parisienne`, `.font-allura`, `.font-montecarlo`, `.font-italianno`
    - Royal Serifs: `.font-cinzel-dec`, `.font-cinzel`, `.font-playfair`, `.font-cormorant`, `.font-marcellus`, `.font-bodoni`, `.font-rozha`, `.font-lora`
    - Sacred Invocation / Arabic: `.font-amiri`
    - Modern Sans: `.font-jakarta`, `.font-montserrat`
- **Global Mobile-First & Overflow Rules (`globals.css:505-541`)**:
  - Form inputs on mobile (`@media (max-width: 640px)`) enforced with `font-size: 16px !important` to prevent iOS Safari auto-zoom.
  - `html, body, main, [class*="tmpl-"]` enforced with `max-width: 100vw; overflow-x: hidden !important;`.
  - Global scrollbars hidden via `scrollbar-width: none !important;` across all templates and previews.
  - Template style isolation: Template styles are enclosed in `templates/<slug>/style.css` under scoped root wrappers (e.g. `.celestial-template-root`, `.gul-e-noor-root`, `.tmpl-sheesh-mahal`).

### 1.6 Animation Primitives & Utilities
- Composable Motion primitives in `components/ui/motion-primitives.tsx`:
  - `EASE_FLUID = [0.32, 0.72, 0, 1]`
  - `fadeUp`, `fadeIn`, `staggerContainer`, `scaleIn`, `slideInLeft`, `slideInRight`, `cardHover`, `viewportOnce`.
- Canvas utilities:
  - Interactive scratch-to-reveal via `canvas-confetti` (e.g. `ScratchTheStarsCard`, `ScratchCard.tsx`).
  - Physics particle canvas (e.g. `CelestialPetalCanvas`, `FloatingPetals.tsx`).
- GSAP & ScrollTrigger: Installed (`gsap: ^3.15.0`, `@gsap/react: ^2.1.2`), available for pinned timelines or horizontal scrubbing if required.
- Lenis: Global smooth scroll active via `LenisProvider`.

### 1.7 Shared Platform Components
- **`components/invitation/`**:
  - `DoorAnimation.tsx`: 3D door opening overlay for live invitations.
  - `CountdownTimer.tsx`: Live countdown with days/hours/mins/secs and celebratory completion state.
  - `GuestMessageForm.tsx`: Multi-event RSVP and guest blessings submission engine connected to `/api/messages`.
  - `ScratchCard.tsx` / `ShapedScratchCard.tsx`: Canvas scratch-to-reveal cards with confetti trigger.
  - `GoogleMapEmbed.tsx`: Venue location embed with 1-tap Google Maps directions.
  - `MusicPlayer.tsx` / `LuxuryAudioDock.tsx`: Floating audio player with animated equalizer bars.
  - `PhotoSlideshow.tsx`: Touch-friendly image carousel with fullscreen lightbox.
  - `TemplateMarketingFooter.tsx`: Shared Atelier conversion footer present at the bottom of all templates. Maps `templateId` via internal `TEMPLATE_THEMES` dictionary (`TemplateMarketingFooter.tsx:250-344`).
- **`components/decor/`**:
  - `floating-petals.tsx`, `floral-divider.tsx`, `golden-particles.tsx`, `hanging-garland.tsx`, `mandala-decor.tsx`, `rangoli-border.tsx`, `corner-rose.tsx`.
- **`components/preview/`**:
  - `DemoBanner.tsx`: Preview header with checkout button and 15-minute timer.
  - `PreviewControlsDock.tsx`: Floating dock with unified Mute/Unmute toggle, track selector, faith switcher, and bottom sheet dialog.

### 1.8 Static Asset Directories
- `public/templates/<slug>/`: Template-specific hero images, door textures, and default `music.mp3`.
- `public/audio/`: 15 curated high-bitrate MP3 instrumental tracks (e.g. `din-shagna-da.mp3`, `kudmayi-royale.mp3`, `ranjha-acoustic.mp3`, `madhanya-violin.mp3`, `kesariya-sitar.mp3`, `pasoori-acoustic.mp3`, `tajdar-e-haram.mp3`, `kun-faya-kun-qawwali.mp3`).
- `public/fonts/`: Local font files (`wedding-font-*.woff2`) and `fonts.css`.
- `public/videos/`: Cinematic video reveals (e.g. `royal-prestige.mp4`, `royal-majesty.mp4`, `royal-heritage.mp4`).
- `public/lottie-icons/`: Interactive JSON Lottie animations.

### 1.9 Build & Lint Health Verification
Executed command in project environment:
- Command: `npx.cmd tsc --noEmit`
- Result: Exited with code `0`, clean compilation, zero TypeScript errors across the entire codebase.

---

## 2. Logic Chain

From the observed facts, the architecture and isolation requirements lead to the following direct deduction steps:

### Step 1: Framework & Runtime Harmony
- Next.js 16 App Router with React 19 and Motion v12 (`motion/react`) requires all interactive templates to be marked with `"use client"`.
- Next.js 16 bundler uses path aliases `@/*` pointing to project root.
- Tailwind v4 and `@import "../public/fonts/fonts.css"` are loaded globally. Any template can immediately consume font utility classes (`font-great-vibes`, `font-cinzel`, `font-cormorant`, etc.) without re-importing font CSS.

### Step 2: Strict Isolation & Zero Disruption Guarantee
- The existing 16 templates are completely decoupled from each other. None import styles or components from another template's directory.
- Global styles in `app/globals.css` only enforce base layout constraints (`max-width: 100vw; overflow-x: hidden !important;`).
- By placing the new template in `templates/sheesh-mahal/` and scoping its custom CSS in `templates/sheesh-mahal/style.css` under a dedicated class (e.g. `.sheesh-mahal-root`), all existing templates, global styles, and shared UI remain 100% unaffected.

### Step 3: Exact Integration Recipe (10 Integration Touchpoints)
To register the new `sheesh-mahal` template as a first-class citizen alongside the existing 16 templates, exactly 10 coordination points must be updated:

1. **Template Directory Creation**:
   - `templates/sheesh-mahal/index.ts` (export component and `defaultData`)
   - `templates/sheesh-mahal/page.tsx` (the React component)
   - `templates/sheesh-mahal/style.css` (scoped styles and keyframes)
   - `templates/sheesh-mahal/data.json` (canonical wedding details, events, and assets)
2. **Central Template Map Registry (`templates/index.ts`)**:
   - Import `SheeshMahal` and `sheeshMahalData` from `./sheesh-mahal`.
   - Add `"sheesh-mahal": SheeshMahal` to `TEMPLATES_MAP`.
   - Add `"sheesh-mahal": sheeshMahalData` to `TEMPLATE_DEFAULT_DATA`.
   - Export `SheeshMahal` and `sheeshMahalData`.
3. **Template Metadata Model (`lib/template-meta.ts`)**:
   - Add `"sheesh-mahal"` to `TemplateId` union type (lines 1-17).
   - Add `sheesh-mahal` entry to `TEMPLATE_META` dictionary with name, style, category, religion tags, and gradient.
   - Add dynamic import `"sheesh-mahal": () => import("@/templates/sheesh-mahal")` to `TEMPLATE_COMPONENTS`.
4. **Printable PDF Styling Tokens (`lib/pdf-theme-tokens.ts`)**:
   - Add `"sheesh-mahal"` configuration to `PDF_THEME_TOKENS` with cover background, gold accents, filigree style, and font choices for export.
5. **Faith Switching Resolver (`lib/preview-faith-content.ts`)**:
   - In `getDefaultFaithForTemplate(templateId: string)`, ensure `"sheesh-mahal"` maps cleanly (e.g. to `"muslim"`, `"hindu"`, or `"universal"` depending on design direction).
6. **Atelier Marketing Footer Themes (`components/invitation/TemplateMarketingFooter.tsx`)**:
   - Add `"sheesh-mahal"` theme tokens to `TEMPLATE_THEMES` dictionary (accent color, badge border, card background) so the footer matches the Sheesh Mahal palette.
7. **Preview Route Whitelist (`app/preview/[templateId]/page.tsx`)**:
   - Add `"sheesh-mahal"` to `KNOWN_TEMPLATE_IDS` array (lines 20-37).
   - Add `.sheesh-audio-pill` / `.sm-music-toggle` to the global style suppression list so dock controls work seamlessly.
8. **Interactive Embed Whitelist (`app/preview/[templateId]/interactive/page.tsx`)**:
   - Add `"sheesh-mahal"` to `ALL_16_TEMPLATES` array (lines 19-36).
9. **Catalog & SEO Sitemap (`app/templates/page.tsx` & `app/sitemap.ts`)**:
   - Add `"sheesh-mahal"` to `TEMPLATES` array in `app/templates/page.tsx` for showcase and filtering.
   - Add `"sheesh-mahal"` to `TEMPLATE_SLUGS` in `app/sitemap.ts` for search engine indexing.
10. **Static Asset Directory (`public/templates/sheesh-mahal/`)**:
    - Store high-resolution imagery, textures, mirror glass SVG/motifs, portraits, and `music.mp3`.

### Step 4: Props & Component Contract
Every template must strictly implement the standard signature:
```typescript
interface SheeshMahalProps {
  data?: any;
}

export default function SheeshMahal({ data }: SheeshMahalProps) {
  // Merge incoming customized props over canonical defaultData
  const resolvedData = { ...defaultData, ...data };
  ...
}
```
Properties to extract safely from `resolvedData` / `data`:
- `brideName`, `groomName`, `brideParents`, `groomParents`, `brideEducation`, `groomEducation`, `brideProfession`, `groomProfession`
- `weddingDate`, `weddingTime`, `venue` (name, address, mapUrl, valet, landmark)
- `events` / `eventsJson` (array of events: Haldi/Manjha, Mehendi, Sangeet, Ceremony/Nikah, Reception/Walima)
- `musicTrack` (resolved via local fallback or curated library)
- `gallery` / `slideshowImages`
- `dressCode` (title, description, color swatches)
- `sacred` (invocations, verses, translations)

### Step 5: Mobile-First & Facial Clearance Constraints (Rule Compliance)
In accordance with `AGENTS.md`:
1. Mobile portrait viewport (360px – 430px) is the primary canvas; desktop is enhanced via `@media (min-width: 768px)` or `md:`.
2. In hero portrait and gallery sections featuring couple photography, **faces, crowns, jewels, and expressions must remain 100% unobstructed**. The layout hierarchy on mobile must be:
   - **Top**: Sacred invocation or compact arch header.
   - **Middle**: Crystal-clear view of the couple artwork.
   - **Bottom**: Frosted glass pedestal/banner for names and date badges.
3. Interactive controls (wax seal, audio toggles, buttons, RSVP CTAs, gallery navigation) must guarantee minimum `44×44px` touch targets.
4. Enforce `overflow-x: hidden` with zero horizontal page scroll.

---

## 3. Caveats

1. **Windows PowerShell Command Execution**:
   - Running `npm` via PowerShell on this Windows system triggers execution policy restrictions on `npm.ps1`.
   - **Remedy**: Always invoke `npm.cmd` or `npx.cmd` and set `BypassSandbox: true` when running workspace commands.
2. **Database Fallback Mode**:
   - In local development where PostgreSQL/Prisma database connections are offline, the platform's routes (`app/[slug]/page.tsx` and `app/preview/[templateId]/page.tsx`) automatically fall back to mock data and `localStorage` caching without failing. This is completely normal and verified.
3. **No Modification of Other Templates**:
   - The 16 existing templates must remain untouched. All Sheesh Mahal code will be self-contained within `templates/sheesh-mahal/` and registered only via the explicit registry files.

---

## 4. Conclusion

The existing WedInvites codebase is exceptionally well-structured, modern, and type-safe. It implements a clean, decoupled template engine running on Next.js 16 App Router, React 19, Motion v12, and Tailwind v4.

The path for introducing the **Sheesh Mahal** template is 100% clear, completely isolated, and straightforward:
- It requires creating a new modular folder `templates/sheesh-mahal/` containing `index.ts`, `page.tsx`, `style.css`, and `data.json`.
- It integrates into the platform via the 10 enumerated touchpoints without altering any existing template code or global styles.
- It can immediately leverage the rich local font library (Amiri, Cinzel, Alex Brush, Playfair, Cormorant), Motion v12 animations, canvas confetti, Lenis smooth scrolling, and shared platform utilities.

---

## 5. Verification Method

To independently verify this architectural analysis and future integration:

1. **TypeScript Build Verification**:
   ```powershell
   npx.cmd tsc --noEmit
   ```
   *Expected outcome:* Exit code `0` with zero diagnostic errors.

2. **Template Registry Verification**:
   Inspect `templates/index.ts` to ensure `TEMPLATES_MAP["sheesh-mahal"]` returns the component and `getTemplateDefaultData("sheesh-mahal")` returns the default data object.

3. **Route Preview Verification**:
   Navigate or fetch:
   - `/preview/sheesh-mahal` (overview demo page)
   - `/preview/sheesh-mahal/interactive` (direct interactive preview)
   - `/customize/sheesh-mahal` (customization wizard)
   - `/[slug]` with `templateId: "sheesh-mahal"` (live couple invitation portal)

4. **Invalidation Conditions**:
   - Any modification to files in other `templates/*` directories.
   - Any TypeScript compiler error introduced during registration.
   - Any horizontal scrollbar or overflow (`overflow-x != hidden`) on 360px viewport.
