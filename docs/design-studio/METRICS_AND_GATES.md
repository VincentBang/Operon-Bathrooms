# Design Studio Metrics And Gates

## Phase 0/1 Gate Targets

- Median first useful visual: 90 seconds or less.
- Completion: at least 35%.
- Estimate intent: at least 15%.
- Output-label comprehension: at least 80%.
- No privacy leak.
- No internal-pricing leak.

## Phase 0 Experiments To Run Outside Codex

1. Clickable Quick Mode test: 30-40 high-intent Sydney users.
2. Concierge photo-inspiration test: 20 consented photos.
3. Estimate handoff A/B test: at least 300 completed designs.
4. Share/voting test: 100 completed designs.
5. Product-fidelity pilot: 40 archetypes and 25 verified test SKUs.
6. 2D geometry spike: 10 canonical bathroom plans.
7. AI/API benchmark: three vendors and deterministic baseline.
8. Catalogue ingestion pilot: three suppliers and 100 records.

Codex may prepare local structures and docs, but must not fabricate experiment results.

## Design Studio Release-Exposure Criteria

Controlled exposure must not start until the release mode, audience, feature flag behavior, noindex behavior, sitemap/nav status, rollback plan and QA evidence are documented.

Suggested pilot metrics are:

- design starts
- design completions
- CTA clicks to estimate, quote review, request review and site measure
- saved or copied summaries
- mobile completion rate
- abandonment by step
- user-reported confusion about planning versus measured output
- qualified lead conversion from Design Studio handoff
- support/manual-review notes about missing evidence

Gate requirements:

- no privacy leak or private pricing leak
- no final-pricing, measured-plan or compliance-certification wording
- no user-entered measurement fields unless separately approved
- no AR/browser-camera experiment unless separately approved
- no sitemap, navigation or indexing change unless separately approved
- route can be disabled through `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO`
- repeat human screen-reader pass before public exposure

## Controlled Noindex Pilot Prep Gate

The original single route flag enabled `/design-studio` and also exposed nav/footer links plus sitemap inclusion. A controlled noindex pilot needs route access without broad discovery.

The discovery split must prove:

- route rendering can be enabled for pilot users
- sitemap inclusion can remain off in pilot mode
- primary nav and footer discovery can remain off in pilot mode
- metadata remains `noindex,nofollow`
- the route can be disabled quickly by environment configuration
- no measurement, AR/browser-camera, upload/storage, pricing, procurement or Quote OS behavior is introduced

Pilot exposure still requires post-merge local QA, responsive QA, accessibility proxy QA and human screen-reader QA before any external users.
