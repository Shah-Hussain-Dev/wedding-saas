import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Crimson Royale Gate Reveal & Privacy Invariants', () => {
  const templatePath = path.resolve(process.cwd(), 'templates/crimson-royale/page.tsx');
  const stylePath = path.resolve(process.cwd(), 'templates/crimson-royale/style.css');

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const styleContent = fs.readFileSync(stylePath, 'utf8');

  it('Gate overlay center does NOT render couple names before gates open', () => {
    // Extract gate__center markup
    const gateCenterMatch = templateContent.match(/<div className="gate__center">([\s\S]*?)<\/div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/);
    assert.ok(gateCenterMatch, 'Gate center element must exist in template');
    const gateCenter = gateCenterMatch[1];

    // Ensure couple names and invitation wording are not in gate center
    assert.ok(!gateCenter.includes('{brideName}'), 'Gate center must not expose brideName before gates open');
    assert.ok(!gateCenter.includes('{groomName}'), 'Gate center must not expose groomName before gates open');
    assert.ok(!gateCenter.includes('Cordially invite you to celebrate our union'), 'Gate center must not expose invitation body text before opening');
    assert.ok(!gateCenter.includes('{formattedDate}'), 'Gate center must not expose wedding date text before opening');
  });

  it('Gate overlay displays royal entrance title and 24K gold wax seal button', () => {
    const gateCenterMatch = templateContent.match(/<div className="gate__center">([\s\S]*?)<\/div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/);
    assert.ok(gateCenterMatch);
    const gateCenter = gateCenterMatch[1];

    assert.ok(gateCenter.includes('SHUBH VIVAH') || gateCenter.includes('ROYAL WEDDING INVITATION'), 'Gate center must show auspicious royal title');
    assert.ok(gateCenter.includes('gate__seal-btn'), 'Gate must have wax seal button');
    assert.ok(gateCenter.includes('TAP TO OPEN'), 'Gate button must show TAP TO OPEN interaction pill');
    assert.ok(gateCenter.includes('gate__seal-svg'), 'Gate seal must include high-fidelity vector seal SVG');
  });

  it('Main content container is hidden when gates are shut to prevent peeking', () => {
    // Assert <main> has display: none / visibility: hidden when !isOpen && !isOpening
    const mainMatch = templateContent.match(/<main\s+style=\{\{([\s\S]*?)\}\}>/);
    assert.ok(mainMatch, '<main> must have dynamic inline style protecting visibility');
    const mainStyle = mainMatch[1];

    assert.ok(mainStyle.includes('display: isOpen || isOpening ? "block" : "none"'), '<main> must set display: none when gates are closed');
    assert.ok(mainStyle.includes('visibility: isOpen || isOpening ? "visible" : "hidden"'), '<main> must set visibility: hidden when closed');
    assert.ok(mainStyle.includes('opacity: isOpen ? 1 : 0'), '<main> must smoothly fade opacity upon opening');
  });

  it('Enforces document and body scroll locking while gates are shut', () => {
    assert.ok(templateContent.includes('document.documentElement.classList.add("is-shut")'), 'Must add is-shut to documentElement');
    assert.ok(templateContent.includes('document.body.classList.add("is-shut")'), 'Must add is-shut to body');
    assert.ok(templateContent.includes('document.documentElement.style.overflow = "hidden"'), 'Must lock documentElement overflow');
    assert.ok(templateContent.includes('document.body.style.overflow = "hidden"'), 'Must lock body overflow');

    // Clean up on open/unmount
    assert.ok(templateContent.includes('document.documentElement.classList.remove("is-shut")'), 'Must remove is-shut on open');
    assert.ok(templateContent.includes('document.body.style.overflow = ""'), 'Must restore overflow on open');
  });

  it('CSS defines strict scroll lock rules for html.is-shut, body.is-shut and root container', () => {
    assert.ok(styleContent.includes('html.is-shut'), 'CSS must define html.is-shut');
    assert.ok(styleContent.includes('body.is-shut'), 'CSS must define body.is-shut');
    assert.ok(styleContent.includes('.tmpl-crimson-royale.is-shut'), 'CSS must define .tmpl-crimson-royale.is-shut');
    assert.ok(styleContent.includes('overflow: hidden !important'), 'CSS must apply overflow: hidden !important');
  });
});
