import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Payment-First Customization Flow Standards', () => {
  const wizardPath = path.resolve('components/customizer/InvitationCustomizerWizard.tsx');
  const paymentModalPath = path.resolve('components/customizer/CustomizerPaymentModal.tsx');
  const actionBarPath = path.resolve('components/customizer/CustomizerFloatingActionBar.tsx');
  const submitFlowPath = path.resolve('components/customizer/CustomizerSubmitFlow.tsx');

  const wizardContent = fs.readFileSync(wizardPath, 'utf8');
  const paymentModalContent = fs.readFileSync(paymentModalPath, 'utf8');
  const actionBarContent = fs.readFileSync(actionBarPath, 'utf8');
  const submitFlowContent = fs.readFileSync(submitFlowPath, 'utf8');

  describe('Feature 1: CustomizerPaymentModal Design & Standards', () => {
    test('Payment modal displays First Priority & Instant Activation badge', () => {
      assert.match(
        paymentModalContent,
        /First Priority · Instant Activation/s,
        'Modal must highlight payment as first priority'
      );
    });

    test('Payment modal displays Unlock couple invitation heading and dynamic pricing', () => {
      assert.match(
        paymentModalContent,
        /Unlock \{coupleLabel\}&apos;s Invitation/s,
        'Modal must display dynamic couple invitation title'
      );
      assert.match(
        paymentModalContent,
        /sellingPrice/s,
        'Modal must display selling price'
      );
      assert.match(
        paymentModalContent,
        /originalPrice/s,
        'Modal must display original price'
      );
    });

    test('Payment modal lists full value proposition: permanent link, RSVPs, music, edits', () => {
      assert.match(paymentModalContent, /Permanent Custom Link/s);
      assert.match(paymentModalContent, /Real-Time Guest RSVPs/s);
      assert.match(paymentModalContent, /Luxury Audio Dock/s);
      assert.match(paymentModalContent, /Instant WhatsApp Sharing/s);
      assert.match(paymentModalContent, /Unlimited Edits/s);
    });

    test('Payment modal features Pay & Activate button and Razorpay trust indicators', () => {
      assert.match(
        paymentModalContent,
        /Pay &amp; Activate Live Website · \{sellingPrice\}/s,
        'Must provide primary Pay & Activate button'
      );
      assert.match(
        paymentModalContent,
        /Secure 256-bit Razorpay Checkout/s,
        'Must provide Razorpay security badge'
      );
      assert.match(
        paymentModalContent,
        /UPI \(GPay \/ PhonePe \/ Paytm\)/s,
        'Must display UPI support'
      );
    });

    test('Payment modal includes non-intrusive save as draft option', () => {
      assert.match(
        paymentModalContent,
        /Save as draft &amp; pay later/s,
        'Must provide option to save as draft & pay later'
      );
    });
  });

  describe('Feature 2: Dynamic Action Bar CTA States', () => {
    test('Action bar displays Log in & Unlock with price when unauthenticated', () => {
      assert.match(
        actionBarContent,
        /Log in & Unlock · \$\{priceFormatted\}/s,
        'Must show Log in & Unlock with price when logged out'
      );
    });

    test('Action bar displays Pay & Unlock with price when authenticated and unpaid', () => {
      assert.match(
        actionBarContent,
        /Pay & Unlock · \$\{priceFormatted\}/s,
        'Must show Pay & Unlock with price when logged in and unpaid'
      );
    });

    test('Action bar displays Save & Update when already paid', () => {
      assert.match(
        actionBarContent,
        /Save & Update/s,
        'Must show Save & Update when template is already paid'
      );
    });
  });

  describe('Feature 3: Customization Flow Triggers Payment As First Priority', () => {
    test('Wizard opens payment modal after login for unpaid templates', () => {
      assert.match(
        wizardContent,
        /PAYMENT IS FIRST PRIORITY AFTER LOGIN/s,
        'Wizard must treat payment as first priority after login'
      );
      assert.match(
        wizardContent,
        /setIsPaymentModalOpen\(true\)/s,
        'Wizard must open payment modal'
      );
    });

    test('Wizard connects Razorpay script loading, order creation and verification', () => {
      assert.match(
        wizardContent,
        /checkout\.razorpay\.com\/v1\/checkout\.js/s,
        'Must load official Razorpay checkout script'
      );
      assert.match(
        wizardContent,
        /\/api\/payments\/create-order/s,
        'Must call create-order API'
      );
      assert.match(
        wizardContent,
        /\/api\/payments\/verify/s,
        'Must verify payment with server'
      );
    });

    test('CustomizerSubmitFlow also triggers payment modal as first priority after login', () => {
      assert.match(
        submitFlowContent,
        /PAYMENT IS FIRST PRIORITY/s,
        'Preview flow must treat payment as first priority'
      );
      assert.match(
        submitFlowContent,
        /CustomizerPaymentModal/s,
        'Preview flow must mount CustomizerPaymentModal'
      );
    });
  });
});

