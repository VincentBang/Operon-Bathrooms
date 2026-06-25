# Design Studio Discovery Split

Date: 2026-06-25

Branch: `codex/design-studio-discovery-split`

## Status

This branch implements the small discovery split approved after controlled noindex pilot prep.

The implementation is limited to flags, sitemap/nav discovery, tests and documentation. It does not add measurements, AR/browser-camera, upload/storage, analytics, pricing, procurement, Quote OS, payment, CRM or public indexing.

## Implemented Behavior

`NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true` now controls route rendering only.

`NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public` controls public discovery links and sitemap inclusion.

Default/blank discovery behavior is hidden:

- `/design-studio` can render when the route flag is enabled.
- `/design-studio` remains `noindex,nofollow`.
- `/design-studio` remains excluded from sitemap unless discovery is `public`.
- `/design-studio` remains excluded from main nav and footer unless discovery is `public`.

## Controlled Noindex Pilot Configuration

Recommended controlled pilot configuration:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true
NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=
```

This allows direct shared-link access while keeping public discovery hidden.

## Public Discovery Configuration

Public discovery remains separately locked.

Do not set this without later approval:

```bash
NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=public
```

Public discovery would expose `/design-studio` through nav/footer and sitemap. That is not approved by this branch.

## Verification Expectations

Before any controlled pilot exposure:

- run `npm run qa:local`
- run `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run build`
- run the Design Studio accessibility proxy against a local server
- run responsive QA with the route flag enabled
- confirm route enabled plus discovery blank excludes sitemap/nav/footer discovery
- confirm route enabled plus discovery public includes sitemap/nav/footer discovery only if later approved
- repeat human VoiceOver or equivalent screen-reader pass before external pilot users

## Locked Scope

- No user-entered measurement fields.
- No AR/browser-camera experiment.
- No upload or persistent storage.
- No Supabase Storage.
- No LiDAR, BIM, measured CAD or construction drawing claim.
- No AI/API-assisted measurement.
- No live supplier feed, SKU verification, pricing, procurement, checkout or marketplace.
- No Quote OS, payment or CRM work.
- No final quote, fixed price, legal advice or compliance certification wording.

## Rollback

Turn off route rendering:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=
```

Hide public discovery while keeping route rendering available:

```bash
NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true
NEXT_PUBLIC_BATHROOM_DESIGN_STUDIO_DISCOVERY=
```

Rebuild/restart the affected environment after env changes.

## Next Gate

After this branch merges, the next decision is whether to run post-merge local QA for the controlled noindex pilot configuration and complete the human screen-reader pass before any external pilot exposure.
