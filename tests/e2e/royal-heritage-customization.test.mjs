import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Royal Heritage - Education Removal, Cultural Blessing & Customizer Faith Selection', async (t) => {
  const dataPath = path.resolve(process.cwd(), 'templates/royal-heritage/data.json');
  const pagePath = path.resolve(process.cwd(), 'templates/royal-heritage/page.tsx');
  const wizardPath = path.resolve(process.cwd(), 'components/customizer/InvitationCustomizerWizard.tsx');

  const dataJson = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const pageSource = fs.readFileSync(pagePath, 'utf-8');
  const wizardSource = fs.readFileSync(wizardPath, 'utf-8');

  await t.test('1. Education & Profession fields are removed from royal-heritage data.json couple object', () => {
    assert.equal(dataJson.couple.groomEducation, undefined, 'groomEducation should not exist in data.json');
    assert.equal(dataJson.couple.groomProfession, undefined, 'groomProfession should not exist in data.json');
    assert.equal(dataJson.couple.brideEducation, undefined, 'brideEducation should not exist in data.json');
    assert.equal(dataJson.couple.brideProfession, undefined, 'brideProfession should not exist in data.json');
  });

  await t.test('2. Education & Profession blocks are removed from all UI scenes in royal-heritage page.tsx', () => {
    assert.ok(!pageSource.includes('groomEducation'), 'page.tsx must not reference groomEducation');
    assert.ok(!pageSource.includes('groomProfession'), 'page.tsx must not reference groomProfession');
    assert.ok(!pageSource.includes('brideEducation'), 'page.tsx must not reference brideEducation');
    assert.ok(!pageSource.includes('brideProfession'), 'page.tsx must not reference brideProfession');
    assert.ok(!pageSource.includes('IIT Madras'), 'page.tsx must not have hardcoded IIT Madras');
    assert.ok(!pageSource.includes('Carnegie Mellon'), 'page.tsx must not have hardcoded Carnegie Mellon');
    assert.ok(!pageSource.includes('AIIMS New Delhi'), 'page.tsx must not have hardcoded AIIMS New Delhi');
  });

  await t.test('3. Muslim cultural blessing phrasing is supported in royal-heritage page.tsx based on faith', () => {
    assert.ok(
      pageSource.includes('Aap ki shirkat aur duaayein hamare liye baais-e-musarrat hongi.'),
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

  await t.test('4. Customizer wizard provides interactive Faith & Cultural Tradition selector', () => {
    assert.ok(
      wizardSource.includes('Select Faith &amp; Cultural Tradition *'),
      'Wizard must have Select Faith & Cultural Tradition heading'
    );
    assert.ok(
      wizardSource.includes('Muslim Tradition'),
      'Wizard must feature Muslim Tradition option'
    );
    assert.ok(
      wizardSource.includes('Hindu Tradition'),
      'Wizard must feature Hindu Tradition option'
    );
    assert.ok(
      wizardSource.includes('Universal & Contemporary'),
      'Wizard must feature Universal option'
    );
    assert.ok(
      wizardSource.includes('Parents & Family Blessings (Walidain)'),
      'Wizard must adapt parents label for Muslim faith'
    );
  });
});
