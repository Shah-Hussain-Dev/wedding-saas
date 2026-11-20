import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Royal Lotus Section 5 (Essentials / Things to Know) has styled Chhatri dome and accessible viewport animations", () => {
  const pagePath = path.resolve("templates/royal-lotus/page.tsx");
  const cssPath = path.resolve("templates/royal-lotus/style.css");

  const pageContent = fs.readFileSync(pagePath, "utf-8");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  // 1. Image has both classes for backward & forward compatibility
  assert.ok(
    pageContent.includes('className="essentials__chhatri essentials__jharokha"'),
    "motif-chhatri.webp must have both essentials__chhatri and essentials__jharokha classes"
  );
  assert.ok(
    pageContent.includes('src="/templates/lotus-courtyard/motif-chhatri.webp"'),
    "motif-chhatri.webp image source must exist"
  );

  // 2. Viewport amount should be 0.1 for desktop visibility reliability
  assert.ok(
    pageContent.includes('viewport={{ once: true, amount: 0.1 }}'),
    "Section 5 elements must have accessible viewport amount (0.1) so they trigger reliably on desktop"
  );

  // 3. CSS must define rules for both .essentials__chhatri and .essentials__jharokha
  assert.ok(
    cssContent.includes(".tmpl-lotus-courtyard .essentials__chhatri") &&
    cssContent.includes(".tmpl-lotus-courtyard .essentials__jharokha"),
    "style.css must style both .essentials__chhatri and .essentials__jharokha"
  );

  // 4. CSS must have width constraints so 1134px wide image does not blow up
  assert.ok(
    cssContent.includes("max-width: 120px") || cssContent.includes("width: clamp("),
    "style.css must constrain chhatri width"
  );

  // 5. Verify the asset file exists on disk
  const chhatriAssetPath = path.resolve("public/templates/lotus-courtyard/motif-chhatri.webp");
  assert.ok(fs.existsSync(chhatriAssetPath), "motif-chhatri.webp must exist in public directory");
});
