# Bathroom Design Studio POC

## Objective

Operon Bathroom Design Studio Phase 0/1 is a local-only proof of concept for a fast bathroom inspiration flow that creates structured design preferences and hands safe, non-price context into the existing planning estimate journey.

It is a Design-to-Scope Bridge, not a CAD product, not an AI image generator and not a final quote tool.

## Approved Scope

- Feature-flagged `/design-studio` route.
- Quick Mode only.
- Five bathroom types.
- Three fictional sample templates.
- Six styles.
- Two curated palettes per style.
- Maximum three deterministic concept variants.
- Conceptual product archetypes only.
- Non-currency allowance bands: Essential, Considered and Premium.
- Local save, copy summary and print-friendly brief.
- Safe estimate handoff into `/quote`.
- Local/no-op event abstraction.

## Feature-Flag Behaviour

The route is enabled only when:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true
```

When absent or false:

- `/design-studio` returns a not-found state.
- Navigation does not show a Design Studio link.
- Sitemap does not include `/design-studio`.

No production environment configuration was changed.

## Data Contract

The draft contract is `BathroomDesignDraft` schema version `0.1`.

It contains structured choices only:

- draft ID and timestamps
- Quick Mode
- bathroom type
- starting point
- style and palette
- deterministic variants
- selected variant
- conceptual selections
- allowance band
- required trust labels
- preferred next step

It excludes image data, blobs, base64, private rates, final prices, personal contact data, exact floor plans and free-text personal information.

## Local Image Privacy Behaviour

Optional local images are kept in browser memory only for the current session.

The POC does not:

- upload images
- save images to localStorage
- save images to Supabase
- send images to analytics
- persist base64/blob data
- log image contents

Saved drafts record only `photoUsed: true`.

## Estimate Handoff

The Design Studio writes an allowlisted handoff object to `sessionStorage`, then routes to `/quote`.

Allowed handoff fields include:

- design draft ID
- schema version
- bathroom type
- sample template
- style
- palette
- conceptual selections
- finish families
- photo-used boolean
- selected variant
- allowance band
- trust labels
- timestamps
- preferred next step

`/quote` reads defensively, ignores invalid or expired data and pre-fills only compatible non-price fields.

## Event Taxonomy

The local/no-op event abstraction supports:

- `design_studio_viewed`
- `design_studio_started`
- `bathroom_type_selected`
- `style_selected`
- `palette_selected`
- `concept_generated`
- `variant_compared`
- `design_saved_local`
- `design_brief_printed`
- `estimate_handoff_started`
- `design_studio_completed`

Events do not leave the browser and must not include images, names, emails, addresses, exact floor plans or free-text personal information.

## Known Limitations

- No measured layout.
- No verified product catalogue.
- No 2D geometry editor.
- No AI generation.
- No cloud rendering.
- No 3D/WebGL/WebGPU.
- No AR or LiDAR.
- No backend share service.
- No public gallery.
- No Quote OS.
- No real supplier data, SKUs, prices or inventory.

## Local Testing

Recommended checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run qa:bundle-safety
npm run qa:local
```

Rendered route check when enabled:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run dev -- --hostname 127.0.0.1 --port 3000
```

## Phase 0 Metrics To Collect

- Median first useful visual.
- Completion rate.
- Estimate handoff intent.
- Output-label comprehension.
- Privacy leak incidents.
- Internal-pricing leak incidents.

Codex must not fabricate these results.

## Criteria For Proceeding To Structured Planner

Phase 2 can begin only after Phase 0/1 gate review passes and Vincent manually marks Phase 2 `APPROVED`.
