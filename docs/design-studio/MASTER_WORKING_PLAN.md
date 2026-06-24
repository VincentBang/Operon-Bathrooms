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

Phase 2 Structured Planner is `APPROVED`.

Phase 3 Catalogue Candidate Shortlist is `IN_PROGRESS` after Vincent approval on 2026-06-24.

No Phase 4 or later work is approved.

## Completed Work Before Design Studio

- Bathroom MVP and SEO foundation merged to `main`.
- Public lead flows, admin-lite, chatbot, manual review reports and QA harnesses exist.
- Post-merge email preview/provider-failure verification passed locally.

## Current-Stage Backlog

1. Define Phase 3 catalogue-candidate acceptance criteria.
2. Extend the draft contract to schema version `0.3` for bounded product shortlist data.
3. Add a governed local catalogue-candidate data set with no live supplier feed, prices, confirmed SKUs or procurement fields.
4. Add shortlist controls in the existing Design Studio flow.
5. Preserve shortlist context in local draft save, copy/print summary and estimate handoff.
6. Keep all outputs labelled as planning candidates requiring human selection checks.
7. Add tests for schema validation, forbidden field boundaries, storage safety, handoff compatibility and public wording.
8. Run local QA and complete the Phase 3 gate review before any Phase 4 work.

## Future Phases

- Phase 2: structured planner with editable approximate layouts.
- Phase 3: governed catalogue candidates and product shortlist, not verified SKUs.
- Phase 4: AI and constraint intelligence.
- Phase 5: AR and measurement.
- Phase 6: Quote OS integration.

Phase 3 is approved to build. Each later phase requires a passed gate report and explicit Vincent approval.

## Dependencies

- Existing Operon Bathrooms visual system and routing.
- Existing `/quote` estimate journey.
- Existing Zod, React and Next.js stack.
- Existing `pdf-lib` dependency only if a later local PDF export is approved as low risk.

## Data Contracts

The current contract is `BathroomDesignDraft` schema version `0.3`. It stores structured design choices, approximate layout planning, public layout-risk prompts and governed catalogue-candidate shortlist choices only. It excludes image data, blobs, base64, private rates, final prices, personal contact data, live supplier feeds, confirmed SKUs, availability checks and procurement data.

## Privacy Boundaries

- User-selected photos stay in browser memory only.
- No upload, Supabase storage, localStorage image data, analytics image data or server logging.
- Saved drafts may record only `photoUsed: true`.
- Object URLs must be revoked.

## Public-Language Boundaries

Every output must distinguish inspiration visual, approximate layout, measured layout, catalogue candidate, verified product, planning estimate, confirmed written scope and contract pricing.

Site measure, selections, licensed-trade checks and written scope confirmation are required before contract pricing.

## Testing Standards

- Unit tests for schema, data limits, local storage and estimate handoff.
- Component/render tests for trust labels and feature-flag behavior.
- Existing lint, typecheck, test, build and bundle-safety scripts must pass.
- Do not weaken existing QA scripts.

## Stage Gates

Codex must not approve a next phase. A phase can begin only when its gate report passes and Vincent manually sets the next phase to `APPROVED`.

## Kill And Pause Rules

Pause if privacy boundaries cannot be guaranteed, internal pricing leaks, public wording implies measured/specification/quote status, bundle size becomes unreasonable, or Phase 3 scope starts drifting into live supplier feeds, confirmed SKUs, AI ranking, procurement, 3D, AR, Quote OS or later-phase work.

## Do-Not-Build List

No production AI, production 3D, WebGL/WebGPU editor, AR, LiDAR, BIM, live supplier feeds, inventory, confirmed SKUs, checkout, marketplace, contractor bidding, automatic final quotes, construction documents, compliance certification, public gallery, native mobile app, Quote OS or production image storage.

## Decision Owners

- Vincent: phase approvals, merge/release decisions and production/staging service approvals.
- Codex: implementation, local QA, documentation, gate report preparation and safe blockers.

## Next Action

Complete Phase 3 Catalogue Candidate Shortlist inside the approved planning-only boundary. Stop before Phase 4.
