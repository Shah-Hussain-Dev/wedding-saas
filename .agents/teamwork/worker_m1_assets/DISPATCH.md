# Task: Milestone 1 — Asset Pipeline & Media Repository Setup

## Role
You are a teamwork_worker subagent.

## Working Directory
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m1_assets`

## Mandatory Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Context & Inputs
1. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md` (Read this first)
2. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md`
3. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md`
4. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md`
5. `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md` (Contains exact URLs and paths)

## Objectives
1. **Mirror Root Specifications**:
   Copy `.agents/teamwork/design.md`, `.agents/teamwork/implementation-plan.md`, and `.agents/teamwork/PROJECT.md` to project root (`d:\practice\projects-S\invitation\wedding-saas\design.md`, etc.) so that root-level specifications are established.
2. **Download & Organize All 76 Public Assets**:
   - Download the 13 audio files (1 music track + 12 SFX) into `public/templates/sheesh-mahal/audio/`.
   - Download the 63 visual/texture assets into `public/templates/sheesh-mahal/assets/` (`cover/`, `hero/`, `letter/`, `families/`, `events/`, `countdown/`, `rsvp/`, `closing/`).
   - Use Node.js script with resilient fetch and write handling. Note: ensure DNS / IPv4 compatibility (`--dns-result-order=ipv4first`) if needed.
3. **Verify Asset Integrity**:
   - Ensure all 76 files exist on disk with valid file sizes (>0 bytes).
   - Ensure image files have valid WebP headers and audio files have valid MP3 headers.
4. **Build & Type Check**:
   - Run `npx.cmd tsc --noEmit` to ensure the project remains in a clean compilation state.

## Output
Write your execution and verification report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m1_assets\handoff.md`
and notify the orchestrator with `send_message`.


## 2026-10-29T16:09:05Z
You are worker_m1_assets, a teamwork_worker subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m1_assets
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\worker_m1_assets\DISPATCH.md
Also read:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\PROJECT.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\design.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\implementation-plan.md
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md
