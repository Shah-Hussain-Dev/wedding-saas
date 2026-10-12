# WedInvites — Mandatory Rules & Engineering Standards

> **Design, UX, Frontend & Engineering Rules for WedInvites (`wedinvites.in`)**  
> *Classification:* Strict Project Governance · *Audience:* Designers, Frontend Engineers, AI Agents

---

## 1. Mandatory Mobile-First Approach

Because **95%+ of wedding guests open invitations on mobile devices** via WhatsApp, SMS, or Instagram, every template, page, and interactive component MUST adhere to this mobile-first foundation:

### 1.1 Base Viewport Standard (360px – 430px)
- **Rule**: All styles must be written for mobile portrait screens (360px – 430px) as the default baseline.
- **Implementation**:
  - Write base Tailwind utility classes for mobile first.
  - Scale up to tablet (`min-width: 768px`) and desktop (`min-width: 1024px`) strictly using responsive breakpoints (`md:`, `lg:`, `xl:`).
  - Test on viewport widths down to **320px** (iPhone SE) to ensure zero unwanted horizontal overflow.
  - Set `overflow-x: hidden` / `overflow-x: clip` at top-level container boundaries.

---

## 2. Visual Focal Points & Facial Clearance Guarantee

### 2.1 The Problem
In wedding invitations featuring couples, bride & groom portraits, cultural artwork, or sacred calligraphy (e.g. Bismillah, Ganesh invocations), floating headline banners, badge pills, or CTA buttons frequently block faces or sacred motifs.

### 2.2 The Facial Clearance Standard
- **The faces, heads, crowns, jewelry, and expressions of couples must NEVER be covered, blocked, or occluded** by floating text cards, badges, or overlays.
- **Adaptive Tri-Tier Layout Standard on Mobile**:
  - **Top Tier (0% – 20% Viewport Height)**: Compact, elegant arch header or semi-transparent sacred invocation.
  - **Middle Tier (20% – 75% Viewport Height)**: **100% unobstructed, crystal-clear view** of the couple portrait, character illustration, and focal artwork.
  - **Bottom Tier (75% – 100% Viewport Height)**: Frosted glass floating pedestal card (`bg-white/80` or `bg-black/75` with `backdrop-blur-md`) housing couple names, wedding date, and interactive actions.

---

## 3. Touch Target Ergonomics & Thumb Zone

### 3.1 44×44px Minimum Touch Target Rule
- All interactive controls (wax seals, audio toggles, buttons, RSVP CTAs, gallery navigation arrows) must have an absolute minimum clickable/tappable area of **44×44px**.
- If a visual element is smaller than 44px (e.g., a 24px icon), its wrapping `<button>` or `<a>` must include padding or invisible hit area extensions (`p-3`, `min-h-[44px] min-w-[44px]`).

### 3.2 Thumb Zone & Safe Area Insets
- Floating action buttons (e.g. music toggle, bottom CTA) must be positioned in the natural thumb zone.
- Floating buttons must respect mobile hardware safe areas:
  ```css
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  ```

---

## 4. Audio Autoplay Protocol & Tap-to-Unfold Gesture

### 4.1 Mobile Browser Restriction
Modern mobile browsers (iOS Safari, Android Chrome) strictly block background audio playback (`AudioContext` / `<audio>`) unless triggered by an explicit user gesture.

### 4.2 Mandatory Tap-to-Unfold Pattern
1. Live invitation pages must launch with a closed curtain/door overlay displaying a subtle prompt: *"Tap to Open"*.
2. The user tap registers the required browser gesture, initializes the audio player synchronously, and begins the 3D door unfolding timeline.
3. Every template must provide an accessible floating audio toggle button so guests can mute/unmute at will.

---

## 5. Next.js App Router & React 19 Rules

### 5.1 Push Client State Down
- Keep route layouts and top-level pages as **Server Components** by default to ensure pre-rendered HTML, fast TTFB, and optimal SEO indexation.
- Only mark leaf components with `"use client"` when they require client hooks (`useState`, `useEffect`, `useRef`) or browser event handlers.

### 5.2 Next.js Metadata API
- `viewport` must always be a separate export (`export const viewport: Viewport = { ... }`), never placed inside the `metadata` object.
- Always declare `metadataBase` in the root layout (`app/layout.tsx`).
- In dynamic route segments (`app/preview/[templateId]`), `params` is a Promise and must be awaited (`const { templateId } = await params;`).

---

## 6. Typography & Fluid Layout Rules

- Use fluid typography with `clamp()` or responsive font-size classes to prevent text overflow or clumsy line wraps on narrow screens.
- Avoid orphaned single-word lines in headings using `text-balance` or controlled `<span>` line breaks.
- Preserve brand color contrast ratios (WCAG AA compliant) across all text overlays.
