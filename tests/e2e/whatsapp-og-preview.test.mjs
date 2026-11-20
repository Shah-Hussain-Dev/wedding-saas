import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("WhatsApp & Social Link Preview Metadata Standards", async (t) => {
  const rootOgPath = path.resolve("app/opengraph-image.tsx");
  const slugOgPath = path.resolve("app/[slug]/opengraph-image.tsx");
  const slugLayoutPath = path.resolve("app/[slug]/layout.tsx");
  const rootLayoutPath = path.resolve("app/layout.tsx");
  const footerPath = path.resolve("components/invitation/TemplateMarketingFooter.tsx");

  const rootOgContent = fs.readFileSync(rootOgPath, "utf-8");
  const slugOgContent = fs.readFileSync(slugOgPath, "utf-8");
  const slugLayoutContent = fs.readFileSync(slugLayoutPath, "utf-8");
  const rootLayoutContent = fs.readFileSync(rootLayoutPath, "utf-8");
  const footerContent = fs.readFileSync(footerPath, "utf-8");

  await t.test("Feature 1: The word 'lifetime' is removed from all preview badges & marketing chips", () => {
    assert.strictEqual(
      rootOgContent.toLowerCase().includes("lifetime"),
      false,
      "root opengraph-image.tsx must not contain the word 'lifetime'"
    );
    assert.strictEqual(
      slugOgContent.toLowerCase().includes("lifetime"),
      false,
      "slug opengraph-image.tsx must not contain the word 'lifetime'"
    );
    assert.strictEqual(
      footerContent.toLowerCase().includes("· lifetime"),
      false,
      "TemplateMarketingFooter must not contain '· Lifetime'"
    );
  });

  await t.test("Feature 2: app/[slug]/layout.tsx generates complete WhatsApp OpenGraph tags", () => {
    assert.ok(
      slugLayoutContent.includes("metadataBase: new URL(siteConfig.url)"),
      "Must define metadataBase with siteConfig.url"
    );
    assert.ok(
      slugLayoutContent.includes("og:image:secure_url"),
      "Must define og:image:secure_url in other metadata for WhatsApp SSL requirements"
    );
    assert.ok(
      slugLayoutContent.includes("type: \"image/png\""),
      "Must specify explicit image type for WhatsApp parser"
    );
    assert.ok(
      slugLayoutContent.includes("width: 1200") && slugLayoutContent.includes("height: 630"),
      "Must specify explicit 1200x630 dimensions"
    );
    assert.ok(
      slugLayoutContent.includes("thumbnail: ogImageUrl"),
      "Must provide thumbnail tag for social chat scrapers"
    );
  });

  await t.test("Feature 3: Slug OG Image has 24h caching and dynamic couple name sizing", () => {
    assert.ok(
      slugOgContent.includes("export const revalidate = 86400"),
      "Must cache generated OG images to prevent WhatsApp scraper timeouts"
    );
    assert.ok(
      slugOgContent.includes("nameFontSize"),
      "Must calculate nameFontSize dynamically so long names never clip"
    );
  });

  await t.test("Feature 4: Root layout does not reference overweight >300KB hero-bg image", () => {
    assert.strictEqual(
      rootLayoutContent.includes("/images/hero-bg.png"),
      false,
      "Root layout should not use 759KB /images/hero-bg.png which violates WhatsApp's 300KB limit"
    );
    assert.ok(
      rootLayoutContent.includes("/opengraph-image"),
      "Root layout must point to the optimized dynamic opengraph-image"
    );
  });
});
