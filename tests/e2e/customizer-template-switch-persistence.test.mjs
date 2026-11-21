import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Customizer Template Switch Data Persistence Standards", async (t) => {
  const wizardFile = fs.readFileSync(
    path.resolve("components/customizer/InvitationCustomizerWizard.tsx"),
    "utf8"
  );
  const syncFile = fs.readFileSync(
    path.resolve("lib/customizer-preview-sync.ts"),
    "utf8"
  );

  await t.test("Feature 1: State initialization reads brideParents and groomParents from draft", () => {
    assert.ok(
      wizardFile.includes("const draft = readCustomizerDraft(templateId);"),
      "Wizard must attempt reading draft on state initialization"
    );
    assert.ok(
      wizardFile.includes("draftParents"),
      "Wizard must initialize brideParents/groomParents from draft if present"
    );
  });

  await t.test("Feature 2: Draft hydration effect restores brideParents and groomParents", () => {
    assert.ok(
      wizardFile.includes("bParents") && wizardFile.includes("setBrideParents(bParents)"),
      "Hydration effect must restore brideParents"
    );
    assert.ok(
      wizardFile.includes("gParents") && wizardFile.includes("setGroomParents(gParents)"),
      "Hydration effect must restore groomParents"
    );
  });

  await t.test("Feature 3: Custom slug / web link and isSlugManuallyEdited are preserved across template switch", () => {
    assert.ok(
      wizardFile.includes("isSlugManuallyEdited") &&
        wizardFile.includes("setSlug(source.slug.trim())"),
      "Hydration effect must set custom slug and lock manual edit status"
    );
    assert.ok(
      wizardFile.includes("isSlugManuallyEdited,") && wizardFile.includes("normalizedSlug"),
      "buildDraftPayload must persist isSlugManuallyEdited flag in payload"
    );
  });

  await t.test("Feature 4: migrateCustomizerDraftToTemplate preserves all custom user fields", () => {
    assert.ok(
      syncFile.includes("migrateCustomizerDraftToTemplate"),
      "customizer-preview-sync must export migrateCustomizerDraftToTemplate"
    );
    assert.ok(
      syncFile.includes("writeCustomizerDraft(toTemplateId, migrated)"),
      "migrateCustomizerDraftToTemplate must write draft for target template"
    );
  });
});
