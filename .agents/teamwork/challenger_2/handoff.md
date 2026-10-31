# Handoff Report: Adversarial Concurrency, State Machine & Lifecycle Stress Testing

**Author:** `challenger_2` (Teamwork Challenger Subagent)  
**Roles:** Critic, Specialist  
**Working Directory:** `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2`  
**Verdict:** ⚠️ **REQUEST_CHANGES** (2 Audio State Machine Vulnerabilities Confirmed)  
**Date:** 2026-10-29  

---

## 1. Observation

### Observation 1.1: Diya Spawning Concurrency Capping (Water Pond)
In `templates/sheesh-mahal/components/ReflectingPool.tsx`:
- Lines 27, 35-39, and 77-84:
```typescript
const MAX_DIYAS = 20;
...
    setDiyas((prev) => {
      const updated = [...prev, newDiya];
      // Concurrency capped at 20 to prevent DOM/memory saturation
      if (updated.length > MAX_DIYAS) {
        return updated.slice(updated.length - MAX_DIYAS);
      }
      return updated;
    });
```
- Empirical Execution of `tests/adversarial-concurrency-2.mjs` (Suite 1):
  - Test 1.1: 100 rapid clicks simulated in 1 second. At every click, `diyas.length <= 20` was asserted. Final count was exactly 20. (PASSED)
  - Test 1.2: 20 sequential clicks verified FIFO eviction; all 3 initial diyas (`diya-init-1`, `diya-init-2`, `diya-init-3`) were evicted once 20 new diyas were pushed. (PASSED)
  - Test 1.3: Extreme out-of-bounds clicks (`(-9999, -9999)` and `(99999, 99999)`) clamped to `xPct: 5..95` and `yPct: 15..85`. (PASSED)
  - Test 1.4: 10,000 rapid cycles executed with heap memory growth < 10 MB. (PASSED)

### Observation 1.2: Replay Invitation Lifecycle & Scroll Locking
In `templates/sheesh-mahal/page.tsx` and `EntranceGate.tsx`:
- `page.tsx` lines 103-113:
```typescript
  const handleReplay = useCallback(() => {
    setIsGateOpen(false);
    setGateCycle((prev) => prev + 1);
    if (typeof window !== "undefined") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, []);
```
- `EntranceGate.tsx` lines 49-66:
```typescript
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (!isFullyOpen) {
        document.documentElement.classList.add("is-shut");
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("is-shut");
        document.body.style.overflow = "";
      }
    };
  }, [isFullyOpen]);
```
- Empirical Execution of `tests/adversarial-concurrency-2.mjs` (Suite 2):
  - Test 2.1: 10 consecutive Open -> Replay -> Open cycles verified. At every shut state, `classList.contains('is-shut') === true` and `body.style.overflow === 'hidden'`. At every open state, `classList.contains('is-shut') === false` and `body.style.overflow === ''`. (PASSED)
  - Test 2.2: Multi-clicks on `#medallion` debounced by `isTriggered.current` ref, firing `onOpen` callback exactly once. (PASSED)
  - Test 2.3: Replay triggered mid-opening unmounts gate cleanly, cancelling timers and restoring locked scroll state for the new gate. (PASSED)

### Observation 1.3: LocalStorage Failure Modes (RSVP & Audio)
In `templates/sheesh-mahal/components/BangleRsvp.tsx`:
- Lines 94-107 (read) and lines 183-186 (write) are wrapped in `try { ... } catch {}`:
```typescript
    try {
      const saved = localStorage.getItem("sm:rsvp");
      if (saved) {
        const parsed = JSON.parse(saved) as RsvpSubmission;
        if (parsed && parsed.guestName) {
...
    try {
      localStorage.setItem("sm:rsvp", JSON.stringify(submission));
    } catch {}
```
- Empirical Execution of `tests/adversarial-concurrency-2.mjs` (Suite 4):
  - Test 4.1: Corrupted JSON strings (`"{malformed json"`, `undefined`, `null`, `12345`, `[1, 2, 3]`, `{"broken": true}`) did not throw `SyntaxError` or crash the component; state defaulted to fresh form. (PASSED)
  - Test 4.2: `DOMException: QuotaExceededError` thrown on submission was caught; submission completed in memory and transitioned to `confirmed` (Shukriya card). (PASSED)
  - Test 4.3: `DOMException: SecurityError` (Storage Disabled in Private Browsing) handled without crashing on mount or submit. (PASSED)
  - Test 4.4: Valid cached submission successfully restored on mount. (PASSED)

### Observation 1.4: Audio State Machine Stale Closure Defect
In `templates/sheesh-mahal/components/AudioDock.tsx`:
- Line 33:
```typescript
const [isPlaying, setIsPlaying] = useState(false);
```
- Lines 88-101:
```typescript
    // Tab visibility handling: fade out on hide, resume on refocus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
        }
      } else {
        if (isPlaying && audioRef.current && hasUserGestured.current) {
          if (audioCtxRef.current?.state === "suspended") {
            audioCtxRef.current.resume().catch(() => {});
          }
          audioRef.current.play().catch(() => {});
        }
      }
    };
```
- Line 125:
```typescript
  }, [audioSrc, isSuppressed]);
```
- Empirical Execution of `tests/adversarial-concurrency-2.mjs` (Suite 3, Test 3.3):
  - Because `isPlaying` is NOT in the dependency array of `useEffect`, `handleVisibilityChange` permanently closes over the initial `isPlaying = false` state from component mount.
  - When the gate opens and audio starts playing (`isPlaying = true`), the visibility listener still references the stale closed-over `isPlaying = false`.
  - When the user minimizes or switches to another browser tab (`document.hidden = true`), `if (isPlaying && audioRef.current)` evaluates to `false`.
  - Result: `audioRef.current.pause()` IS NEVER CALLED. Background palace music continues playing in the background while hidden.

### Observation 1.5: Audio Mute Toggle Timeout Race Condition
In `templates/sheesh-mahal/components/AudioDock.tsx`:
- Lines 205-220:
```typescript
  const toggleAudio = () => {
    if (isSuppressed || !audioRef.current) return;
    hasUserGestured.current = true;

    if (isPlaying) {
      // Fade out and pause
      rampVolume(0, 0.5);
      setTimeout(() => {
        audioRef.current?.pause();
        setIsPlaying(false);
        try {
          localStorage.setItem("sm:music", "off");
        } catch {}
      }, 500);
    } else {
```
- Empirical Execution of `tests/adversarial-concurrency-2.mjs` (Suite 3, Test 3.4):
  - The 500ms `setTimeout` is anonymous and has no tracking reference (e.g. `fadeTimeoutRef`).
  - During the 500ms fade duration, `isPlaying` remains `true` in React state.
  - If a user double-clicks or rapidly taps the mute button within 500ms, both clicks enter the `if (isPlaying)` branch, scheduling multiple conflicting timeouts.
  - These orphaned timeouts execute after subsequent clicks, prematurely pausing audio and desynchronizing UI button state from the underlying audio playback state.

---

## 2. Logic Chain

1. **Premise (Diya Capping)**: `ReflectingPool.tsx` implements strict array slicing (`updated.slice(updated.length - MAX_DIYAS)`) with `MAX_DIYAS = 20`. Under 100 rapid clicks, the active count is guaranteed never to exceed 20, memory remains flat, and coordinate clamping prevents styling anomalies.
2. **Premise (Replay Lifecycle)**: `page.tsx` keys `EntranceGate` by `gateCycle`. Unmounting cleans up `is-shut` and `body.style.overflow`, while remounting re-applies `is-shut` and locks scroll. Rapid clicks on medallion are debounced via `isTriggered.current`. Cycling 10 times preserves state integrity without stuck scroll locks.
3. **Premise (LocalStorage Failure Modes)**: Both `BangleRsvp.tsx` and `AudioDock.tsx` enclose storage accesses in `try/catch`. Quota exhaustion or malformed JSON payloads fail safely to in-memory state or clean form fallbacks.
4. **Premise (Audio Stale Closure)**: In React, any function declared inside `useEffect` that reads state without declaring that state in the dependency array (or reading from a ref) closes over the value at effect execution time. In `AudioDock.tsx`, `handleVisibilityChange` is bound on mount when `isPlaying === false` and never rebound. Therefore, when `document.hidden` becomes true, `isPlaying` evaluates to `false`, failing to pause audio.
5. **Premise (Audio Toggle Race Condition)**: When an asynchronous delay (500ms `setTimeout`) mutates state without debouncing, locking, or clearing previous timers, concurrent user gestures spawn overlapping timers. A second tap within 500ms causes desynchronization.

---

## 3. Caveats

- Operating system audio driver crashes and hardware Bluetooth disconnections were not tested.
- Safari iOS low-power mode aggressive tab throttling could not be directly tested without real iOS hardware, though standard `document.visibilitychange` semantics were empirically verified.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The Sheesh Mahal template demonstrates excellent engineering in:
- ✅ Water pond diya concurrency capping (strict 20 cap, FIFO eviction, bounded memory).
- ✅ Replay lifecycle re-entrance (10x cycle with robust scroll lock/unlock state machine).
- ✅ LocalStorage resilience against corruption and QuotaExceededError.
- ✅ Strict TypeScript typecheck passing cleanly (`tsc --noEmit` code 0).

However, **two state machine vulnerabilities exist in `templates/sheesh-mahal/components/AudioDock.tsx`** that must be addressed:

### Required Changes:
1. **Fix Stale Closure on `isPlaying` in Tab Visibility Handler (`AudioDock.tsx`)**:
   Add an `isPlayingRef = useRef(false)` in `AudioDock.tsx`. Update `isPlayingRef.current = true / false` inside `startAudio()` and `toggleAudio()`. Read `isPlayingRef.current` inside `handleVisibilityChange`.
2. **Fix Uncancelled Timeout on Rapid Mute Toggle (`AudioDock.tsx`)**:
   Store the 500ms fade-out timeout in a ref (`fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)`). Call `if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)` at the entry of `toggleAudio()` and on unmount. Set `isPlayingRef.current = false` immediately or debounce rapid clicks (< 300ms) on the mute toggle.

---

## 5. Verification Method

To independently verify these findings and execute the adversarial test harness:

```powershell
# 1. Run the new adversarial stress test harness (18 tests)
node --test tests/adversarial-concurrency-2.mjs

# 2. Run both the existing E2E suite and the adversarial harness (109 tests total)
node --test tests/e2e/sheesh-mahal-e2e.test.mjs tests/adversarial-concurrency-2.mjs

# 3. Verify TypeScript compilation
npx.cmd tsc --noEmit

# 4. Invalidation Condition:
# The verdict REQUEST_CHANGES is invalidated if AudioDock is refactored with an isPlayingRef and fadeTimeoutRef such that tab hiding pauses audio regardless of mount-time closure, and rapid mute toggling remains strictly synchronized.
```
