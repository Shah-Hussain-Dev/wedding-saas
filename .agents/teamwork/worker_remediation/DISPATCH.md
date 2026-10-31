## 2026-10-29T17:11:51Z

# Task: Iteration 2 — Sheesh Mahal Hardening & Adversarial Remediation

## Role
You are worker_remediation, a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_remediation`

## Mandatory Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\orchestrator\GATE_STATUS.md` (Contains the 7 remediation items)
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\reviewer_2\handoff.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1\handoff.md`
5. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2\handoff.md`

## Remediation Objectives
Apply the following 7 precise fixes to harden the Sheesh Mahal template:

1. **Fix Countdown Minutes Bug (`templates/sheesh-mahal/components/AstrolabeCountdown.tsx:51`)**:
   Change `(diffMs % (1000 * 60)) / (1000 * 60)` to `Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))`.
   Ensure minutes countdown displays actual remaining minutes, not perpetual `00`.

2. **Narrow Viewport Flip-Tile Scaling (`templates/sheesh-mahal/components/AstrolabeCountdown.tsx:131`)**:
   Change `min-w-[76px] sm:min-w-[96px]` to `min-w-[64px] sm:min-w-[80px]` or `w-full` so all 4 tiles fit within 320px viewports without horizontal clipping.

3. **Hard Clamp RSVP Stepper State (`templates/sheesh-mahal/components/BangleRsvp.tsx:131-143, 175-181`)**:
   - Update `handleIncrement` to `setGuestCount((prev) => Math.min(maxSeats, prev + 1));`.
   - Update `handleDecrement` to `setGuestCount((prev) => Math.max(1, prev - 1));`.
   - Defensive clamp on submission: `attendingCount: Math.min(maxSeats, Math.max(1, guestCount))`.

4. **Synchronous Guard for Casket Lid (`templates/sheesh-mahal/components/LetterCasket.tsx:65-75`)**:
   Add a `useRef` lock (`isTriggered = useRef(false); if (isTriggered.current || isOpen) return; isTriggered.current = true;`) to `handleToggleCasket`, and add `disabled={isOpen}` to button.

5. **Audio State Machine Robustness & `?nomusic` Suppression**:
   - In `templates/sheesh-mahal/components/AudioDock.tsx`:
     * Use `isPlayingRef.current` inside `handleVisibilityChange` to eliminate the stale closure bug when switching tabs.
     * Store and clear `fadeTimeoutRef.current` in `toggleMusic` so rapid clicks don't cause overlapping timer cut-offs.
   - In all components (`EventWindows.tsx`, `BangleRsvp.tsx`, `ReflectingPool.tsx`, `LetterCasket.tsx`, `AstrolabeCountdown.tsx`):
     * Check `nomusic` query parameter before playing SFX so that `?nomusic=1` completely silences all audio.

6. **Bind Orphaned CSS Keyframes & Wire Carrier Dove Flight (`templates/sheesh-mahal/style.css`)**:
   - Bind `@keyframes dove-flap` to `.rs-flyer .rs-dove-sprite` or `.rs-flyer` so the dove sprite animates its wing flapping during flight.
   - Bind `@keyframes d-sweep` to `.d-flood.is-active`.
   - Ensure all 28 keyframes are bound to real CSS selectors.

7. **Refactor E2E Test Suite (`tests/e2e/sheesh-mahal-e2e.test.mjs`)**:
   - Update tests to directly import and assert real files from the repository (`templates/sheesh-mahal/data.json`, `templates/sheesh-mahal/style.css`, component source text, public audio assets).
   - Verify that test assertions validate real implementation files, eliminating the self-certifying mock criticism.

## Verification
- Run `npx.cmd tsc --noEmit` -> confirm 0 errors.
- Run `node --test tests/e2e/sheesh-mahal-e2e.test.mjs` -> confirm 100% pass.
- Run `node tests/adversarial-stress-1.mjs` -> confirm all pass.
- Run `node tests/adversarial-concurrency-2.mjs` -> confirm all pass.

## Output
Write your handoff report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_remediation\handoff.md`
and notify parent.
