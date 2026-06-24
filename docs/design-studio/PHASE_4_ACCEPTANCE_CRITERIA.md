# Phase 4 Acceptance Criteria

## Phase Name

Phase 4 Deterministic Constraint Intelligence.

## Current Status

Deterministic-only implementation is gate-review-ready.

Vincent approved the deterministic-only implementation path after this criteria document was drafted. AI/API-assisted constraint intelligence remains locked and is not approved.

## Phase Intent

Phase 4 may add grounded constraint intelligence to the feature-flagged Design Studio so users can better understand planning conflicts, missing evidence, likely review topics and safe next steps.

The phase must improve scope clarity without becoming a final quote engine, compliance checker, procurement tool, design certifier, construction drawing system or ungrounded AI assistant.

## Allowed Direction

Phase 4 may explore:

- deterministic constraint rules for layout, access, waterproofing, ventilation, strata/Class 2, service relocation and evidence readiness
- public explanation prompts generated from existing bounded Design Studio state
- evidence-preparation prompts for photos, quotes, strata notes, measurements to bring to site review and selections
- safe recommendation routing to `/quote`, `/quote/review`, `/request-review` and `/site-measure`
- internal-only event labels for which safe prompt categories appeared, without exposing scores or private logic
- optional AI/API planning notes only after a separate provider, privacy, prompt and data-retention review

## Must Pass Before Implementation

- Define whether Phase 4 is deterministic-only or includes a gated AI/API experiment.
- If AI/API is proposed, choose provider, model, privacy boundary, prompt boundary, logging boundary and fallback behavior before coding.
- Confirm no user photos, base64 image data, personal contact data, private rates or supplier data are sent to an AI provider.
- Confirm `/design-studio` remains behind `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`.
- Confirm `/design-studio` remains `noindex,nofollow`.
- Define the exact versioned data-contract change, likely `BathroomDesignDraft` schema `0.4`.
- Define all new public prompt categories as allowlisted structured outputs.
- Define tests for unsafe wording, private data leaks, deterministic fallback and handoff compatibility.
- Define rollback criteria before any implementation branch starts.

## Must Pass During Implementation

- Constraint outputs must be grounded in existing bounded Design Studio fields.
- Public outputs must use planning guidance only.
- Public outputs must not claim site conditions, waterproofing, compliance, product compatibility, strata approval, DBP/Class 2 status, buildability or final price are confirmed online.
- Site measure, selections, licensed-trade checks and written scope confirmation must remain required before contract pricing.
- If AI/API is used, every AI result must pass a deterministic safety filter before display or handoff.
- If AI/API is unavailable, the feature must degrade to deterministic prompts or safe no-output states.
- No hidden lead score, admin note, supplier cost, labour rate, margin, rate card or private ranking logic can appear in public output or client bundles.
- No unbounded free-text scope capture should be added to Design Studio.
- Existing estimate, quote review, request review and site measure flows must continue to work without Phase 4 data.

## Explicitly Out Of Scope

- Final quotes, fixed prices or contract pricing.
- Legal advice, compliance certification or waterproofing certification.
- Measured CAD, construction drawings, specifications or build-ready plans.
- AI image generation.
- Automatic design approval.
- Live supplier feeds, verified SKUs, supplier availability, pricing, procurement, checkout or marketplace.
- Quote OS implementation.
- Payment, CRM or contractor bidding.
- 3D, AR, LiDAR, BIM or room capture.
- Public release exposure or indexing changes.

## Public Language Rules

Use:

- "planning guidance"
- "prompt to check"
- "confirm during site measure"
- "confirm in writing"
- "may affect scope certainty"
- "requires licensed-trade review"

Do not use:

- "approved"
- "compliant"
- "certified"
- "buildable"
- "final quote"
- "fixed price"
- "guaranteed"
- "verified SKU"
- "supplier availability"

## Data Boundary

Allowed inputs:

- existing bounded Design Studio draft fields
- existing layout-risk prompts
- existing catalogue-candidate shortlist fields
- feature flag state
- non-personal route/handoff context

Forbidden inputs:

- user photos or image blobs
- base64 data
- personal contact data
- addresses
- private rate cards
- supplier costs
- labour rates
- margins
- lead scoring
- admin notes
- service role keys

Allowed outputs:

- public planning prompt IDs
- prompt level: check, review or site-review
- prompt title and safe message
- recommended next step route
- evidence to prepare
- deterministic fallback status

Forbidden outputs:

- final price
- quote approval
- compliance status
- legal conclusion
- product verification
- procurement recommendation
- private scoring
- hidden ranking
- internal notes

## Test Requirements

- Unit tests for each constraint category.
- Schema tests for the versioned `0.4` contract if new fields are added.
- Component/render tests proving safe wording and no final-price/compliance claims.
- Handoff tests proving Phase 4 prompt context is allowlisted and optional.
- Bundle-safety checks for private pricing and secret markers.
- AI/API safety tests if AI/API is approved.
- Feature-flag tests proving `/design-studio` remains hidden when disabled.
- Noindex/nofollow tests proving the route remains non-indexable when enabled.
- Responsive and accessibility QA for any new prompt UI.

## Rollback And Pause Rules

Pause Phase 4 if:

- AI/API privacy boundaries are unclear
- user photos or personal data would be sent externally
- public output implies compliance, buildability, final pricing or legal advice
- outputs are not reproducible or safely filterable
- client bundle exposes private markers
- Phase 4 drifts into supplier feeds, procurement, Quote OS, 3D/AR or release exposure

## Gate Exit

Phase 4 moved from acceptance criteria to deterministic-only implementation after Vincent explicitly approved that scoped path.

Any future expansion must specify one of:

- AI/API-assisted constraint intelligence with approved provider, privacy and safety boundaries

Until then, AI/API-assisted constraint intelligence remains locked.
