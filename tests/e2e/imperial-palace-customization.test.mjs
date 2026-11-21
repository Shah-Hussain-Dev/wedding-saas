import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Imperial Palace - Education Removal & Cultural Blessing Wording', async (t) => {
  const dataPath = path.resolve(process.cwd(), 'templates/imperial-palace/data.json');
  const pagePath = path.resolve(process.cwd(), 'templates/imperial-palace/page.tsx');

  const dataJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const pageSource = fs.readFileSync(pagePath, 'utf-8');

  await t.test('1. Education & Profession fields are removed from data.json couple object', () => {
    assert.equal(dataJson.couple.groomEducation, undefined, 'groomEducation should not exist in data.json');
    assert.equal(dataJson.couple.groomProfession, undefined, 'groomProfession should not exist in data.json');
    assert.equal(dataJson.couple.brideEducation, undefined, 'brideEducation should not exist in data.json');
    assert.equal(dataJson.couple.brideProfession, undefined, 'brideProfession should not exist in data.json');
  });

  await t.test('2. Education & Profession blocks are removed from all UI scenes in page.tsx', () => {
    assert.ok(!pageSource.includes('groomEducation'), 'page.tsx must not reference groomEducation');
    assert.ok(!pageSource.includes('groomProfession'), 'page.tsx must not reference groomProfession');
    assert.ok(!pageSource.includes('brideEducation'), 'page.tsx must not reference brideEducation');
    assert.ok(!pageSource.includes('brideProfession'), 'page.tsx must not reference brideProfession');
    assert.ok(!pageSource.includes('IIT Bombay'), 'page.tsx must not have hardcoded IIT Bombay');
    assert.ok(!pageSource.includes('Wharton'), 'page.tsx must not have hardcoded Wharton');
    assert.ok(!pageSource.includes('Oxford'), 'page.tsx must not have hardcoded Oxford');
  });

  await t.test('3. Muslim cultural blessing phrasing is supported in page.tsx', () => {
    assert.ok(
      pageSource.includes('Aap ki shirkat aur duaayein hamari khushiyon ko dobala karengi.'),
      'page.tsx must include Muslim blessing phrase for Muslim invitations'
    );
    assert.ok(
      pageSource.includes('Aapki upasthiti aur aashirwad hamari khushiyon ko dobala karega.'),
      'page.tsx must preserve Hindu blessing phrase for Hindu invitations'
    );
    assert.ok(
      pageSource.includes('isMuslimTradition'),
      'page.tsx must dynamically evaluate isMuslimTradition'
    );
  });
});
