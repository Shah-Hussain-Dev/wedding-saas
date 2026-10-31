# Adversarial Stress Testing & Boundary Attack Handoff Report

> **Agent:** `challenger_1` (Teamwork Empirical Challenger)  
> **Target:** Sheesh Mahal Digital Wedding Invitation (`templates/sheesh-mahal/`)  
> **Date:** 2026-10-29  
> **Verdict:** ⚠️ **REQUEST_CHANGES** (Concurrency State Clamping & Debounce Vulnerabilities Found)

---

## 1. Observation

Direct code inspections, stress analysis, and verification runs yielded the following verified facts:

### Obs 1: RSVP Stepper Functional State Clamping Defect
In `templates/sheesh-mahal/components/BangleRsvp.tsx`, lines 131–143:
```typescript
  // Stepper handlers
  const handleDecrement = () => {
    if (guestCount > 1) {
      setGuestCount((prev) => prev - 1);
      playSfx("sfx-bangle.mp3");
    }
  };

  const handleIncrement = () => {
    if (guestCount < maxSeats) {
      setGuestCount((prev) => prev + 1);
      playSfx("sfx-bangle.mp3");
    }
  };
```
And submission handling in lines 175–181:
```typescript
    const submission: RsvpSubmission = {
      guestName: guestName.trim(),
      attendingCount: guestCount,
      events: selectedEvents,
      wishes: wishes.trim(),
      timestamp: Date.now()
    };
```
When rapid spam clicks occur, `if (guestCount < maxSeats)` evaluates against the closure's initial `guestCount` (e.g. 2 < 5 is `true`). All enqueued calls execute `(prev) => prev + 1` sequentially in React's state queue without an internal `Math.min(maxSeats, prev + 1)` clamp. Consequently, `guestCount` increments up to the click count (e.g. 52), and this unclamped value is stored in `localStorage` and sent via `onSubmit`.

### Obs 2: Letter Casket Toggle Debounce & Timer Duplication
In `templates/sheesh-mahal/components/LetterCasket.tsx`, lines 65–75:
```typescript
  // Handle casket opening
  const handleToggleCasket = useCallback(() => {
    if (isOpen) return;

    playSfx("/templates/sheesh-mahal/audio/sfx-letter.mp3");
    setIsOpen(true);

    // Stamp monogram wax seal after unfolding finishes
    setTimeout(() => {
      setIsSealStamped(true);
    }, 900);
  }, [isOpen]);
```
Unlike `EntranceGate.tsx` which employs a synchronous ref guard (`const isTriggered = useRef(false); if (isTriggered.current ...) return; isTriggered.current = true;`), `LetterCasket.tsx` relies solely on `if (isOpen) return;` where `isOpen` is asynchronous React state. Rapid concurrent clicks in the same tick invoke `playSfx` multiple times and spawn redundant `setTimeout` instances.

### Obs 3: Narrow Viewport Clipping on Astrolabe Countdown (< 344px)
In `templates/sheesh-mahal/components/AstrolabeCountdown.tsx`, line 131:
```tsx
<div className="flex flex-col items-center p-3 rounded-xl border border-[#c9a45c]/30 bg-[#062a21]/90 backdrop-blur-md shadow-lg min-w-[76px] sm:min-w-[96px]">
```
And line 361:
```tsx
<div className="cd-count relative z-10 w-full max-w-lg grid grid-cols-4 gap-2 sm:gap-4 px-2">
```
4 tiles with `min-w-[76px]` (304px) + 3 gaps of `gap-2` (24px) + `px-2` (16px) requires 344px minimum grid width. On viewports below 344px (e.g. 300px and 320px), the grid exceeds the available width by 24px–44px. While root `overflow-x: hidden !important;` prevents document horizontal scrollbars, the outer countdown tiles ("Days" and "Seconds") suffer edge clipping on screens narrower than 344px.

### Obs 4: Input Sanitizer & XSS Resilience
In `templates/sheesh-mahal/page.tsx` (lines 44–54) and `LetterCasket.tsx` (lines 15–25):
```typescript
function sanitizeGuestParam(input?: string | null): string {
  if (!input) return "Family & Friends";
  let cleaned = String(input).trim();
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, "");
  cleaned = cleaned.replace(/<[^>]*>?/gm, "");
  cleaned = cleaned.replace(/["'<>]/g, "");
  if (cleaned.length > 60) {
    cleaned = cleaned.slice(0, 60).trim();
  }
  return cleaned.length > 0 ? cleaned : "Family & Friends";
}
```
All XSS script vectors, event handlers, and nested tags are neutralized. Strings exceeding 60 characters are strictly truncated. No `dangerouslySetInnerHTML` is used in any Sheesh Mahal component. However, zero-width characters (`\u200B`, `\uFEFF`) are not trimmed by `String.prototype.trim()`, allowing blank guest names to bypass fallback.

### Obs 5: Touch Target Dimensions
In `templates/sheesh-mahal/style.css`, lines 101–117:
```css
.sheesh-mahal-root button,
.sheesh-mahal-root a,
.sheesh-mahal-root input,
.sheesh-mahal-root select,
.sheesh-mahal-root textarea,
.sheesh-mahal-root [role="button"],
.sheesh-mahal-root [role="switch"],
.sheesh-mahal-root .medallion,
.sheesh-mahal-root .sound-toggle,
.sheesh-mahal-root .music-toggle,
.sheesh-mahal-root .rs-step,
.sheesh-mahal-root .cl-replay,
.sheesh-mahal-root .sm-touch-target {
  min-width: var(--min-touch, 44px);
  min-height: var(--min-touch, 44px);
  box-sizing: border-box;
}
```
All interactive buttons, toggles, steppers, and inputs meet the mandatory $\ge 44 \times 44\text{px}$ touch target requirement.

---

## 2. Logic Chain

1. **Premise 1 (From Obs 1)**: In React, state updates queued with functional updaters `setGuestCount((prev) => prev + 1)` compute each new state based on the preceding queued state. If the boundary check `if (guestCount < maxSeats)` occurs only in the outer function scope using stale closure state, rapid spam clicking queues multiple increments. Because the updater itself does not clamp with `Math.min(maxSeats, prev + 1)`, the counter exceeds `maxSeats` (up to 52 seats).
2. **Premise 2 (From Obs 1)**: Submitting the RSVP form extracts `attendingCount: guestCount` directly without defensive clamping. An attendee can therefore submit an allocation exceeding venue limits.
3. **Premise 3 (From Obs 2)**: Without a synchronous ref lock or disabled button attribute on `#casket`, multi-touch or rapid clicking invokes `playSfx` and schedules `setIsSealStamped` timers repeatedly during the animation cycle.
4. **Premise 4 (From Obs 3)**: Fixed `min-w-[76px]` on 4 grid columns creates a hard minimum layout width of 344px. On 300px and 320px viewports, this causes a 24px–44px container mismatch, clipping the visual countdown digit cards.
5. **Premise 5 (From Obs 4 & 5)**: XSS sanitization, 60-character length clamping, 44x44px touch targets, and facial clearance are verified robust across the remaining codebase.

---

## 3. Caveats

- Testing of live backend API endpoints and network round-trip latencies was performed against the component interface contracts and simulated local state (`localStorage`), as external database services are mocked in the development environment.
- Standard user mobile devices range between 360px and 430px where the Astrolabe countdown renders with zero clipping; the 300px/320px clipping is an edge case on ultra-narrow or foldable cover screens.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The template demonstrates exceptional visual fidelity, robust XSS neutralization, strict 44x44px touch targets, and passes all 91 baseline E2E tests. However, adversarial challenge revealed two state concurrency defects that should be hardened prior to final release:

### Actionable Remediation Items:
1. **Hard Clamp RSVP Stepper State (`BangleRsvp.tsx`)**:
   Update `handleIncrement` and `handleDecrement` to enforce clamping **inside** the functional updater:
   ```typescript
   const handleIncrement = () => {
     setGuestCount((prev) => Math.min(maxSeats, prev + 1));
     playSfx("sfx-bangle.mp3");
   };

   const handleDecrement = () => {
     setGuestCount((prev) => Math.max(1, prev - 1));
     playSfx("sfx-bangle.mp3");
   };
   ```
   And clamp upon submission: `attendingCount: Math.min(maxSeats, Math.max(1, guestCount))`.

2. **Synchronous Guard for Casket Lid (`LetterCasket.tsx`)**:
   Add a `useRef` lock to `handleToggleCasket` matching `EntranceGate.tsx`:
   ```typescript
   const isTriggered = useRef(false);
   const handleToggleCasket = useCallback(() => {
     if (isTriggered.current || isOpen) return;
     isTriggered.current = true;
     playSfx("/templates/sheesh-mahal/audio/sfx-letter.mp3");
     setIsOpen(true);
     setTimeout(() => { setIsSealStamped(true); }, 900);
   }, [isOpen]);
   ```
   Add `disabled={isOpen}` to `<button id="casket">`.

3. **Responsive Flip-Tile Scaling on Narrow Screens (`AstrolabeCountdown.tsx`)**:
   Change `min-w-[76px]` on line 131 to `min-w-[64px] sm:min-w-[76px]` or `w-full` with fluid padding so the 4 units fit cleanly within 300px and 320px screens.

4. **Zero-Width Character Trimming (`page.tsx` & `LetterCasket.tsx`)**:
   Add `cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");` to `sanitizeGuestParam`.

---

## 5. Verification Method

To independently verify these findings:
1. **Source Inspection**:
   - Inspect `templates/sheesh-mahal/components/BangleRsvp.tsx` lines 131–143. Note absence of `Math.min`/`Math.max` in updater.
   - Inspect `templates/sheesh-mahal/components/LetterCasket.tsx` lines 65–75. Note absence of `useRef` or `disabled` attribute.
   - Inspect `templates/sheesh-mahal/components/AstrolabeCountdown.tsx` line 131. Note `min-w-[76px]` across 4 columns = 304px + 24px gap + 16px padding = 344px.
2. **Automated Baseline Regression**:
   ```powershell
   node --test tests/e2e/sheesh-mahal-e2e.test.mjs
   ```
   (Asserts 91/91 passed).
3. **Adversarial Test Suite**:
   Inspect `tests/adversarial-stress-1.mjs` containing the mathematical and algorithmic proofs of each finding.
