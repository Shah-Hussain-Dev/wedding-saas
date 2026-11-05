import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Noor-e-Nikah 3D Luxury Envelope Physics & Mobile-First Standards', () => {
  const pagePath = path.resolve('templates/noor-e-nikah/page.tsx');
  const stylePath = path.resolve('templates/noor-e-nikah/style.css');
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  const styleContent = fs.readFileSync(stylePath, 'utf8');

  describe('Feature 1: 3D Spatial Geometry & Preserve-3D Hierarchy', () => {
    test('Envelope scene defines 3D perspective and preserve-3d', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-envelope-scene\s*\{[^}]*perspective:\s*1400px/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-envelope-scene\s*\{[^}]*transform-style:\s*preserve-3d/);
    });

    test('Envelope case maintains preserve-3d to prevent 2D layer flattening', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-env-case\s*\{[^}]*transform-style:\s*preserve-3d/);
    });

    test('Envelope case lowers gracefully on card rise for mobile optical centering', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-envelope-scene\.is-card-up \.noor-env-case\s*\{[^}]*transform:\s*translateY\(38px\)\s*scale\(0\.96\)/
      );
    });

    test('Front pocket establishes forward Z-plane in front of card', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-env-front-pocket\s*\{[^}]*transform:\s*translateZ\(14px\)/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-env-front-pocket\s*\{[^}]*z-index:\s*10/);
    });
  });

  describe('Feature 2: 3D Flap Hinge & Seal Arc Unfolding', () => {
    test('Top flap hinges at top center with 3D preserve-3d', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-env-flap-top\s*\{[^}]*transform-origin:\s*top center/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-env-flap-top\s*\{[^}]*transform-style:\s*preserve-3d/);
    });

    test('Top flap flips backward 180 degrees into negative Z space', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-envelope-scene\.is-flap-open \.noor-env-flap-top\s*\{[^}]*transform:\s*translateZ\(-2px\)\s*rotateX\(180deg\)/
      );
    });

    test('Flap transition smoothly coordinates z-index swap at 90-degree apex', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-env-flap-top\s*\{[^}]*transition:[^}]*z-index\s*0s\s*linear\s*0\.6s/
      );
    });

    test('Wax seal anchor is mounted inside front flap facet at the apex tip', () => {
      assert.ok(
        pageContent.includes('<div className="noor-flap-top-front">') &&
        pageContent.includes('<div className="noor-wax-seal-anchor">')
      );
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-flap-top-front \.noor-wax-seal-anchor\s*\{[^}]*top:\s*94\.3%/
      );
    });
  });

  describe('Feature 3: Tactile Wax Seal Fracture & Glow Physics', () => {
    test('Wax seal has cracked state indicator and jolt recoil keyframes', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-wax-seal-body\.is-cracked\s*\{[^}]*animation:\s*sealBreakJolt/);
      assert.match(styleContent, /@keyframes sealBreakJolt/);
    });

    test('Fracture line illuminates with golden crack glow', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-seal-crack-glow/);
      assert.match(styleContent, /@keyframes crackFlash/);
    });

    test('Front pocket retains gilded wax seal imprint', () => {
      assert.ok(pageContent.includes('noor-pocket-seal-imprint'));
    });
  });

  describe('Feature 4: Card Slide Emergence & Specular Shimmer', () => {
    test('Inner card insert slides up by 50% into forward 3D tilt with depth shadow on mobile', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-envelope-scene\.is-card-up \.noor-env-card-insert\s*\{[^}]*transform:\s*translateY\(-50%\)\s*translateZ\(42px\)\s*rotateX\(-2deg\)\s*scale\(1\.03\)/
      );
    });

    test('Card insert elevates further to -58% on larger screens with min-height', () => {
      assert.match(
        styleContent,
        /@media\s*\(min-width:\s*768px\)\s*and\s*\(min-height:\s*750px\)\s*\{[^}]*\.tmpl-noor-nikah \.noor-envelope-scene\.is-card-up \.noor-env-card-insert\s*\{[^}]*transform:\s*translateY\(-58%\)/
      );
    });

    test('Specular gold shimmer sweeps across card face upon slide-up', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-card-shimmer/);
      assert.match(styleContent, /@keyframes cardShimmerSweep/);
      assert.ok(pageContent.includes('noor-card-shimmer'));
    });

    test('Card content displays couple names, bismillah, date, venue, and verse', () => {
      assert.ok(pageContent.includes('noor-card-couple-names'));
      assert.ok(pageContent.includes('noor-card-date'));
      assert.ok(pageContent.includes('noor-card-venue'));
      assert.ok(pageContent.includes('noor-card-quran-verse'));
    });
  });

  describe('Feature 5: Mobile App Design Standards & Touch Ergonomics', () => {
    test('Suppresses pointer tilt for touch events to eliminate mobile tap jitter', () => {
      assert.ok(pageContent.includes('if (e.pointerType === "touch") return;'));
    });

    test('Wax seal and tap pill have touch-action manipulation for fast tap response', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-envelope-scene\s*\{[^}]*touch-action:\s*manipulation/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-wax-seal-body\s*\{[^}]*touch-action:\s*manipulation/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-tap-pill\s*\{[^}]*touch-action:\s*manipulation/);
    });

    test('Tap pill meets minimum 44px mobile touch target', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-tap-pill\s*\{[^}]*min-height:\s*44px/);
    });

    test('Floating music control is safe-area aware and has 48x48px touch target', () => {
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-music-toggle\s*\{[^}]*env\(safe-area-inset-bottom/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-music-toggle\s*\{[^}]*min-width:\s*48px/);
      assert.match(styleContent, /\.tmpl-noor-nikah \.noor-music-toggle\s*\{[^}]*min-height:\s*48px/);
    });

    test('Form inputs have minimum 16px font-size to prevent iOS Safari auto-zoom', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-form-input,\s*\.tmpl-noor-nikah \.noor-form-select,\s*\.tmpl-noor-nikah \.noor-form-textarea\s*\{[^}]*font-size:\s*16px/
      );
    });

    test('Envelope scene limits max-height on short viewports to prevent screen clipping', () => {
      assert.match(
        styleContent,
        /\.tmpl-noor-nikah \.noor-envelope-scene\s*\{[^}]*max-height:\s*calc\(100dvh\s*-\s*145px\)/
      );
    });
  });

  describe('Feature 6: Multi-Phase Audio Preloading & SFX Choreography', () => {
    test('Preloads crack, letter slide, and shimmer sound effects', () => {
      assert.ok(fs.existsSync(path.resolve('public/templates/noor-e-nikah/audio/sfx-open.mp3')));
      assert.ok(fs.existsSync(path.resolve('public/templates/noor-e-nikah/audio/sfx-letter.mp3')));
      assert.ok(fs.existsSync(path.resolve('public/templates/noor-e-nikah/audio/sfx-shimmer.mp3')));
    });

    test('Component maintains audio refs and triggers paper rustle and chime on card rise', () => {
      assert.ok(pageContent.includes('sfxOpenRef'));
      assert.ok(pageContent.includes('sfxLetterRef'));
      assert.ok(pageContent.includes('sfxShimmerRef'));
    });

    test('Opening sequence progresses through all physical phases', () => {
      assert.ok(pageContent.includes('setIsLighting(true)'));
      assert.ok(pageContent.includes('setIsCracked(true)'));
      assert.ok(pageContent.includes('setIsFlapOpen(true)'));
      assert.ok(pageContent.includes('setIsCardUp(true)'));
      assert.ok(pageContent.includes('setIsOpening(true)'));
      assert.ok(pageContent.includes('setIsOpen(true)'));
    });
  });
});
