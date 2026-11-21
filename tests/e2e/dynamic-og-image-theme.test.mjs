import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Dynamic OG Thumbnail Preview Link - Themes, Cultural Traditions, and 3D Structure", async (t) => {
  const themesPath = path.resolve("lib/og-template-themes.ts");
  const slugOgPath = path.resolve("app/[slug]/opengraph-image.tsx");
  const slugLayoutPath = path.resolve("app/[slug]/layout.tsx");

  assert.ok(fs.existsSync(themesPath), "lib/og-template-themes.ts exists");
  assert.ok(fs.existsSync(slugOgPath), "app/[slug]/opengraph-image.tsx exists");
  assert.ok(fs.existsSync(slugLayoutPath), "app/[slug]/layout.tsx exists");

  const themesContent = fs.readFileSync(themesPath, "utf-8");
  const slugOgContent = fs.readFileSync(slugOgPath, "utf-8");
  const slugLayoutContent = fs.readFileSync(slugLayoutPath, "utf-8");

  await t.test("OG Template Themes define distinct palettes and 3D structures for core templates", () => {
    // Check template theme definitions
    assert.ok(themesContent.includes('"imperial-palace"'), 'Should define imperial-palace theme');
    assert.ok(themesContent.includes('"sheesh-mahal"'), 'Should define sheesh-mahal theme');
    assert.ok(themesContent.includes('"royal-heritage"'), 'Should define royal-heritage theme');
    assert.ok(themesContent.includes('"celestial-rose"'), 'Should define celestial-rose theme');
    assert.ok(themesContent.includes('"royal-lotus"'), 'Should define royal-lotus theme');

    // Check specific theme color indicators
    assert.ok(themesContent.includes('#361114'), 'Imperial Palace should have regal mahogany/burgundy gradient');
    assert.ok(themesContent.includes('#0A382C'), 'Sheesh Mahal should have Mughal emerald gradient');
    assert.ok(themesContent.includes('#13334C'), 'Royal Heritage should have Mediterranean azure gradient');
    assert.ok(themesContent.includes('#281438'), 'Celestial Rose should have twilight starlight gradient');
  });

  await t.test("Faith & Cultural Tradition invocation logic is dynamic and accurate", () => {
    // Muslim Islamic Bismillah
    assert.ok(
      themesContent.includes("بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"),
      "Must define Islamic Bismillah for Muslim ceremonies"
    );

    // Hindu auspicious Ganesha
    assert.ok(
      themesContent.includes("॥ श्री गणेशाय नमः ॥"),
      "Must define Ganesha invocation for Hindu ceremonies"
    );

    // Universal sacred celebration
    assert.ok(
      themesContent.includes("✦ A SACRED CELEBRATION OF LOVE ✦"),
      "Must define Universal celebration for non-denominational ceremonies"
    );

    // Function exported
    assert.ok(
      themesContent.includes("export function getOgThemeForTemplate"),
      "Must export getOgThemeForTemplate helper"
    );
  });

  await t.test("app/[slug]/opengraph-image.tsx dynamically queries templateId and renders 3D structure", () => {
    assert.ok(slugOgContent.includes("templateId: true"), "Must select templateId from Prisma");
    assert.ok(slugOgContent.includes("translations: true"), "Must select translations from Prisma");
    assert.ok(slugOgContent.includes("getOgThemeForTemplate"), "Must resolve dynamic OG theme");
    assert.ok(slugOgContent.includes("theme.bgGradient"), "Must apply dynamic background gradient");
    assert.ok(slugOgContent.includes("theme.borderOuter"), "Must apply dynamic outer border color");
    assert.ok(slugOgContent.includes("theme.borderInner"), "Must apply dynamic inner border color");
    assert.ok(slugOgContent.includes("TAP TO OPEN 3D DIGITAL INVITATION"), "Must display 3D interactive action pill");
    assert.ok(slugOgContent.includes("theme.watermark"), "Must display template-specific watermark");
    assert.ok(slugOgContent.includes("sacredInvocation"), "Must display dynamic sacred invocation");
  });

  await t.test("app/[slug]/layout.tsx generates front-loaded description avoiding truncation", () => {
    assert.ok(
      slugLayoutContent.includes("${coupleTitle} cordially invite you to celebrate their wedding"),
      "Description should front-load couple names, date, and venue to prevent mobile WhatsApp truncation"
    );
    assert.ok(slugLayoutContent.includes("templateId: true"), "Must select templateId in layout");
  });
});
