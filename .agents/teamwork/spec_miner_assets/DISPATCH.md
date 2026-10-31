# Task: Reference Website Asset Inventory, Styling Tokens & Animation Reverse Engineering

## Role
You are a teamwork_spec_miner. Your job is read-only specification mining and asset auditing from the authoritative reference implementation.

## Reference URL
https://aqdinvites.com/demo/sheesh-mahal

## Objective
Reverse engineer the design tokens, assets, styling, and animations from the reference website:
1. Complete Asset Inventory:
   - Identify and list all public assets used on https://aqdinvites.com/demo/sheesh-mahal:
     * Background images/patterns (textures, palace arches, marble, royal motifs)
     * Decorative SVG/PNG graphics (borders, archways, floral corners, mandalas, divider lines, wax seal emblem)
     * Couple/event placeholder photos
     * Audio file URL (background instrumental music / Shehnai / romantic track)
     * Fonts loaded (Google Fonts, custom webfonts, serif/script/sans-serif font families, font weights, font URLs)
2. Styling & Design Tokens:
   - Color palette: primary, secondary, accent, background, text, gold foils, borders, frosted glass overlays (exact hex/rgba values).
   - Typography hierarchy: font families, font sizes (desktop vs mobile clamp values), line-heights, letter-spacing.
   - Layout tokens: max-widths, card paddings, border radiuses, box shadows, backdrop filters.
3. Animation Mechanics & Timing:
   - CSS animations vs JS libraries (check scripts: GSAP, Framer Motion, AOS, Animate.css, vanilla keyframes, or canvas).
   - Keyframe details for opening envelope, wax seal break/fade, floating particles/petals, section reveal fades/slides, pulsing buttons.
   - Timing functions (easings, durations, delays).
4. Download and Organization Strategy:
   - Provide direct URLs for each asset so they can be saved into the project's public directory cleanly (e.g. `public/templates/sheesh-mahal/...`).

## Tools & Skills
- You may use `read_url_content`, `run_command` with curl/node scripts or network inspection.

## Constraints
- Read-only: Do not modify any code or files outside your working directory.

## Output
Write your comprehensive asset and design tokens report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md`
and notify the orchestrator with `send_message`.


## 2026-10-29T15:49:35Z
You are spec_miner_assets, a teamwork_spec_miner subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\DISPATCH.md

Your task is to reverse engineer all design tokens, styling, assets, and animation mechanics from the reference website at https://aqdinvites.com/demo/sheesh-mahal.
Document:
1. Complete inventory of public assets (backgrounds, motifs, arches, wax seal, couple placeholders, audio file URL, webfonts loaded).
2. Color palette (hex/rgba values for golds, deep royal tones, glassmorphism overlays).
3. Typography hierarchy (font families, clamp rules, weights).
4. CSS/JS animations and keyframe timings (envelope opening, floating particles, reveals).
5. Direct asset URLs and download manifest for saving to the project.
Write your comprehensive report to:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md

When complete, send a message to your parent with your summary and handoff report path.


## 2026-10-29T16:03:46Z
From: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32 (parent)
**Context**: Asset & Design Token Specification Mining
**Content**: Great work extracting `checked_assets.json` and `css_tokens.json`.
**Action**: Please synthesize your findings into `d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_assets\handoff.md` and send your completion message so we can finalize the project decomposition and PROJECT.md.
