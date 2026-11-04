# DesignOS roadmap

## Milestone 1 — fintech checkout MVP
- Checkout-specific brief prefilled for an India-first fintech payment flow.
- Demo generation returns checkout assumptions, a four-step journey, four screens, design tokens, accessibility checks, and validation scenarios.
- Interactive checkout simulation with UPI/card/net banking selection, WELCOME10 discount, success state, and failure-recovery state.
- Clear demo-only notice; no real payment data or transactions.
- API validation for short/oversized briefs and shallow validation of live model output shape.
- Built-in Node smoke-test script for a running local or deployed instance.

## MVP included
- Brief intake, audience, platform
- Design plan generation (demo mode and optional live model mode)
- Overview, user journey, screen specification, design system, validation tabs
- Export JSON, copy JSON, responsive layout

## Next milestones
1. Persistence: Supabase/Postgres projects and version history.
2. Design system ingestion: upload tokens/components and enforce approved patterns.
3. Figma workflow: connect via official Figma APIs/MCP where appropriate; make write operations explicit and user-approved.
4. Prototype generation: connect generated screen specs to configurable React preview components (the current checkout simulation is a curated demo, not yet generated from each plan).
5. Browser QA: Playwright smoke tests and accessibility checks against generated previews.
6. Evaluation: curated briefs, schema validation, rubric scoring, regression tests, and tracked failure cases.
7. Deployment hardening: auth, rate limits, observability, data retention controls, and cost limits.
8. Dependency install and production build in a network-enabled environment; browser-level testing and accessibility audit.

## Honest demo narrative
"DesignOS takes a fuzzy product brief and creates a reviewable first-pass design direction. It makes assumptions explicit, outlines screens and states, and proposes validation checks. It is a design copilot, not an autonomous designer; human review and user research remain part of the loop."
