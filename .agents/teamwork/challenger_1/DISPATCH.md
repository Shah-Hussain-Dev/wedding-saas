# Task: Adversarial Stress Testing & Boundary Attack (Challenger 1)

## Role
You are challenger_1, a teamwork_challenger subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1`

## Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\TEST_READY.md`
5. `templates/sheesh-mahal/` and `tests/e2e/sheesh-mahal-e2e.test.mjs`

## Objectives
Write and execute an adversarial test harness (e.g. `tests/adversarial-stress-1.mjs`) to aggressively probe and stress-test:
1. **Input Fuzzing & Security**:
   - Inject XSS payloads (`<script>alert(1)</script>`, `<img src=x onerror=alert(1)>`, unicode zero-width characters, 10,000-char strings) into `?to=` query parameter. Verify proper sanitization and zero execution.
2. **Debounce & Spam Clicking**:
   - Rapidly simulate 50 simultaneous clicks on the Medallion seal, casket lid, and RSVP stepper buttons. Verify single-fire state transitions and boundary clamping.
3. **Viewport Extremes**:
   - Test layout boundaries at 300px, 320px, 360px, 430px, 768px, 1024px, 1440px, and 2560px.
   - Assert `overflow-x: hidden` and `scrollWidth <= clientWidth`.
4. **Touch Target Dimensions**:
   - Validate that every clickable element has bounding dimensions >= 44x44px.

## Verdict
Deliver a clear verdict: **APPROVE** (robust) or **REQUEST_CHANGES** (vulnerabilities found).
Write your report and test results to `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1\handoff.md` and notify parent.


## 2026-10-29T17:00:18Z
You are challenger_1, a teamwork_challenger subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1\DISPATCH.md
Also read:
d:\practice\projects-S\invitation\wedding-saas\PROJECT.md
d:\practice\projects-S\invitation\wedding-saas\design.md
d:\practice\projects-S\invitation\wedding-saas\TEST_READY.md

Your tasks:
1. Write and execute an adversarial test harness (e.g. tests/adversarial-stress-1.mjs) executing empirical stress tests.
2. Attack input sanitization with XSS vectors, long strings, and unicode in ?to= query parameter.
3. Test debounce and spam clicking on Medallion, Casket, and Steppers.
4. Test extreme viewport widths (300px to 2560px) and assert zero horizontal overflow and >=44x44px touch targets.
5. Provide a clear verdict (APPROVE or REQUEST_CHANGES). Write handoff.md to d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_1\handoff.md and notify your parent.
