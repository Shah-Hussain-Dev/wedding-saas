import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Post-Payment Email Notification & SMTP Standards', () => {
  const root = process.cwd();
  const emailLibFile = path.join(root, 'lib', 'email.ts');
  const verifyRouteFile = path.join(root, 'app', 'api', 'payments', 'verify', 'route.ts');
  const testSmtpScript = path.join(root, 'scripts', 'test-smtp.mjs');

  describe('Feature 1: Email Library & Luxury Template Generator', () => {
    const emailContent = fs.readFileSync(emailLibFile, 'utf8');

    test('lib/email.ts exports sendPaymentSuccessEmail and renderPaymentSuccessHtml', () => {
      assert.match(
        emailContent,
        /export\s+async\s+function\s+sendPaymentSuccessEmail/s,
        'Must export sendPaymentSuccessEmail'
      );
      assert.match(
        emailContent,
        /export\s+function\s+renderPaymentSuccessHtml/s,
        'Must export renderPaymentSuccessHtml'
      );
    });

    test('renderPaymentSuccessHtml includes royal blessings and heartfelt wishful note', () => {
      assert.match(
        emailContent,
        /May your union be blessed with eternal harmony/s,
        'Email template must include heartfelt blessing'
      );
      assert.match(
        emailContent,
        /Dearest \$\{brideName\} &amp; \$\{groomName\}/s,
        'Email template must personalize couple greeting'
      );
    });

    test('renderPaymentSuccessHtml features clear live template URL and Open button', () => {
      assert.match(
        emailContent,
        /Open Live Invitation/s,
        'Email template must feature prominent Open Live Invitation CTA button'
      );
      assert.match(
        emailContent,
        /Your Official Shareable Link/s,
        'Email template must highlight shareable link'
      );
      assert.match(
        emailContent,
        /Go to Couple Dashboard/s,
        'Email template must provide direct dashboard link'
      );
    });

    test('renderPaymentSuccessHtml includes transparent order receipt breakdown', () => {
      assert.match(
        emailContent,
        /Payment Receipt Details/s,
        'Email template must display payment receipt'
      );
      assert.match(
        emailContent,
        /Amount Paid:/s,
        'Email template must display amount paid'
      );
      assert.match(
        emailContent,
        /Razorpay Payment ID:/s,
        'Email template must display Razorpay Payment ID'
      );
    });
  });

  describe('Feature 2: Payment Verification Route Email Dispatch', () => {
    const verifyContent = fs.readFileSync(verifyRouteFile, 'utf8');

    test('app/api/payments/verify/route.ts imports sendPaymentSuccessEmail', () => {
      assert.match(
        verifyContent,
        /import\s*\{\s*sendPaymentSuccessEmail\s*\}\s*from\s*["']@\/lib\/email["']/s,
        'Verification route must import sendPaymentSuccessEmail'
      );
    });

    test('Payment verification dispatches email asynchronously upon status: paid', () => {
      assert.match(
        verifyContent,
        /sendPaymentSuccessEmail\s*\(\s*\{/s,
        'Verification route must invoke sendPaymentSuccessEmail'
      );
      assert.match(
        verifyContent,
        /\.catch\s*\(\s*\(mailErr\)\s*=>/s,
        'Email dispatch must be non-blocking with .catch handler'
      );
    });
  });

  describe('Feature 3: SMTP Test Utility Script', () => {
    test('scripts/test-smtp.mjs exists and handles SMTP verification', () => {
      assert.ok(fs.existsSync(testSmtpScript), 'scripts/test-smtp.mjs must exist');
      const scriptContent = fs.readFileSync(testSmtpScript, 'utf8');
      assert.match(
        scriptContent,
        /transporter\.verify\(\)/s,
        'Test script must verify transporter connection'
      );
      assert.match(
        scriptContent,
        /sendMail\(/s,
        'Test script must support sending test verification email'
      );
    });
  });
});

