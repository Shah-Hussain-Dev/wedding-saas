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

  it('Feature 7: /templates showroom synchronizes with dynamic Best Star & Display Rank from Admin', () => {
    const showroomFile = fs.readFileSync('app/templates/page.tsx', 'utf8');
    assert.ok(showroomFile.includes('detailsA.isPopular'), 'Showroom must sort popular/starred templates first');
    assert.ok(showroomFile.includes('detailsA.sortOrder'), 'Showroom must prioritize dynamic sortOrder from details');
    assert.ok(showroomFile.includes('pricing.isPopular'), 'Showroom Best Sellers filter must include dynamic starred templates');

    const cardFile = fs.readFileSync('components/marketing/template-catalog-card.tsx', 'utf8');
    assert.ok(cardFile.includes('pricing.isPopular'), 'TemplateCatalogCard must check pricing.isPopular');
    assert.ok(cardFile.includes('BEST'), 'TemplateCatalogCard must render BEST badge for starred templates');

    const hookFile = fs.readFileSync('lib/hooks/use-template-pricing.ts', 'utf8');
    assert.ok(hookFile.includes('sortOrder?: number'), 'TemplatePricingDetail must include sortOrder');
    assert.ok(hookFile.includes('isPopular?: boolean'), 'TemplatePricingDetail must include isPopular');
    assert.ok(hookFile.includes('unfold_pricing_updated'), 'useTemplatePricing must listen to unfold_pricing_updated event');
    assert.ok(hookFile.includes('getSortRank'), 'useTemplatePricing must export getSortRank helper');
    assert.ok(hookFile.includes('isPopular'), 'useTemplatePricing must export isPopular helper');

    const adminTableFile = fs.readFileSync('components/admin/AdminTemplatesTable.tsx', 'utf8');
    assert.ok(adminTableFile.includes('unfold_template_pricing_details'), 'AdminTemplatesTable must sync unfold_template_pricing_details');
    assert.ok(adminTableFile.includes('unfold_pricing_updated'), 'AdminTemplatesTable must dispatch unfold_pricing_updated event');
  });

  it('Feature 8: Home Page InteractiveTemplateGrid reflects exact Admin saved rank, ⭐ BEST, and Sheesh Mahal #1', () => {
    const gridFile = fs.readFileSync('components/marketing/interactive-template-grid.tsx', 'utf8');
    assert.ok(gridFile.includes('useTemplatePricing'), 'Home Page grid must use useTemplatePricing hook');
    assert.ok(gridFile.includes('sheesh-mahal'), 'Home Page grid must contain sheesh-mahal');
    assert.ok(gridFile.includes('detailsA.isPopular'), 'Home Page grid must prioritize dynamic Best Star');
    assert.ok(gridFile.includes('rankA - rankB'), 'Home Page grid must sort by display rank');

    const sortFile = fs.readFileSync('lib/template-sort.ts', 'utf8');
    assert.ok(sortFile.includes('"sheesh-mahal": 1'), 'Default rank #1 must be sheesh-mahal');
    assert.ok(sortFile.includes('"imperial-palace": 2'), 'Default rank #2 must be imperial-palace');
    assert.ok(sortFile.includes('"royal-lotus": 3'), 'Default rank #3 must be royal-lotus');
    assert.ok(sortFile.includes('"royal-majesty": 4'), 'Default rank #4 must be royal-majesty');
    assert.ok(sortFile.includes('"celestial-rose": 5'), 'Default rank #5 must be celestial-rose');
    assert.ok(sortFile.includes('"royal-heritage": 6'), 'Default rank #6 must be royal-heritage');
    assert.ok(sortFile.includes('"royal-grace": 7'), 'Default rank #7 must be royal-grace');
    assert.ok(sortFile.includes('"crimson-royale": 8'), 'Default rank #8 must be crimson-royale');

    const pricesJson = JSON.parse(fs.readFileSync('data/template-prices.json', 'utf8'));
    assert.strictEqual(pricesJson['sheesh-mahal'].sortOrder, 1);
    assert.strictEqual(pricesJson['sheesh-mahal'].isPopular, true);
    assert.strictEqual(pricesJson['imperial-palace'].sortOrder, 2);
    assert.strictEqual(pricesJson['imperial-palace'].isPopular, true);
    assert.strictEqual(pricesJson['royal-lotus'].sortOrder, 3);
    assert.strictEqual(pricesJson['royal-lotus'].isPopular, true);
    assert.strictEqual(pricesJson['royal-majesty'].sortOrder, 4);
    assert.strictEqual(pricesJson['royal-majesty'].isPopular, true);
    assert.strictEqual(pricesJson['celestial-rose'].sortOrder, 5);
    assert.strictEqual(pricesJson['celestial-rose'].isPopular, true);
    assert.strictEqual(pricesJson['royal-heritage'].sortOrder, 6);
    assert.strictEqual(pricesJson['royal-heritage'].isPopular, true);
    assert.strictEqual(pricesJson['royal-grace'].sortOrder, 7);
    assert.strictEqual(pricesJson['royal-grace'].isPopular, true);
    assert.strictEqual(pricesJson['crimson-royale'].sortOrder, 8);
    assert.strictEqual(pricesJson['crimson-royale'].isPopular, true);
  });
});
