import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Admin Template Configuration - Interactive Cover Photo & Trailer Video Selectors", async (t) => {
  const pickersPath = path.resolve("components/admin/TemplateMediaPickers.tsx");
  const editorPath = path.resolve("components/admin/TemplateAdminEditor.tsx");

  assert.ok(fs.existsSync(pickersPath), "components/admin/TemplateMediaPickers.tsx exists");
  assert.ok(fs.existsSync(editorPath), "components/admin/TemplateAdminEditor.tsx exists");

  const pickersContent = fs.readFileSync(pickersPath, "utf-8");
  const editorContent = fs.readFileSync(editorPath, "utf-8");

  await t.test("Exports TemplateCoverPicker and TemplateVideoPicker components", () => {
    assert.ok(
      pickersContent.includes("export function TemplateCoverPicker"),
      "Must export TemplateCoverPicker"
    );
    assert.ok(
      pickersContent.includes("export function TemplateVideoPicker"),
      "Must export TemplateVideoPicker"
    );
  });

  await t.test("Curated Cover and Video preset libraries are properly configured", () => {
    assert.ok(
      pickersContent.includes("export const CURATED_COVER_PRESETS"),
      "Must define CURATED_COVER_PRESETS"
    );
    assert.ok(
      pickersContent.includes("export const CURATED_TRAILER_VIDEOS"),
      "Must define CURATED_TRAILER_VIDEOS"
    );

    // Verify key video templates are in catalog
    assert.ok(pickersContent.includes("/videos/royal-heritage.mp4"), "Must include Royal Heritage trailer");
    assert.ok(pickersContent.includes("/videos/royal-prestige.mp4"), "Must include Celestial Rose trailer");
    assert.ok(pickersContent.includes("/videos/royal-elegance-royal.mp4"), "Must include Imperial Palace trailer");

    // Verify key cover templates are in catalog
    assert.ok(pickersContent.includes("/templates/royal-heritage/couple-arch.jpg"), "Must include Royal Heritage cover");
    assert.ok(pickersContent.includes("/templates/imperial-palace/doors-hero.jpg"), "Must include Imperial Palace cover");
    assert.ok(pickersContent.includes("/templates/sheesh-mahal/assets/cover/doors.webp"), "Must include Sheesh Mahal cover");
  });

  await t.test("TemplateVideoPicker embeds HTML5 video player and option for static poster", () => {
    assert.ok(pickersContent.includes("<video"), "Must embed HTML5 <video> player for previewing trailers");
    assert.ok(pickersContent.includes("Use default trailer"), "Must provide 1-click option to reset to template default video");
    assert.ok(pickersContent.includes("None (Static Cover Only)"), "Must provide option to disable video for static cover only");
  });

  await t.test("TemplateCoverPicker provides preset modal and upload options", () => {
    assert.ok(pickersContent.includes("Choose Cover Preset"), "Must provide preset selection button");
    assert.ok(pickersContent.includes("Use default cover"), "Must provide 1-click option to reset to template default cover");
    assert.ok(pickersContent.includes("Upload Custom"), "Must provide option to upload custom photo to Cloudinary");
  });

  await t.test("TemplateAdminEditor integrates TemplateCoverPicker and TemplateVideoPicker in Step 1", () => {
    assert.ok(editorContent.includes("<TemplateCoverPicker"), "Step 1 must use TemplateCoverPicker");
    assert.ok(editorContent.includes("<TemplateVideoPicker"), "Step 1 must use TemplateVideoPicker");
    assert.ok(
      !editorContent.includes('placeholder="/templates/…/opening.mp4"'),
      "Step 1 must not contain raw text input for trailer video path"
    );
  });
});
