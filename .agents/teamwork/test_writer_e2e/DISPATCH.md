# Task: E2E Testing Track — Opaque-Box Test Suite & Infrastructure

## Role
You are a teamwork_test_writer subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\test_writer_e2e`

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md`

## Objectives
1. **Design E2E Test Infrastructure (`TEST_INFRA.md`)**:
   - Establish opaque-box, requirement-driven test architecture.
   - Target entry points: `/preview/sheesh-mahal`, `/preview/sheesh-mahal/interactive`, and `/[slug]`.
2. **Author Systematic Test Cases Across 4 Tiers**:
   - **Tier 1: Feature Coverage (>=5 per feature)**:
     Happy-path tests verifying each of the 8 template sections in isolation (Door opening, audio toggle, hero names, casket letter unfold, family lamps, 4 event windows, astrolabe countdown, RSVP form, reflecting pool diyas).
   - **Tier 2: Boundary & Corner Cases (>=5 per feature)**:
     Empty RSVP name, `?nomusic` query parameter, `?to=` query parameter with XSS characters, mobile viewport 320px–360px without horizontal overflow (`overflow-x: hidden`), past event dates, touch target sizes >= 44x44px.
   - **Tier 3: Cross-Feature Combinations (Pairwise)**:
     Audio playback + door open sequence, faith switching + sacred verses, RSVP submission + localStorage persistence, replay button + state reset.
   - **Tier 4: Real-World Application Scenarios (>=5 scenarios)**:
     Full end-to-end guest journey, customizer wizard preview with custom couple names, responsive layout rendering across mobile (375x812, 390x844), tablet (768x1024), and desktop (1440x900).
3. **Implement Executable Test Runner**:
   - Write a standalone test runner script (e.g. `tests/e2e/sheesh-mahal-e2e.mjs` or Playwright test suite) that can be run with Node/Playwright.
   - Document execution command in `TEST_INFRA.md` and `TEST_READY.md`.
4. **Publish `TEST_READY.md`**:
   - Publish `TEST_READY.md` at project root (`d:\practice\projects-S\invitation\wedding-saas\TEST_READY.md`) summarizing test counts, runner command, and coverage matrix.

## Constraints
- Do NOT modify application code or implementation components. Focus strictly on tests and test infrastructure.

## Output
Write your handoff report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\test_writer_e2e\handoff.md`
and notify the orchestrator with `send_message`.

## 2026-10-29T16:09:13Z
[Message] timestamp=2026-10-29T16:09:13Z sender=08c3d65b-0165-43d5-a7d7-4b58c33f5e32 priority=MESSAGE_PRIORITY_HIGH content=You are test_writer_e2e, a teamwork_test_writer subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\test_writer_e2e
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\test_writer_e2e\DISPATCH.md
Also read:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md

Your tasks:
1. Establish the opaque-box E2E test infrastructure. Author TEST_INFRA.md at project root.
2. Design and implement systematic test cases across 4 Tiers (Feature Coverage >= 5 per feature, Boundary/Corner Cases >= 5 per feature, Cross-Feature Pairwise, Real-World Application Scenarios >= 5).
3. Create an automated test runner script that can execute these tests (e.g. tests/e2e/sheesh-mahal.test.mjs or Playwright test).
4. Publish TEST_READY.md at project root with test counts, coverage matrix, and runner instructions.
5. Write your handoff report to d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\test_writer_e2e\handoff.md and send a completion message to your parent.
