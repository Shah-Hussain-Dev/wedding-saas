import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Dynamic Parents Names Customization & Template Synchronization', () => {
  const wizardPath = path.resolve('components/customizer/InvitationCustomizerWizard.tsx');
  const editPagePath = path.resolve('app/dashboard/invitation/[id]/edit/page.tsx');
  const interactivePath = path.resolve('app/preview/[templateId]/interactive/page.tsx');
  const faithPath = path.resolve('lib/preview-faith-content.ts');
  const lotusPagePath = path.resolve('templates/royal-lotus/page.tsx');
  const lotusDataPath = path.resolve('templates/royal-lotus/data.json');
  const apiRoutePath = path.resolve('app/api/invitations/route.ts');
  const apiIdRoutePath = path.resolve('app/api/invitations/[id]/route.ts');

  const wizardContent = fs.readFileSync(wizardPath, 'utf8');
  const editPageContent = fs.readFileSync(editPagePath, 'utf8');
  const interactiveContent = fs.readFileSync(interactivePath, 'utf8');
  const faithContent = fs.readFileSync(faithPath, 'utf8');
  const lotusPageContent = fs.readFileSync(lotusPagePath, 'utf8');
  const lotusData = JSON.parse(fs.readFileSync(lotusDataPath, 'utf8'));
  const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');
  const apiIdRouteContent = fs.readFileSync(apiIdRoutePath, 'utf8');

  test('Feature 1: InvitationCustomizerWizard provides dynamic inputs for bride & groom parents', () => {
    assert.match(
      wizardContent,
      /const \[brideParents, setBrideParents\] = useState/s,
      'Wizard must declare brideParents state'
    );
    assert.match(
      wizardContent,
      /const \[groomParents, setGroomParents\] = useState/s,
      'Wizard must declare groomParents state'
    );
    assert.match(
      wizardContent,
      /Bride&apos;s Parents \(Mataji &amp; Pitaji\)/s,
      'Wizard must render clear label for Bride Parents'
    );
    assert.match(
      wizardContent,
      /Groom&apos;s Parents \(Mataji &amp; Pitaji\)/s,
      'Wizard must render clear label for Groom Parents'
    );
    assert.match(
      wizardContent,
      /placeholder="e\.g\. Swargiya Bindu Agrahari & Shri Vinay Agrahari"/s,
      'Wizard input must have culturally respectful placeholder'
    );
  });

  test('Feature 2: InvitationCustomizerWizard syncs parents into buildDraftPayload and handleSaveInvitationInternal', () => {
    assert.ok(
      wizardContent.includes('brideParents: brideParents.trim()'),
      'Draft payload must include brideParents'
    );
    assert.ok(
      wizardContent.includes('groomParents: groomParents.trim()'),
      'Draft payload must include groomParents'
    );
    assert.match(
      wizardContent,
      /couple:\s*\{[^}]*brideParents:\s*brideParents\.trim\(\)[^}]*groomParents:\s*groomParents\.trim\(\)/s,
      'Draft payload must also map into couple object for legacy templates'
    );
    assert.ok(
      wizardContent.includes('translations: {') &&
      wizardContent.includes('brideParents: brideParents.trim(),') &&
      wizardContent.includes('groomParents: groomParents.trim(),'),
      'handleSaveInvitationInternal must persist parents into translations JSON'
    );
  });

  test('Feature 3: Section 5 Review & Save card displays configured parents names', () => {
    assert.match(
      wizardContent,
      /Parents &amp; Blessings/s,
      'Section 5 summary cards must include Parents & Blessings'
    );
    assert.match(
      wizardContent,
      /Bride&apos;s Parents:/s,
      'Summary card must display Bride Parents'
    );
    assert.match(
      wizardContent,
      /Groom&apos;s Parents:/s,
      'Summary card must display Groom Parents'
    );
  });

  test('Feature 4: Edit Page defaults Pawan & Gargi Agrahari parents correctly', () => {
    assert.match(
      editPageContent,
      /Swargiya Bindu Agrahari & Shri Vinay Agrahari/s,
      'Edit page must supply Swargiya Bindu Agrahari & Shri Vinay Agrahari'
    );
    assert.match(
      editPageContent,
      /Smt\. Vimla Devi & Shri Mahendra Agrahari/s,
      'Edit page must supply Smt. Vimla Devi & Shri Mahendra Agrahari'
    );
  });

  test('Feature 5: Royal Lotus template default and data.json reflect updated parents', () => {
    assert.equal(
      lotusData.couple.brideParents,
      'Swargiya Bindu Agrahari & Shri Vinay Agrahari',
      'royal-lotus data.json couple.brideParents must be updated'
    );
    assert.equal(
      lotusData.couple.groomParents,
      'Smt. Vimla Devi & Shri Mahendra Agrahari',
      'royal-lotus data.json couple.groomParents must be updated'
    );
    assert.match(
      lotusPageContent,
      /Swargiya Bindu Agrahari & Shri Vinay Agrahari/s,
      'royal-lotus page.tsx must use Swargiya Bindu Agrahari & Shri Vinay Agrahari as default'
    );
    assert.match(
      lotusPageContent,
      /Smt\. Vimla Devi & Shri Mahendra Agrahari/s,
      'royal-lotus page.tsx must use Smt. Vimla Devi & Shri Mahendra Agrahari as default'
    );
  });

  test('Feature 6: Live preview and faith adapter dynamically honor customized parents names', () => {
    assert.match(
      interactiveContent,
      /setBrideParents\(parsed\.brideParents\)/s,
      'interactive preview must read brideParents from draft'
    );
    assert.match(
      interactiveContent,
      /setGroomParents\(parsed\.groomParents\)/s,
      'interactive preview must read groomParents from draft'
    );
    assert.match(
      faithContent,
      /baseData\?\.brideParents\s*\|\|\s*baseData\?\.couple\?\.brideParents/s,
      'faith adapter must prioritize customized brideParents'
    );
    assert.match(
      faithContent,
      /baseData\?\.groomParents\s*\|\|\s*baseData\?\.couple\?\.groomParents/s,
      'faith adapter must prioritize customized groomParents'
    );
  });

  test('Feature 7: API routes accept and persist brideParents and groomParents in translations', () => {
    assert.match(
      apiRouteContent,
      /brideParents:\s*brideParents\s*\|\|\s*null/s,
      'POST /api/invitations must store brideParents in translationsData'
    );
    assert.match(
      apiRouteContent,
      /groomParents:\s*groomParents\s*\|\|\s*null/s,
      'POST /api/invitations must store groomParents in translationsData'
    );
    assert.match(
      apiIdRouteContent,
      /brideParents:\s*trans\.brideParents\s*\|\|\s*null/s,
      'GET /api/invitations/[id] must enrich and return brideParents'
    );
    assert.match(
      apiIdRouteContent,
      /groomParents:\s*trans\.groomParents\s*\|\|\s*null/s,
      'GET /api/invitations/[id] must enrich and return groomParents'
    );
  });
});
