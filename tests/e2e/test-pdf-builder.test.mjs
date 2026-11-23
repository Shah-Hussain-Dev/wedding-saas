import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('Test PDF Builder page exists and imports WeddingInvitationBuilder', () => {
  const pagePath = path.join(projectRoot, 'app', 'test-pdf-builder', 'page.tsx');
  assert.ok(fs.existsSync(pagePath), 'app/test-pdf-builder/page.tsx must exist');

  const content = fs.readFileSync(pagePath, 'utf8');
  assert.ok(content.includes('WeddingInvitationBuilder'), 'Must import and render WeddingInvitationBuilder');
  assert.ok(content.includes('Back to Admin'), 'Must have back navigation');
  assert.ok(content.includes('Save as PDF'), 'Must mention Save as PDF tips');
});

test('PDF module structure and core assets exist', () => {
  const files = [
    'pdf/WeddingInvitationBuilder.jsx',
    'pdf/pages.jsx',
    'pdf/data.js',
    'pdf/styles.js',
  ];

  for (const f of files) {
    const fullPath = path.join(projectRoot, f);
    assert.ok(fs.existsSync(fullPath), `${f} must exist`);
  }
});

test('pdf/data.js contains universal faith, 3D templates, and 2-3 page limits without RSVP', () => {
  const dataPath = path.join(projectRoot, 'pdf', 'data.js');
  const content = fs.readFileSync(dataPath, 'utf8');

  // Verify Faiths (including universal)
  assert.ok(content.includes('FAITHS ='), 'FAITHS must be defined');
  assert.ok(content.includes('universal:'), 'universal faith must be defined');
  assert.ok(content.includes('hindu:'), 'hindu faith must be defined');
  assert.ok(content.includes('muslim:'), 'muslim faith must be defined');
  assert.ok(content.includes('christian:'), 'christian faith must be defined');
  assert.ok(content.includes('sikh:'), 'sikh faith must be defined');
  assert.ok(content.includes('interfaith:'), 'interfaith faith must be defined');

  // Verify RSVP has been removed
  assert.ok(!content.includes('rsvpDeadline'), 'rsvpDeadline must be removed from data');
  assert.ok(!content.includes('rsvpContact'), 'rsvpContact must be removed from data');

  // Verify 7 3D Templates matching project themes
  const signature3dTemplates = [
    'sheesh-mahal-3d',
    'royal-majesty-3d',
    'royal-lotus-3d',
    'royal-heritage-3d',
    'royal-grace-3d',
    'royal-elegance-3d',
    'rose-gold-blush-3d',
  ];
  for (const t of signature3dTemplates) {
    assert.ok(content.includes(t), `3D template ${t} must exist`);
  }

  // Verify Universal & Multi-Faith Templates
  assert.ok(content.includes('art-deco-grandeur'), 'art-deco-grandeur template must exist');
  assert.ok(content.includes('tuscan-botanical'), 'tuscan-botanical template must exist');
  assert.ok(content.includes('celestial-starlight'), 'celestial-starlight template must exist');
  assert.ok(content.includes('minimalist-editorial'), 'minimalist-editorial template must exist');
  assert.ok(content.includes('ALL_FAITHS'), 'ALL_FAITHS constant must exist ensuring all religions can use universal templates');

  // Verify Structure attributes (2-page or 3-page)
  assert.ok(content.includes('structure: "2-page"'), '2-page structure must exist');
  assert.ok(content.includes('structure: "3-page"'), '3-page structure must exist');

  // Verify 3D Architectural Layouts
  const expectedLayouts = [
    'sheeshMirror',
    'lotusTemple',
    'majestyBezel',
    'heritageSandstone',
    'graceMehndi',
    'crimsonGoldCrest',
    'twilightRose',
  ];
  for (const l of expectedLayouts) {
    assert.ok(content.includes(`${l}:`), `3D Layout ${l} must exist in LAYOUTS`);
  }

  // Verify 3D Matching Themes
  const expectedThemes = [
    'sheeshMahal',
    'royalMajesty',
    'royalLotus',
    'royalHeritage',
    'royalGrace',
    'royalElegance',
    'roseGoldBlush',
  ];
  for (const th of expectedThemes) {
    assert.ok(content.includes(`${th}:`), `Theme ${th} must exist in THEMES`);
  }
});

test('pdf/pages.jsx implements vector SVG renderers for 3D layouts, combined page, and max 3 page limit', () => {
  const pagesPath = path.join(projectRoot, 'pdf', 'pages.jsx');
  const content = fs.readFileSync(pagesPath, 'utf8');

  // Verify 3D layout renderers in pages.jsx
  assert.ok(content.includes('layout === "sheeshMirror"'), 'sheeshMirror layout renderer must exist');
  assert.ok(content.includes('layout === "lotusTemple"'), 'lotusTemple layout renderer must exist');
  assert.ok(content.includes('layout === "majestyBezel"'), 'majestyBezel layout renderer must exist');
  assert.ok(content.includes('layout === "heritageSandstone"'), 'heritageSandstone layout renderer must exist');
  assert.ok(content.includes('layout === "graceMehndi"'), 'graceMehndi layout renderer must exist');
  assert.ok(content.includes('layout === "crimsonGoldCrest"'), 'crimsonGoldCrest layout renderer must exist');
  assert.ok(content.includes('layout === "twilightRose"'), 'twilightRose layout renderer must exist');

  // Verify combined 2-page component
  assert.ok(content.includes('CombinedCelebrationPage'), 'CombinedCelebrationPage must exist for 2-page cards');

  // Verify max 3 page cap in visiblePages
  assert.ok(content.includes('.slice(0, 3)'), 'visiblePages must enforce max 3 page limit');

  // Verify RSVP is removed
  assert.ok(!content.includes('RSVP kindly requested'), 'RSVP text must be removed from pages');
});

test('pdf/styles.js contains print stylesheet with A5 size, luxury scrollbar, and 3D depth', () => {
  const stylesPath = path.join(projectRoot, 'pdf', 'styles.js');
  const content = fs.readFileSync(stylesPath, 'utf8');

  assert.ok(content.includes('@page{size:148mm 210mm;margin:0}'), 'Must specify exact A5 dimensions (148mm 210mm)');
  assert.ok(content.includes('.wib-print-root'), 'Must include .wib-print-root for print isolation');
  assert.ok(content.includes('scrollbar-gutter:stable'), 'Must include scrollbar-gutter for stable stage scrolling');
  assert.ok(content.includes('.wibu-main::-webkit-scrollbar'), 'Must style stage scrollbar');
  assert.ok(content.includes('wibu-zoom-tools'), 'Must include zoom tools styling');
});

test('pdf/WeddingInvitationBuilder.jsx has zoom controls, 2-3 page badge, and no confirm alert', () => {
  const builderPath = path.join(projectRoot, 'pdf', 'WeddingInvitationBuilder.jsx');
  const content = fs.readFileSync(builderPath, 'utf8');

  assert.ok(content.includes('createPortal'), 'Must use createPortal for print output');
  assert.ok(content.includes('zoomMultiplier'), 'Must provide zoomMultiplier state for user zooming');
  assert.ok(content.includes('2-Page Keepsake'), 'Must provide 2-Page Keepsake option');
  assert.ok(content.includes('3-Page Heritage Suite'), 'Must provide 3-Page Heritage Suite option');
  assert.ok(!content.includes('window.confirm'), 'window.confirm alert must be removed');
  assert.ok(!content.includes('RSVP Details'), 'RSVP Details section must be removed from editor');
});
