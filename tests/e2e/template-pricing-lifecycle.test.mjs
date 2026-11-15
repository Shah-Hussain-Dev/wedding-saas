import { describe, test, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Template Pricing Lifecycle & Dynamic Discount Verification Suite', () => {
  const root = process.cwd();
  const pricingLibPath = path.join(root, 'lib', 'template-pricing.ts');
  const adminRoutePath = path.join(root, 'app', 'api', 'admin', 'templates', 'route.ts');
  const publicPricingRoutePath = path.join(root, 'app', 'api', 'templates', 'pricing', 'route.ts');
  const createOrderRoutePath = path.join(root, 'app', 'api', 'payments', 'create-order', 'route.ts');
  const adminTableComponentPath = path.join(root, 'components', 'admin', 'AdminTemplatesTable.tsx');
  const showroomPagePath = path.join(root, 'app', 'templates', 'page.tsx');
  const pricingHookPath = path.join(root, 'lib', 'hooks', 'use-template-pricing.ts');
  const catalogCardPath = path.join(root, 'components', 'marketing', 'template-catalog-card.tsx');

  // ─────────────────────────────────────────────────────────────
  // Tier 1: Pricing Mathematical Invariants & Business Logic
  // ─────────────────────────────────────────────────────────────
  describe('Tier 1: Pricing Invariants & Calculation Mechanics', () => {
    const pricingContent = fs.readFileSync(pricingLibPath, 'utf8');

    test('buildTemplatePricingConfig calculates discount percentage and savings accurately', () => {
      assert.match(
        pricingContent,
        /Math\.round\(\(\(originalPriceInr - priceInr\) \/ originalPriceInr\) \* 100\)/,
        'Must compute discount percentage using standard retail formula'
      );
      assert.match(
        pricingContent,
        /savingsAmountInr = Math\.max\(0, originalPriceInr - priceInr\)/,
        'Savings amount must be calculated as difference and clamped at zero'
      );
      assert.match(
        pricingContent,
        /isOnSale = originalPriceInr > priceInr && priceInr > 0/,
        'isOnSale must be strictly true only when original price exceeds positive selling price'
      );
    });

    test('buildTemplatePricingConfig formats INR currency with standard locale conventions', () => {
      assert.match(
        pricingContent,
        /toLocaleString\("en-IN"\)/,
        'Currency values must be formatted with Indian Rupee (en-IN) numbering system'
      );
    });

    test('updateTemplatePrice enforces safe, non-negative integers for prices and clamps discount to 100%', () => {
      assert.match(
        pricingContent,
        /safePrice = Math\.max\(0, Math\.round\(Number\(priceInr\)/,
        'Selling price must be rounded and clamped to non-negative numbers'
      );
      assert.match(
        pricingContent,
        /Math\.min\(100, Math\.round\(Number\(options\.discountPercent\)\)\)/,
        'Discount percentage must be clamped at 100%'
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Tier 2: Persistence Layer & High-Latency Resilient Architecture
  // ─────────────────────────────────────────────────────────────
  describe('Tier 2: Persistence Layer & Cache Integrity', () => {
    const pricingContent = fs.readFileSync(pricingLibPath, 'utf8');

    test('getAllTemplatesWithPricing allocates generous timeout (12000ms) for cloud DB pooler', () => {
      assert.match(
        pricingContent,
        /setTimeout\(\(\) => reject\(new Error\("DB query timed out"\)\), 12000\)/,
        'DB timeout must be set to 12s to prevent premature fallback on high-latency poolers'
      );
    });

    test('updateTemplatePrice merges existing file cache to prevent catalog truncation', () => {
      assert.match(
        pricingContent,
        /const fileData = loadPricesFromFile\(\);/,
        'Must load file cache before modifying'
      );
      assert.match(
        pricingContent,
        /memoryPriceCache = \{ \.\.\.fileData, \.\.\.memoryPriceCache \};/,
        'Must merge existing file prices so other templates are not lost'
      );
      assert.match(
        pricingContent,
        /savePricesToFile\(memoryPriceCache\);/,
        'Must persist merged cache to file backup immediately'
      );
    });

    test('template_prices.json contains valid JSON with 17 template entries', () => {
      const pricesFile = path.join(root, 'data', 'template-prices.json');
      assert.ok(fs.existsSync(pricesFile), 'data/template-prices.json must exist');
      const content = fs.readFileSync(pricesFile, 'utf8');
      const parsed = JSON.parse(content);
      const keys = Object.keys(parsed);
      assert.ok(keys.length >= 17, `Expected at least 17 templates in cache, found ${keys.length}`);
      for (const key of keys) {
        assert.ok(typeof parsed[key].priceInr === 'number', `${key} must have numeric priceInr`);
        assert.ok(parsed[key].priceInr >= 0, `${key} priceInr must be non-negative`);
      }
    });

    test('updateTemplatePrice persists coverImageUrl directly into Prisma updateData', () => {
      assert.match(
        pricingContent,
        /updateData\.coverImageUrl = options\.coverImageUrl\.trim\(\);/,
        'Must consolidate coverImageUrl into Prisma update to minimize database roundtrips'
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Tier 3: Admin & Public Route Handlers Contract
  // ─────────────────────────────────────────────────────────────
  describe('Tier 3: Route Handlers Security & API Contracts', () => {
    const adminRouteContent = fs.readFileSync(adminRoutePath, 'utf8');
    const publicPricingContent = fs.readFileSync(publicPricingRoutePath, 'utf8');

    test('Admin PATCH route requires verified admin session and passes request context', () => {
      assert.match(
        adminRouteContent,
        /const \{ isAdmin \} = await verifyAdminSession\(req\);/,
        'Admin PATCH route must pass req to verifyAdminSession'
      );
      assert.match(
        adminRouteContent,
        /if \(!isAdmin\) \{\s*return NextResponse\.json\(\{ error: "Unauthorized/,
        'Unauthorized calls must return 401 Unauthorized status'
      );
    });

    test('Admin PATCH route validates templateId parameter and price boundaries', () => {
      assert.match(
        adminRouteContent,
        /if \(!templateId\) \{\s*return NextResponse\.json\(\{ error: "Missing required templateId parameter"/,
        'Must validate templateId parameter'
      );
      assert.match(
        adminRouteContent,
        /if \(priceInr !== undefined && \(isNaN\(Number\(priceInr\)\) \|\| Number\(priceInr\) < 0\)\)/,
        'Must reject negative or NaN price values with 400'
      );
    });

    test('Admin PATCH route supports bulk price updates across all or selected templates', () => {
      assert.match(
        adminRouteContent,
        /if \(body\.action === "bulk" \|\| body\.bulk === true\)/,
        'Must support bulk price update action'
      );
      assert.match(
        adminRouteContent,
        /await bulkUpdateTemplatePricing\(\{/,
        'Must invoke bulkUpdateTemplatePricing for bulk updates'
      );
    });

    test('Public pricing route (/api/templates/pricing) returns pricingMap, pricingDetailsMap and cache: no-store', () => {
      assert.match(
        publicPricingContent,
        /pricingMap\[t\.id\] = t\.priceInr;/,
        'Public endpoint must export simple pricingMap'
      );
      assert.match(
        publicPricingContent,
        /pricingDetailsMap\[t\.id\] = t;/,
        'Public endpoint must export comprehensive pricingDetailsMap'
      );
      assert.match(
        publicPricingContent,
        /"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"/,
        'Public endpoint must enforce zero HTTP caching'
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Tier 4: Razorpay Payment Integration Verification
  // ─────────────────────────────────────────────────────────────
  describe('Tier 4: Razorpay Dynamic Payment Charging Verification', () => {
    const createOrderContent = fs.readFileSync(createOrderRoutePath, 'utf8');

    test('/api/payments/create-order fetches dynamic template price via getTemplatePriceInr', () => {
      assert.match(
        createOrderContent,
        /import.*getTemplatePriceInr.*from "@\/lib\/template-pricing"/,
        'Create order route must import getTemplatePriceInr'
      );
      assert.match(
        createOrderContent,
        /configuredPrice\s*=\s*activeTemplateId\s*\?\s*await\s+getTemplatePriceInr\(activeTemplateId\)/,
        'Create order route must lookup verified dynamic price from database/pricing engine'
      );
    });

    test('/api/payments/create-order converts INR price to paise for Razorpay order creation', () => {
      assert.match(
        createOrderContent,
        /amountPaise\s*=\s*resolvedAmount\s*\*\s*100/,
        'Razorpay order creation must charge resolvedAmount * 100 in paise'
      );
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Tier 5: Client-Side Synchronization & Showroom Experience
  // ─────────────────────────────────────────────────────────────
  describe('Tier 5: Client State Synchronization & Showroom Sorting', () => {
    const adminTableContent = fs.readFileSync(adminTableComponentPath, 'utf8');
    const showroomContent = fs.readFileSync(showroomPagePath, 'utf8');
    const pricingHookContent = fs.readFileSync(pricingHookPath, 'utf8');
    const catalogCardContent = fs.readFileSync(catalogCardPath, 'utf8');

    test('AdminTemplatesTable consumes serverTemplate and synchronizes local storage on save', () => {
      assert.match(
        adminTableContent,
        /const serverTemplate = data\.template;/,
        'Admin table must read authoritative serverTemplate from API response'
      );
      assert.match(
        adminTableContent,
        /pricingMap\[templateId\] = serverTemplate\?\.priceInr \?\? editSellingPrice;/,
        'Admin table must sync updated price into localStorage pricingMap'
      );
      assert.match(
        adminTableContent,
        /localStorage\.setItem\("unfold_template_pricing", JSON\.stringify\(pricingMap\)\);/,
        'Admin table must persist updated price to localStorage unfold_template_pricing'
      );
    });

    test('useTemplatePricing hook listens to localStorage and queries public API with cache buster', () => {
      assert.match(
        pricingHookContent,
        /localStorage\.getItem\("unfold_template_pricing"\)/,
        'useTemplatePricing must read cached pricingMap on client mount'
      );
      assert.match(
        pricingHookContent,
        /\/api\/templates\/pricing\?_t=/,
        'useTemplatePricing must query pricing API with timestamp cache buster'
      );
      assert.match(
        pricingHookContent,
        /cache:\s*"no-store"/,
        'useTemplatePricing must specify cache: no-store'
      );
    });

    test('Showroom page (/templates) uses getPricingDetails for live dynamic price sorting', () => {
      assert.match(
        showroomContent,
        /const \{ getPricingDetails \} = useTemplatePricing\(\);/,
        'Showroom page must consume useTemplatePricing hook'
      );
      assert.match(
        showroomContent,
        /if \(sortBy === "price_asc"\) \{\s*const priceA = getPricingDetails\(a\?\.id, a\?\.price\)\.priceInr;\s*const priceB = getPricingDetails\(b\?\.id, b\?\.price\)\.priceInr;\s*return priceA - priceB;\s*\}/s,
        'Showroom must sort price ascending by dynamic getPricingDetails'
      );
      assert.match(
        showroomContent,
        /if \(sortBy === "price_desc"\) \{\s*const priceA = getPricingDetails\(a\?\.id, a\?\.price\)\.priceInr;\s*const priceB = getPricingDetails\(b\?\.id, b\?\.price\)\.priceInr;\s*return priceB - priceA;\s*\}/s,
        'Showroom must sort price descending by dynamic getPricingDetails'
      );
    });

    test('TemplateCatalogCard renders dynamic priceFormatted, originalPriceFormatted and discount badge', () => {
      assert.match(
        catalogCardContent,
        /pricing\.isOnSale && \(\s*<div.*\{pricing\.discountPercent\}% OFF/s,
        'Catalog card must render % OFF badge when on sale'
      );
      assert.match(
        catalogCardContent,
        /pricing\.originalPriceFormatted/,
        'Catalog card must render strikethrough original MRP'
      );
      assert.match(
        catalogCardContent,
        /pricing\.priceFormatted/,
        'Catalog card must render current selling price'
      );
    });
  });
});
