# Phase 7 Lifecycle Vocabulary

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only lifecycle vocabulary for Phase 7 Shared Operon System Infrastructure.

It defines candidate status labels and transition language for humans planning future Operon System alignment. It does not implement workflow automation, CRM stages, database enums, shared schemas, API routes, background jobs, notifications or admin actions.

## Principles

- Lifecycle labels describe review state, not sales promises.
- Public labels must stay simple and guidance-only.
- Internal labels may support triage, but must not expose private scoring.
- Site measure, selections, licensed-trade checks and written scope confirmation remain required before contract pricing.
- A lifecycle label is not a legal, compliance, waterproofing, strata or price certification.
- Bathrooms-local workflows remain the source of truth until a later adapter is explicitly approved.

## Public-Facing Lifecycle Labels

| Label | Meaning | Safe user-facing copy | Must not imply |
|---|---|---|---|
| Planning started | The user has started an estimate, review request or Design Studio planning path. | Your planning context has started. | A quote, booking, approval or commitment. |
| Planning range prepared | A planning estimate range or summary is available. | Use this as early planning guidance only. | Final price, fixed price or contract pricing. |
| Review requested | The user has submitted a scope, quote or evidence review request. | Your review request has been received. | Legal review, quote approval or guaranteed response time. |
| Evidence to prepare | More photos, plans, quote details, access notes or strata notes may help. | Prepare these items before review or site measure. | Upload requirement, verified evidence or compliance proof. |
| Site measure recommended | The next useful step may be a site inspection. | A site measure can help confirm conditions and written scope. | Confirmed price, guaranteed booking or compliance certification. |
| Written scope needed | The project needs documented scope after checks. | Written scope confirmation is required before contract pricing. | A public proposal or contract-ready document. |

## Internal Review Lifecycle Labels

| Label | Meaning | Typical next human action | Must not imply |
|---|---|---|---|
| New | A lead or handoff has arrived and has not been reviewed. | Check source, contact details and obvious risk prompts. | Qualification score or sales priority. |
| Reviewing | A human is reading the supplied context. | Check scope, evidence, risk prompts and next-step fit. | Final assessment or committed response. |
| Awaiting evidence | Useful details are missing. | Ask for quote PDF, photos, access notes, strata notes or selection context. | That the user must upload private files publicly. |
| Needs clarification | Scope or risk language needs follow-up. | Ask focused questions before recommending site measure or review path. | Builder wrongdoing, legal issue or compliance failure. |
| Ready for site measure review | The lead appears prepared enough to consider site inspection. | Confirm contact details, location, access and preferred timing. | Site condition approval or final pricing readiness. |
| Manual review required | Risk prompts suggest a human should review before heavier action. | Review high-risk context and prepare safe next-step notes. | Hidden private score, legal decision or automatic rejection. |
| Not a fit | The request may not match Operon Bathrooms services. | Respond politely or suggest relevant licensed help where appropriate. | User fault, unsafe advice or legal conclusion. |
| Closed | The review path is complete, paused or no further action is planned. | Record outcome and keep private notes internal. | Public rejection or permanent customer status. |

## Evidence Lifecycle Labels

| Label | Meaning | Safe use |
|---|---|---|
| Missing | The evidence item has not been provided or described. | Ask the user to prepare it if it would improve review quality. |
| Planned | The user expects to prepare the item later. | Remind the user it may help before site measure. |
| Prepared | The user says the item is ready or available. | Treat as user-supplied and unverified until reviewed. |
| Not applicable | The item does not appear relevant to the current path. | Do not ask for it unless context changes. |

Evidence lifecycle labels must not imply uploaded storage, verified measurements, waterproofing confirmation, compliance proof or product-fit confirmation.

## Follow-Up Task Lifecycle Labels

| Label | Meaning | Safe use |
|---|---|---|
| Open | A follow-up task exists and has not been actioned. | Internal task queue label only. |
| In review | Someone is considering the next safe response. | Internal progress label only. |
| Waiting on customer | The next step depends on user-supplied context. | Request specific evidence or clarification. |
| Ready to respond | The next response can be prepared. | Draft guidance-only response or routing. |
| Completed | The follow-up has been actioned. | Record outcome internally. |
| Cancelled | The follow-up is no longer needed. | Keep cancellation reason internal where appropriate. |

Follow-up labels must not imply automated CRM sequences, guaranteed callbacks, confirmed bookings or contract commitments.

## Design Studio Handoff Lifecycle Labels

| Label | Meaning | Safe use |
|---|---|---|
| Draft saved | A local Design Studio draft exists in the browser. | Local planning continuity only. |
| Planning summary prepared | The user has a Design Studio summary. | Copy/print or use as planning context. |
| Estimate handoff prepared | A safe handoff can prefill estimate context. | Send only allowlisted, non-price planning data. |
| Quote OS context prepared | Internal-only handoff context exists for later review foundations. | Keep internal and planning-only. |

These labels must not imply server storage, public proposal output, final pricing, construction documentation or live Quote OS behavior.

## Transition Language

Use:

- moved to review
- awaiting evidence
- ready for human review
- recommended for site measure review
- closed after response
- paused until more context is supplied

Avoid:

- approved
- rejected
- certified
- compliant
- guaranteed
- contract-ready
- proposal-ready
- final quote issued
- price confirmed

## Shared Mapping Notes

Future shared adapters, if separately approved, should:

- keep Bathrooms-local labels as source values
- map only allowlisted lifecycle terms
- preserve `sourceSystem: "operon-bathrooms"` or equivalent provenance
- reject private scores, admin notes, rate cards, supplier data, SKU data, secrets, media data and personal data unless a later gate approves a safe internal path
- include tests before runtime use

No shared adapter is implemented by this vocabulary.

## Gate Exit

This lifecycle vocabulary is ready when:

- the document is reviewed and merged
- stage status records the lifecycle vocabulary as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the next safe task is a docs-only adapter-readiness checklist. Implementation should remain locked until a later explicit approval.
