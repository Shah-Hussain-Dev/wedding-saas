# Task: Adversarial Concurrency, State Machine & Lifecycle Stress (Challenger 2)

## Role
You are challenger_2, a teamwork_challenger subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2`

## Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\TEST_READY.md`
5. `templates/sheesh-mahal/` and `tests/e2e/sheesh-mahal-e2e.test.mjs`

## Objectives
Write and execute an adversarial test harness (e.g. `tests/adversarial-concurrency-2.mjs`) to aggressively probe:
1. **Memory & Concurrency Bounds**:
   - Spam-click the water pond in `ReflectingPool` 100 times in 1 second. Verify that active diya instances are strictly capped at max concurrency (20) to prevent memory leak / DOM saturation.
2. **Replay Invitation Lifecycle**:
   - Test cycling through Replay -> Open Gate -> Replay -> Open Gate 10 consecutive times. Verify that scroll locks/unlocks properly without broken state machines.
3. **Audio State Machine Robustness**:
   - Stress test audio state transitions: fast toggle mute/unmute, tab hidden -> tab visible, `?nomusic` override.
4. **LocalStorage Failure Modes**:
   - Test RSVP recovery when `localStorage` throws QuotaExceededError or contains corrupted JSON. Verify graceful fallback without unhandled exception crashes.

## Verdict
Deliver a clear verdict: **APPROVE** (resilient) or **REQUEST_CHANGES** (state machine failures).
Write your report and test results to `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2\handoff.md` and notify parent.


## 2026-10-29T17:00:24Z
From: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32
Content:
You are challenger_2, a teamwork_challenger subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2\DISPATCH.md
Also read:
d:\practice\projects-S\invitation\wedding-saas\PROJECT.md
d:\practice\projects-S\invitation\wedding-saas\design.md
d:\practice\projects-S\invitation\wedding-saas\TEST_READY.md

Your tasks:
1. Write and execute an adversarial test harness (e.g. tests/adversarial-concurrency-2.mjs) testing concurrency, state machines, and lifecycle transitions.
2. Stress test diya spawning concurrency capping (verify active count clamped to prevent memory leak).
3. Stress test Replay Invitation cycle (multiple open -> replay -> open transitions).
4. Stress test audio state machine and LocalStorage quota/corruption failure modes.
5. Provide a clear verdict (APPROVE or REQUEST_CHANGES). Write handoff.md to d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\challenger_2\handoff.md and notify your parent.
