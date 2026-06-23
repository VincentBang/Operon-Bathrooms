# Design Studio Data Contract

## Contract

`BathroomDesignDraft` is a serialisable versioned object for Phase 0/1 Quick Mode and Phase 2 approximate layout planning.

Current schema version: `0.2`.

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

## Handoff Contract

The `/quote` handoff stores an allowlisted subset in `sessionStorage`. It expires and is ignored if invalid.

Allowed handoff fields include draft ID, schema version, bathroom type, sample template, style, palette, conceptual selections, finish families, `photoUsed`, selected variant, allowance band, approximate layout planning object, layout-risk prompts, trust labels, timestamps and preferred next step.
