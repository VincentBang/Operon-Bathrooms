# Phase 5 Acceptance Criteria

## Phase Name

Phase 5 AR and Measurement.

## Current Status

Vincent approved Phase 5 to begin as an acceptance-criteria and release-boundary task on 2026-06-24.

Implementation is not yet approved. No AR, camera, sensor, upload, measured-plan, pricing, procurement or Quote OS code should be added until this criteria document is reviewed and the implementation path is explicitly approved.

## Phase Intent

Phase 5 may improve the feature-flagged Design Studio by helping users prepare better room evidence for site review.

The phase must support scope clarity and site-measure preparation. It must not become a measured CAD tool, LiDAR capture product, construction drawing system, compliance checker, product-fit verifier, final quote engine or procurement workflow.

## Allowed Direction

Phase 5 may explore:

- a guided evidence checklist for room dimensions, wall photos, fixtures, services, ventilation, access, strata notes and known issues
- user-entered approximate measurement fields with clear "supplied by user, unverified online" labels
- optional browser-only visual measurement prompts that explain what to photograph or measure, without calculating certified dimensions
- optional local-only AR placement research if it is explicitly bounded, feature-flagged and not persisted
- an evidence-readiness summary that routes users to `/site-measure`, `/request-review`, `/quote/review` or `/quote`
- safe handoff context that tells the next flow which evidence prompts were completed, without storing images or private scoring
- accessibility-first alternatives for any visual or AR-adjacent feature

## Must Pass Before Implementation

- Confirm whether Phase 5 starts with evidence-readiness only, user-entered approximate measurements or an AR/browser-camera experiment.
- Define the exact browser capabilities required before any AR/camera path is considered.
- Confirm `/design-studio` remains behind `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`.
- Confirm `/design-studio` remains `noindex,nofollow`.
- Define the versioned data-contract change, likely `BathroomDesignDraft` schema `0.5`.
- Define whether any camera/photo/file input is used. If yes, confirm it stays browser-memory-only unless a separate private-storage approval is given.
- Define object URL cleanup, no-upload behavior, no analytics image capture and no localStorage image persistence.
- Define all public labels for approximate measurements, unverified user inputs and site-measure requirements.
- Define tests for unsafe wording, image-data leaks, private data leaks, feature flag behavior and handoff compatibility.
- Define rollback criteria before any implementation branch starts.

## Must Pass During Implementation

- Any measurement value must be labelled as user-supplied and unverified online.
- Any visual placement or AR-adjacent UI must be labelled as planning guidance only.
- No output may claim measured accuracy, buildability, compliance, waterproofing status, strata status, fixture fit, product compatibility, final price or contract readiness.
- Site measure, selections, licensed-trade checks and written scope confirmation must remain required before contract pricing.
- Camera/photo features, if approved, must not upload or persist image data by default.
- Saved drafts may store only safe evidence status such as `photoEvidencePrepared: true`, not files, image data, EXIF data or precise location data.
- The feature must work without AR/camera support and provide an accessible non-visual fallback.
- Existing estimate, quote review, request review and site measure flows must continue to work without Phase 5 data.
- No hidden lead score, admin note, supplier cost, labour rate, margin, rate card or private ranking logic can appear in public output or client bundles.

## Explicitly Out Of Scope

- Final quotes, fixed prices or contract pricing.
- Legal advice, compliance certification, waterproofing certification or DBP/Class 2 confirmation.
- Measured CAD, construction drawings, specifications, certified measurements or build-ready plans.
- LiDAR, BIM, native mobile AR, WebXR production AR, scan-to-plan, room reconstruction or automatic dimension extraction unless a later technical spike is separately approved.
- AI image generation or AI/API-assisted measurement interpretation.
- Live supplier feeds, verified SKUs, supplier availability, pricing, procurement, checkout or marketplace.
- Quote OS implementation.
- Payment, CRM, contractor bidding or production upload storage.
- Public release exposure or indexing changes.

## Public Language Rules

Use:

- "planning guidance"
- "user-supplied measurement"
- "unverified online"
- "prepare for site measure"
- "confirm during site inspection"
- "confirm with licensed trades"
- "written scope confirmation"

Do not use:

- "measured plan"
- "certified measurement"
- "CAD drawing"
- "construction drawing"
- "build-ready"
- "compliant"
- "approved"
- "final quote"
- "fixed price"
- "guaranteed"
- "verified fit"

## Data Boundary

Allowed inputs:

- existing bounded Design Studio draft fields
- user-entered approximate measurement ranges or values, if approved
- safe evidence checklist status
- feature flag state
- non-personal route and handoff context

Forbidden inputs:

- uploaded image files unless separately approved
- base64 image data
- EXIF location data
- precise address data
- personal contact data
- private rate cards
- supplier costs
- labour rates
- margins
- lead scoring
- admin notes
- service role keys

Allowed outputs:

- evidence checklist completion status
- public evidence prompt IDs
- measurement confidence label such as `unverified-user-supplied`
- recommended next step route
- safe handoff context for site measure or review flows

Forbidden outputs:

- final price
- contract-ready scope
- compliance status
- legal conclusion
- product fit verification
- procurement recommendation
- private scoring
- hidden ranking
- internal notes

## Test Requirements

- Unit tests for schema version `0.5` if new fields are added.
- Tests proving image data, base64 strings, EXIF-like payloads and private markers are rejected or not persisted.
- Component/render tests proving safe wording and no measured-plan, final-price or compliance claims.
- Handoff tests proving Phase 5 evidence context is allowlisted and optional.
- Feature-flag tests proving `/design-studio` remains hidden when disabled.
- Noindex/nofollow tests proving the route remains non-indexable when enabled.
- Accessibility tests for any visual measurement, checklist or AR-adjacent UI.
- Responsive QA across desktop, laptop, tablet and mobile.
- Bundle-safety checks for private pricing, secret markers and image-data persistence markers.

## Rollback And Pause Rules

Pause Phase 5 if:

- AR, camera, upload or storage privacy boundaries are unclear
- image data, EXIF data, personal data or precise addresses would be persisted without separate approval
- public output implies measured accuracy, compliance, buildability, final pricing or legal advice
- accessible non-visual fallbacks cannot be provided
- browser support makes the experience unreliable or misleading
- client bundles expose private markers
- Phase 5 drifts into LiDAR, BIM, production AR, supplier feeds, procurement, Quote OS or release exposure

## Gate Exit

Phase 5 may move from acceptance criteria to implementation only after Vincent reviews this document and explicitly approves one scoped path:

- evidence-readiness only
- user-entered approximate measurements
- a separately bounded AR/browser-camera experiment

Until then, Phase 5 implementation remains locked.
