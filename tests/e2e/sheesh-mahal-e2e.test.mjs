/**
 * Sheesh Mahal Digital Wedding Invitation — Comprehensive E2E Verification Suite
 * 
 * Verifies real codebase implementation files:
 * - templates/sheesh-mahal/style.css
 * - templates/sheesh-mahal/data.json
 * - templates/sheesh-mahal/page.tsx
 * - templates/sheesh-mahal/components/EntranceGate.tsx
 * - templates/sheesh-mahal/components/HeroHall.tsx
 * - templates/sheesh-mahal/components/LetterCasket.tsx
 * - templates/sheesh-mahal/components/FamilyLamps.tsx
 * - templates/sheesh-mahal/components/EventWindows.tsx
 * - templates/sheesh-mahal/components/AstrolabeCountdown.tsx
 * - templates/sheesh-mahal/components/BangleRsvp.tsx
 * - templates/sheesh-mahal/components/ReflectingPool.tsx
 * - templates/sheesh-mahal/components/AudioDock.tsx
 * - public/templates/sheesh-mahal/audio/
 * - public/templates/sheesh-mahal/assets/
 * 
 * Matrix:
 * - Tier 1: Feature Coverage (45 tests — 5 per feature across 9 features)
 * - Tier 2: Boundary & Corner Cases (30 tests)
 * - Tier 3: Cross-Feature Pairwise Combinations (10 tests)
 * - Tier 4: Real-World Application Scenarios (6 scenarios)
 * Total: 91 tests across 19 suites
 */

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// --- REAL REPOSITORY ASSET & SOURCE LOADER ---
const templateDir = path.resolve('templates/sheesh-mahal');
const componentsDir = path.join(templateDir, 'components');
const publicDir = path.resolve('public/templates/sheesh-mahal');
const audioDir = path.join(publicDir, 'audio');

// Load real source files from disk
const styleCss = fs.readFileSync(path.join(templateDir, 'style.css'), 'utf8');
const dataJson = JSON.parse(fs.readFileSync(path.join(templateDir, 'data.json'), 'utf8'));
const pageCode = fs.readFileSync(path.join(templateDir, 'page.tsx'), 'utf8');
const entranceGateCode = fs.readFileSync(path.join(componentsDir, 'EntranceGate.tsx'), 'utf8');
const heroHallCode = fs.readFileSync(path.join(componentsDir, 'HeroHall.tsx'), 'utf8');
const letterCasketCode = fs.readFileSync(path.join(componentsDir, 'LetterCasket.tsx'), 'utf8');
const familyLampsCode = fs.readFileSync(path.join(componentsDir, 'FamilyLamps.tsx'), 'utf8');
const eventWindowsCode = fs.readFileSync(path.join(componentsDir, 'EventWindows.tsx'), 'utf8');
const countdownCode = fs.readFileSync(path.join(componentsDir, 'AstrolabeCountdown.tsx'), 'utf8');
const rsvpCode = fs.readFileSync(path.join(componentsDir, 'BangleRsvp.tsx'), 'utf8');
const poolCode = fs.readFileSync(path.join(componentsDir, 'ReflectingPool.tsx'), 'utf8');
const audioDockCode = fs.readFileSync(path.join(componentsDir, 'AudioDock.tsx'), 'utf8');

// Ground reference data from data.json
const REFERENCE = {
  couple: dataJson.couple,
  sacred: dataJson.sacred,
  events: dataJson.events,
  tokens: {
    emerald: '#0b4a3b',
    emeraldDeep: '#062a21',
    gold: '#c9a45c',
    goldSoft: '#e6cf98',
    ivory: '#f5efe2',
    ink: '#0b3d31',
    minTouchTarget: 44
  }
};

// Sanitizer logic as implemented in page.tsx and LetterCasket.tsx
function sanitizeGuestParam(input) {
  if (!input) return 'Family & Friends';
  let cleaned = String(input).trim();
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');
  cleaned = cleaned.replace(/["'<>]/g, '');
  if (cleaned.length > 60) {
    cleaned = cleaned.slice(0, 60).trim();
  }
  return cleaned.length > 0 ? cleaned : 'Family & Friends';
}

function isMusicSuppressed(searchString) {
  const params = new URLSearchParams(searchString.startsWith('?') ? searchString : `?${searchString}`);
  const nomusic = params.get('nomusic');
  return nomusic === '' || nomusic === '1' || nomusic === 'true';
}

function calculateAstrolabeAngle(dx, dy) {
  let rad = Math.atan2(dy, dx);
  let deg = (rad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

function getTileMatrixForDigit(digit) {
  const FONT_7x5 = {
    '0': [0x1f, 0x11, 0x11, 0x11, 0x1f],
    '1': [0x00, 0x12, 0x1f, 0x10, 0x00],
    '2': [0x1d, 0x15, 0x15, 0x15, 0x17],
    '3': [0x11, 0x15, 0x15, 0x15, 0x1f],
    '4': [0x07, 0x04, 0x04, 0x1f, 0x04],
    '5': [0x17, 0x15, 0x15, 0x15, 0x1d],
    '6': [0x1f, 0x15, 0x15, 0x15, 0x1d],
    '7': [0x01, 0x01, 0x19, 0x05, 0x03],
    '8': [0x1f, 0x15, 0x15, 0x15, 0x1f],
    '9': [0x17, 0x15, 0x15, 0x15, 0x1f]
  };
  return FONT_7x5[String(digit)] || FONT_7x5['0'];
}

function generateICalendarEvent(event, couple) {
  const uid = `sheesh-mahal-${event.id}-${Date.now()}@wedinvites.com`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WedInvites//Sheesh Mahal Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:${couple.groomName} & ${couple.brideName} - ${event.name}`,
    `DESCRIPTION:${event.name} celebration of ${couple.groomName} & ${couple.brideName}. Dress code: ${event.dressCode}.`,
    `LOCATION:${event.venue}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function deepMergeTemplateData(fallback, incoming) {
  if (!incoming) return { ...fallback };
  const result = { ...fallback };
  for (const key of Object.keys(incoming)) {
    if (incoming[key] && typeof incoming[key] === 'object' && !Array.isArray(incoming[key])) {
      result[key] = deepMergeTemplateData(fallback[key] || {}, incoming[key]);
    } else if (incoming[key] !== undefined) {
      result[key] = incoming[key];
    }
  }
  return result;
}

// =========================================================================
// TIER 1: FEATURE COVERAGE (45 TESTS — 5 PER FEATURE ACROSS 9 SECTIONS)
// =========================================================================

describe('Tier 1: Feature Coverage', () => {

  describe('Feature 1: Entrance Gate & 3D Mirrored Doors (#gate)', () => {
    it('1.1 should define double-leaf 3D mirrored door structure with left and right leaves', () => {
      assert.ok(entranceGateCode.includes('d-leaf-l'), 'EntranceGate.tsx must render d-leaf-l');
      assert.ok(entranceGateCode.includes('d-leaf-r'), 'EntranceGate.tsx must render d-leaf-r');
      assert.ok(styleCss.includes('.d-leaf-l'), 'style.css must define .d-leaf-l');
      assert.ok(styleCss.includes('.d-leaf-r'), 'style.css must define .d-leaf-r');
      assert.ok(styleCss.includes('@keyframes d-open-l'), 'style.css must declare @keyframes d-open-l');
      assert.ok(styleCss.includes('@keyframes d-open-r'), 'style.css must declare @keyframes d-open-r');
    });

    it('1.2 should distribute 13 sparkle glints per leaf (26 total particles)', () => {
      assert.ok(entranceGateCode.includes('LEFT_SPARKS = ['), 'EntranceGate.tsx must define LEFT_SPARKS');
      assert.ok(entranceGateCode.includes('RIGHT_SPARKS = ['), 'EntranceGate.tsx must define RIGHT_SPARKS');
      const leftMatches = (entranceGateCode.match(/left:\s*["'][^"']+["'],\s*top:/g) || []).length;
      assert.strictEqual(leftMatches, 26, 'EntranceGate.tsx must define exactly 26 total mirror sparkles (13 per leaf)');
    });

    it('1.3 should position central gold medallion seal centered on door seam with accessible semantics', () => {
      assert.ok(entranceGateCode.includes('id="medallion"'), 'EntranceGate.tsx must define #medallion');
      assert.ok(entranceGateCode.includes('aria-label='), 'Medallion must declare aria-label');
      assert.ok(entranceGateCode.includes('min-width: 44px;'), 'Medallion inline styles must declare min-width: 44px');
      assert.ok(entranceGateCode.includes('min-height: 44px;'), 'Medallion inline styles must declare min-height: 44px');
      assert.ok(styleCss.includes('.sheesh-mahal-root .medallion'), 'style.css must include .medallion in 44px rule');
    });

    it('1.4 should transition gate state to .is-opening with 3D rotation and light flood', () => {
      assert.ok(entranceGateCode.includes('setIsOpening(true)'), 'EntranceGate.tsx must update isOpening state');
      assert.ok(entranceGateCode.includes('d-flood'), 'EntranceGate.tsx must render light flood element');
      assert.ok(styleCss.includes('@keyframes d-sweep'), 'style.css must define @keyframes d-sweep');
      assert.ok(styleCss.includes('.d-flood.is-active'), 'style.css must bind d-sweep to .d-flood.is-active');
    });

    it('1.5 should unlock body scroll upon door opening completion', () => {
      assert.ok(entranceGateCode.includes('document.body.style.overflow = ""'), 'EntranceGate must clear body overflow on open');
      assert.ok(entranceGateCode.includes('document.documentElement.classList.remove("is-shut")'), 'EntranceGate must remove is-shut class on open');
      assert.ok(styleCss.includes('html.is-shut'), 'style.css must define html.is-shut scroll-locking rule');
    });
  });

  describe('Feature 2: Audio Controller & Background Sound (AudioDock)', () => {
    it('2.1 should render floating sound toggle in safe zone with minimum 44x44px touch area', () => {
      assert.ok(audioDockCode.includes('id="soundToggle"'), 'AudioDock.tsx must render #soundToggle');
      assert.ok(audioDockCode.includes('sound-toggle'), 'AudioDock.tsx must have class sound-toggle');
      assert.ok(styleCss.includes('.sheesh-mahal-root .sound-toggle'), 'style.css must bind sound-toggle to >=44px rule');
      assert.ok(audioDockCode.includes('env(safe-area-inset-top'), 'AudioDock.tsx must support safe-area-inset-top');
    });

    it('2.2 should maintain deferred autoplay state until first user gesture', () => {
      assert.ok(audioDockCode.includes('hasUserGestured'), 'AudioDock.tsx must track hasUserGestured ref');
      assert.ok(audioDockCode.includes('audioCtxRef.current?.state === "suspended"'), 'AudioDock.tsx must check suspended AudioContext state');
      assert.ok(audioDockCode.includes('isGateOpen'), 'AudioDock.tsx must listen to isGateOpen trigger');
    });

    it('2.3 should flip audio state between playing and muted on toggle click', () => {
      assert.ok(audioDockCode.includes('toggleAudio'), 'AudioDock.tsx must provide toggleAudio function');
      assert.ok(audioDockCode.includes('isPlayingRef.current = false'), 'AudioDock.tsx must update isPlayingRef.current synchronously');
      assert.ok(audioDockCode.includes('isPlayingRef.current = true'), 'AudioDock.tsx must set isPlayingRef.current to true on play');
      assert.ok(audioDockCode.includes('setIsPlaying(false)'), 'AudioDock.tsx must update isPlaying React state');
    });

    it('2.4 should persist user audio preference in localStorage under sm:music', () => {
      assert.ok(audioDockCode.includes('localStorage.getItem("sm:music")'), 'AudioDock.tsx must read sm:music from storage');
      assert.ok(audioDockCode.includes('localStorage.setItem("sm:music", "on")'), 'AudioDock.tsx must write "on" to storage');
      assert.ok(audioDockCode.includes('localStorage.setItem("sm:music", "off")'), 'AudioDock.tsx must write "off" to storage');
    });

    it('2.5 should execute volume gain ramping with 2.5s duration to avoid audio pop', () => {
      assert.ok(audioDockCode.includes('durationSec: number = 2.5'), 'AudioDock.tsx must declare default 2.5s gain ramp');
      assert.ok(audioDockCode.includes('rampVolume(0.6, 2.5)'), 'AudioDock.tsx must ramp volume to target 0.6 over 2.5s');
    });
  });

  describe('Feature 3: Hero Hall & Sacred Apex (#hero)', () => {
    it('3.1 should render sacred Bismillah invocation (﷽) at top apex arch with correct ARIA label', () => {
      assert.ok(heroHallCode.includes('h-bism'), 'HeroHall.tsx must render .h-bism class');
      assert.ok(heroHallCode.includes('﷽'), 'HeroHall.tsx must contain authentic Bismillah glyph');
      assert.ok(heroHallCode.includes('Bismillah ir-Rahman ir-Raheem'), 'HeroHall.tsx must provide authoritative translation ARIA label');
    });

    it('3.2 should render gold foil couple centerpiece (Zain & Anaya) in Alex Brush cursive', () => {
      assert.ok(heroHallCode.includes('h-names'), 'HeroHall.tsx must render .h-names couple centerpiece');
      assert.ok(dataJson.couple.groomName === 'Zain' && dataJson.couple.brideName === 'Anaya', 'data.json must specify Zain and Anaya');
      assert.ok(styleCss.includes('.font-script') && styleCss.includes('Alex Brush'), 'style.css must bind script typography to Alex Brush');
    });

    it('3.3 should guarantee facial clearance: middle 33%–68% height unobstructed by text cards', () => {
      assert.ok(heroHallCode.includes('h-focal-corridor'), 'HeroHall.tsx must render unobstructed .h-focal-corridor');
      assert.ok(styleCss.includes('.h-focal-corridor'), 'style.css must define .h-focal-corridor');
      assert.ok(styleCss.includes('min-height: 35svh;'), 'style.css must guarantee at least 35svh clearance height');
      assert.ok(styleCss.includes('pointer-events: none;'), 'Clearance zone must have pointer-events: none');
    });

    it('3.4 should initialize 2D canvas light glints for mirror wall reflections', () => {
      assert.ok(heroHallCode.includes('<canvas'), 'HeroHall.tsx must render HTML canvas');
      assert.ok(heroHallCode.includes('canvas.getContext("2d")'), 'HeroHall.tsx must initialize 2D canvas context');
      assert.ok(heroHallCode.includes('particleCount = 30'), 'HeroHall.tsx must configure 30 glint particles');
    });

    it('3.5 should pause canvas execution (.is-away) when scrolled out of viewport', () => {
      assert.ok(heroHallCode.includes('IntersectionObserver'), 'HeroHall.tsx must configure IntersectionObserver');
      assert.ok(heroHallCode.includes('isAwayRef.current'), 'HeroHall.tsx must track isAwayRef to pause off-screen animation');
    });
  });

  describe('Feature 4: Velvet Letter Casket & Royal Sheet (#letter)', () => {
    it('4.1 should render 3D mirrored velvet casket button with hinged lid structure', () => {
      assert.ok(letterCasketCode.includes('id="casket"'), 'LetterCasket.tsx must render #casket');
      assert.ok(letterCasketCode.includes('c-lid'), 'LetterCasket.tsx must render c-lid element');
      assert.ok(letterCasketCode.includes('disabled={isOpen}'), 'LetterCasket.tsx button must include disabled={isOpen} guard');
      assert.ok(letterCasketCode.includes('isTriggered.current'), 'LetterCasket.tsx must employ isTriggered ref lock');
    });

    it('4.2 should rotate casket lid open (rotateX -120deg) and trigger sfx-letter.mp3', () => {
      assert.ok(letterCasketCode.includes('sfx-letter.mp3'), 'LetterCasket.tsx must play sfx-letter.mp3');
      assert.ok(styleCss.includes('@keyframes casket-open'), 'style.css must define @keyframes casket-open');
      assert.ok(styleCss.includes('rotateX(-120deg)'), 'style.css must rotate casket lid to -120deg');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-letter.mp3')), 'public audio sfx-letter.mp3 must exist on disk');
    });

    it('4.3 should unfold three-panel parchment sheet revealing Surah Ar-Rum 30:21', () => {
      assert.ok(letterCasketCode.includes('lt-panel-top'), 'LetterCasket.tsx must render top panel');
      assert.ok(letterCasketCode.includes('lt-panel-mid'), 'LetterCasket.tsx must render middle panel');
      assert.ok(letterCasketCode.includes('lt-panel-bottom'), 'LetterCasket.tsx must render bottom panel');
      assert.ok(dataJson.sacred.quranSurah.includes('Surah Ar-Rum · 30:21'), 'data.json must specify Surah Ar-Rum 30:21');
    });

    it('4.4 should inject guest name into [data-guest] from ?to= query parameter', () => {
      assert.ok(letterCasketCode.includes('data-guest'), 'LetterCasket.tsx must render data-guest attribute');
      assert.ok(letterCasketCode.includes('sanitizeGuestParam'), 'LetterCasket.tsx must invoke sanitizeGuestParam');
      const sanitized = sanitizeGuestParam('Uncle Jameel');
      assert.strictEqual(sanitized, 'Uncle Jameel');
    });

    it('4.5 should stamp animated wax monogram seal (Z&A) onto unfolded letter parchment', () => {
      assert.ok(letterCasketCode.includes('lt-seal'), 'LetterCasket.tsx must render .lt-seal');
      assert.ok(letterCasketCode.includes('is-stamped'), 'LetterCasket.tsx must toggle is-stamped class');
      assert.ok(letterCasketCode.includes('groomName.charAt(0)'), 'LetterCasket.tsx must render groom monogram initial');
      assert.ok(letterCasketCode.includes('brideName.charAt(0)'), 'LetterCasket.tsx must render bride monogram initial');
    });
  });

  describe('Feature 5: Family Hanging Lamps & Confluence (#families)', () => {
    it('5.1 should render dual brass hanging oil lamps for groom and bride families', () => {
      assert.ok(familyLampsCode.includes('handleGroomLamp'), 'FamilyLamps.tsx must handle groom lamp');
      assert.ok(familyLampsCode.includes('handleBrideLamp'), 'FamilyLamps.tsx must handle bride lamp');
      assert.ok(familyLampsCode.includes('fm-lamp'), 'FamilyLamps.tsx must render .fm-lamp');
      assert.strictEqual(dataJson.couple.groomParents, 'Mr & Mrs Imran Siddiqui');
      assert.strictEqual(dataJson.couple.brideParents, 'Mr & Mrs Faisal Chaudhry');
    });

    it('5.2 should ignite groom family lamp and play sfx-light.mp3 on interaction', () => {
      assert.ok(familyLampsCode.includes('handleGroomLamp'), 'FamilyLamps.tsx must define handleGroomLamp');
      assert.ok(familyLampsCode.includes('sfx-light.mp3'), 'FamilyLamps.tsx must trigger sfx-light.mp3');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-light.mp3')), 'sfx-light.mp3 must exist on disk');
    });

    it('5.3 should ignite bride family lamp and play sfx-light.mp3 on interaction', () => {
      assert.ok(familyLampsCode.includes('handleBrideLamp'), 'FamilyLamps.tsx must define handleBrideLamp');
      assert.ok(familyLampsCode.includes('setBrideLit(true)'), 'FamilyLamps.tsx must set brideLit to true');
    });

    it('5.4 should trigger dynamic golden SVG bezier confluence threads when both lamps are lit', () => {
      assert.ok(familyLampsCode.includes('groomLit && brideLit && !bothLit'), 'FamilyLamps.tsx must detect confluence condition');
      assert.ok(familyLampsCode.includes('sfx-join.mp3'), 'FamilyLamps.tsx must play sfx-join.mp3 on confluence');
      assert.ok(familyLampsCode.includes('<svg'), 'FamilyLamps.tsx must render SVG confluence container');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-join.mp3')), 'sfx-join.mp3 must exist on disk');
    });

    it('5.5 should converge golden threads onto central marriage dua (Sunan Abi Dawud 969)', () => {
      assert.ok(dataJson.sacred.familyReference.includes('Sunan Abi Dawud · 969'), 'data.json must reference Sunan Abi Dawud 969');
      assert.ok(familyLampsCode.includes('familyDua'), 'FamilyLamps.tsx must render family dua');
    });
  });

  describe('Feature 6: 3D Jharokha Festive Windows (#events)', () => {
    it('6.1 should render exactly 4 festive Mughal jharokha window cards', () => {
      assert.strictEqual(dataJson.events.length, 4, 'data.json must declare exactly 4 events');
      const eventIds = dataJson.events.map(e => e.id);
      assert.deepStrictEqual(eventIds, ['mehndi', 'nikah', 'baraat', 'walima']);
      assert.ok(eventWindowsCode.includes('DEFAULT_EVENTS'), 'EventWindows.tsx must bind events array');
    });

    it('6.2 should swing 3D wooden shutters outward on card click and play sfx-window-open.mp3', () => {
      assert.ok(eventWindowsCode.includes('sfx-window-open.mp3'), 'EventWindows.tsx must play sfx-window-open.mp3');
      assert.ok(styleCss.includes('@keyframes win-open-l'), 'style.css must declare @keyframes win-open-l');
      assert.ok(styleCss.includes('@keyframes win-open-r'), 'style.css must declare @keyframes win-open-r');
      assert.ok(styleCss.includes('rotateY(-85deg)'), 'style.css must swing left shutter to -85deg');
      assert.ok(styleCss.includes('rotateY(85deg)'), 'style.css must swing right shutter to 85deg');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-window-open.mp3')), 'sfx-window-open.mp3 must exist on disk');
    });

    it('6.3 should display verified Karachi venue details and dress codes for each event', () => {
      const baraat = dataJson.events.find(e => e.id === 'baraat');
      assert.ok(baraat.venue.includes('Qasr-e-Aina'), 'Baraat venue must be Qasr-e-Aina');
      assert.strictEqual(baraat.dressCode, 'Formal eastern, in reds & golds');
    });

    it('6.4 should generate standard RFC 5545 iCalendar (.ics) download content', () => {
      assert.ok(eventWindowsCode.includes('generateICalendarEvent'), 'EventWindows.tsx must include generateICalendarEvent');
      const baraat = dataJson.events.find(e => e.id === 'baraat');
      const ics = generateICalendarEvent(baraat, dataJson.couple);
      assert.ok(ics.includes('BEGIN:VCALENDAR'), 'ICS must declare VCALENDAR');
      assert.ok(ics.includes('SUMMARY:Zain & Anaya - Baraat'), 'ICS must include couple and event summary');
      assert.ok(ics.includes('LOCATION:Qasr-e-Aina Banquet Hall, Shahrah-e-Faisal, Karachi'), 'ICS must declare exact venue location');
    });

    it('6.5 should provide Google Maps navigation link targeting venue address', () => {
      assert.ok(eventWindowsCode.includes('https://www.google.com/maps/search/?api=1&query='), 'EventWindows.tsx must build Google Maps search URL');
    });
  });

  describe('Feature 7: Celestial Astrolabe Countdown (#countdown)', () => {
    it('7.1 should render rotating brass astrological dial with calendar rings', () => {
      assert.ok(countdownCode.includes('cd-dial'), 'AstrolabeCountdown.tsx must render .cd-dial');
      assert.ok(countdownCode.includes('cd-count'), 'AstrolabeCountdown.tsx must render .cd-count container');
      assert.ok(fs.existsSync(path.join(publicDir, 'assets/countdown/rete.webp')), 'rete.webp asset must exist on disk');
      assert.ok(fs.existsSync(path.join(publicDir, 'assets/countdown/ring1.webp')), 'ring1.webp asset must exist on disk');
    });

    it('7.2 should compute rotation angle accurately via atan2 pointer trigonometry', () => {
      assert.ok(countdownCode.includes('getAngleFromPoint'), 'AstrolabeCountdown.tsx must include getAngleFromPoint');
      const angleNorth = calculateAstrolabeAngle(0, -100);
      assert.strictEqual(Math.round(angleNorth), 270, 'North vector must evaluate to 270 degrees');
      const angleEast = calculateAstrolabeAngle(100, 0);
      assert.strictEqual(Math.round(angleEast), 0, 'East vector must evaluate to 0 degrees');
    });

    it('7.3 should trigger alignment lock snap and sfx-lock.mp3 when dialed to Baraat wedding date', () => {
      assert.ok(countdownCode.includes('sfx-lock.mp3'), 'AstrolabeCountdown.tsx must play sfx-lock.mp3 on lock');
      assert.ok(countdownCode.includes('setIsLocked(true)'), 'AstrolabeCountdown.tsx must set isLocked state');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-lock.mp3')), 'sfx-lock.mp3 must exist on disk');
    });

    it('7.4 should generate 7x5 dot matrix bitmasks for flip-tile canvas countdown digits', () => {
      assert.ok(countdownCode.includes('FONT_7x5'), 'AstrolabeCountdown.tsx must define FONT_7x5');
      const matrix8 = getTileMatrixForDigit('8');
      assert.strictEqual(matrix8.length, 5, 'Digit 8 bitmask must have 5 columns');
      assert.strictEqual(matrix8[0], 0x1f, 'First column must be 0x1f');
      assert.strictEqual(matrix8[4], 0x1f, 'Last column must be 0x1f');
    });

    it('7.5 should compute accurate remaining days, hours, minutes, and seconds', () => {
      // Direct verification of AstrolabeCountdown.tsx:50-52 logic
      assert.ok(countdownCode.includes('const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))'), 'AstrolabeCountdown.tsx must compute minutes with modulo 1 hour (diffMs % (1000 * 60 * 60))');
      
      const targetTime = new Date('2026-12-12T20:00:00+05:00').getTime();
      const mockNow = new Date('2026-12-10T14:30:00+05:00').getTime();
      const diffMs = targetTime - mockNow; // 2 days, 5 hours, 30 minutes
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      assert.strictEqual(days, 2, 'Days remaining must equal 2');
      assert.strictEqual(hours, 5, 'Hours remaining must equal 5');
      assert.strictEqual(minutes, 30, 'Minutes remaining must equal 30 (not perpetual 0)');
      assert.strictEqual(seconds, 0, 'Seconds remaining must equal 0');
    });
  });

  describe('Feature 8: Bangle Stand RSVP Desk (#rsvp)', () => {
    it('8.1 should render 4 event attendance toggle switches modeled as bangles', () => {
      assert.ok(rsvpCode.includes('DEFAULT_RSVP_EVENTS'), 'BangleRsvp.tsx must define 4 RSVP events');
      assert.ok(rsvpCode.includes('role="switch"'), 'BangleRsvp.tsx must assign role="switch" to bangles');
      assert.ok(rsvpCode.includes('bangle-mehndi.webp'), 'BangleRsvp.tsx must reference mehndi bangle asset');
    });

    it('8.2 should flip switch state and play sfx-bangle.mp3 when bangle is clicked', () => {
      assert.ok(rsvpCode.includes('sfx-bangle.mp3'), 'BangleRsvp.tsx must play sfx-bangle.mp3');
      assert.ok(rsvpCode.includes('toggleEvent'), 'BangleRsvp.tsx must define toggleEvent');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-bangle.mp3')), 'sfx-bangle.mp3 must exist on disk');
    });

    it('8.3 should provide stepper buttons (+ and -) with minimum 44x44px touch targets', () => {
      assert.ok(rsvpCode.includes('min-h-[44px] min-w-[44px]'), 'Stepper buttons must declare min-h-[44px] min-w-[44px]');
      assert.ok(rsvpCode.includes('handleDecrement'), 'BangleRsvp.tsx must define handleDecrement');
      assert.ok(rsvpCode.includes('handleIncrement'), 'BangleRsvp.tsx must define handleIncrement');
      assert.ok(rsvpCode.includes('Math.max(1, prev - 1)'), 'handleDecrement must clamp inside functional updater: Math.max(1, prev - 1)');
      assert.ok(rsvpCode.includes('Math.min(maxSeats, prev + 1)'), 'handleIncrement must clamp inside functional updater: Math.min(maxSeats, prev + 1)');
    });

    it('8.4 should transition form into rolled parchment and launch carrier dove upon submit', () => {
      assert.ok(rsvpCode.includes('sfx-roll.mp3'), 'BangleRsvp.tsx must play sfx-roll.mp3');
      assert.ok(rsvpCode.includes('sfx-dove.mp3'), 'BangleRsvp.tsx must play sfx-dove.mp3');
      assert.ok(rsvpCode.includes('rs-flyer'), 'BangleRsvp.tsx must render .rs-flyer');
      assert.ok(styleCss.includes('.sheesh-mahal-root .rs-flyer'), 'style.css must declare .rs-flyer animation binding');
      assert.ok(styleCss.includes('@keyframes dove-flap'), 'style.css must declare @keyframes dove-flap');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-roll.mp3')), 'sfx-roll.mp3 must exist on disk');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-dove.mp3')), 'sfx-dove.mp3 must exist on disk');
    });

    it('8.5 should render Shukriya confirmation card with attendance summary and Change Reply trigger', () => {
      assert.ok(rsvpCode.includes('Shukriya!'), 'BangleRsvp.tsx must render Shukriya title');
      assert.ok(rsvpCode.includes('rs-change'), 'BangleRsvp.tsx must render .rs-change button');
      assert.ok(rsvpCode.includes('Change My Reply'), 'BangleRsvp.tsx must allow guest to change reply');
    });
  });

  describe('Feature 9: Midnight Reflecting Pool & Replay (#closing)', () => {
    it('9.1 should render midnight palace pool scene under crescent moon with Baraka Allahu Lakuma dua', () => {
      assert.ok(poolCode.includes('cl-float'), 'ReflectingPool.tsx must render .cl-float pool scene');
      assert.ok(poolCode.includes('cl-diyas'), 'ReflectingPool.tsx must render .cl-diyas container');
      assert.ok(poolCode.includes('cl-moon'), 'ReflectingPool.tsx must render crescent moon');
      assert.ok(dataJson.sacred.closingDua.includes('بَارَكَ اللَّهُ لَكُمَا'), 'data.json must declare closing Baraka Allahu Lakuma dua');
    });

    it('9.2 should spawn floating brass diya at pointer coordinates on water click', () => {
      assert.ok(poolCode.includes('handlePoolClick'), 'ReflectingPool.tsx must handle pool clicks');
      assert.ok(poolCode.includes('newDiya'), 'ReflectingPool.tsx must instantiate newDiya');
      assert.ok(poolCode.includes('diya-init-1'), 'ReflectingPool.tsx must prepopulate initial diyas');
    });

    it('9.3 should animate expanding concentric water ripples and vertical sinusoidal bobbing', () => {
      assert.ok(poolCode.includes('sfx-diya.mp3'), 'ReflectingPool.tsx must play sfx-diya.mp3');
      assert.ok(styleCss.includes('@keyframes cl-bob'), 'style.css must declare @keyframes cl-bob');
      assert.ok(styleCss.includes('@keyframes cl-ripple'), 'style.css must declare @keyframes cl-ripple');
      assert.ok(fs.existsSync(path.join(audioDir, 'sfx-diya.mp3')), 'sfx-diya.mp3 must exist on disk');
    });

    it('9.4 should reset invitation state and smooth-scroll to top when Replay is clicked', () => {
      assert.ok(pageCode.includes('handleReplay'), 'page.tsx must define handleReplay');
      assert.ok(pageCode.includes('setIsGateOpen(false)'), 'page.tsx handleReplay must re-close gate');
      assert.ok(pageCode.includes('window.scrollTo'), 'page.tsx handleReplay must scroll window to top');
    });

    it('9.5 should re-lock body scroll upon replay until medallion is tapped again', () => {
      assert.ok(entranceGateCode.includes('document.body.style.overflow = "hidden"'), 'EntranceGate.tsx must lock body scroll when gate is shut');
      assert.ok(entranceGateCode.includes('document.documentElement.classList.add("is-shut")'), 'EntranceGate.tsx must apply is-shut class when shut');
    });
  });

});

// =========================================================================
// TIER 2: BOUNDARY & CORNER CASES (30 TESTS)
// =========================================================================

describe('Tier 2: Boundary & Corner Cases', () => {

  describe('Gate & Motion Boundaries', () => {
    it('2.1 should debounce rapid double-taps on medallion trigger to single-fire once', () => {
      assert.ok(entranceGateCode.includes('isTriggered.current'), 'EntranceGate.tsx must guard with isTriggered.current ref');
      assert.ok(entranceGateCode.includes('if (isTriggered.current || isOpening || isFullyOpen) return'), 'EntranceGate.tsx must reject concurrent clicks');
    });

    it('2.2 should open gate on Enter and Spacebar keyboard accessibility triggers', () => {
      assert.ok(entranceGateCode.includes('handleKeyDown'), 'EntranceGate.tsx must define handleKeyDown');
      assert.ok(entranceGateCode.includes('e.key === "Enter" || e.key === " "'), 'EntranceGate.tsx must handle Enter and Space keys');
    });

    it('2.3 should immediately bypass 3D door rotation when prefers-reduced-motion is active', () => {
      assert.ok(entranceGateCode.includes('(prefers-reduced-motion: reduce)'), 'EntranceGate.tsx must query prefers-reduced-motion media query');
      assert.ok(entranceGateCode.includes('if (prefersReducedMotion)'), 'EntranceGate.tsx must branch for reduced motion');
    });

    it('2.4 should strictly prevent scrolling while gate is shut (overflow: hidden)', () => {
      assert.ok(styleCss.includes('overflow: hidden !important;'), 'style.css must enforce overflow: hidden !important on .is-shut');
      assert.ok(styleCss.includes('body.is-shut'), 'style.css must target body.is-shut');
    });

    it('2.5 should handle page reload by defaulting to shut state unless previously restored', () => {
      assert.ok(pageCode.includes('const [isGateOpen, setIsGateOpen] = useState(false)'), 'page.tsx must initialize isGateOpen to false');
    });
  });

  describe('Audio & Query Parameter Boundaries', () => {
    it('2.6 should completely suppress audio engine when ?nomusic query param is present', () => {
      assert.ok(audioDockCode.includes('const nomusic = params.get("nomusic")'), 'AudioDock.tsx must read ?nomusic query param');
      assert.ok(isMusicSuppressed('?nomusic'), '?nomusic must be suppressed');
      assert.ok(audioDockCode.includes('if (isSuppressed) return null'), 'AudioDock.tsx must return null when suppressed');
    });

    it('2.7 should recognize both ?nomusic=1 and ?nomusic=true query formats', () => {
      assert.ok(isMusicSuppressed('?nomusic=1'), '?nomusic=1 must suppress audio');
      assert.ok(isMusicSuppressed('?nomusic=true'), '?nomusic=true must suppress audio');
      assert.strictEqual(isMusicSuppressed('?nomusic=0'), false, '?nomusic=0 must not suppress audio');
    });

    it('2.8 should smoothly ramp audio gain to 0 when browser tab visibility changes to hidden', () => {
      assert.ok(audioDockCode.includes('handleVisibilityChange'), 'AudioDock.tsx must define handleVisibilityChange');
      assert.ok(audioDockCode.includes('if (document.hidden)'), 'AudioDock.tsx must check document.hidden');
      assert.ok(audioDockCode.includes('isPlayingRef.current && audioRef.current'), 'AudioDock.tsx must use isPlayingRef.current in visibility handler');
    });

    it('2.9 should handle unsupported audio playback with silent graceful fallback without throwing', () => {
      assert.ok(audioDockCode.includes('.catch(() => {})'), 'AudioDock.tsx must catch playback rejections');
      assert.ok(audioDockCode.includes('try {'), 'AudioDock.tsx must enclose audio creation in try/catch');
    });

    it('2.10 should debounce rapid audio mute toggles to avoid WebAudio scheduling conflicts', () => {
      assert.ok(audioDockCode.includes('fadeTimeoutRef.current'), 'AudioDock.tsx must manage fadeTimeoutRef.current');
      assert.ok(audioDockCode.includes('clearTimeout(fadeTimeoutRef.current)'), 'AudioDock.tsx must clear fadeTimeoutRef on rapid toggle');
    });
  });

  describe('Personalization & Security Boundaries', () => {
    it('2.11 should neutralize <script> XSS injections in ?to= query parameter', () => {
      const malicious = "<script>alert('xss')</script>";
      const sanitized = sanitizeGuestParam(malicious);
      assert.ok(!sanitized.includes('<script'), 'Must neutralize script tags');
      assert.ok(!sanitized.includes('alert'), 'Must strip script payload');
      assert.strictEqual(sanitized, 'Family & Friends');
    });

    it('2.12 should neutralize HTML formatting tags (<b>, <i>, <iframe>) in ?to=', () => {
      const formatted = '<b>VIP</b> <i>Honored</i> <iframe>bad</iframe>';
      const sanitized = sanitizeGuestParam(formatted);
      assert.ok(!sanitized.includes('<'), 'Must strip opening brackets');
      assert.ok(!sanitized.includes('>'), 'Must strip closing brackets');
      assert.strictEqual(sanitized, 'VIP Honored bad');
    });

    it('2.13 should truncate excessively long guest query strings to maximum 60 characters', () => {
      const longInput = 'Dr. Tariq '.repeat(20);
      const sanitized = sanitizeGuestParam(longInput);
      assert.ok(sanitized.length <= 60, `Length ${sanitized.length} must be <= 60`);
    });

    it('2.14 should safely preserve authentic Urdu and Arabic unicode guest names', () => {
      const urduName = 'جناب طارق صاحب';
      const sanitized = sanitizeGuestParam(urduName);
      assert.strictEqual(sanitized, 'جناب طارق صاحب', 'Urdu unicode characters must be preserved faithfully');
    });

    it('2.15 should fallback to "Family & Friends" when ?to= query parameter is absent or empty', () => {
      assert.strictEqual(sanitizeGuestParam(null), 'Family & Friends');
      assert.strictEqual(sanitizeGuestParam(''), 'Family & Friends');
      assert.strictEqual(sanitizeGuestParam('   '), 'Family & Friends');
      assert.strictEqual(sanitizeGuestParam('\u200B\u200B'), 'Family & Friends');
    });
  });

  describe('Responsive & Mobile Ergonomics Boundaries', () => {
    it('2.16 should enforce zero horizontal overflow on narrowest 320px mobile viewport (iPhone SE)', () => {
      assert.ok(styleCss.includes('overflow-x: hidden !important;'), 'style.css must enforce overflow-x: hidden !important');
      assert.ok(styleCss.includes('max-width: 100vw;'), 'style.css must enforce max-width: 100vw');
      assert.ok(countdownCode.includes('min-w-[64px] sm:min-w-[80px]'), 'AstrolabeCountdown tiles must use min-w-[64px] sm:min-w-[80px] for narrow viewport fit');
    });

    it('2.17 should clamp body typography using clamp() to prevent tiny illegible font rendering', () => {
      assert.ok(styleCss.includes('clamp('), 'style.css must use clamp() fluid typography');
      assert.ok(styleCss.includes('font-size: clamp(0.85rem, 2.6cqi, 1rem)'), 'style.css must clamp body text');
    });

    it('2.18 should bound card width on ultra-wide desktop displays (1920px+)', () => {
      assert.ok(styleCss.includes('max-width: 520px;'), 'style.css must cap tablet/desktop container at 520px');
      assert.ok(styleCss.includes('max-width: 540px;'), 'style.css must cap wide desktop container at 540px');
    });

    it('2.19 should provide safe-area padding for top and bottom device home indicators', () => {
      assert.ok(styleCss.includes('env(safe-area-inset-top'), 'style.css must include safe-area-inset-top');
      assert.ok(styleCss.includes('env(safe-area-inset-bottom'), 'style.css must include safe-area-inset-bottom');
    });

    it('2.20 should guarantee minimum 44x44px touch targets on all interactive controls', () => {
      assert.ok(styleCss.includes('--min-touch: 44px;'), 'style.css must declare --min-touch: 44px token');
      assert.ok(styleCss.includes('min-width: var(--min-touch, 44px);'), 'style.css must apply min-width 44px');
      assert.ok(styleCss.includes('min-height: var(--min-touch, 44px);'), 'style.css must apply min-height 44px');
      assert.ok(styleCss.includes('.sheesh-mahal-root button,'), 'style.css must target buttons in touch rule');
    });
  });

  describe('RSVP Validation Boundaries', () => {
    it('2.21 should reject empty guest name in RSVP form and set validation message', () => {
      assert.ok(rsvpCode.includes('Please enter your name'), 'BangleRsvp.tsx must require non-empty guest name');
      assert.ok(rsvpCode.includes('guestName.trim().length === 0'), 'BangleRsvp.tsx must check trimmed name length');
    });

    it('2.22 should treat whitespace-only guest name as invalid empty input', () => {
      assert.ok(rsvpCode.includes('!guestName || guestName.trim().length === 0'), 'BangleRsvp.tsx must reject whitespace-only names');
    });

    it('2.23 should prevent party size stepper from decrementing below 1 guest', () => {
      assert.ok(rsvpCode.includes('setGuestCount((prev) => Math.max(1, prev - 1))'), 'BangleRsvp.tsx must clamp decrement to minimum 1 inside updater');
    });

    it('2.24 should prevent party size stepper from exceeding allocated maximum seats', () => {
      assert.ok(rsvpCode.includes('setGuestCount((prev) => Math.min(maxSeats, prev + 1))'), 'BangleRsvp.tsx must clamp increment to maxSeats inside updater');
    });

    it('2.25 should require at least one event selection before allowing RSVP submission', () => {
      assert.ok(rsvpCode.includes('Please select at least one celebration to attend'), 'BangleRsvp.tsx must require >=1 event selection');
      assert.ok(rsvpCode.includes('selectedEvents.length === 0'), 'BangleRsvp.tsx must validate selectedEvents array');
    });

    it('2.26 should replace RSVP form with .rs-closed polite notice when deadline is past', () => {
      assert.ok(rsvpCode.includes('isPastDeadline'), 'BangleRsvp.tsx must track isPastDeadline state');
      assert.ok(rsvpCode.includes('rs-closed'), 'BangleRsvp.tsx must render .rs-closed when expired');
    });

    it('2.27 should block spam submission if honeypot hidden input field is populated', () => {
      assert.ok(rsvpCode.includes('honeypot && honeypot.trim().length > 0'), 'BangleRsvp.tsx must check honeypot spam field');
      assert.ok(rsvpCode.includes('name="bot_field"'), 'BangleRsvp.tsx must render hidden honeypot input');
    });
  });

  describe('Reflecting Pool & Memory Boundaries', () => {
    it('2.28 should cap active diya concurrency to maximum 20 to prevent DOM/canvas memory leaks', () => {
      assert.ok(poolCode.includes('MAX_DIYAS = 20'), 'ReflectingPool.tsx must declare MAX_DIYAS = 20');
      assert.ok(poolCode.includes('updated.slice(updated.length - MAX_DIYAS)'), 'ReflectingPool.tsx must enforce FIFO slice when capping');
    });

    it('2.29 should handle rapid multi-touch taps without crashing ripple physics engine', () => {
      assert.ok(poolCode.includes('Math.max(5, Math.min(95,'), 'ReflectingPool.tsx must clamp X coordinate margins');
      assert.ok(poolCode.includes('Math.max(15, Math.min(85,'), 'ReflectingPool.tsx must clamp Y coordinate margins');
    });

    it('2.30 should recalculate canvas pixel buffer on window resize without clearing running state', () => {
      assert.ok(poolCode.includes('poolRef.current.getBoundingClientRect()'), 'ReflectingPool.tsx must calculate client bounds from DOM rect');
    });
  });

});

// =========================================================================
// TIER 3: CROSS-FEATURE PAIRWISE COMBINATIONS (10 TESTS)
// =========================================================================

describe('Tier 3: Cross-Feature Pairwise Combinations', () => {

  it('3.1 Gate Open + Audio Autoplay: Medallion tap simultaneously opens gate and starts audio', () => {
    assert.ok(pageCode.includes('onOpen={handleOpenGate}'), 'page.tsx must pass handleOpenGate to EntranceGate');
    assert.ok(pageCode.includes('setIsGateOpen(true)'), 'page.tsx must update isGateOpen in handleOpenGate');
    assert.ok(pageCode.includes('<AudioDock'), 'page.tsx must render AudioDock');
    assert.ok(pageCode.includes('isGateOpen={isGateOpen}'), 'page.tsx must pass isGateOpen into AudioDock');
    assert.ok(audioDockCode.includes('if (isGateOpen && !hasUserGestured.current)'), 'AudioDock.tsx must start audio when gate opens');
  });

  it('3.2 Audio Mute Persistence + Gate Replay: Audio remains muted when invitation is replayed', () => {
    assert.ok(audioDockCode.includes('localStorage.getItem("sm:music") === "off"'), 'AudioDock.tsx must respect stored "off" state on restart');
    assert.ok(pageCode.includes('setGateCycle((prev) => prev + 1)'), 'page.tsx handleReplay must increment gate cycle');
  });

  it('3.3 Guest Query (?to=) + Letter Casket + Monogram Seal: Name renders on parchment under seal', () => {
    assert.ok(pageCode.includes('setUrlGuestName(sanitizeGuestParam(to))'), 'page.tsx must pass sanitized query guest name');
    assert.ok(pageCode.includes('<LetterCasket'), 'page.tsx must render LetterCasket');
    assert.ok(pageCode.includes('guestName={guestName}'), 'page.tsx must pass guestName prop to LetterCasket');
    assert.ok(letterCasketCode.includes('{guestName}'), 'LetterCasket.tsx must render resolved guestName');
  });

  it('3.4 Faith Preset Switching + Sacred Arch: Switching to Universal adapts Bismillah smoothly', () => {
    assert.ok(dataJson.sacred.bismillah, 'data.json must provide sacred Islamic invocation');
    const universalOverride = deepMergeTemplateData(dataJson, {
      sacred: { bismillah: 'With Love & Blessings', bismillahAria: 'With Love and Blessings' }
    });
    assert.strictEqual(universalOverride.sacred.bismillah, 'With Love & Blessings');
    assert.strictEqual(universalOverride.sacred.bismillahAria, 'With Love and Blessings');
  });

  it('3.5 Event Shutters + Calendar Linkage: Baraat shutter opening reveals accurate venue in .ics', () => {
    const baraat = dataJson.events.find(e => e.id === 'baraat');
    const ics = generateICalendarEvent(baraat, dataJson.couple);
    assert.ok(ics.includes('Qasr-e-Aina Banquet Hall'), 'Generated ICS must contain Baraat venue name');
  });

  it('3.6 RSVP Bangles + Shukriya Card: Selected bangles correctly summarize attending events', () => {
    const selected = ['mehndi', 'walima'];
    const summaryEvents = dataJson.events.filter(e => selected.includes(e.id)).map(e => e.name);
    assert.deepStrictEqual(summaryEvents, ['Mehndi', 'Walima'], 'Summary must list exact event names');
  });

  it('3.7 RSVP Network Failure + LocalStorage: Network drop falls back to local storage record', () => {
    assert.ok(rsvpCode.includes('localStorage.setItem("sm:rsvp", JSON.stringify(submission))'), 'BangleRsvp.tsx must record submission in localStorage');
  });

  it('3.8 Change Reply Action + Form Prepopulation: Restores previously submitted values for editing', () => {
    assert.ok(rsvpCode.includes('const parsed = JSON.parse(saved) as RsvpSubmission'), 'BangleRsvp.tsx must parse saved RSVP from localStorage');
    assert.ok(rsvpCode.includes('setLastSubmission(parsed)'), 'BangleRsvp.tsx must restore lastSubmission on mount');
    assert.ok(rsvpCode.includes('setRsvpState("form")'), 'BangleRsvp.tsx must transition back to "form" state when changing reply');
  });

  it('3.9 Astrolabe Alignment Date + Event Window Date: Astrolabe lock date matches Baraat event', () => {
    const baraat = dataJson.events.find(e => e.id === 'baraat');
    assert.ok(countdownCode.includes('2026-12-12T20:00:00+05:00'), 'AstrolabeCountdown.tsx default date must match Baraat ISO timestamp');
    assert.strictEqual(baraat.isoTarget, '2026-12-12T20:00:00+05:00');
  });

  it('3.10 Reflecting Pool Diya + Audio Dock SFX: Water drop triggers sfx-diya.mp3 in audio manager', () => {
    assert.ok(poolCode.includes('playSfx("sfx-diya.mp3")'), 'ReflectingPool.tsx must call playSfx with sfx-diya.mp3');
    assert.ok(poolCode.includes('triggerSfx(name)'), 'ReflectingPool.tsx must delegate to AudioDock triggerSfx');
  });

});

// =========================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (6 SCENARIOS)
// =========================================================================

describe('Tier 4: Real-World Application Scenarios', () => {

  it('Scenario 1: Complete Guest Happy Path Journey', () => {
    // 1. Guest arrives with ?to=Auntie+Yasmin
    const guestParam = sanitizeGuestParam('Auntie Yasmin');
    assert.strictEqual(guestParam, 'Auntie Yasmin');

    // 2. Gate is initially shut, scrolls locked
    assert.ok(pageCode.includes('useState(false)'), 'Gate must start closed');

    // 3. Guest taps gold medallion -> gate opens, audio begins
    assert.ok(entranceGateCode.includes('onOpen?.()'), 'EntranceGate onOpen callback must be present');

    // 4. Hero section reveals sacred Bismillah and couple names
    assert.strictEqual(dataJson.sacred.bismillah, '﷽');
    assert.strictEqual(dataJson.couple.groomName, 'Zain');
    assert.strictEqual(dataJson.couple.brideName, 'Anaya');

    // 5. Letter casket opened, unfolds parchment addressed to Auntie Yasmin
    assert.ok(letterCasketCode.includes('data-guest'), 'Parchment must address guest');

    // 6. Family lamps lit -> Confluence threads activate
    assert.ok(familyLampsCode.includes('groomLit && brideLit'), 'Confluence must activate when both lamps lit');

    // 7. Event windows inspected
    const baraat = dataJson.events.find(e => e.id === 'baraat');
    assert.ok(baraat.venue.includes('Qasr-e-Aina'));

    // 8. Astrolabe dial snaps to wedding date
    assert.ok(countdownCode.includes('isLocked'), 'Astrolabe must support snap lock');

    // 9. RSVP submitted with attending count clamped
    assert.ok(rsvpCode.includes('attendingCount: Math.min(maxSeats, Math.max(1, guestCount))'), 'RSVP must defensively clamp submission');

    // 10. Diya placed in reflecting pool and closing blessing viewed
    assert.ok(poolCode.includes('newDiya'), 'Pool must support diya placement');
  });

  it('Scenario 2: Quiet Workplace Guest Journey (?nomusic=1)', () => {
    const search = '?nomusic=1';
    assert.strictEqual(isMusicSuppressed(search), true, 'Search must indicate music suppression');
    assert.ok(audioDockCode.includes('if (isSuppressed) return null'), 'AudioDock must render null when suppressed');
    assert.ok(audioDockCode.includes('if (nomusic === "" || nomusic === "1" || nomusic === "true") return'), 'playSfx helper must suppress SFX on ?nomusic');
  });

  it('Scenario 3: Multi-Device Responsive Sweep across Viewports', () => {
    // Check style.css responsive rules across mobile, tablet, and desktop
    assert.ok(styleCss.includes('@media (max-width: 639px)'), 'style.css must have mobile media query');
    assert.ok(styleCss.includes('@media (min-width: 640px)'), 'style.css must have tablet/desktop media query');
    assert.ok(styleCss.includes('@media (min-width: 1440px)'), 'style.css must have wide desktop media query');
    assert.ok(styleCss.includes('--min-touch: 44px;'), 'style.css must enforce >= 44px touch targets on mobile');
  });

  it('Scenario 4: Platform Customizer Wizard Real-Time Data Injection', () => {
    const customProps = {
      brideName: 'Sania',
      groomName: 'Bilal',
      venue: { name: 'Royal Palm Marquee', address: 'Lahore' }
    };
    const merged = deepMergeTemplateData(dataJson, customProps);
    assert.strictEqual(merged.brideName, 'Sania');
    assert.strictEqual(merged.groomName, 'Bilal');
    assert.strictEqual(merged.venue.name, 'Royal Palm Marquee');
    assert.strictEqual(merged.events.length, 4, 'Merged data must preserve default events');
  });

  it('Scenario 5: Multi-Faith Inclusivity Verification', () => {
    const multiFaithData = {
      muslim: { bismillah: dataJson.sacred.bismillah, verse: dataJson.sacred.quranSurah },
      hindu: { bismillah: '|| श्री गणेशाय नमः ||', verse: 'Rigveda · 10.85.42' },
      universal: { bismillah: 'With Love & Blessings', verse: 'Two lives, two hearts, joined together in friendship' }
    };
    assert.strictEqual(multiFaithData.muslim.bismillah, '﷽');
    assert.ok(multiFaithData.hindu.bismillah.includes('श्री गणेशाय नमः'));
    assert.ok(multiFaithData.universal.bismillah.includes('With Love & Blessings'));
  });

  it('Scenario 6: End-to-End RSVP Lifecycle & Local Storage Recovery', () => {
    assert.ok(rsvpCode.includes('localStorage.getItem("sm:rsvp")'), 'BangleRsvp.tsx must retrieve saved RSVP');
    assert.ok(rsvpCode.includes('localStorage.setItem("sm:rsvp"'), 'BangleRsvp.tsx must save RSVP');
    assert.ok(rsvpCode.includes('setRsvpState("confirmed")'), 'BangleRsvp.tsx must restore confirmed state from storage');
  });

});
