# Operon Bathroom Design Studio Master Working Plan

## Product Mission

Operon Bathroom Design Studio is a staged Design-to-Scope Bridge inside Operon Bathrooms. It helps a user move from quick inspiration to structured preferences, conceptual selections, evidence prompts and the existing planning estimate/review/site-measure paths.

The product is not a generic AI image generator, a professional CAD replacement, a measured plan, a specification tool, a final quote engine or a construction documentation system.

## Strategy

Quick inspiration -> structured design preferences -> approximate planning -> product and finish selection -> risk and evidence prompts -> planning estimate -> quote review -> request review -> site measure -> later Quote OS.

The primary KPI is qualified lead conversion, not render count, session duration or visual novelty.

## Current Repository Capabilities

- Next.js 15, React 19 and TypeScript application.
- Zod validation for estimate and intake flows.
- Public planning estimate wizard at `/quote`.
- Quote review, request review and site measure flows.
- Bathroom chatbot with safe routing.
- Admin-lite lead workflow, qualification and manual review report foundations.
- Local/staging Supabase migrations and verification scripts.
- Public crawl, safety, responsive and bundle-safety QA scripts.

## Current Approved Phase

Phase 0/1 Local Proof of Concept is `APPROVED`.

Phase 2 Structured Planner is `IN_PROGRESS` for acceptance criteria and implementation planning.

No Phase 3 or later work is approved.

## Completed Work Before Design Studio

- Bathroom MVP and SEO foundation merged to `main`.
- Public lead flows, admin-lite, chatbot, manual review reports and QA harnesses exist.
- Post-merge email preview/provider-failure verification passed locally.

## Current-Stage Backlog

1. Define Phase 2 Structured Planner acceptance criteria.
2. Extend the draft contract for approximate layout planning without measured-plan claims.
3. Add bounded room-shape and fixture-zone inputs.
4. Add an approximate 2D planning canvas using accessible HTML/CSS/SVG, not CAD/WebGL.
5. Add validation for layout conflicts, access constraints and scope risks.
6. Keep all outputs labelled as approximate planning guidance only.
7. Preserve local-only storage and safe non-price handoff into existing estimate/review flows.
8. Add tests for layout validation, storage boundaries, public wording and handoff compatibility.
9. Run local QA and complete the Phase 2 gate review before Phase 3.

## Future Phases

- Phase 2: structured planner with editable approximate layouts.
- Phase 3: verified product catalogue.
- Phase 4: AI and constraint intelligence.
- Phase 5: AR and measurement.
- Phase 6: Quote OS integration.

Phase 2 is approved to start. Each later phase requires a passed gate report and explicit Vincent approval.

## Dependencies

- Existing Operon Bathrooms visual system and routing.
- Existing `/quote` estimate journey.
- Existing Zod, React and Next.js stack.
- Existing `pdf-lib` dependency only if a later local PDF export is approved as low risk.

## Data Contracts

The Phase 0/1 contract is `BathroomDesignDraft` schema version `0.1`. It stores structured design choices only. It excludes image data, blobs, base64, private rates, final prices and personal contact data.

## Privacy Boundaries

- User-selected photos stay in browser memory only.
- No upload, Supabase storage, localStorage image data, analytics image data or server logging.
- Saved drafts may record only `photoUsed: true`.
- Object URLs must be revoked.

## Public-Language Boundaries

Every output must distinguish inspiration visual, approximate layout, measured layout, conceptual product, verified product, planning estimate, confirmed written scope and contract pricing.

Site measure, selections, licensed-trade checks and written scope confirmation are required before contract pricing.

## Testing Standards

- Unit tests for schema, data limits, local storage and estimate handoff.
- Component/render tests for trust labels and feature-flag behavior.
- Existing lint, typecheck, test, build and bundle-safety scripts must pass.
- Do not weaken existing QA scripts.

## Stage Gates

Codex must not approve a next phase. A phase can begin only when its gate report passes and Vincent manually sets the next phase to `APPROVED`.

## Kill And Pause Rules

Pause if privacy boundaries cannot be guaranteed, internal pricing leaks, public wording implies measured/specification/quote status, bundle size becomes unreasonable, or Phase 0/1 scope starts drifting into 2D geometry, 3D, AR, catalogue or Quote OS.

## Do-Not-Build List

No production AI, production 3D, WebGL/WebGPU editor, AR, LiDAR, BIM, live supplier feeds, inventory, checkout, marketplace, contractor bidding, automatic final quotes, construction documents, compliance certification, public gallery, native mobile app, Quote OS or production image storage.

## Decision Owners

- Vincent: phase approvals, merge/release decisions and production/staging service approvals.
- Codex: implementation, local QA, documentation, gate report preparation and safe blockers.

## Next Action

Define and implement Phase 2 Structured Planner inside the approved planning-only boundary. Stop before Phase 3.
