import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Template Sort Order & Authentic Cover Photos Standards', () => {
  it('Feature 1: Every template in TEMPLATE_META has an authentic, existing cover image in public', () => {
    const trailerFile = fs.readFileSync('lib/template-trailer.ts', 'utf8');
    assert.ok(trailerFile.includes('TEMPLATE_POSTER_MAP'), 'lib/template-trailer.ts must export TEMPLATE_POSTER_MAP');

    const posterSection = trailerFile.split('export const TEMPLATE_POSTER_MAP')[1].split('};')[0];

    const expectedTemplates = [
      'sheesh-mahal',
      'noor-e-nikah',
      'emerald-qasr',
      'gul-e-noor',
      'azure-nikah',
      'kitab-e-nikah',
      'celestial-rose',
      'imperial-palace',
      'royal-majesty',
      'royal-heritage',
      'royal-grace',
      'rose-gold-blush',
      'crimson-royale',
      'royal-lotus',
      'emerald-noir',
      'royal-elegance',
      'modern-minimal',
    ];

    const extractedUrls = [];
    for (const id of expectedTemplates) {
      assert.ok(posterSection.includes(`"${id}":`), `TEMPLATE_POSTER_MAP must contain entry for ${id}`);
      const match = posterSection.match(new RegExp(`"${id}":\\s*"([^"]+)"`));
      assert.ok(match, `Could not extract URL for ${id}`);
      const url = match[1];
      assert.ok(fs.existsSync(path.join('public', url)), `Asset file must exist at public${url}`);
      extractedUrls.push(url);
    }

    // Verify all 17 cover photos are strictly unique (0 duplicates)
    const uniqueUrls = new Set(extractedUrls);
    assert.strictEqual(
      uniqueUrls.size,
      expectedTemplates.length,
      `Expected ${expectedTemplates.length} unique cover photo URLs, but found duplicate(s)!`
    );
  });

  it('Feature 2: Prisma schema defines sortOrder and createdAt for template_configs', () => {
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
    assert.ok(schema.includes('sortOrder'), 'schema.prisma must include sortOrder in TemplateConfig');
    assert.ok(schema.includes('createdAt'), 'schema.prisma must include createdAt in TemplateConfig');
    assert.ok(schema.includes('@map("sort_order")'), 'sortOrder must map to sort_order');
  });

  it('Feature 3: lib/template-pricing.ts exports sort order and release timeline mappings', () => {
    const pricingFile = fs.readFileSync('lib/template-pricing.ts', 'utf8');
    assert.ok(pricingFile.includes('DEFAULT_TEMPLATE_SORT_ORDER'), 'lib/template-pricing.ts must export DEFAULT_TEMPLATE_SORT_ORDER');
    assert.ok(pricingFile.includes('DEFAULT_TEMPLATE_RELEASE_DATES'), 'lib/template-pricing.ts must export DEFAULT_TEMPLATE_RELEASE_DATES');
    assert.ok(pricingFile.includes('sortOrder: number'), 'TemplatePricingConfig must include sortOrder');
  });

  it('Feature 4: AdminTemplatesTable provides interactive Sort Order controls & single-click Star toggle', () => {
    const tableFile = fs.readFileSync('components/admin/AdminTemplatesTable.tsx', 'utf8');
    assert.ok(tableFile.includes('Sort Order:'), 'AdminTemplatesTable must display Sort Order selector');
    assert.ok(tableFile.includes('handleTogglePopular'), 'AdminTemplatesTable must provide handleTogglePopular handler');
    assert.ok(tableFile.includes('sortedTemplates'), 'AdminTemplatesTable must sort templates using sortedTemplates');
    assert.ok(tableFile.includes('Best Template First'), 'AdminTemplatesTable must offer Best Template First option');
    assert.ok(tableFile.includes('Latest Created First'), 'AdminTemplatesTable must offer Latest Created First option');
    assert.ok(tableFile.includes('Display Rank (1 = Top)'), 'Edit modal must offer Display Rank input');
    assert.ok(tableFile.includes('Related Cover Photo URL'), 'Edit modal must offer Related Cover Photo URL input');
  });

  it('Feature 5: /templates showroom supports sorting and lists all 17 masterpieces', () => {
    const showroomFile = fs.readFileSync('app/templates/page.tsx', 'utf8');
    assert.ok(showroomFile.includes('All Masterpieces (17)'), 'Showroom must feature all 17 masterpieces');
    assert.ok(showroomFile.includes('DEFAULT_TEMPLATE_SORT_ORDER'), 'Showroom must import DEFAULT_TEMPLATE_SORT_ORDER');
    assert.ok(showroomFile.includes('Best Templates First'), 'Showroom must feature Best Templates First sort option');
    assert.ok(showroomFile.includes('Latest Created First'), 'Showroom must feature Latest Created First sort option');
  });

  it('Feature 6: Dynamic price update persistence & admin verification architecture', () => {
    const routeFile = fs.readFileSync('app/api/admin/templates/route.ts', 'utf8');
    assert.ok(routeFile.includes('verifyAdminSession(req)'), 'PATCH route must pass req to verifyAdminSession');
    assert.ok(routeFile.includes('updateTemplatePrice'), 'PATCH route must invoke updateTemplatePrice');

    const adminFile = fs.readFileSync('lib/admin.ts', 'utf8');
    assert.ok(adminFile.includes('getToken'), 'lib/admin.ts must support JWT token extraction for App Router requests');

    const tableFile = fs.readFileSync('components/admin/AdminTemplatesTable.tsx', 'utf8');
    assert.ok(tableFile.includes('unfold_template_pricing'), 'AdminTemplatesTable must sync updated prices to client storage');
    assert.ok(tableFile.includes('serverTemplate'), 'AdminTemplatesTable must consume serverTemplate from response');
  });
});
