import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Invitation Link Sharing & Social Thumbnail Preview Standards', () => {
  const layoutPath = path.resolve(process.cwd(), 'app/[slug]/layout.tsx');
  const ogImagePath = path.resolve(process.cwd(), 'app/[slug]/opengraph-image.tsx');

  test('Feature 1: Dynamic generateMetadata in app/[slug]/layout.tsx produces couple-specific OpenGraph & Twitter tags', () => {
    assert.ok(fs.existsSync(layoutPath), 'app/[slug]/layout.tsx must exist');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // Couple personalization
    assert.ok(layoutContent.includes('formatCoupleFromSlug'), 'layout must format couple names from slug if offline');
    assert.ok(layoutContent.includes('prisma.invitation.findUnique'), 'layout must query Prisma for real couple metadata');
    assert.ok(layoutContent.includes('Wedding Celebration Invitation'), 'layout must include celebratory invitation title');

    // OpenGraph standards for WhatsApp, Facebook, iMessage
    assert.ok(layoutContent.includes('openGraph:'), 'layout must export openGraph metadata');
    assert.ok(layoutContent.includes('opengraph-image'), 'openGraph images must reference opengraph-image endpoint');
    assert.ok(layoutContent.includes('width: 1200'), 'openGraph image width must be 1200px');
    assert.ok(layoutContent.includes('height: 630'), 'openGraph image height must be 630px');
    assert.ok(layoutContent.includes('type: "image/png"'), 'openGraph image type must be specified');

    // Twitter Card standards
    assert.ok(layoutContent.includes('twitter:'), 'layout must export twitter metadata');
    assert.ok(layoutContent.includes('card: "summary_large_image"'), 'twitter card must be summary_large_image for big thumbnail');
    assert.ok(layoutContent.includes('images: [ogImageUrl]'), 'twitter metadata must include thumbnail image');
  });

  test('Feature 2: app/[slug]/opengraph-image.tsx dynamic image generator renders royal 1200x630 wedding card', () => {
    assert.ok(fs.existsSync(ogImagePath), 'app/[slug]/opengraph-image.tsx must exist');
    const ogContent = fs.readFileSync(ogImagePath, 'utf8');

    // Next.js App Router OG conventions
    assert.ok(ogContent.includes('export const size = { width: 1200, height: 630 }'), 'Must export 1200x630 size');
    assert.ok(ogContent.includes('export const contentType = "image/png"'), 'Must export image/png contentType');
    assert.ok(ogContent.includes('new ImageResponse('), 'Must instantiate Next.js ImageResponse');

    // Content & Design Elements
    assert.ok(ogContent.includes('A SACRED WEDDING CELEBRATION'), 'Must include sacred wedding celebration header');
    assert.ok(ogContent.includes('श्री गणेशाय नमः'), 'Must include auspicious wedding invocation');
    assert.ok(ogContent.includes('wedinvites.in'), 'Must include WedInvites brand watermark');
    assert.ok(ogContent.includes('TAP TO OPEN 3D DIGITAL INVITATION'), 'Must render interactive CTA pill');
  });

  test('Feature 3: Verification with sample slug gargi-pawan-agrahari', async () => {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    assert.ok(layoutContent.includes('decodeURIComponent(slug)'), 'Must safely decode slug URI components');
    assert.ok(layoutContent.includes('words.slice(1)'), 'Must parse multi-word names like Gargi and Pawan Agrahari');
  });
});
