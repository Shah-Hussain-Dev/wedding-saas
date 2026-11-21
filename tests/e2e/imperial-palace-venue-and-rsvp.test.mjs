import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Imperial Palace - Venue name truncation, time fallback, and commented RSVP section', async (t) => {
  const imperialPalacePath = path.resolve('templates/imperial-palace/page.tsx');
  assert.ok(fs.existsSync(imperialPalacePath), 'imperial-palace page.tsx exists');
  const content = fs.readFileSync(imperialPalacePath, 'utf-8');

  await t.test('Venue name is not truncated by split("&")', () => {
    // Neither Hero pill nor Scratch card should split venueName by "&"
    assert.strictEqual(
      content.includes('venueName.split("&")'),
      false,
      'Should not truncate venue name with split("&")'
    );
    assert.strictEqual(
      content.includes('venueName.split(\'&\')'),
      false,
      'Should not truncate venue name with split(\'&\')'
    );
  });

  await t.test('effectiveWeddingTime cleanly handles blank/empty time without dummy fallback', () => {
    assert.ok(
      content.includes('effectiveWeddingTime'),
      'effectiveWeddingTime helper should be defined'
    );
    // Scratch card prop weddingTime should be optional and conditionally rendered
    assert.ok(
      content.includes('weddingTime?: string;'),
      'RoyalScratchRevealCard should accept optional weddingTime'
    );
  });

  await t.test('Events chamber only renders clock badge when time is provided', () => {
    assert.ok(
      content.includes('events[selectedChamberIdx]?.time ?'),
      'Chamber events should conditionally render time badge and time string'
    );
  });

  await t.test('RSVP Sign Royal Guestbook section is commented out', () => {
    // Check that Sign Royal Guestbook is inside a comment block
    const isCommented = /\{\/\*[\s\S]*?Sign Royal Guestbook[\s\S]*?\*\/\}/.test(content);
    assert.ok(isCommented, 'Sign Royal Guestbook section should be commented out');
  });
});
