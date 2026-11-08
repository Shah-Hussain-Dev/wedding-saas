import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Freemium Demo Preview & Watermark Standards', () => {
  const root = process.cwd();
  const demoWatermarkFile = path.join(root, 'components', 'preview', 'DemoWatermark.tsx');
  const demoBannerFile = path.join(root, 'components', 'preview', 'DemoBanner.tsx');
  const slugPageFile = path.join(root, 'app', '[slug]', 'page.tsx');
  const wizardFile = path.join(root, 'components', 'customizer', 'InvitationCustomizerWizard.tsx');
  const successModalFile = path.join(root, 'components', 'customizer', 'CustomizerSubmitSuccessModal.tsx');

  describe('Feature 1: DemoWatermark Component Architecture', () => {
    const content = fs.readFileSync(demoWatermarkFile, 'utf8');

    test('DemoWatermark renders luxury repeating watermark pattern', () => {
      assert.match(
        content,
        /DEMO PREVIEW/s,
        'Must display DEMO PREVIEW in watermark pattern'
      );
      assert.match(
        content,
        /wedinvites\.in/s,
        'Must display domain in watermark'
      );
    });

    test('DemoWatermark displays top preview badge without blocking content', () => {
      assert.match(
        content,
        /Preview Demo/s,
        'Must display Preview Demo label'
      );
      assert.match(
        content,
        /Unlock to remove watermark/s,
        'Must inform user that unlocking removes watermark'
      );
    });
  });

  describe('Feature 2: Customized URL [slug] Free Demo View & Banner Integration', () => {
    const slugContent = fs.readFileSync(slugPageFile, 'utf8');
    const bannerContent = fs.readFileSync(demoBannerFile, 'utf8');

    test('[slug] page imports and renders both DemoBanner and DemoWatermark when unpublished/unpaid', () => {
      assert.match(
        slugContent,
        /import\s*\{\s*DemoBanner\s*\}\s*from\s*["']@\/components\/preview\/DemoBanner["']/s,
        '[slug] page must import DemoBanner'
      );
      assert.match(
        slugContent,
        /import\s*\{\s*DemoWatermark\s*\}\s*from\s*["']@\/components\/preview\/DemoWatermark["']/s,
        '[slug] page must import DemoWatermark'
      );
      assert.match(
        slugContent,
        /<DemoBanner/s,
        '[slug] page must render DemoBanner'
      );
      assert.match(
        slugContent,
        /<DemoWatermark/s,
        '[slug] page must render DemoWatermark'
      );
    });

    test('[slug] page local storage fallback strictly requires verified paid order', () => {
      assert.match(
        slugContent,
        /const isPaid = Boolean\(localItem\.order\?\.status === "paid" \|\| localItem\.orderStatus === "paid"\);/s,
        '[slug] page must not trust raw localItem.isPaid without order status'
      );
    });

    test('DemoBanner strictly requires order status verification in checkIsUnlocked', () => {
      assert.match(
        bannerContent,
        /if \(parsed\.order\?\.status === "paid" \|\| parsed\.orderStatus === "paid"\)/s,
        'DemoBanner checkIsUnlocked must not trust raw parsed.isPaid'
      );
    });

    test('DemoBanner propagates onUnlockSuccess callback when payment completes', () => {
      assert.match(
        bannerContent,
        /onUnlockSuccess\?:\s*\(liveUrl:\s*string\)\s*=>\s*void/s,
        'DemoBanner must accept onUnlockSuccess prop'
      );
      assert.match(
        slugContent,
        /onUnlockSuccess=\{handleUnlockSuccess\}/s,
        '[slug] page must connect handleUnlockSuccess'
      );
    });
  });

  describe('Feature 3: Customizer Wizard & Success Modal Flow Integrity', () => {
    const wizardContent = fs.readFileSync(wizardFile, 'utf8');
    const modalContent = fs.readFileSync(successModalFile, 'utf8');

    test('Wizard isPaid strictly requires order.status === "paid"', () => {
      assert.match(
        wizardContent,
        /initialData\?\.order\?\.status === "paid" \|\|/s,
        'Wizard must check order.status === paid'
      );
      assert.doesNotMatch(
        wizardContent,
        /initialData\?\.isPaid === true \|\|\s*initialData\?\.order\?\.status === "paid"/s,
        'Wizard must not trust unverified initialData.isPaid'
      );
    });

    test('CustomizerSubmitSuccessModal distinguishes Free Demo Preview from Live Website Activated', () => {
      assert.match(
        modalContent,
        /Live Website Activated/s,
        'Modal must show Live Website Activated when paid'
      );
      assert.match(
        modalContent,
        /Free Demo Preview · Unpaid Draft/s,
        'Modal must show Free Demo Preview badge when unpaid'
      );
      assert.match(
        modalContent,
        /Your Free Demo Link is Ready!/s,
        'Modal must show Free Demo Link heading when unpaid'
      );
      assert.match(
        modalContent,
        /Pay &amp; Unlock Official Website/s,
        'Modal must feature Pay & Unlock button when unpaid'
      );
    });

    test('Wizard connects onPay and priceFormatted to CustomizerSubmitSuccessModal', () => {
      assert.match(
        wizardContent,
        /onPay=\{handlePayInvitation\}/s,
        'Wizard must pass onPay to success modal'
      );
      assert.match(
        wizardContent,
        /priceFormatted=\{pricingDetail\.priceFormatted\}/s,
        'Wizard must pass priceFormatted to success modal'
      );
    });
  });
});

