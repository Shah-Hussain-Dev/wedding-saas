# Task: Codebase Architecture & Integration Inspection

## Role
You are a teamwork_explorer. Your job is read-only exploration and analysis of the existing codebase.

## Objective
Inspect the existing wedding invitation project to understand:
1. Project structure, Next.js version (App Router vs Pages Router, check package.json, next.config, etc.).
2. How existing invitation templates are defined, structured, and registered (where templates live, how routes/slugs work, how templates are selected or previewed).
3. Data models and schemas for wedding invitation data (couple names, dates, events, venue, photos, music, RSVP, countdown, etc.) and how props/configuration are passed to templates.
4. Styling system (Tailwind configuration, CSS modules, global CSS, design tokens, fonts setup).
5. Animation utilities and libraries installed/used (Framer Motion, GSAP, Lucide icons, etc.).
6. Shared UI components (audio player, countdown, RSVP form, gallery, modal, wax seal, etc.) that can be reused or must remain isolated.
7. Public asset structure (where template assets, audio files, images, SVGs live).
8. Build, lint, and test scripts and commands (`npm run build`, `npm run lint`, etc.).

## Constraints
- Read-only: DO NOT modify any code or files outside your working directory.
- Document exact file paths, exported component names, and data structures.
- Identify the exact integration point for adding the new 'Sheesh Mahal' template without breaking existing templates or global styles.

## Output
Write your comprehensive analysis report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\explorer_codebase\handoff.md`
and notify the orchestrator with `send_message`.


## 2026-10-29T16:00:39Z
From: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32 (parent)
**Context**: Codebase Architecture Survey
**Content**: Checking in on progress. Have you completed the inspection of package.json, routing, templates, data models, styling, and shared components?
**Action**: Please update your progress.md and provide an estimate or submit your handoff.md if ready.
