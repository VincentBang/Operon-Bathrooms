# Phase 6 Acceptance Criteria

## Phase Name

Phase 6 Quote OS Integration Foundation.

## Current Status

Vincent approved Phase 6 to begin as an acceptance-criteria task on 2026-06-26.

Implementation is not yet approved. No Quote OS code, pricing engine, admin automation, proposal generation, supplier procurement, public quote output, payment, CRM or contract-pricing workflow should be added until this criteria document is reviewed and a scoped implementation path is explicitly approved.

## Phase Intent

Phase 6 may define how Design Studio planning context can safely support later internal Quote OS work.

The phase should bridge Design Studio outputs into internal scope-review thinking without turning the public Design Studio into a final quote tool, contractor proposal generator, procurement system, admin CRM, compliance checker or contract-pricing engine.

## Allowed Direction

Phase 6 may explore:

- a Design Studio to internal Quote OS handoff contract
- safe scope-context mapping from existing bounded draft fields
- internal-only review sections for layout, selections, evidence, constraints and site-measure readiness
- internal manual-review prompts based on already-public planning context
- optional internal summary fields that help a reviewer prepare questions before site measure
- safe routing to existing estimate, quote review, request review and site measure flows
- local-only or docs-only examples of a future internal review packet
- deterministic acceptance rules for what can and cannot be passed forward

## Must Pass Before Implementation

- Define the exact Phase 6 implementation path before coding.
- Confirm whether Phase 6 is documentation-only, handoff-contract-only, internal-review-packet-only or a minimal internal UI.
- Confirm `/design-studio` remains behind `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`.
- Confirm `/design-studio` remains `noindex,nofollow`.
- Confirm public discovery remains controlled by `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY`.
- Confirm the current public Design Studio remains planning-only.
- Define whether the versioned draft contract changes from `0.5` to a later version.
- Define an allowlist of fields that may enter future internal Quote OS context.
- Define forbidden fields that must never enter the handoff or client bundle.
- Define whether any storage is needed. If yes, storage must be internal-only, private and separately approved.
- Define whether any Supabase migration is needed. If yes, it must be local/staging-only until production approval.
- Define tests for private data leaks, pricing leaks, unsafe public wording, handoff compatibility and feature-flag behavior.
- Define rollback criteria before any implementation branch starts.

## Must Pass During Implementation

- Quote OS context must be internal-only unless a separate public release path is approved.
- Public Design Studio output must remain planning guidance only.
- No public output may claim final price, contract pricing, quote approval, legal advice, compliance certification, waterproofing certification, product fit, supplier availability, buildability or construction readiness.
- Site measure, selections, licensed-trade checks and written scope confirmation must remain required before contract pricing.
- Any internal review packet must be labelled as preparation context, not a quote, proposal, contract, specification or construction document.
- Handoff data must be allowlisted, optional and backwards-compatible with existing estimate, quote review, request review and site measure flows.
- No hidden lead score, admin note, supplier cost, labour rate, margin, rate card or private ranking logic may appear in public output or client bundles.
- No live supplier feed, confirmed SKU, price, availability check, purchase order, payment or procurement action may be added.
- No AI/API-assisted pricing, scope approval or proposal generation may be added without separate provider, privacy, retention and safety approval.

## Explicitly Out Of Scope

- Final quotes, fixed prices, contract pricing or quote approval.
- Legal advice, compliance certification, waterproofing certification, DBP/Class 2 confirmation or HBC/HBCF certification.
- Public proposal generation.
- Construction drawings, specifications, measured CAD, build-ready plans or certified measurements.
- Live supplier feeds, verified SKUs, supplier availability, pricing, procurement, purchase orders, checkout or marketplace.
- Payment, CRM, contractor bidding or production workflow automation.
- Admin-lite expansion beyond a separately approved internal review path.
- AI/API-assisted pricing, quoting, proposal writing or automatic scope approval.
- Public release exposure, sitemap inclusion, navigation/footer exposure or indexing changes.
- User-entered measurement fields, AR/browser-camera experiments, uploads or storage unless separately approved.

## Public Language Rules

Use:

- "planning context"
- "internal review preparation"
- "scope questions to confirm"
- "site measure required"
- "selections to confirm"
- "licensed-trade checks required"
- "written scope confirmation required"

Do not use:

- "final quote"
- "fixed price"
- "contract price"
- "approved quote"
- "proposal ready"
- "build-ready"
- "certified"
- "compliant"
- "verified SKU"
- "supplier availability"
- "order now"

## Data Boundary

Allowed inputs:

- existing bounded Design Studio draft fields
- approximate layout planning enum values
- public layout-risk prompts
- governed catalogue-candidate shortlist context
- deterministic constraint prompt IDs and messages
- evidence-readiness checklist status
- preferred next step route
- non-personal route and handoff context

Forbidden inputs:

- uploaded image files
- base64 image data
- EXIF location data
- precise addresses
- personal contact data unless collected in a separately approved lead flow
- private rate cards
- supplier costs
- labour rates
- margins
- lead scoring
- admin notes
- service role keys
- live supplier feeds
- confirmed SKUs
- procurement or payment data

Allowed outputs:

- internal planning-context summary
- scope questions to confirm
- evidence gaps to review
- site-measure readiness notes
- safe next-step route recommendation
- reviewer checklist sections
- public prompt IDs and labels already visible to the user

Forbidden outputs:

- final price
- contract-ready scope
- quote approval
- legal conclusion
- compliance status
- waterproofing certification
- product fit verification
- procurement recommendation
- private scoring
- hidden ranking
- supplier cost or margin
- public proposal

## Test Requirements

- Schema tests if a new `BathroomDesignDraft` version is introduced.
- Handoff tests proving only allowlisted Phase 6 context is passed forward.
- Tests proving existing estimate, quote review, request review and site measure flows work without Phase 6 data.
- Bundle-safety checks for rates, margins, supplier costs, private scoring, service keys, SKU/procurement markers and admin-only notes.
- Component/render tests proving public wording remains planning-only.
- Tests proving `/design-studio` remains feature-flagged and noindex when enabled.
- Tests proving discovery remains hidden unless `NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public` is separately approved.
- Accessibility and responsive QA for any future internal review packet UI.
- Migration safety checks if any local/staging-only database changes are proposed later.

## Rollback And Pause Rules

Pause Phase 6 if:

- Quote OS context cannot be kept internal-only
- public output implies final pricing, quote approval, proposal readiness, legal advice, compliance certification or buildability
- private pricing, margin, rate-card, supplier cost, SKU, procurement, scoring or admin notes would enter the client bundle
- storage or Supabase changes are required without a separate local/staging approval
- existing public lead flows break without Phase 6 context
- the work drifts into payment, CRM, marketplace, procurement, AI/API quoting, live supplier feeds, external exposure or public indexing

## Gate Exit

Phase 6 may move from acceptance criteria to implementation only after Vincent reviews this document and explicitly approves one scoped path:

- documentation-only internal review packet
- handoff-contract-only implementation
- internal-review-packet generation
- minimal internal UI

Until then, Phase 6 implementation remains locked.
