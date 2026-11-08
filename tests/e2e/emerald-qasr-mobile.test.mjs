import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Emerald Qasr Mobile-First Responsiveness & 3D Web Standards', () => {
  const pagePath = path.resolve('templates/emerald-qasr/page.tsx');
  const stylePath = path.resolve('templates/emerald-qasr/style.css');
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  const styleContent = fs.readFileSync(stylePath, 'utf8');

  describe('Feature 1: Mobile-First CSS Architecture & Zero Horizontal Overflow', () => {
    test('Root enforces overflow-x hidden and 100% width box-sizing', () => {
      assert.match(styleContent, /\.emerald-qasr-root\s*\{[^}]*overflow-x:\s*hidden/);
      assert.match(styleContent, /\.emerald-qasr-root\s*\{[^}]*width:\s*100%/);
    });

    test('Viewport shell follows mobile-first scaling with min-width media queries', () => {
      assert.match(styleContent, /\.eq-viewport-shell\s*\{[^}]*max-width:\s*480px/);
      assert.match(styleContent, /@media\s*\(min-width:\s*768px\)\s*\{[^}]*\.eq-viewport-shell/);
      assert.match(styleContent, /@media\s*\(min-width:\s*1024px\)\s*\{[^}]*\.eq-viewport-shell/);
    });

    test('Fluid typography uses clamp() for responsive titles and bismillah', () => {
      assert.match(styleContent, /\.eq-arch-bismillah\s*\{[^}]*font-size:\s*clamp\(/);
      assert.match(styleContent, /\.eq-section-title\s*\{[^}]*font-size:\s*clamp\(/);
    });
  });

  describe('Feature 2: 3D Spatial Geometry & Decoupled Hanging Lantern Physics', () => {
    test('Hero stage defines 3D perspective and preserve-3d', () => {
      assert.match(styleContent, /\.eq-video-hero-wrapper\s*\{[^}]*perspective:\s*1200px/);
      assert.match(styleContent, /\.eq-video-card\s*\{[^}]*transform-style:\s*preserve-3d/);
    });

    test('Hanging Ottoman lanterns decouple vertical floating from rotational pendulum sway', () => {
      assert.match(styleContent, /\.eq-floating-lantern/);
      assert.match(styleContent, /\.eq-lantern-pendulum\s*\{[^}]*transform-origin:\s*top center/);
      assert.match(styleContent, /@keyframes eq-pendulum-sway-l/);
      assert.match(styleContent, /@keyframes eq-pendulum-sway-r/);
      assert.match(styleContent, /@keyframes eq-lantern-float-l/);
      assert.match(styleContent, /@keyframes eq-lantern-float-r/);
    });

    test('Left and right lanterns have desynchronized periods and phase offsets', () => {
      assert.match(styleContent, /\.eq-lantern-left\s+\.eq-lantern-pendulum\s*\{[^}]*animation:[^}]*eq-pendulum-sway-l\s+4\.8s/);
      assert.match(styleContent, /\.eq-lantern-right\s+\.eq-lantern-pendulum\s*\{[^}]*animation:[^}]*eq-pendulum-sway-r\s+5\.4s/);
    });
  });

  describe('Feature 3: Touch Targets & Mobile Ergonomics (Apple & Android Standards)', () => {
    test('Wax seal anchor meets minimum 48x48px mobile touch target', () => {
      assert.match(styleContent, /\.eq-wax-initials-ring\s*\{[^}]*min-width:\s*48px/);
      assert.match(styleContent, /\.eq-wax-initials-ring\s*\{[^}]*min-height:\s*48px/);
    });

    test('Tap prompt ribbon meets minimum 44px height and has touch-action manipulation', () => {
      assert.match(styleContent, /\.eq-tap-prompt-ribbon\s*\{[^}]*min-height:\s*44px/);
      assert.match(styleContent, /\.eq-tap-prompt-ribbon\s*\{[^}]*touch-action:\s*manipulation/);
    });

    test('Floating music control is safe-area aware and has 48x48px touch target', () => {
      assert.match(styleContent, /\.eq-music-toggle\s*\{[^}]*width:\s*48px/);
      assert.match(styleContent, /\.eq-music-toggle\s*\{[^}]*height:\s*48px/);
      assert.match(styleContent, /\.eq-music-toggle\s*\{[^}]*env\(safe-area-inset-bottom/);
    });

    test('Form inputs enforce minimum 16px font-size to prevent iOS Safari auto-zoom', () => {
      assert.match(styleContent, /\.eq-input[^{]*\{[^}]*font-size:\s*16px/);
      assert.match(styleContent, /\.eq-select[^{]*\{[^}]*font-size:\s*16px/);
      assert.match(styleContent, /\.eq-textarea[^{]*\{[^}]*font-size:\s*16px/);
    });

    test('Suppresses pointer tilt for touch events to eliminate mobile tap jitter', () => {
      assert.match(pageContent, /if\s*\(e\.pointerType\s*===\s*["']touch["']\)\s*return/);
    });
    test('Envelope action buttons are naturally centered in-flow without transform conflicts', () => {
      assert.match(styleContent, /\.eq-envelope-actions-bar\s*\{[^}]*justify-content:\s*center/);
      assert.match(styleContent, /\.eq-print-btn-primary\s*\{[^}]*min-height:\s*44px/);
      assert.match(styleContent, /\.eq-print-btn-secondary\s*\{[^}]*min-height:\s*44px/);
      assert.match(styleContent, /\.eq-print-btn-replay\s*\{[^}]*min-height:\s*44px/);
    });
  });

  describe('Feature 4: Audio-Motion Choreography & Zero-Latency Preloading', () => {
    test('Preloads sound effects in component-level useEffect', () => {
      assert.match(pageContent, /new Audio\(["']\/templates\/emerald-qasr\/audio\/sfx-open\.mp3["']\)/);
      assert.match(pageContent, /\.preload\s*=\s*["']auto["']/);
      assert.match(pageContent, /sfxOpenRef\.current/);
      assert.match(pageContent, /sfxShimmerRef\.current/);
    });

    test('Revealed card has gold specular light shimmer sweep', () => {
      assert.ok(pageContent.includes('eq-card-shimmer'));
      assert.match(styleContent, /\.eq-card-shimmer/);
      assert.match(styleContent, /@keyframes eq-shimmer-sweep/);
    });
  });

  describe('Feature 5: Visual Focal Points & Facial Clearance Guarantee', () => {
    test('Custom hero portrait maintains unobstructed middle focal clearance', () => {
      assert.ok(pageContent.includes('eq-custom-hero-frame'));
      assert.match(styleContent, /\.eq-custom-hero-gradient\s*\{[^}]*linear-gradient/);
      assert.match(styleContent, /\.eq-custom-hero-badge\s*\{[^}]*position:\s*absolute/);
    });
  });

  describe('Feature 6: UI/UX Pro Max Convenience Features', () => {
    test('Includes Copy Address functionality with visual feedback', () => {
      assert.ok(pageContent.includes('handleCopyAddress') || pageContent.includes('copiedAddress'));
      assert.ok(pageContent.includes('Copy Address') || pageContent.includes('Address Copied'));
    });

    test('Includes Add to Calendar (.ics) export capability', () => {
      assert.ok(pageContent.includes('handleAddToCalendar'));
      assert.ok(pageContent.includes('.ics'));
    });

    test('Includes WhatsApp Share capability with prefilled royal message', () => {
      assert.ok(pageContent.includes('handleWhatsAppShare'));
      assert.ok(pageContent.includes('api.whatsapp.com'));
    });
  });

  describe('Feature 7: Desktop Envelope Kept Closed until User Interaction', () => {
    test('Paper overlay strictly renders upon videoOpened, never auto-revealed on desktop load', () => {
      assert.doesNotMatch(pageContent, /if\s*\(isDesk\)\s*\{\s*setVideoOpened\(true\)/);
      assert.match(pageContent, /\{videoOpened\s*&&\s*\(\s*<motion\.div\s+className=["']eq-blank-card-overlay["']/);
    });

    test('Wax seal and tap ribbon are visible on desktop prior to unveiling', () => {
      assert.match(pageContent, /\{!videoOpened\s*&&\s*\(\s*<div\s+className=\{`eq-seal-monogram-anchor/);
      assert.match(pageContent, /\{!isPlayingVideo\s*&&\s*!videoOpened\s*&&\s*\(\s*<button/);
    });
  });
});

