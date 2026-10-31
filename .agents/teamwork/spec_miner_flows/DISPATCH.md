# Task: Reference Website Flow, Structure & Interaction Deep Inspection

## Role
You are a teamwork_spec_miner. Your job is read-only specification mining from the authoritative reference implementation.

## Reference URL
https://aqdinvites.com/demo/sheesh-mahal

## Objective
Deeply inspect the reference website across viewports (mobile 375x812, 390x844; tablet 768x1024; desktop 1440x900).
Investigate and document:
1. Complete page structure, sequence of sections from top to bottom (e.g. envelope/flap/wax seal opening experience, hero cover, sacred header/invocation, couple introduction, countdown timer, event itineraries/schedules, venue & location details, RSVP form/interactions, photo gallery / lightbox, footer/credits).
2. User interaction states and flows:
   - Initial entry state (locked screen vs unopened envelope vs direct view)
   - Envelope opening micro-interactions (clicking wax seal, flap opening animation, letter sliding out, music triggering)
   - Audio playback behavior: floating music toggle button, autoplay policy handling, mute/unmute state, visual audio waves/equalizer indicator
   - Countdown timer logic (target date, days/hours/minutes/seconds display)
   - RSVP form fields, validation, submit handling, success state
   - Gallery / photo interactions (carousel vs grid, modal lightbox, zoom, swipe)
3. Responsive behavior & mobile viewport layout:
   - Mobile portrait viewports (360px - 430px)
   - Visual focal points: verify that couple faces, heads, crowns, jewelry are completely unobstructed by floating cards or text
   - Touch target sizes (verify >= 44x44px for wax seal, audio toggle, RSVP buttons, gallery controls)
   - Overflow and scrolling mechanics (smooth scroll, snap, or standard vertical scroll)
4. All text content, headings, sacred texts/invocations, date/time examples, and placeholder copy.

## Tools & Skills
- You may use `read_url_content`, `run_command` with curl/node scripts, or browser automation skills if available (e.g. `agent-browser` or `browser-use`).

## Constraints
- Read-only: Do not modify any code or files outside your working directory.

## Output
Write your comprehensive specification report to:
`d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\handoff.md`
and notify the orchestrator with `send_message`.


## 2026-10-29T15:49:27Z
Received dispatch message:
You are spec_miner_flows, a teamwork_spec_miner subagent.
Your assigned working directory is: d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows
Your parent is: 08c3d65b-0165-43d5-a7d7-4b58c33f5e32

MANDATORY: Read the original user request before starting work:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\ORIGINAL_REQUEST.md

Read your detailed task instructions in:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\DISPATCH.md

Your task is to inspect the reference website at https://aqdinvites.com/demo/sheesh-mahal across viewports (mobile 375x812, 390x844; tablet 768x1024; desktop 1440x900).
Document the complete page structure, sections, user interaction states (envelope/wax seal opening sequence, audio controls, countdown, RSVP form, gallery/lightbox, footer), mobile-first ergonomics, facial clearance, and touch target sizes.
Write your comprehensive specification report to:
d:\practice\projects-S\invitation\wedding-saas\.agents\teamwork\spec_miner_flows\handoff.md

When complete, send a message to your parent with your summary and handoff report path.
