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

Phase 3 Catalogue Candidate Shortlist is `APPROVED` and merged after Vincent approval on 2026-06-24.

Phase 4 Deterministic Constraint Intelligence is `APPROVED` and merged after Vincent approval on 2026-06-24.

Phase 5 AR and Measurement evidence-readiness only path is `APPROVED` and merged after Vincent approval on 2026-06-24. No user-entered measurement fields, release exposure, AI/API-assisted measurement, production AR or upload/storage work is approved yet.

Release-exposure criteria, controlled noindex pilot prep, discovery split, internal-only pilot approval and operations-readiness closeout are merged. This does not approve public release, route indexing, measurement fields or AR/browser-camera work.

Phase 6 Quote OS Integration Foundation is approved and completed for the handoff-contract-only implementation path. Full Quote OS, pricing, proposals, procurement, payment, CRM and public Quote OS output remain locked.

Phase 7 Shared Operon System Infrastructure is approved for acceptance-criteria-only planning, a docs-only shared architecture map, a docs-only shared glossary, a docs-only lifecycle vocabulary, a docs-only adapter-readiness checklist and a docs-only contract field inventory. No Phase 7 implementation, shared package extraction, cross-repo edits, Supabase changes, Netlify changes or public exposure changes are approved.

## Completed Work Before Design Studio

- Bathroom MVP and SEO foundation merged to `main`.
- Public lead flows, admin-lite, chatbot, manual review reports and QA harnesses exist.
- Post-merge email preview/provider-failure verification passed locally.

## Current Decision Queue

1. Review the Phase 7 docs-only contract field inventory PR.
2. Keep Phase 7 implementation locked unless separately approved.
3. Keep `/design-studio` internal-only unless external exposure is separately approved.
4. Keep public discovery, indexing, measurements, AR/browser-camera, upload/storage, shared infrastructure implementation and full Quote OS implementation locked until separate approval.

## Future Phases

- Phase 2: structured planner with editable approximate layouts.
- Phase 3: governed catalogue candidates and product shortlist, not verified SKUs.
- Phase 4: deterministic grounded constraint intelligence; AI/API only after a separate provider and privacy approval.
- Phase 5: AR and measurement, starting with evidence-readiness only before any user-supplied measurement fields or AR/browser-camera experiment.
- Phase 6: Quote OS integration foundation, starting with acceptance criteria only and completed as handoff-contract-only implementation.
- Phase 7: shared Operon System infrastructure, starting with acceptance criteria only.

Phase 3, Phase 4 deterministic implementation and Phase 5 evidence-readiness implementation are complete and approved as merged. Release exposure, later Phase 5 measurement/AR paths and full Quote OS remain separately gated.

## Dependencies

- Existing Operon Bathrooms visual system and routing.
- Existing `/quote` estimate journey.
- Existing Zod, React and Next.js stack.
- Existing `pdf-lib` dependency only if a later local PDF export is approved as low risk.

## Data Contracts

The current contract is `BathroomDesignDraft` schema version `0.5`. It stores structured design choices, approximate layout planning, public layout-risk prompts, governed catalogue-candidate shortlist choices, deterministic constraint prompts and evidence-readiness checklist state only. It excludes image data, blobs, base64, private rates, final prices, personal contact data, live supplier feeds, confirmed SKUs, availability checks, procurement data, AI/API responses, measured accuracy claims and private scoring logic.

Phase 6 implemented an internal-only Quote OS handoff contract without changing the `BathroomDesignDraft` schema version.

Phase 7 may define shared contract candidates, architecture mapping, glossary vocabulary, lifecycle vocabulary, adapter-readiness requirements and contract field classifications as documentation only. No shared package, cross-repo dependency or service integration is approved.

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

Pause if privacy boundaries cannot be guaranteed, internal pricing leaks, public wording implies measured/specification/quote status, bundle size becomes unreasonable, or current scope starts drifting into live supplier feeds, confirmed SKUs, AI/API recommendations, procurement, 3D, AR, Quote OS or later-phase work.

## Do-Not-Build List

No production AI, production 3D, WebGL/WebGPU editor, production AR, LiDAR, BIM, live supplier feeds, inventory, confirmed SKUs, checkout, marketplace, contractor bidding, automatic final quotes, construction documents, compliance certification, public gallery, native mobile app, full Quote OS, shared package extraction, cross-repo infrastructure implementation or production image storage.

## Decision Owners

- Vincent: phase approvals, merge/release decisions and production/staging service approvals.
- Codex: implementation, local QA, documentation, gate report preparation and safe blockers.

## Next Action

Review and approve the Phase 7 contract field inventory PR, then decide whether to pause or draft a docs-only adapter decision packet. Keep `/design-studio` noindex and keep public discovery locked.
