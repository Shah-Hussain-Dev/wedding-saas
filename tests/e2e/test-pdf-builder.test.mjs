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

test('pdf/data.js contains universal faith, 3D templates, 6 scenic templates, and ELEMENT_LIBRARY', () => {
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

  // Verify 6 Scenic Illustrated Templates (Matching user's reference)
  const scenicTemplates = [
    'scenic-veranda',
    'scenic-lotus-jharokha',
    'scenic-functions-vignette',
    'scenic-chhatri-grove',
    'scenic-rose-pavilion',
    'scenic-temple-bells',
  ];
  for (const s of scenicTemplates) {
    assert.ok(content.includes(s), `Scenic template ${s} must exist`);
  }

  // Verify ELEMENT_LIBRARY and categories
  assert.ok(content.includes('ELEMENT_LIBRARY ='), 'ELEMENT_LIBRARY must be exported');
  assert.ok(content.includes('bells-hanging-pair'), 'bells element must exist');
  assert.ok(content.includes('arch-mughal-crest'), 'arch element must exist');
  assert.ok(content.includes('flora-lotus-bloom'), 'flora lotus element must exist');
  assert.ok(content.includes('accent-royal-chhatri'), 'accent chhatri element must exist');
  assert.ok(content.includes('vignette-haldi-moment'), 'vignette haldi element must exist');

  // Verify Structure attributes (2-page or 3-page)
  assert.ok(content.includes('structure: "2-page"'), '2-page structure must exist');
  assert.ok(content.includes('structure: "3-page"'), '3-page structure must exist');
});

test('pdf/pages.jsx implements vector SVG renderers for scenic layouts, ElementRenderer, and Canva EditableText', () => {
  const pagesPath = path.join(projectRoot, 'pdf', 'pages.jsx');
  const content = fs.readFileSync(pagesPath, 'utf8');

  // Verify scenic layout renderers in pages.jsx
  assert.ok(content.includes('layout === "scenicVeranda"'), 'scenicVeranda layout renderer must exist');
  assert.ok(content.includes('layout === "lotusJharokha"'), 'lotusJharokha layout renderer must exist');
  assert.ok(content.includes('layout === "functionVignettes"'), 'functionVignettes layout renderer must exist');
  assert.ok(content.includes('layout === "chhatriGrove"'), 'chhatriGrove layout renderer must exist');
  assert.ok(content.includes('layout === "rosePavilion"'), 'rosePavilion layout renderer must exist');
  assert.ok(content.includes('layout === "templeBells"'), 'templeBells layout renderer must exist');

  // Verify Canva In-Place Editing Components
  assert.ok(content.includes('export function EditableText'), 'EditableText component must exist');
  assert.ok(content.includes('export function CanvasElementsLayer'), 'CanvasElementsLayer component must exist');
  assert.ok(content.includes('export function ElementRenderer'), 'ElementRenderer component must exist');

  // Verify max 3 page cap in visiblePages
  assert.ok(content.includes('.slice(0, 3)'), 'visiblePages must enforce max 3 page limit');

  // Verify RSVP is removed
  assert.ok(!content.includes('RSVP kindly requested'), 'RSVP text must be removed from pages');

  // Verify Google Maps Hyperlink Button
  assert.ok(content.includes('wib-map-link-btn'), 'wib-map-link-btn must exist in pages.jsx');
  assert.ok(content.includes('Open in Google Maps'), 'Open in Google Maps button text must exist');

  // Verify pointer capture exclusion for delete button
  assert.ok(content.includes('e.target.closest(".wib-el-action") || e.target.closest(".wib-el-delete")'), 'Delete action must avoid pointer capture conflict');
});

test('pdf/styles.js contains print stylesheet, Canva selection styles, map button, and page spacing', () => {
  const stylesPath = path.join(projectRoot, 'pdf', 'styles.js');
  const content = fs.readFileSync(stylesPath, 'utf8');

  assert.ok(content.includes('@page{size:148mm 210mm;margin:0}'), 'Must specify exact A5 dimensions (148mm 210mm)');
  assert.ok(content.includes('.wib-print-root'), 'Must include .wib-print-root for print isolation');
  assert.ok(content.includes('scrollbar-gutter:stable'), 'Must include scrollbar-gutter for stable stage scrolling');
  assert.ok(content.includes('.wib-editable'), 'Must include .wib-editable styling for hover feedback');
  assert.ok(content.includes('.wib-selected-text'), 'Must include .wib-selected-text styling for Canva active selection');
  assert.ok(content.includes('.wib-floating-toolbar'), 'Must include .wib-floating-toolbar styling');
  assert.ok(content.includes('.wib-elements-layer'), 'Must include .wib-elements-layer styling');
  assert.ok(content.includes('.wib-element-item'), 'Must include .wib-element-item styling');
  assert.ok(content.includes('.wibu-page-container'), 'Must include .wibu-page-container for page spacing');
  assert.ok(content.includes('.wibu-page-badge'), 'Must include .wibu-page-badge for page identification');
  assert.ok(content.includes('.wib-map-link-btn'), 'Must include .wib-map-link-btn styling');
  assert.ok(content.includes('.wibu-mob-bottombar'), 'Must include .wibu-mob-bottombar for mobile ergonomic navigation');
  assert.ok(content.includes('font-size:16px!important'), 'Must enforce 16px font on inputs to prevent iOS auto-zoom');
});

test('pdf/WeddingInvitationBuilder.jsx has Canva editing, mobile bottom bar, page containers, and zoom controls', () => {
  const builderPath = path.join(projectRoot, 'pdf', 'WeddingInvitationBuilder.jsx');
  const content = fs.readFileSync(builderPath, 'utf8');

  assert.ok(content.includes('createPortal'), 'Must use createPortal for print output');
  assert.ok(content.includes('zoomMultiplier'), 'Must provide zoomMultiplier state for user zooming');
  assert.ok(content.includes('Stickers & 3D'), 'Must provide Stickers & 3D tab');
  assert.ok(content.includes('handleAddElement'), 'Must provide handleAddElement function');
  assert.ok(content.includes('handleUpdateElement'), 'Must provide handleUpdateElement function');
  assert.ok(content.includes('handleRemoveElement'), 'Must provide handleRemoveElement function');
  assert.ok(content.includes('wib-floating-toolbar'), 'Must provide floating format bar in preview');
  assert.ok(content.includes('wibu-page-container'), 'Must render wibu-page-container');
  assert.ok(content.includes('wibu-page-badge'), 'Must render wibu-page-badge');
  assert.ok(content.includes('wibu-mob-bottombar'), 'Must render mobile bottom navigation bar in thumb zone');
  assert.ok(content.includes('wibu-mob-cta-btn'), 'Must render primary Save PDF CTA button in bottom bar');
  assert.ok(!content.includes('window.confirm'), 'window.confirm alert must be removed');
});
