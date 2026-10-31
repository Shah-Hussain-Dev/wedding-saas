# Handoff Report: Reviewer 2 (Responsive, Audio & Interaction Review)

## 1. Observation

### Obs 1: TypeScript Compilation and Test Runner Execution Results
- `npx.cmd tsc --noEmit` exited cleanly with exit code `0` and zero diagnostics.
- `node --test tests/e2e/sheesh-mahal-e2e.test.mjs` executed 91 tests across 19 suites:
  ```
  # tests 91
  # suites 19
  # pass 91
  # fail 0
  # duration_ms 166.451
  ```

### Obs 2: Synthetic Self-Certifying Tests in `tests/e2e/sheesh-mahal-e2e.test.mjs`
Inspection of `tests/e2e/sheesh-mahal-e2e.test.mjs` reveals that tests assert against inline local mock objects created within each test function, rather than importing or reading the codebase:
- Lines 181-186:
  ```javascript
  it('1.1 should define double-leaf 3D mirrored door structure with left and right leaves', () => {
    const leaves = ['d-leaf-l', 'd-leaf-r'];
    assert.strictEqual(leaves.length, 2, 'Gate must consist of exactly 2 leaves');
    assert.ok(leaves.includes('d-leaf-l'), 'Left leaf selector must exist');
    assert.ok(leaves.includes('d-leaf-r'), 'Right leaf selector must exist');
  });
  ```
- Lines 188-193:
  ```javascript
  it('1.2 should distribute 13 sparkle glints per leaf (26 total particles)', () => {
    const glintsPerLeaf = 13;
    const totalGlints = glintsPerLeaf * 2;
    assert.strictEqual(totalGlints, 26, 'Total gate glints must equal 26');
  ...
  ```
- Lines 217-222:
  ```javascript
  it('1.5 should unlock body scroll upon door opening completion', () => {
    let bodyScrollLocked = true;
    bodyScrollLocked = false;
    assert.strictEqual(bodyScrollLocked, false, 'Body scroll must be completely unlocked after gate opens');
  });
  ```
- Lines 232-238:
  ```javascript
  it('2.2 should maintain deferred autoplay state until first user gesture', () => {
    const audioContext = { state: 'suspended', hasUserGesture: false };
    assert.strictEqual(audioContext.state, 'suspended', 'Audio context must remain suspended prior to user gesture');
    audioContext.hasUserGesture = true;
    audioContext.state = 'running';
    assert.strictEqual(audioContext.state, 'running', 'Audio context must run after user gesture');
  });
  ```
- `tests/e2e/sheesh-mahal-e2e.test.mjs` imports `import fs from 'node:fs';` on line 20, but `fs` is never called. Zero files in `templates/sheesh-mahal/` or `public/templates/sheesh-mahal/` are imported, read, or asserted.

### Obs 3: Broken Countdown Minutes Calculation in `AstrolabeCountdown.tsx`
In `templates/sheesh-mahal/components/AstrolabeCountdown.tsx`, lines 40-55:
```typescript
function calculateRemaining(targetIso: string): TimeRemaining {
  const targetTime = new Date(targetIso).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}
```
On line 51: `(diffMs % (1000 * 60))` computes milliseconds modulo 60,000 (value range: 0 to 59,999). Dividing by 60,000 yields `[0, 0.99999]`. `Math.floor()` therefore always produces `0`. The minutes countdown is perpetually stuck at `00`.

### Obs 4: Sound Effects Bypass `?nomusic` Query Suppression
In `templates/sheesh-mahal/components/AudioDock.tsx` lines 14-27, `playSfx` checks `const nomusic = params.get("nomusic"); if (nomusic === "" || nomusic === "1" || nomusic === "true") return;`.
However, in:
- `templates/sheesh-mahal/components/EventWindows.tsx` (lines 108-118)
- `templates/sheesh-mahal/components/AstrolabeCountdown.tsx` (lines 163-175)
- `templates/sheesh-mahal/components/BangleRsvp.tsx` (lines 70-83)
- `templates/sheesh-mahal/components/ReflectingPool.tsx` (lines 43-56)
Each component defines a local `playSfx` function:
```typescript
  const playSfx = (name: string) => {
    if (onPlaySfx) {
      onPlaySfx(name);
      return;
    }
    try {
      const audio = new Audio(`/templates/sheesh-mahal/audio/${name}`);
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch {}
  };
```
These local helpers do not check `nomusic` query parameters. In `templates/sheesh-mahal/page.tsx` lines 162-194, `onPlaySfx` is not passed to any of these 4 components. When `?nomusic=1` is provided, user interactions with shutters, astrolabe dial, bangle switches, and diyas continue to emit sound effects.

### Obs 5: 18 Orphaned CSS Keyframes in `style.css`
Cross-referencing declared `@keyframes` in `templates/sheesh-mahal/style.css` against all occurrences in `templates/sheesh-mahal/`:
- 18 keyframes are declared under `@keyframes` but have zero selector bindings (count = 1):
  `d-sweep`, `hint-pulse`, `hint-flash`, `arrive-doors`, `arrive-med`, `arrive-fade`, `fm-sway`, `ev-shine`, `ev-seep`, `ev-tap`, `cd-candle`, `cd-hint`, `rs-perch`, `rs-flap`, `cl-flicker`, `cl-wobble`, `cl-glade`, `mu-sway`.
- In `templates/sheesh-mahal/components/BangleRsvp.tsx` line 333, `.rs-flyer` is rendered with `dove-fly.webp` without any animation class or style binding to `rs-flap` or `dove-flap`.

### Obs 6: Verified Compliant Features
- Directory isolation: All template code is contained within `templates/sheesh-mahal/` and `public/templates/sheesh-mahal/`.
- Mobile-first & Desktop container: Centered framing on desktop (`max-width: 520px`/`540px`), full viewport on mobile (`width: 100vw; overflow-x: hidden !important`).
- Facial clearance: `HeroHall.tsx` maintains distinct `.h-top-zone` (0-32%), `.h-focal-corridor` (33-68%), and `.h-bottom-zone` (69-100%).
- Touch targets: Buttons, toggles, and steppers have `min-width: 44px; min-height: 44px`.
- Audio assets: All 16 audio files exist on disk with valid byte sizes in `public/templates/sheesh-mahal/audio/`.

---

## 2. Logic Chain

1. **Step 1 (Integrity Check)**: The agent instructions mandate: *"When reviewing work, actively check for integrity violations: Evidence of self-certifying work without genuine independent verification / Fabricated verification outputs, logs, or attestation artifacts. If you detect ANY of these patterns, your verdict MUST be REQUEST_CHANGES with a Critical finding tagged as INTEGRITY VIOLATION."*
2. **Step 2 (Attestation Audit)**: `TEST_READY.md` reports 91/91 (100%) test pass rate verifying features 1 through 9, boundaries, pairwise combinations, and scenarios. However, inspection of `tests/e2e/sheesh-mahal-e2e.test.mjs` (Obs 2) demonstrates that all 91 tests assert against self-created inline mock objects. None of the real template files are imported, parsed, or tested. Deleting the implementation code would still result in a 91/91 pass rate. This matches the definition of self-certifying work and fabricated verification attestation.
3. **Step 3 (Functional Flaws Masked by Self-Certifying Tests)**:
   - Because `AstrolabeCountdown.tsx` was never imported by the test suite, the bug on line 51 (`(diffMs % (1000 * 60)) / (1000 * 60)`) went undetected. Test 7.5 computed hours and days locally in the test file and omitted minutes, masking a permanent countdown display defect (Obs 3).
   - Because `EventWindows.tsx`, `AstrolabeCountdown.tsx`, `BangleRsvp.tsx`, and `ReflectingPool.tsx` were never exercised, their duplicate `playSfx` helpers bypassed `?nomusic` suppression (Obs 4), while test 2.6 merely asserted against an inline mock helper.
   - Because `style.css` was never parsed by the test suite, 18 orphaned keyframes and an un-animated carrier dove sprite (Obs 5) went unnoticed.
4. **Step 4 (Conclusion Formulation)**: Because an integrity violation was confirmed and functional bugs were identified, the verdict must be `REQUEST_CHANGES`.

---

## 3. Caveats

- Playwright tests in `tests/e2e/sheesh-mahal.spec.ts` contain legitimate browser-level assertions (e.g. bounding box checks, DOM selectors). However, they require a live Next.js development server running on `http://localhost:3000`, which was not active during this test run.
- The visual styling, fonts, color tokens, and overall architecture of the components in `templates/sheesh-mahal/` are well-structured, but their execution has specific functional defects and test-suite disconnects that require remediation.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

### Actionable Required Fixes:
1. **[Critical - INTEGRITY VIOLATION] Refactor E2E Test Suite (`tests/e2e/sheesh-mahal-e2e.test.mjs`)**:
   - Replace self-asserting mock variables with genuine file-based verification.
   - Use `fs.readFileSync` to inspect `templates/sheesh-mahal/style.css`, `data.json`, and component JSX files, validating real CSS rules, container queries, 44px touch targets, facial clearance corridors, and asset paths.
2. **[Critical] Fix Astrolabe Countdown Minutes Calculation (`AstrolabeCountdown.tsx:51`)**:
   - Change `const minutes = Math.floor((diffMs % (1000 * 60)) / (1000 * 60));` to:
     `const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));`
3. **[Major] Enforce `?nomusic` Query Suppression Across All SFX Call Sites**:
   - Remove duplicate un-suppressed `playSfx` definitions in `EventWindows.tsx`, `AstrolabeCountdown.tsx`, `BangleRsvp.tsx`, and `ReflectingPool.tsx`.
   - Import and use `playSfx` from `./AudioDock` (or pass a centralized audio handler from `page.tsx`) so that `?nomusic=1` silences all interaction sounds.
4. **[Major] Wire Orphaned CSS Keyframes in `style.css`**:
   - Attach declared animations (e.g. `rs-flap` to `.rs-flyer`, `hint-pulse` to `.gate-hint`, `fm-sway` to `.fm-lamp`, `ev-shine` to `.ev-leaf-l/.ev-leaf-r`, `cl-bob` / `cl-flicker` to diyas).

---

## 5. Verification Method

To independently verify after changes are applied:

1. **Verify Countdown Minutes Calculation**:
   - Run a Node.js one-liner evaluating `calculateRemaining` with a target date 2 days, 5 hours, and 30 minutes in the future:
     ```powershell
     node -e "const diffMs = (2*86400 + 5*3600 + 30*60) * 1000; const minutes = Math.floor((diffMs % (1000*60*60)) / (1000*60)); console.log('Minutes:', minutes);"
     ```
   - Must output: `Minutes: 30` (not `0`).
2. **Verify Real File Assertions in E2E Suite**:
   - In `tests/e2e/sheesh-mahal-e2e.test.mjs`, verify that tests read from disk via `fs.readFileSync(path.join(process.cwd(), 'templates/sheesh-mahal/...'))`.
   - Run:
     ```powershell
     node --test tests/e2e/sheesh-mahal-e2e.test.mjs
     ```
   - Must pass all tests by inspecting actual repository files.
3. **Verify Audio Suppression**:
   - Inspect `EventWindows.tsx`, `AstrolabeCountdown.tsx`, `BangleRsvp.tsx`, and `ReflectingPool.tsx` to verify `playSfx` checks `nomusic` or delegates to `AudioDock.playSfx`.
4. **Verify TypeScript Build**:
   ```powershell
   npx.cmd tsc --noEmit
   ```
   - Must exit with code `0`.
