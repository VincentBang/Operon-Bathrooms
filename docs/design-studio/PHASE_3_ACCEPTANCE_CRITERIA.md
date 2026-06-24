# Phase 3 Acceptance Criteria

## Phase Name

Phase 3 Catalogue Candidate Shortlist.

## Approval

Vincent approved Phase 3 build on 2026-06-24.

## Public Outcome

Design Studio users can shortlist governed bathroom catalogue candidates during planning. The shortlist helps preserve product and finish preferences for estimate handoff, quote review and site-measure preparation.

## Must Pass

- `/design-studio` remains behind `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`.
- `/design-studio` remains `noindex,nofollow`.
- Catalogue candidates are local governed planning records only.
- No live supplier feed, confirmed SKU, supplier availability, procurement or pricing field is introduced.
- The draft schema is versioned to `0.3`.
- Shortlist selections are bounded to one to six candidates.
- Every selected candidate validates against the governed local catalogue.
- Local save, copy/print summary and estimate handoff preserve shortlist context.
- Public copy states candidates require human selection checks before contract pricing.
- Tests cover schema, storage, handoff and safe wording.
- Local lint, typecheck, test, build and Design Studio QA pass.

## Must Not Build

- Verified products or confirmed SKUs.
- Supplier feeds, supplier logos or supplier availability checks.
- Retail pricing, supplier costs, labour rates, margins or rate cards.
- AI ranking or automatic recommendations.
- Procurement, ordering, checkout or marketplace flows.
- Quote OS integration.
- Final quote, construction specification or compliance certification.

## Gate Exit

Phase 3 can be marked gate-review-ready only after local QA passes and the gate review records evidence. Phase 4 remains locked until Vincent explicitly approves it.
