import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Invitation Edit Mode & Save/Update Button Visibility Standards', () => {
  const editPagePath = path.resolve('app/dashboard/invitation/[id]/edit/page.tsx');
  const wizardPath = path.resolve('components/customizer/InvitationCustomizerWizard.tsx');
  const actionBarPath = path.resolve('components/customizer/CustomizerFloatingActionBar.tsx');

  const editPageContent = fs.readFileSync(editPagePath, 'utf8');
  const wizardContent = fs.readFileSync(wizardPath, 'utf8');
  const actionBarContent = fs.readFileSync(actionBarPath, 'utf8');

  test('Feature 1: Edit page implements studio 100dvh desktop layout so action bar is never pushed off-screen', () => {
    assert.match(
      editPageContent,
      /lg:h-\[100dvh\]/s,
      'Edit page root must enforce 100dvh on desktop'
    );
    assert.match(
      editPageContent,
      /<div className="lg:hidden">\s*<GlassNav \/>\s*<\/div>/s,
      'GlassNav must be hidden on desktop to avoid pushing studio 112px down'
    );
    assert.match(
      editPageContent,
      /lg:pt-0 lg:pb-0/s,
      'Main container must remove padding-top/bottom on desktop to keep bottom bar pinned to screen'
    );
  });

  test('Feature 2: CustomizerFloatingActionBar displays Save & Update button for isEdit mode', () => {
    assert.match(
      actionBarContent,
      /isEdit \|\| isPaid\s*\?\s*"Save & Update"/s,
      'Primary button must show "Save & Update" when in edit mode'
    );
    assert.match(
      actionBarContent,
      /!isPaid && !isEdit \? \(\s*<LockOpen/s,
      'Lock icon should only show if unpaid and NOT in edit mode; in edit mode it shows FloppyDisk'
    );
  });

  test('Feature 3: CustomizerFloatingActionBar always renders action buttons grid so button is never hidden', () => {
    // Ensures the grid is rendered unconditionally without an isFormComplete ? ( ... ) : null gate
    assert.doesNotMatch(
      actionBarContent,
      /\{isFormComplete\s*\?\s*\(\s*<div className="grid grid-cols-2/s,
      'ActionBar must NOT hide the Save & Update button when form is being edited'
    );
    assert.match(
      actionBarContent,
      /<div className="grid grid-cols-2 gap-3">/s,
      'ActionBar must render Preview and Primary action grid'
    );
  });

  test('Feature 4: InvitationCustomizerWizard provides multiple unmissable Save & Update touchpoints in edit mode', () => {
    // Top header quick button
    assert.match(
      wizardContent,
      /\{isEdit && \(\s*<button[^>]*onClick=\{requestSubmitFlow\}[^>]*>[\s\S]*?Save & Update/s,
      'Top header must render quick Save & Update button when isEdit is true'
    );

    // In-card button inside Step 5 Review & Save Changes
    assert.match(
      wizardContent,
      /Save & Update Invitation/s,
      'Step 5 Review & Save must provide in-card primary Save & Update CTA'
    );
  });

  test('Feature 5: requestSubmitFlow directly saves and updates when isEdit is true', () => {
    assert.match(
      wizardContent,
      /if \(isPaid \|\| isEdit\) \{\s*await handleSaveInvitationInternal\(\);\s*return;\s*\}/s,
      'Submitting in edit mode must directly trigger handleSaveInvitationInternal without forcing payment'
    );
  });
});
