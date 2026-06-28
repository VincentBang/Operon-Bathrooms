# Design Studio Data Contract

## Contract

`BathroomDesignDraft` is a serialisable versioned object for Phase 0/1 Quick Mode, Phase 2 approximate layout planning, Phase 3 catalogue-candidate shortlisting, Phase 4 deterministic constraint prompts and Phase 5 evidence readiness.

Current schema version: `0.5`.

Allowed fields:

- `schemaVersion`
- `id`
- `createdAt`
- `updatedAt`
- `mode`
- `bathroomType`
- `startingPoint.kind`
- `startingPoint.sampleTemplateId`
- `startingPoint.photoUsed`
- `styleId`
- `paletteId`
- `variants`
- `selectedVariantId`
- `conceptualSelections`
- `allowanceBand`
- `labels`
- `layoutPlanning.roomShape`
- `layoutPlanning.sizeBand`
- `layoutPlanning.entryPosition`
- `layoutPlanning.fixtureZones`
- `layoutPlanning.constraints`
- `layoutPlanning.labels`
- `layoutRiskPrompts`
- `productShortlist`
- `cataloguePlanning`
- `constraintPrompts`
- `constraintPlanning`
- `evidenceReadiness`
- `evidencePlanning`
- `preferredNextStep`

Forbidden fields:

- image data
- blobs
- base64
- private rates
- final prices
- personal contact data
- exact floor plans
- measured dimensions
- construction drawing claims
- compliance certification
- free-text personal information
- live supplier feeds
- confirmed SKUs
- product availability checks
- procurement or ordering data
- AI/API generated recommendations
- external provider responses
- private scoring or ranking logic
- uploaded media
- persisted media
- camera captures
- AR placement output
- certified measurement output

## Phase 2 Layout Contract

The Phase 2 layout object is approximate planning data only.

Allowed layout values are bounded enums and short labels:

- room shape: rectangle, l-shape, galley, open-zone or unknown
- size band: compact, standard, large or unknown
- entry position: wall-position or unknown
- fixture zone type: shower, bath, vanity, toilet, laundry, storage, door, window, ventilation or waste-drain
- approximate fixture position: wall/zone labels only, not dimensions
- service change: keep, relocate, new, remove or unclear
- constraints: boolean planning flags for strata/Class 2, access, waterproofing uncertainty, drainage/falls, ventilation and suspected asbestos

The contract rejects measured-plan drift by requiring:

- `approximatePlanningLayout: true`
- `measuredPlan: false`
- `constructionDrawing: false`
- `planningGuidanceOnly: true`

Fixture zones are capped at eight.

## Phase 2 Layout-Risk Prompt Contract

`layoutRiskPrompts` preserves the public planning prompts generated from layout choices.

Allowed prompt fields:

- `id`
- `level`: check, review or site-review
- `title`
- `message`
- `nextStep`: clarify, confirm-in-writing, site-measure or request-review

Prompt context must remain public and explanatory. It must not include hidden scores, ranking points, internal qualification logic, admin notes, supplier costs, labour rates, margins, fixed prices or final quote language.

## Phase 3 Catalogue-Candidate Contract

The Phase 3 catalogue object is a governed local planning shortlist only.

Allowed candidate fields:

- candidate ID
- linked public archetype ID
- public category
- public label
- finish family
- planning use
- evidence prompt
- verification status: `catalogue-candidate`
- safety flags showing no verified product, no confirmed SKU, no supplier feed and no pricing

The catalogue contract rejects drift into commercial product data by requiring:

- `verifiedProduct: false`
- `confirmedSku: false`
- `supplierFeed: false`
- `pricingIncluded: false`
- `cataloguePlanning.liveSupplierFeed: false`
- `cataloguePlanning.verifiedSku: false`
- `cataloguePlanning.pricing: false`
- `cataloguePlanning.procurement: false`

The shortlist is capped at six candidates and requires at least one candidate. Every candidate must match the governed local catalogue by ID, archetype and category.

## Phase 4 Deterministic Constraint Contract

The Phase 4 constraint object is a deterministic planning prompt layer. It is generated from bounded draft inputs only.

Allowed prompt fields:

- `id`
- `category`: layout, access, waterproofing, ventilation, strata, services, evidence or selection
- `level`: check, review or site-review
- `title`
- `message`
- `evidenceToPrepare`
- `nextStep`: estimate, quote-review, request-review or site-measure

The prompt list is capped at ten prompts.

The contract rejects drift into AI/API or commercial decisioning by requiring:

- `constraintPlanning.mode: deterministic-constraints`
- `constraintPlanning.deterministicOnly: true`
- `constraintPlanning.aiAssisted: false`
- `constraintPlanning.externalProvider: false`
- `constraintPlanning.sourceMediaUsed: false`
- `constraintPlanning.personalDataUsed: false`
- `constraintPlanning.pricing: false`
- `constraintPlanning.complianceCertification: false`
- `constraintPlanning.planningGuidanceOnly: true`

Constraint prompts must stay public, explanatory and evidence-oriented. They must not include hidden scores, ranking points, internal qualification logic, admin notes, supplier costs, labour rates, margins, fixed prices, final quote wording, legal advice, buildability approval or compliance certification.

## Phase 5 Evidence-Readiness Contract

The Phase 5 evidence object is a structured preparation checklist only. It helps users prepare useful context for site review without capturing media, calculating dimensions or claiming any condition is verified online.

Allowed evidence item fields:

- `id`
- `category`: photos, measurements, services, access, strata, quote, issues or selections
- `label`
- `prompt`
- `status`: missing, planned, prepared or not-applicable
- `userSupplied: true`
- `verifiedOnline: false`
- `uploadStored: false`
- `requiresSiteMeasureConfirmation: true`

The evidence list is capped at twelve items.

The contract rejects drift into media capture, AR or verified measurement by requiring:

- `evidencePlanning.mode: evidence-readiness`
- `evidencePlanning.evidenceReadinessOnly: true`
- `evidencePlanning.cameraCapture: false`
- `evidencePlanning.arPlacement: false`
- `evidencePlanning.uploadedMedia: false`
- `evidencePlanning.persistedMedia: false`
- `evidencePlanning.measuredAccuracy: false`
- `evidencePlanning.userSuppliedUnverified: true`
- `evidencePlanning.planningGuidanceOnly: true`

Evidence readiness must stay public, checklist-based and site-measure-oriented. It must not upload files, store image data, read EXIF data, verify dimensions, confirm waterproofing, certify compliance, confirm product fit or imply contract pricing.

## Handoff Contract

The `/quote` handoff stores an allowlisted subset in `sessionStorage`. It expires and is ignored if invalid.

Allowed handoff fields include draft ID, schema version, bathroom type, sample template, style, palette, conceptual selections, finish families, `photoUsed`, selected variant, allowance band, approximate layout planning object, layout-risk prompts, governed catalogue-candidate shortlist, catalogue-planning safety flags, deterministic constraint prompts, constraint-planning safety flags, evidence-readiness checklist, evidence-planning safety flags, trust labels, timestamps and preferred next step.

## Phase 6 Quote OS Integration Boundary

Phase 6 is approved for a handoff-contract-only implementation path. No `BathroomDesignDraft` schema change is approved yet.

The implementation defines an internal-only allowlisted `BathroomDesignQuoteOsHandoff` object derived from the existing `BathroomDesignDraft` `0.5` contract. This does not bump the public Design Studio draft schema.

Allowed Quote OS handoff fields include source, handoff version, draft ID, draft schema version, creation timestamp, bathroom type, preferred next step, starting point kind, optional sample template ID, style, palette, allowance band, selected variant ID, photo-used flag, approximate room shape, size band, entry position, bounded fixture-zone summaries, layout constraints, catalogue-candidate selection summaries, layout/constraint prompt IDs, bounded internal review questions, evidence-readiness counts and prepared/missing/planned evidence IDs.

The handoff is a planning-context bridge only. It is not written to public storage, not exposed as a public proposal and not used to approve quote totals.

Phase 6 must not add final pricing, quote approval, proposal output, procurement, payment, live supplier data, confirmed SKUs, private scoring, admin notes, supplier costs, labour rates, margins, service role keys or public Quote OS output to the Design Studio contract.

## Phase 7 Shared Infrastructure Boundary

Phase 7 is approved for acceptance-criteria-only planning and related docs-only shared vocabulary/readiness artifacts.

Phase 7 may identify candidate shared contract concepts, but it must not extract a shared package, add cross-repo imports, modify another Operon repository, add Supabase migrations, modify Netlify settings, change public route discovery or create shared runtime infrastructure.

Any future shared contract must preserve Bathrooms-local ownership for `BathroomDesignDraft`, `BathroomDesignQuoteOsHandoff`, bathroom-specific estimate logic, bathroom quote review scoring, bathroom compliance prompts and bathroom manual review report content unless a later gate explicitly approves an adapter.

The Phase 7 adapter-readiness checklist is documentation only. It may define allowlist principles, reject lists, versioning requirements and test expectations for a future one-way adapter, but it does not create a shared destination contract, schema, enum, adapter, package, API route, Supabase migration or runtime integration.

The Phase 7 shared architecture map may describe one-way future adapter concepts, but no adapter, shared type, shared package, shared API, database migration or runtime dependency is approved.

The Phase 7 shared glossary may standardise vocabulary for humans and future planning. It is not a schema, shared type, package, adapter, database contract or runtime dependency.

The Phase 7 lifecycle vocabulary may standardise status labels for documentation and future adapter planning. It is not a database enum, workflow automation rule, CRM stage, shared type, package, adapter or runtime dependency.

The Phase 7 contract field inventory may classify current Bathrooms-local fields as candidate shared fields, Bathrooms-local fields, internal-only candidates or rejected fields for future review. It is not an allowlist implementation, adapter, schema, type export, database contract or runtime dependency.

The Phase 7 adapter decision packet may recommend `BathroomDesignQuoteOsHandoff` as the first future adapter source because it is already internal-only and allowlisted. That recommendation is documentation only; it does not implement an adapter, create a destination contract, export a shared type or approve runtime use.

The Phase 7 destination contract acceptance criteria may name `OperonPlanningContext` as the preferred future destination contract and define required fields, safety flags, exclusions, versioning and tests. It is documentation only; it does not implement the destination contract, export a shared type, create a schema or approve runtime use.

The Phase 7 implementation gate checklist may define the final preflight requirements for future adapter work. It is documentation only; it does not approve implementation, create an adapter, export a shared type, create a schema, add a feature flag or approve runtime use.
