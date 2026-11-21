import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Admin Template Customizer - Ceremony Deletion & Detailed Field Labels', async (t) => {
  const editorPath = path.resolve('components/admin/TemplateAdminEditor.tsx');
  assert.ok(fs.existsSync(editorPath), 'TemplateAdminEditor.tsx exists');
  const content = fs.readFileSync(editorPath, 'utf-8');

  await t.test('Imports Trash icon from @phosphor-icons/react', () => {
    assert.match(
      content,
      /import\s*\{[^}]*Trash[^}]*\}\s*from\s*["']@phosphor-icons\/react["']/,
      'Trash icon should be imported'
    );
  });

  await t.test('Implements Delete Ceremony button with filtering logic and touch area', () => {
    assert.ok(
      content.includes('events.filter((_, i) => i !== idx)'),
      'Clicking delete should filter out the target ceremony by index'
    );
    assert.ok(
      content.includes('min-h-[44px] min-w-[44px]'),
      'Delete ceremony button must meet minimum 44x44px touch target ergonomics'
    );
    assert.ok(
      content.includes('title="Delete ceremony"'),
      'Delete ceremony button must have title="Delete ceremony"'
    );
  });

  await t.test('Renders explicit labels and placeholders for Event Name, Venue, Date, and Time', () => {
    assert.ok(content.includes('Event Name'), 'Should display Event Name label');
    assert.ok(content.includes('Venue / Lawn'), 'Should display Venue / Lawn label');
    assert.ok(content.includes('Date'), 'Should display Date label');
    assert.ok(content.includes('Time'), 'Should display Time label');

    assert.ok(
      content.includes('placeholder="e.g. Tel Poojan / Haldi, Sangeet, Shubh Vivah"'),
      'Should display helpful Event Name placeholder'
    );
    assert.ok(
      content.includes('placeholder="e.g. Royal Palace Lawn, Banquet Hall"'),
      'Should display helpful Venue placeholder'
    );
  });

  await t.test('Provides empty state message when no ceremonies exist', () => {
    assert.ok(
      content.includes('No ceremonies added yet'),
      'Should show informative empty state when ceremonies list is empty'
    );
  });
});
