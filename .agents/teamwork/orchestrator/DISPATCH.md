## 2026-10-29T15:47:02Z

Reverse engineer and implement the 'Sheesh Mahal' digital wedding invitation template from reference URL https://aqdinvites.com/demo/sheesh-mahal into the existing wedding invitation platform for production use, following the multi-phase inspection, planning, implementation, and verification workflow.

Working directory: d:\practice\projects-S\invitation\wedding-saas
Integrity mode: development

Reference URL: https://aqdinvites.com/demo/sheesh-mahal

## Requirements

### R1. Existing Project Architecture & Convention Inspection (Phase 1)
Inspect the existing wedding invitation project structure, routing, shared components, styling system, animation utilities, configuration data models, and asset directories. Produce an architecture summary and determine the exact template integration location without altering unrelated templates or global styles.

### R2. Reference Website Deep Inspection & Documentation (Phases 2-7)
Open and inspect https://aqdinvites.com/demo/sheesh-mahal using browser automation across desktop and mobile viewports. Document the full page structure, interactive elements, micro-interactions, state transitions, audio controls, animations, timing, and design tokens (palette, typography, layout). Inventory, download, and organize permitted public assets (images, SVGs, audio, fonts) with a verified asset manifest. Author complete `design.md` and `implementation-plan.md` specifications before implementing code.

### R3. Template Implementation & Platform Isolation (Phase 8)
Implement the Sheesh Mahal template as a modular, production-ready React/Next.js template that externalizes wedding-specific details (couple names, dates, events, venue, photos, music) into configuration/props. Strictly adhere to mobile-first responsive design, ensure facial focal points in portrait cards remain completely unobstructed, provide minimum 44×44px touch targets, and isolate template code so existing templates and shared platform components remain unaffected.

### R4. Responsive Testing, Visual Comparison & Final Completion Report (Phases 9-11)
Test responsiveness across mobile (375×812, 390×844), tablet (768×1024), and desktop (1440×900) viewports for mouse and touch interactions. Verify audio behavior (respecting autoplay restrictions), opening sequences, countdown, RSVP, and gallery components. Perform visual regression comparison against reference captures to eliminate layout, styling, and timing discrepancies. Verify that project TypeScript build and lint checks pass cleanly with zero errors, and deliver a detailed completion report.

## Acceptance Criteria

### Architecture & Specification
- [ ] Architecture summary and template integration path documented prior to implementation.
- [ ] `design.md` created with documented color palette, typography hierarchy, layout dimensions, animation parameters, and asset manifest.
- [ ] `implementation-plan.md` created with phased task breakdown, dependencies, and component design before code changes.

### Implementation & Isolation
- [ ] Sheesh Mahal template implemented under the project's template architecture with externalized configuration for wedding details.
- [ ] All existing templates, unrelated routes, shared platform components, and global styles remain unaffected and fully functional.
- [ ] Mobile-first design strictly enforced with unobstructed facial focal points in hero and portrait cards, zero horizontal overflow (`overflow-x: hidden`), and minimum 44×44px interactive touch targets.

### Verification & Quality
- [ ] Responsive layout and interactions verified at viewports 375×812, 390×844, 768×1024, and 1440×900.
- [ ] All interactive states (invitation open sequence, envelope flap/seal, audio toggle, countdown timer, event schedules, RSVP form, gallery/lightbox) function without browser console errors.
- [ ] Automated browser inspection and visual regression comparisons completed against reference captures.
- [ ] TypeScript build and lint checks run cleanly with zero errors (`npm run build` or equivalent).
- [ ] Completion report delivered detailing reference URL, asset inventory counts, files created/modified, and verification outcomes.
