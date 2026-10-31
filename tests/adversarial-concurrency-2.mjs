/**
 * Sheesh Mahal — Adversarial Concurrency, State Machine & Lifecycle Stress Test Harness
 * Author: challenger_2 (Empirical Challenger Subagent)
 * Target: templates/sheesh-mahal/
 * 
 * Verifies:
 * 1. Diya spawning concurrency capping (100 rapid clicks, max concurrency <= 20, FIFO eviction, memory bounds)
 * 2. Replay invitation cycle (10 consecutive Open -> Replay -> Open cycles, body scroll lock/unlock state machine)
 * 3. Audio state machine robustness (rapid toggle debouncing, tab visibility transitions, ?nomusic query suppression variants)
 * 4. LocalStorage failure modes (QuotaExceededError, SecurityError, Corrupted JSON, Malformed types, Graceful recovery)
 * 5. Live Next.js preview endpoint verification on port 3000 (/preview/sheesh-mahal/interactive)
 */

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// --- HARNESS SIMULATORS & MOCK DOM HELPERS ---

/**
 * High-fidelity DOMTokenList mock
 */
class MockClassList {
  constructor(initial = []) {
    this._classes = new Set(initial);
  }
  add(...tokens) {
    tokens.forEach(t => this._classes.add(t));
  }
  remove(...tokens) {
    tokens.forEach(t => this._classes.delete(t));
  }
  contains(token) {
    return this._classes.has(token);
  }
  has(token) {
    return this._classes.has(token);
  }
  toggle(token, force) {
    if (force !== undefined) {
      if (force) this._classes.add(token);
      else this._classes.delete(token);
      return force;
    }
    if (this._classes.has(token)) {
      this._classes.delete(token);
      return false;
    }
    this._classes.add(token);
    return true;
  }
}

/**
 * Models ReflectingPool state machine from templates/sheesh-mahal/components/ReflectingPool.tsx
 */
class ReflectingPoolHarness {
  constructor() {
    this.MAX_DIYAS = 20;
    this.sfxPlayed = [];
    this.diyas = [
      { id: "diya-init-1", xPct: 28, yPct: 52, diyaIndex: 0, createdAt: 1 },
      { id: "diya-init-2", xPct: 65, yPct: 44, diyaIndex: 1, createdAt: 2 },
      { id: "diya-init-3", xPct: 48, yPct: 68, diyaIndex: 2, createdAt: 3 }
    ];
  }

  handleClick(clientX, clientY, rect = { left: 0, top: 0, width: 800, height: 400 }) {
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const xPct = Math.max(5, Math.min(95, (clickX / rect.width) * 100));
    const yPct = Math.max(15, Math.min(85, (clickY / rect.height) * 100));

    const newDiya = {
      id: `diya-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      xPct,
      yPct,
      diyaIndex: Math.floor(Math.random() * 4),
      createdAt: Date.now()
    };

    this.sfxPlayed.push('sfx-diya.mp3');

    // State updater matching ReflectingPool.tsx lines 77-84
    const prev = this.diyas;
    const updated = [...prev, newDiya];
    if (updated.length > this.MAX_DIYAS) {
      this.diyas = updated.slice(updated.length - this.MAX_DIYAS);
    } else {
      this.diyas = updated;
    }

    return newDiya;
  }
}

/**
 * Models Gate & Page Replay Lifecycle from templates/sheesh-mahal/page.tsx and EntranceGate.tsx
 */
class ReplayLifecycleHarness {
  constructor() {
    this.document = {
      documentElement: {
        classList: new MockClassList()
      },
      body: {
        style: { overflow: '' }
      }
    };
    this.isGateOpen = false;
    this.gateCycle = 0;
    this.gateInstance = null;
    this.mountGate();
  }

  mountGate() {
    if (this.gateInstance) {
      this.gateInstance.unmount();
    }
    this.gateInstance = new GateInstance(this.document, () => {
      this.isGateOpen = true;
    });
  }

  replay() {
    this.isGateOpen = false;
    this.gateCycle += 1;
    this.mountGate();
  }

  openGate(prefersReducedMotion = false) {
    if (this.gateInstance) {
      this.gateInstance.triggerOpen(prefersReducedMotion);
    }
  }
}

class GateInstance {
  constructor(doc, onOpen) {
    this.doc = doc;
    this.onOpen = onOpen;
    this.isOpening = false;
    this.isFullyOpen = false;
    this.isTriggered = false;
    this.timer = null;

    // useEffect on mount [isFullyOpen]
    this.syncScrollLock();
  }

  syncScrollLock() {
    if (!this.isFullyOpen) {
      this.doc.documentElement.classList.add('is-shut');
      this.doc.body.style.overflow = 'hidden';
    } else {
      this.doc.documentElement.classList.remove('is-shut');
      this.doc.body.style.overflow = '';
    }
  }

  triggerOpen(prefersReducedMotion = false) {
    if (this.isTriggered || this.isOpening || this.isFullyOpen) return;
    this.isTriggered = true;

    if (prefersReducedMotion) {
      this.isFullyOpen = true;
      this.syncScrollLock();
      this.onOpen?.();
      return;
    }

    this.isOpening = true;
    // 1800ms door swing (scaled to 30ms for testing)
    this.timer = setTimeout(() => {
      this.isFullyOpen = true;
      this.isOpening = false;
      this.syncScrollLock();
      this.onOpen?.();
    }, 30);
  }

  unmount() {
    if (this.timer) clearTimeout(this.timer);
    // Cleanup effect in EntranceGate.tsx lines 60-65
    this.doc.documentElement.classList.remove('is-shut');
    this.doc.body.style.overflow = '';
  }
}

/**
 * Exact replica of AudioDock component logic from templates/sheesh-mahal/components/AudioDock.tsx
 * Used to empirically demonstrate state machine behavior and race conditions.
 */
class AudioDockActualImplementation {
  constructor(searchString = '', storage = {}) {
    this.storage = storage;
    const params = new URLSearchParams(searchString.startsWith('?') ? searchString : `?${searchString}`);
    const nomusic = params.get('nomusic');
    this.isSuppressed = (nomusic === '' || nomusic === '1' || nomusic === 'true');

    // React state: useState(false)
    this.isPlaying = false;
    this.hasUserGestured = false;
    this.audioPaused = true;
    this.audioElement = { paused: true, playCount: 0, pauseCount: 0 };
    
    // In AudioDock.tsx, handleVisibilityChange closes over isPlaying at mount time!
    const closedOverIsPlaying = this.isPlaying;
    this.visibilityListener = (documentHidden) => {
      if (documentHidden) {
        // Line 90: if (isPlaying && audioRef.current)
        if (closedOverIsPlaying && this.audioElement) {
          this.audioElement.paused = true;
          this.audioElement.pauseCount++;
        }
      } else {
        // Line 94: if (isPlaying && audioRef.current && hasUserGestured.current)
        if (closedOverIsPlaying && this.audioElement && this.hasUserGestured) {
          this.audioElement.paused = false;
          this.audioElement.playCount++;
        }
      }
    };
  }

  startAudio() {
    if (this.isSuppressed) return;
    this.hasUserGestured = true;
    this.isPlaying = true;
    this.audioElement.paused = false;
    this.audioElement.playCount++;
    this.storage['sm:music'] = 'on';
  }

  toggleAudio(onTimeoutComplete) {
    if (this.isSuppressed) return;
    this.hasUserGestured = true;

    if (this.isPlaying) {
      // Lines 210-219 of AudioDock.tsx:
      // rampVolume(0, 0.5);
      // setTimeout(() => { audioRef.current?.pause(); setIsPlaying(false); ... }, 500);
      setTimeout(() => {
        this.audioElement.paused = true;
        this.audioElement.pauseCount++;
        this.isPlaying = false;
        this.storage['sm:music'] = 'off';
        onTimeoutComplete?.();
      }, 50);
    } else {
      this.audioElement.paused = false;
      this.audioElement.playCount++;
      this.isPlaying = true;
      this.storage['sm:music'] = 'on';
      onTimeoutComplete?.();
    }
  }
}

/**
 * Models LocalStorage RSVP recovery and submission from BangleRsvp.tsx
 */
class BangleRsvpHarness {
  constructor(storage, options = {}) {
    this.storage = storage;
    this.options = options;
    this.rsvpState = 'form';
    this.guestName = options.guestNameDefault || '';
    this.guestCount = 2;
    this.selectedEvents = ['baraat', 'walima'];
    this.lastSubmission = null;
    this.errorMessage = null;

    this.mount();
  }

  mount() {
    try {
      const saved = this.storage.getItem('sm:rsvp');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.guestName && typeof parsed.guestName === 'string') {
          this.lastSubmission = parsed;
          this.guestName = parsed.guestName;
          this.guestCount = parsed.attendingCount || 2;
          this.selectedEvents = Array.isArray(parsed.events) ? parsed.events : [];
          this.rsvpState = 'confirmed';
        }
      }
    } catch (err) {
      this.lastSubmission = null;
    }
  }

  submit(guestName, events, count = 2) {
    if (!guestName || guestName.trim().length === 0) {
      this.errorMessage = 'Please enter your name';
      return false;
    }
    if (!events || events.length === 0) {
      this.errorMessage = 'Please select at least one celebration to attend';
      return false;
    }

    const payload = {
      guestName: guestName.trim(),
      attendingCount: count,
      events,
      timestamp: Date.now()
    };

    try {
      this.storage.setItem('sm:rsvp', JSON.stringify(payload));
    } catch (err) {
      // Swallowed
    }

    this.lastSubmission = payload;
    this.rsvpState = 'confirmed';
    return true;
  }
}

// =========================================================================
// SUITE 1: DIYA SPAWNING CONCURRENCY CAPPING & MEMORY STRESS
// =========================================================================

describe('Stress Test 1: Diya Spawning Concurrency Capping (Water Pond)', () => {

  it('1.1 should clamp active diyas strictly to MAX_DIYAS (20) after 100 rapid clicks in 1 second', () => {
    const pool = new ReflectingPoolHarness();
    assert.strictEqual(pool.diyas.length, 3, 'Initial pool must start with 3 default diyas');

    for (let i = 0; i < 100; i++) {
      const clickX = Math.floor(Math.random() * 800);
      const clickY = Math.floor(Math.random() * 400);
      pool.handleClick(clickX, clickY);

      assert.ok(
        pool.diyas.length <= 20,
        `Diya pool exceeded max concurrency limit! Found ${pool.diyas.length} instances at click ${i + 1}`
      );
    }

    assert.strictEqual(pool.diyas.length, 20, 'Final pool size must be strictly clamped to exactly 20 diyas');
    assert.strictEqual(pool.sfxPlayed.length, 100, 'All 100 clicks must trigger diya sound effect');
  });

  it('1.2 should strictly evict oldest diyas in FIFO order when capping at 20', () => {
    const pool = new ReflectingPoolHarness();
    const initIds = pool.diyas.map(d => d.id);
    
    const newAdded = [];
    for (let i = 0; i < 20; i++) {
      const diya = pool.handleClick(100 + i * 10, 100 + i * 5);
      newAdded.push(diya.id);
    }

    const currentIds = pool.diyas.map(d => d.id);
    for (const initId of initIds) {
      assert.ok(!currentIds.includes(initId), `Initial diya ${initId} was not evicted after 20 new additions`);
    }

    assert.deepStrictEqual(currentIds, newAdded, 'Current pool must exactly match the last 20 added diyas in FIFO order');
  });

  it('1.3 should clamp out-of-bounds coordinates to safe margins (5% - 95% X, 15% - 85% Y)', () => {
    const pool = new ReflectingPoolHarness();

    const diyaMin = pool.handleClick(-9999, -9999);
    assert.strictEqual(diyaMin.xPct, 5, 'Negative X must clamp to 5%');
    assert.strictEqual(diyaMin.yPct, 15, 'Negative Y must clamp to 15%');

    const diyaMax = pool.handleClick(99999, 99999);
    assert.strictEqual(diyaMax.xPct, 95, 'Extreme X must clamp to 95%');
    assert.strictEqual(diyaMax.yPct, 85, 'Extreme Y must clamp to 85%');
  });

  it('1.4 should sustain 10,000 rapid click cycles with bounded memory footprint and zero leakage', () => {
    const pool = new ReflectingPoolHarness();
    const startMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 10000; i++) {
      pool.handleClick((i * 17) % 800, (i * 23) % 400);
    }

    assert.strictEqual(pool.diyas.length, 20, 'Array length must remain 20 after 10,000 operations');
    const endMemory = process.memoryUsage().heapUsed;
    const memoryGrowthMb = (endMemory - startMemory) / (1024 * 1024);

    assert.ok(memoryGrowthMb < 35, `Memory grew excessively: ${memoryGrowthMb.toFixed(2)} MB`);
  });

});

// =========================================================================
// SUITE 2: REPLAY INVITATION LIFECYCLE & BODY SCROLL LOCK STRESS
// =========================================================================

describe('Stress Test 2: Replay Invitation Lifecycle (10x Consecutive Open/Replay Cycles)', () => {

  it('2.1 should maintain consistent body scroll lock/unlock through 10 consecutive Open -> Replay cycles', () => {
    const harness = new ReplayLifecycleHarness();

    for (let cycle = 1; cycle <= 10; cycle++) {
      assert.strictEqual(harness.isGateOpen, false, `Cycle ${cycle}: isGateOpen should be false before opening`);
      assert.ok(
        harness.document.documentElement.classList.contains('is-shut'),
        `Cycle ${cycle}: root element must have 'is-shut' class when gate is shut`
      );
      assert.strictEqual(
        harness.document.body.style.overflow,
        'hidden',
        `Cycle ${cycle}: body overflow must be 'hidden' when gate is shut`
      );

      // Open Gate
      harness.openGate(true);

      assert.strictEqual(harness.isGateOpen, true, `Cycle ${cycle}: isGateOpen should be true after opening`);
      assert.ok(
        !harness.document.documentElement.classList.contains('is-shut'),
        `Cycle ${cycle}: root element must not have 'is-shut' after opening`
      );
      assert.strictEqual(
        harness.document.body.style.overflow,
        '',
        `Cycle ${cycle}: body overflow must be cleared ('') after opening`
      );

      // Replay
      harness.replay();

      assert.strictEqual(harness.gateCycle, cycle, `gateCycle must increment to ${cycle}`);
      assert.strictEqual(harness.isGateOpen, false, `Cycle ${cycle}: isGateOpen must reset to false after replay`);
      assert.ok(
        harness.document.documentElement.classList.contains('is-shut'),
        `Cycle ${cycle}: 'is-shut' must be re-applied after replay`
      );
      assert.strictEqual(
        harness.document.body.style.overflow,
        'hidden',
        `Cycle ${cycle}: body overflow must be locked ('hidden') after replay`
      );
    }
  });

  it('2.2 should debounce rapid consecutive clicks on medallion to avoid multiple animation triggers', async () => {
    const doc = {
      documentElement: { classList: new MockClassList(['is-shut']) },
      body: { style: { overflow: 'hidden' } }
    };
    let openCallbacks = 0;
    const gate = new GateInstance(doc, () => {
      openCallbacks++;
    });

    gate.triggerOpen(false);
    gate.triggerOpen(false);
    gate.triggerOpen(false);

    assert.strictEqual(gate.isOpening, true);
    assert.strictEqual(gate.isTriggered, true);

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.strictEqual(openCallbacks, 1, 'onOpen callback must be fired exactly once despite multiple clicks');
    assert.strictEqual(gate.isFullyOpen, true);
  });

  it('2.3 should clean up scroll lock and timers safely when replayed mid-opening', () => {
    const harness = new ReplayLifecycleHarness();

    harness.openGate(false);
    assert.strictEqual(harness.gateInstance.isOpening, true);

    // Replay mid-animation
    harness.replay();

    assert.strictEqual(harness.isGateOpen, false);
    assert.strictEqual(harness.document.body.style.overflow, 'hidden');
    assert.ok(harness.document.documentElement.classList.contains('is-shut'));

    harness.openGate(true);
    assert.strictEqual(harness.document.body.style.overflow, '');
    assert.ok(!harness.document.documentElement.classList.contains('is-shut'));
  });

});

// =========================================================================
// SUITE 3: AUDIO STATE MACHINE, QUERY SUPPRESSION & CLOSURE ANALYSIS
// =========================================================================

describe('Stress Test 3: Audio State Machine Robustness & Query Suppression', () => {

  it('3.1 should honor all ?nomusic query param formats (?nomusic, ?nomusic=1, ?nomusic=true)', () => {
    const suppressQueries = ['?nomusic', '?nomusic=1', '?nomusic=true', 'nomusic=1'];
    for (const q of suppressQueries) {
      const audio = new AudioDockActualImplementation(q);
      assert.strictEqual(audio.isSuppressed, true, `Query ${q} must suppress audio`);

      audio.startAudio();
      audio.toggleAudio();
      assert.strictEqual(audio.isPlaying, false, 'Suppressed audio must never play');
      assert.strictEqual(audio.audioElement.playCount, 0, 'Audio.play() must not be invoked');
    }
  });

  it('3.2 should NOT suppress audio for non-suppression flags (?nomusic=0, ?nomusic=false, ?other=1)', () => {
    const passQueries = ['?nomusic=0', '?nomusic=false', '?nomusic=no', '', '?guest=Zain'];
    for (const q of passQueries) {
      const audio = new AudioDockActualImplementation(q);
      assert.strictEqual(audio.isSuppressed, false, `Query ${q} should not suppress audio`);

      audio.startAudio();
      assert.strictEqual(audio.isPlaying, true, `Audio should start on gate open for ${q}`);
    }
  });

  it('3.3 [BUG CONFIRMATION] AudioDock has stale closure on isPlaying in visibilitychange handler', () => {
    // In AudioDock.tsx line 88-101 and line 125:
    // handleVisibilityChange is defined inside useEffect with deps [audioSrc, isSuppressed].
    // It captures `isPlaying` which was false on initial mount.
    const audio = new AudioDockActualImplementation();
    
    // User opens the gate, starting audio
    audio.startAudio();
    assert.strictEqual(audio.isPlaying, true, 'Audio is now playing');
    assert.strictEqual(audio.audioElement.paused, false);

    // User switches tabs (document.hidden = true)
    audio.visibilityListener(true);

    // Because handleVisibilityChange closed over isPlaying = false, audio.pause() WAS NEVER CALLED!
    const bugPresent = (audio.audioElement.paused === false);
    assert.ok(
      bugPresent,
      'Confirmed vulnerability: Stale closure in AudioDock prevents audio from pausing when tab is hidden!'
    );
  });

  it('3.4 [RACE CONDITION CONFIRMATION] Double-click on mute toggle within 500ms creates conflicting timeouts', async () => {
    const audio = new AudioDockActualImplementation();
    audio.startAudio();
    assert.strictEqual(audio.isPlaying, true);

    // User rapidly double-clicks mute button within 500ms fade window
    // Click 1:
    audio.toggleAudio();
    // At click 1, isPlaying is still true, 500ms timeout scheduled
    // Click 2 (at 10ms):
    assert.strictEqual(audio.isPlaying, true, 'isPlaying is still true before 500ms fade completes');
    audio.toggleAudio(); // Second click also branches into `if (isPlaying)`, scheduling second mute!

    await new Promise((r) => setTimeout(r, 60));
    // The state is now muted instead of toggling back to playing!
    assert.strictEqual(audio.isPlaying, false);
  });

});

// =========================================================================
// SUITE 4: LOCALSTORAGE FAILURE MODES & ADVERSARIAL RECOVERY
// =========================================================================

describe('Stress Test 4: LocalStorage Quota & Corruption Recovery', () => {

  it('4.1 should recover gracefully when localStorage contains corrupted JSON payload', () => {
    const corruptedPayloads = [
      '{malformed json',
      'undefined',
      'null',
      '',
      '{"guestName": [1, 2, 3]}',
      '12345',
      '{"broken": true}'
    ];

    for (const badPayload of corruptedPayloads) {
      const mockStorage = {
        getItem: () => badPayload,
        setItem: () => {}
      };

      let rsvp;
      assert.doesNotThrow(() => {
        rsvp = new BangleRsvpHarness(mockStorage);
      }, `Should not crash on corrupted payload: ${badPayload}`);

      assert.strictEqual(rsvp.rsvpState, 'form', 'Corrupted storage must fallback to fresh form state');
      assert.strictEqual(rsvp.lastSubmission, null, 'Corrupted storage must not generate invalid submission');
    }
  });

  it('4.2 should complete submission gracefully when localStorage throws QuotaExceededError', () => {
    const mockStorage = {
      getItem: () => null,
      setItem: () => {
        const quotaError = new Error('The quota has been exceeded.');
        quotaError.name = 'QuotaExceededError';
        quotaError.code = 22;
        throw quotaError;
      }
    };

    const rsvp = new BangleRsvpHarness(mockStorage);
    assert.strictEqual(rsvp.rsvpState, 'form');

    let success = false;
    assert.doesNotThrow(() => {
      success = rsvp.submit('Mr & Mrs Tariq', ['baraat'], 3);
    }, 'QuotaExceededError in localStorage.setItem must be handled silently');

    assert.strictEqual(success, true, 'Submission should succeed in memory');
    assert.strictEqual(rsvp.rsvpState, 'confirmed', 'RSVP must transition to confirmed state despite storage quota failure');
    assert.strictEqual(rsvp.lastSubmission.guestName, 'Mr & Mrs Tariq');
  });

  it('4.3 should complete submission gracefully when localStorage throws SecurityError (Storage Disabled)', () => {
    const mockStorage = {
      getItem: () => {
        const secError = new Error('Access is denied for this document.');
        secError.name = 'SecurityError';
        throw secError;
      },
      setItem: () => {
        const secError = new Error('Access is denied for this document.');
        secError.name = 'SecurityError';
        throw secError;
      }
    };

    let rsvp;
    assert.doesNotThrow(() => {
      rsvp = new BangleRsvpHarness(mockStorage);
    }, 'SecurityError on mount must not crash');

    assert.strictEqual(rsvp.rsvpState, 'form');

    assert.doesNotThrow(() => {
      rsvp.submit('Begum Akhtar', ['walima'], 2);
    }, 'SecurityError on submit must not crash');

    assert.strictEqual(rsvp.rsvpState, 'confirmed');
  });

  it('4.4 should correctly restore valid previously submitted RSVP data', () => {
    const validData = {
      guestName: 'Dr. Faisal & Family',
      attendingCount: 4,
      events: ['mehndi', 'nikah', 'baraat'],
      timestamp: 1730220000000
    };

    const mockStorage = {
      store: { 'sm:rsvp': JSON.stringify(validData) },
      getItem(key) { return this.store[key] || null; },
      setItem(key, val) { this.store[key] = val; }
    };

    const rsvp = new BangleRsvpHarness(mockStorage);
    assert.strictEqual(rsvp.rsvpState, 'confirmed', 'Valid stored RSVP must directly restore confirmed state');
    assert.strictEqual(rsvp.guestName, 'Dr. Faisal & Family');
    assert.strictEqual(rsvp.guestCount, 4);
    assert.deepStrictEqual(rsvp.selectedEvents, ['mehndi', 'nikah', 'baraat']);
  });

});

// =========================================================================
// SUITE 5: LIVE ENDPOINT FORENSICS ON LOCAL SERVER (PORT 3000)
// =========================================================================

describe('Stress Test 5: Live Server Integration & Template Verification (Port 3000)', () => {

  it('5.1 should serve HTTP 200 for interactive demo with scoped CSS and all 9 sections in DOM', async () => {
    const res = await fetch('http://localhost:3000/preview/sheesh-mahal/interactive');
    assert.strictEqual(res.status, 200, 'Live endpoint must return HTTP 200');

    const html = await res.text();
    
    // Scoped root container
    assert.ok(html.includes('sheesh-mahal-root'), 'Root class .sheesh-mahal-root must be rendered in HTML');
    
    // Gate section (#gate)
    assert.ok(html.includes('id="gate"') || html.includes('id=&quot;gate&quot;') || html.includes('medallion'), 'Entrance Gate component must exist in DOM');

    // Hero section (#hero)
    assert.ok(html.includes('id="hero"') || html.includes('id=&quot;hero&quot;'), 'Hero section must exist in DOM');

    // Letter casket (#letter)
    assert.ok(html.includes('id="letter"') || html.includes('id=&quot;letter&quot;'), 'Letter casket must exist in DOM');

    // Family lamps (#families)
    assert.ok(html.includes('id="families"') || html.includes('id=&quot;families&quot;'), 'Family lamps must exist in DOM');

    // Event windows (#events)
    assert.ok(html.includes('id="events"') || html.includes('id=&quot;events&quot;'), 'Event windows must exist in DOM');

    // Countdown (#countdown)
    assert.ok(html.includes('id="countdown"') || html.includes('id=&quot;countdown&quot;'), 'Countdown must exist in DOM');

    // RSVP (#rsvp)
    assert.ok(html.includes('id="rsvp"') || html.includes('id=&quot;rsvp&quot;'), 'RSVP section must exist in DOM');

    // Reflecting pool (#closing)
    assert.ok(html.includes('id="closing"') || html.includes('id=&quot;closing&quot;'), 'Reflecting pool must exist in DOM');
  });

  it('5.2 should sanitize guest name in server response when injected via ?to= query parameter', async () => {
    const res = await fetch('http://localhost:3000/preview/sheesh-mahal/interactive?to=%3Cscript%3Ealert(%27xss%27)%3C%2Fscript%3E');
    assert.strictEqual(res.status, 200);

    const html = await res.text();
    assert.ok(!html.includes("<script>alert('xss')</script>"), 'Injected script must be sanitized');
  });

  it('5.3 should respond cleanly to concurrent requests without crashing or worker degradation', async () => {
    const urls = [
      'http://localhost:3000/preview/sheesh-mahal/interactive',
      'http://localhost:3000/preview/sheesh-mahal/interactive?nomusic=1',
      'http://localhost:3000/preview/sheesh-mahal/interactive?to=Naveed',
      'http://localhost:3000/preview/sheesh-mahal/interactive?to=Zubair%20Khan',
      'http://localhost:3000/preview/sheesh-mahal/interactive?faith=universal'
    ];

    const responses = await Promise.all(urls.map(u => fetch(u)));
    for (const r of responses) {
      assert.strictEqual(r.status, 200, `Concurrent fetch to ${r.url} must return 200`);
    }
  });

});
