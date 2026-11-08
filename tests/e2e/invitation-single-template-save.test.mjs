import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Single Template Save Per User & Collision Prevention Standards', () => {
  const apiRoutePath = path.resolve('app/api/invitations/route.ts');
  const customizerPath = path.resolve('components/customizer/InvitationCustomizerWizard.tsx');
  const successModalPath = path.resolve('components/customizer/CustomizerSubmitSuccessModal.tsx');
  const customizePagePath = path.resolve('app/customize/[templateId]/page.tsx');
  const submitLibPath = path.resolve('lib/customizer-invitation-submit.ts');

  const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');
  const customizerContent = fs.readFileSync(customizerPath, 'utf8');
  const successModalContent = fs.readFileSync(successModalPath, 'utf8');
  const customizePageContent = fs.readFileSync(customizePagePath, 'utf8');
  const submitLibContent = fs.readFileSync(submitLibPath, 'utf8');

  describe('Feature 1: Backend Single Template Invariant & Collision Prevention', () => {
    test('POST /api/invitations queries for existing invitation for user and template', () => {
      assert.match(
        apiRouteContent,
        /prisma\.invitation\.findFirst\(\s*\{[^}]*userId:\s*user\.id,[^}]*templateId:\s*targetTemplateId/s,
        'Must check if user already has an invitation for targetTemplateId'
      );
    });

    test('POST /api/invitations updates existing invitation instead of creating duplicate', () => {
      assert.match(
        apiRouteContent,
        /if\s*\(\s*existingInvitation\s*\)\s*\{[^}]*prisma\.invitation\.update\(\s*\{[^}]*where:\s*\{\s*id:\s*existingInvitation\.id\s*\}/s,
        'Must update existing invitation by id when found'
      );
    });

    test('POST /api/invitations flags alreadySaved: true and returns informative message', () => {
      assert.match(
        apiRouteContent,
        /alreadySaved:\s*true/s,
        'Must return alreadySaved: true when invitation already exists'
      );
      assert.match(
        apiRouteContent,
        /message:\s*"This template is already saved in your dashboard\."/s,
        'Must return clear message indicating template is already saved'
      );
    });

    test('POST /api/invitations preserves existing slug without appending random suffixes', () => {
      // In the existingInvitation block, it must not call generateUniqueSlug or overwrite slug with random suffixes
      const existingBranch = apiRouteContent.slice(
        apiRouteContent.indexOf('if (existingInvitation)'),
        apiRouteContent.indexOf('No previous invitation exists for this template')
      );
      assert.ok(
        !existingBranch.includes('generateUniqueSlug'),
        'Must NOT generate new random suffixed slug when template is already saved'
      );
    });

    test('POST /api/invitations deduplicates and cleans up any stray un-paid duplicates', () => {
      assert.match(
        apiRouteContent,
        /prisma\.invitation\.deleteMany\(\s*\{[^}]*userId:\s*user\.id,[^}]*templateId:\s*targetTemplateId,[^}]*id:\s*\{\s*not:\s*existingInvitation\.id\s*\}/s,
        'Must delete any stray duplicate un-paid invitations for this user and template'
      );
    });

    test('GET /api/invitations supports templateId query to check existing saved template', () => {
      assert.match(
        apiRouteContent,
        /templateIdParam/s,
        'Must extract templateIdParam from searchParams'
      );
      assert.match(
        apiRouteContent,
        /existingInvitation/s,
        'Must return existingInvitation when templateId matches'
      );
    });
  });

  describe('Feature 2: Customizer Pre-Load & Edit Mode Integration', () => {
    test('app/customize/[templateId] checks existing invitation for current user on load', () => {
      assert.match(
        customizePageContent,
        /\/api\/invitations\?templateId=\$\{encodeURIComponent\(normalized\)\}/s,
        'Must query /api/invitations?templateId on page load'
      );
      assert.match(
        customizePageContent,
        /invData\?\.existingInvitation/s,
        'Must check invData.existingInvitation'
      );
      assert.match(
        customizePageContent,
        /setInitialData\(invData\.existingInvitation\)/s,
        'Must populate initialData with existing invitation'
      );
    });

    test('Wizard UI displays header indicator when template is already saved', () => {
      assert.match(
        customizerContent,
        /Already saved in your dashboard &bull; Edits will update your existing invitation\./s,
        'Must show already saved notice in customizer header'
      );
    });

    test('Wizard save handler records alreadySaved status and sets customizer success message', () => {
      assert.match(
        customizerContent,
        /alreadySaved:\s*isAlreadySavedResult/s,
        'Must pass alreadySaved boolean to successRecord'
      );
      assert.match(
        customizerContent,
        /This template is already saved in your dashboard! Customization updated\./s,
        'Must show customization updated toast when already saved'
      );
    });
  });

  describe('Feature 3: Customizer Submit Success Modal & Clean URL Preservation', () => {
    test('CustomizerSuccessInvite interface defines optional alreadySaved boolean', () => {
      assert.match(
        successModalContent,
        /alreadySaved\?:\s*boolean/s,
        'CustomizerSuccessInvite interface must include alreadySaved'
      );
    });

    test('CustomizerSubmitSuccessModal renders "Template Already Saved" banner and heading', () => {
      assert.match(
        successModalContent,
        /Template Already Saved/s,
        'Modal must show "Template Already Saved" heading'
      );
      assert.match(
        successModalContent,
        /Already Saved in Dashboard/s,
        'Modal must show "Already Saved in Dashboard" badge'
      );
      assert.match(
        successModalContent,
        /Your latest customizations have been updated while keeping your original clean link\./s,
        'Modal must reassure user that clean link is preserved'
      );
    });

    test('Submit helper library propagates alreadySaved flag', () => {
      assert.match(
        submitLibContent,
        /alreadySaved:\s*Boolean\(created\.alreadySaved\)/s,
        'Must propagate alreadySaved boolean from API response'
      );
    });
  });
});

