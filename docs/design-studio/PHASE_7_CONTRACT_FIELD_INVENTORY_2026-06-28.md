# Phase 7 Contract Field Inventory

Date: 2026-06-28

Status: GATE_REVIEW_READY

## Scope

This is a docs-only contract field inventory for Phase 7 Shared Operon System Infrastructure.

It documents current Operon Bathrooms Design Studio source fields and classifies which fields may be candidates for a future shared adapter review. It does not implement an adapter, shared schema, shared package, cross-repo import, API route, database enum, Supabase migration, Netlify change, analytics pipeline, public exposure change or Quote OS workflow.

## Inventory Principles

- Bathrooms-local contracts remain the source of truth.
- Candidate fields are not automatically approved for sharing.
- A future adapter must be one-way, versioned, allowlisted and separately approved.
- Public or customer-facing fields must preserve planning guidance only.
- Internal-only fields must not enter public bundles, public routes or customer-facing copy.
- Rejected fields must stay rejected unless Vincent approves a new gate with a specific private/internal path.

## Source Contracts Reviewed

| Source | Current version | Purpose | Current status |
|---|---:|---|---|
| `BathroomDesignDraft` | `0.5` | Browser-local Design Studio planning object | Bathrooms-local source of truth |
| `BathroomDesignHandoff` | `0.5` | Session-storage `/quote` handoff | Bathrooms-local estimate handoff |
| `BathroomDesignQuoteOsHandoff` | `0.1` | Internal-only Quote OS preparation context | Bathrooms-local internal handoff |
| `BathroomDesignEvent` | Unversioned | Local event abstraction payload | Bathrooms-local instrumentation placeholder |

## Classification Legend

| Classification | Meaning |
|---|---|
| Candidate shared field | May be considered in a later approved adapter. |
| Bathrooms-local only | Useful inside Bathrooms, but not a shared contract candidate yet. |
| Internal-only candidate | May be considered only for protected internal workflows after separate approval. |
| Reject | Must not be shared or exposed through a future adapter. |

## `BathroomDesignDraft` Field Inventory

| Field | Classification | Future shared name candidate | Notes |
|---|---|---|---|
| `schemaVersion` | Candidate shared field | `sourceSchemaVersion` | Preserve source version in any future adapter. |
| `id` | Internal-only candidate | `sourceRecordId` | Safe only as provenance; do not expose publicly as identity. |
| `createdAt` | Internal-only candidate | `sourceCreatedAt` | Internal audit only unless explicitly approved. |
| `updatedAt` | Internal-only candidate | `sourceUpdatedAt` | Internal audit only unless explicitly approved. |
| `mode` | Candidate shared field | `planningMode` | Bounded value currently `quick`. |
| `bathroomType` | Candidate shared field | `projectRoomType` | Useful shared planning dimension. |
| `startingPoint.kind` | Candidate shared field | `planningStartingPoint` | Bounded to sample or local-photo. |
| `startingPoint.sampleTemplateId` | Bathrooms-local only | none yet | Template IDs are tied to Bathrooms local content. |
| `startingPoint.photoUsed` | Candidate shared field | `photoUsedFlag` | Boolean only; no media or metadata. |
| `styleId` | Bathrooms-local only | none yet | Local style taxonomy; may need a future glossary map. |
| `paletteId` | Bathrooms-local only | none yet | Local palette taxonomy; may need a future glossary map. |
| `variants` | Bathrooms-local only | none yet | Design Studio UI state; not a shared contract yet. |
| `selectedVariantId` | Bathrooms-local only | none yet | Local variant reference only. |
| `conceptualSelections` | Bathrooms-local only | none yet | Contains local archetype labels; could be summarized later. |
| `productShortlist` | Bathrooms-local only | none yet | Governed candidates only; no SKU or supplier sharing. |
| `cataloguePlanning` | Candidate shared field | `selectionSafetyFlags` | Safety flags may be mapped later; product details remain local. |
| `allowanceBand` | Candidate shared field | `finishLevelBand` | Public planning band only; not pricing. |
| `labels` | Candidate shared field | `planningTrustLabels` | Useful for preserving no-CAD/no-final-price boundaries. |
| `layoutPlanning.roomShape` | Candidate shared field | `roomShapeBand` | Approximate planning only. |
| `layoutPlanning.sizeBand` | Candidate shared field | `sizeBand` | Approximate size band only; no dimensions. |
| `layoutPlanning.entryPosition` | Candidate shared field | `entryPositionBand` | Approximate wall-position only. |
| `layoutPlanning.fixtureZones.fixtureType` | Candidate shared field | `fixtureZoneType` | Bounded fixture category only. |
| `layoutPlanning.fixtureZones.label` | Bathrooms-local only | none yet | Human label; review before sharing. |
| `layoutPlanning.fixtureZones.approximatePosition` | Candidate shared field | `fixtureApproximatePosition` | Bounded wall/zone label only. |
| `layoutPlanning.fixtureZones.status` | Candidate shared field | `fixturePlanningStatus` | Bounded planning state only. |
| `layoutPlanning.fixtureZones.serviceChange` | Candidate shared field | `fixtureServiceChange` | Useful risk input; site checks still required. |
| `layoutPlanning.fixtureZones.notes` | Reject | none | Free-text field; do not share without a later privacy gate. |
| `layoutPlanning.constraints` | Candidate shared field | `planningConstraintFlags` | Boolean planning prompts only; not compliance findings. |
| `layoutPlanning.labels` | Candidate shared field | `layoutSafetyLabels` | Required false/true safety labels. |
| `layoutRiskPrompts.id` | Candidate shared field | `layoutRiskPromptId` | IDs only are safer than full messages. |
| `layoutRiskPrompts.level` | Candidate shared field | `riskPromptLevel` | Public prompt severity label only. |
| `layoutRiskPrompts.title` | Bathrooms-local only | none yet | Copy should remain local until shared wording is approved. |
| `layoutRiskPrompts.message` | Bathrooms-local only | none yet | Public copy should remain local until adapter copy rules exist. |
| `layoutRiskPrompts.nextStep` | Candidate shared field | `recommendedPlanningNextStep` | Bounded routing hint only. |
| `constraintPrompts.id` | Candidate shared field | `constraintPromptId` | IDs only are safer than full messages. |
| `constraintPrompts.category` | Candidate shared field | `constraintCategory` | Useful shared planning category. |
| `constraintPrompts.level` | Candidate shared field | `constraintPromptLevel` | Public prompt severity label only. |
| `constraintPrompts.title` | Bathrooms-local only | none yet | Copy remains local. |
| `constraintPrompts.message` | Bathrooms-local only | none yet | Copy remains local. |
| `constraintPrompts.evidenceToPrepare` | Bathrooms-local only | none yet | Could become shared later after wording review. |
| `constraintPrompts.nextStep` | Candidate shared field | `recommendedPlanningNextStep` | Bounded routing hint only. |
| `constraintPlanning` | Candidate shared field | `constraintSafetyFlags` | Safety flags only; no AI/API/provider fields enabled. |
| `evidenceReadiness.id` | Candidate shared field | `evidenceItemId` | Stable checklist IDs only. |
| `evidenceReadiness.category` | Candidate shared field | `evidenceCategory` | Useful shared preparation category. |
| `evidenceReadiness.label` | Bathrooms-local only | none yet | Copy remains local. |
| `evidenceReadiness.prompt` | Bathrooms-local only | none yet | Copy remains local. |
| `evidenceReadiness.status` | Candidate shared field | `evidenceStatus` | Use lifecycle vocabulary labels. |
| `evidenceReadiness.userSupplied` | Candidate shared field | `userSuppliedUnverified` | Must stay unverified. |
| `evidenceReadiness.verifiedOnline` | Candidate shared field | `verifiedOnline` | Must remain `false`. |
| `evidenceReadiness.uploadStored` | Candidate shared field | `uploadStored` | Must remain `false`. |
| `evidenceReadiness.requiresSiteMeasureConfirmation` | Candidate shared field | `requiresSiteMeasureConfirmation` | Must remain `true`. |
| `evidencePlanning` | Candidate shared field | `evidenceSafetyFlags` | Safety flags only. |
| `preferredNextStep` | Candidate shared field | `preferredNextStep` | Bounded routing hint only. |

## `BathroomDesignHandoff` Field Inventory

The `/quote` handoff is a session-storage bridge into the planning estimate flow. It should remain Bathrooms-local unless a later adapter gate approves a shared planning handoff.

| Field group | Classification | Notes |
|---|---|---|
| `schemaVersion`, `designDraftId`, timestamps, `expiresAt` | Internal-only candidate | Provenance and expiry only. |
| `bathroomType`, `allowanceBand`, `preferredNextStep` | Candidate shared field | Safe planning dimensions; no pricing. |
| `sampleTemplateId`, `styleId`, `paletteId`, `selectedVariantId` | Bathrooms-local only | Local taxonomy IDs. |
| `conceptualSelections`, `finishFamilies` | Bathrooms-local only | Could become summary-only later. |
| `productShortlist`, `cataloguePlanning` | Bathrooms-local only | Keep governed candidate context local. |
| `photoUsed` | Candidate shared field | Boolean only; no media. |
| `labels`, `layoutPlanning`, `layoutRiskPrompts`, `constraintPrompts`, `constraintPlanning`, `evidenceReadiness`, `evidencePlanning` | Same as draft classification | Follow the `BathroomDesignDraft` inventory above. |

## `BathroomDesignQuoteOsHandoff` Field Inventory

This handoff is internal-only. It may be the safest future source for a shared internal planning adapter because it is already allowlisted, but it still requires separate approval.

| Field | Classification | Future shared name candidate | Notes |
|---|---|---|---|
| `version` | Internal-only candidate | `sourceHandoffVersion` | Preserve if adapted. |
| `source` | Candidate shared field | `sourceFlow` | Current value is `design-studio`; future shared contracts should add `sourceSystem`. |
| `draftId` | Internal-only candidate | `sourceRecordId` | Provenance only. |
| `schemaVersion` | Candidate shared field | `sourceSchemaVersion` | Preserve source version. |
| `createdAt` | Internal-only candidate | `handoffCreatedAt` | Internal audit only. |
| `bathroomType` | Candidate shared field | `projectRoomType` | Safe planning dimension. |
| `preferredNextStep` | Candidate shared field | `preferredNextStep` | Bounded routing hint only. |
| `planningContext.startingPoint` | Candidate shared field | `planningStartingPoint` | Bounded. |
| `planningContext.sampleTemplateId` | Bathrooms-local only | none yet | Local template ID. |
| `planningContext.styleId`, `planningContext.paletteId` | Bathrooms-local only | none yet | Local taxonomy IDs. |
| `planningContext.allowanceBand` | Candidate shared field | `finishLevelBand` | Public planning band only. |
| `planningContext.selectedVariantId` | Bathrooms-local only | none yet | Local UI state. |
| `planningContext.photoUsed` | Candidate shared field | `photoUsedFlag` | Boolean only. |
| `layoutContext.roomShape`, `sizeBand`, `entryPosition` | Candidate shared field | `layoutPlanningBands` | Approximate planning only. |
| `layoutContext.fixtureZones` | Candidate shared field | `fixtureZoneSummaries` | Already strips notes. |
| `layoutContext.constraints` | Candidate shared field | `planningConstraintFlags` | Boolean planning flags only. |
| `selectionContext` | Bathrooms-local only | none yet | Planning candidate summary; not SKU or supplier data. |
| `promptContext.layoutRiskPromptIds` | Candidate shared field | `layoutRiskPromptIds` | IDs only. |
| `promptContext.constraintPromptIds` | Candidate shared field | `constraintPromptIds` | IDs only. |
| `promptContext.reviewQuestions` | Internal-only candidate | `reviewQuestions` | Internal guidance only; not public copy. |
| `evidenceContext.summary` | Candidate shared field | `evidenceSummary` | Counts/status only. |
| `evidenceContext.preparedItemIds`, `missingItemIds`, `plannedItemIds` | Candidate shared field | `evidenceItemIdsByStatus` | IDs only. |
| `evidenceContext.requiresSiteMeasureConfirmation` | Candidate shared field | `requiresSiteMeasureConfirmation` | Must remain `true`. |
| `safety` | Candidate shared field | `handoffSafetyFlags` | Required reject flags; all public-output/pricing/procurement flags remain false. |

## `BathroomDesignEvent` Field Inventory

The current event abstraction is local and does not prove live analytics. Treat it as a naming reference only.

| Field | Classification | Notes |
|---|---|---|
| `name` | Candidate shared field | Event naming may be standardised later. |
| `timestamp` | Internal-only candidate | Internal analytics timestamp only. |
| `draftId` | Internal-only candidate | Provenance only; avoid public exposure. |
| `payload.bathroomType` | Candidate shared field | Safe planning dimension. |
| `payload.styleId`, `payload.paletteId`, `payload.selectedVariantId` | Bathrooms-local only | Local taxonomy/UI state. |
| `payload.photoUsed` | Candidate shared field | Boolean only. |
| `payload.allowanceBand` | Candidate shared field | Planning band only; not pricing. |
| `payload.productShortlistCount` | Candidate shared field | Count only. |
| `payload.constraintPromptCount` | Candidate shared field | Count only. |
| `payload.evidencePreparedCount` | Candidate shared field | Count only. |

## Always-Rejected Field Families

Future shared adapters must reject these field families even if similarly named keys appear in a local object:

- exact measurements, dimensions, floor plans, CAD, construction drawings or measured accuracy claims
- image data, blobs, base64, object URLs, EXIF data, uploaded media or persisted media
- free-text personal information and contact details unless a separate internal-only privacy gate approves them
- internal rate cards, supplier costs, labour rates, margins, final prices, fixed prices or pricing logic
- private scores, qualification logic, admin notes, lead priority or hidden review ranking
- service-role keys, tokens, secrets or privileged identifiers
- live supplier feeds, confirmed SKUs, product availability checks, procurement, ordering or payment data
- legal advice, compliance certification, waterproofing certification, quote approval or quote rejection labels
- public proposal output, contract-ready output or final quote wording

## Minimum Future Adapter Shape

If implementation is later approved, the adapter should start from this safe shape:

```ts
type FutureSharedPlanningContext = {
  sourceSystem: "operon-bathrooms";
  sourceFlow: "design-studio";
  sourceSchemaVersion: string;
  sourceHandoffVersion?: string;
  projectRoomType?: string;
  planningMode?: string;
  finishLevelBand?: string;
  preferredNextStep?: string;
  photoUsedFlag?: boolean;
  planningTrustLabels?: Record<string, boolean>;
  layoutPlanningBands?: Record<string, string>;
  planningConstraintFlags?: Record<string, boolean>;
  evidenceSummary?: Record<string, number>;
  evidenceItemIdsByStatus?: Record<string, string[]>;
  requiresSiteMeasureConfirmation: true;
  planningGuidanceOnly: true;
};
```

This shape is illustrative only. It is not an implemented contract, exported type, schema or shared package.

## Open Questions Before Implementation

- Should the future adapter source be `BathroomDesignDraft` or the safer `BathroomDesignQuoteOsHandoff`?
- Should source IDs be included at all, or should a non-identifying reference be created?
- Should copy fields ever be shared, or should future adapters use IDs only?
- Should local style and palette IDs map to a shared style vocabulary first?
- Should evidence item IDs be shared before evidence labels are standardised?
- What destination contract name and version would receive these fields?
- Which local/staging verification must pass before any runtime use?

## Gate Exit

This field inventory is ready when:

- this document is reviewed and merged
- stage status records the inventory as docs-only
- next actions keep implementation locked
- local `git diff --check` passes

After this gate, the next safe action is to pause Phase 7 or draft a docs-only adapter decision packet. Implementation should remain locked until a later explicit approval.
