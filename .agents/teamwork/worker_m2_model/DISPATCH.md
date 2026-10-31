# Task: Milestone 2 — Data Model, Props Interface & Platform Registration

## Role
You are a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m2_model`

## Mandatory Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md`
5. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\explorer_codebase\handoff.md` (Contains exact 10 touchpoints)

## Objectives
1. **Template Directory & Data Contract**:
   - Create `templates/sheesh-mahal/data.json` containing authentic default data for Zain & Anaya, Karachi venues, 4 events (Mehndi, Nikah, Baraat, Walima), sacred verses (Bismillah, Surah Ar-Rum 30:21), family names (Mr & Mrs Imran Siddiqui, Mr & Mrs Faisal Chaudhry), dress codes, and music path.
   - Create `templates/sheesh-mahal/types.ts` defining `SheeshMahalProps` and `SheeshMahalData`.
   - Create `templates/sheesh-mahal/page.tsx` as a modular client component (`"use client"`) that merges incoming `data?: any` over `defaultData` and sets up the root element (`.sheesh-mahal-root`).
   - Create `templates/sheesh-mahal/index.ts` exporting `default` (SheeshMahal) and `sheeshMahalData`.
   - Create `templates/sheesh-mahal/style.css` with initial scoped theme variables.

2. **Connect the 10 Platform Integration Touchpoints**:
   Follow Section 2.3 of `explorer_codebase/handoff.md` precisely:
   - `templates/index.ts`: Import and add `sheesh-mahal` to `TEMPLATES_MAP` and `TEMPLATE_DEFAULT_DATA`.
   - `lib/template-meta.ts`: Add `"sheesh-mahal"` to `TemplateId` union, `TEMPLATE_META` dictionary, and `TEMPLATE_COMPONENTS` dynamic import.
   - `lib/pdf-theme-tokens.ts`: Add `"sheesh-mahal"` to `PDF_THEME_TOKENS`.
   - `lib/preview-faith-content.ts`: Add `"sheesh-mahal"` in `getDefaultFaithForTemplate` (default to `"muslim"` or universal with authentic fallback).
   - `components/invitation/TemplateMarketingFooter.tsx`: Add `"sheesh-mahal"` theme tokens to `TEMPLATE_THEMES`.
   - `app/preview/[templateId]/page.tsx`: Add `"sheesh-mahal"` to `KNOWN_TEMPLATE_IDS`, and add `.sheesh-audio-pill, .sm-music-toggle` to audio suppression styles.
   - `app/preview/[templateId]/interactive/page.tsx`: Add `"sheesh-mahal"` to `ALL_16_TEMPLATES`.
   - `app/templates/page.tsx`: Add `"sheesh-mahal"` entry to `TEMPLATES` catalog array.
   - `app/sitemap.ts`: Add `"sheesh-mahal"` to `TEMPLATE_SLUGS`.

3. **Verify Strict Isolation & Build Health**:
   - DO NOT alter any other template folders or code.
   - Run `npx.cmd tsc --noEmit` and confirm 0 errors.
   - Test route resolution (e.g. check that `TEMPLATES_MAP["sheesh-mahal"]` resolves correctly).

## Output
Write your execution and verification report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m2_model\handoff.md`
and notify the orchestrator with `send_message`.
