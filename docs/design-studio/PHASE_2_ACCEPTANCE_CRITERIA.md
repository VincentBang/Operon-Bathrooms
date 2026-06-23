# Phase 2 Structured Planner Acceptance Criteria

Status: Approved to start. Acceptance criteria defined before implementation.

## Phase Goal

Phase 2 adds a structured approximate bathroom planner that helps users describe a layout, fixture zones, access constraints and renovation risks before continuing into the existing estimate, quote review, request review or site measure paths.

The planner must remain a planning aid. It must not create measured drawings, construction documentation, compliance certification, final pricing or a Quote OS output.

## Approved User Outcomes

- A user can select an approximate bathroom shape and broad size band.
- A user can place or describe fixture zones for shower, bath, vanity, toilet, laundry and storage where relevant.
- A user can identify door, window, ventilation, waste/drain and access constraints at a planning level.
- A user can see a simple approximate 2D visual that communicates zones and risks without implying measured accuracy.
- A user can save, copy or print a planning summary.
- A user can hand safe non-price layout context into `/quote`, `/quote/review`, `/request-review` or `/site-measure`.

## Required Public Labels

Every planner output must clearly state:

- "Approximate planning layout"
- "Not a measured plan"
- "Not a construction drawing"
- "Planning guidance only"
- "Site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing"

## Data Contract Acceptance

- Extend the existing design draft schema with a new versioned layout object.
- Store only structured layout choices, zones, constraints and user-selected labels.
- Do not store image data, blobs, base64, supplier pricing, labour rates, margins, final prices, internal notes or lead scoring.
- Keep handoff data allowlisted and non-price.
- Reject invalid room shapes, fixture types, impossible enum values and oversized payloads.

## Planner UI Acceptance

- The planner must be usable on desktop, laptop, tablet and mobile.
- The planner must use semantic controls and keyboard-operable actions.
- The approximate preview must be implemented with bounded HTML/CSS/SVG or equivalent lightweight frontend primitives. Stage 2E uses HTML/CSS only.
- The preview must not use CAD, WebGL, WebGPU, AR, LiDAR, BIM or external rendering services.
- The interface must not block existing quote/review/site-measure CTAs.

## Layout Logic Acceptance

- Maximum fixture zones are bounded.
- Room size bands are approximate and must not imply measured dimensions.
- Layout warnings should be phrased as "clarify", "check", "may affect scope" or "site review required".
- High-risk topics should route users toward quote review, request review or site measure.
- The planner must never say a layout is compliant, buildable, waterproofed, structurally suitable or ready for contract pricing.

## Safety Boundaries

Forbidden in Phase 2:

- Measured CAD output.
- Dimensioned construction drawings.
- Compliance certificates or legal advice.
- Final quote or fixed price.
- Supplier/product catalogue claims.
- Internal rate cards, supplier costs, labour rates, margins, scoring logic or admin notes.
- Private upload storage or external image processing.
- Quote OS, procurement, checkout, marketplace or CRM work.

## Test Acceptance

Phase 2 must add or update tests for:

- Schema validation and payload bounds.
- Layout-zone validation.
- Local storage privacy.
- Handoff allowlist and expiry behavior.
- Public label and disclaimer rendering.
- No internal rates, supplier costs or final pricing in public output.
- Feature-flag route behavior remains safe.

## QA Acceptance

Before Phase 2 gate review, run:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run qa:bundle-safety`
- `npm run qa:local`
- `git diff --check`

If any command does not exist or fails, record the exact result in the Phase 2 gate review.

## Gate Exit

Phase 2 is complete only when implementation, tests, local QA, privacy checks, wording checks and a Phase 2 gate review are complete.

Phase 3 cannot start until Vincent explicitly approves it after the Phase 2 gate.
