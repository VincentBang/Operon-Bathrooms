# Phase 2 Manual QA

Date: 2026-06-23

Environment:

- Local only.
- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true`
- `http://127.0.0.1:3010/design-studio`
- No deployment, production Supabase, production Netlify or external upload service used.

## Viewports Checked

| Viewport | Result | Evidence |
|---|---|---|
| 1440 x 1000 desktop | Pass | No horizontal overflow. Step 3 layout reached. Preview role present. Fixture selects present. Risk prompt updates after shower relocation. |
| 1280 x 900 laptop | Pass | No horizontal overflow. Controls fit viewport. Layout preview and fixture controls render. |
| 768 x 1024 tablet | Pass | No horizontal overflow. Single-column layout active. Fixture controls and preview stay within viewport. |
| 390 x 844 mobile | Pass | No horizontal overflow. Layout step and final result step reachable. Result CTAs fit viewport. |

## Flow Checks

- `/design-studio` loads with one H1 and seven trust labels.
- Wizard advances from Step 1 to Step 3 using scoped primary actions.
- Layout step renders room shape, size band, door entry, approximate preview and fixture-zone controls.
- Fixture service change can be set to `relocate`.
- Risk prompt changes from service intent unclear to relocation review.
- Mobile flow reaches Step 7 of 7.
- Result actions render: save locally, copy design summary, print brief, start planning estimate and request scope review.

## Accessibility Proxy Checks

- Layout step has four fieldsets with legends:
  - Approximate room shape
  - Approximate size band
  - Approximate door entry
  - Fixture-zone placement
- Approximate preview uses `role="img"` with label: `Approximate rectangle bathroom layout with 3 fixture zones`.
- Preview `aria-labelledby` and `aria-describedby` targets exist.
- Fixture selects expose labels:
  - Shower zone approximate position, status and service change
  - Vanity zone approximate position, status and service change
  - Toilet zone approximate position, status and service change
- No unlabeled controls were found in the layout step proxy check.

## Safety Checks

- No unsafe wording found in checked pages for:
  - final quote
  - fixed price
  - compliant design
  - certified
  - guaranteed
  - CAD
  - blueprint
  - dimensioned
- Copy remains planning-only and requires site measure, selections, licensed-trade checks and written scope confirmation before contract pricing.

## Remaining Limitation

This was browser-based manual/responsive QA plus accessibility proxy inspection. A dedicated human screen-reader session in VoiceOver or equivalent remains recommended before public release exposure.

## Release Polish Notes

- Updated public-facing Design Studio labels to "planning preview" language.
- Confirmed release-polish copy still says outputs are not measured plans, specifications, quotes or construction documents.
- Added current-step semantics for keyboard and assistive-technology context.
- Added scoped CSS polish for focus visibility, compact result actions and smaller layout preview spacing on narrow viewports.
- Added noindex/nofollow metadata regression coverage.
- Updated responsive QA to include `/design-studio` only when the feature flag is enabled.
- `npm run qa:local` passed with 64 tests.
- `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:responsive -- http://127.0.0.1:3010` passed for `/`, `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads` and `/design-studio` at desktop, laptop, tablet and mobile viewports.
- Responsive screenshots were saved locally to `.local/qa-responsive`.

## Design Studio Accessibility Harness

Added `npm run qa:design-studio:a11y` for repeatable local Design Studio checks with the feature flag enabled.

Latest runs:

- 2026-06-23: `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:design-studio:a11y -- http://127.0.0.1:3010` passed.
- 2026-06-24: `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO=true npm run qa:design-studio:a11y -- http://127.0.0.1:3010` passed.
- Desktop and mobile checks completed.
- Verified noindex/nofollow metadata on `/design-studio`.
- Verified one H1, active-step `aria-current`, visible control names and required trust labels.
- Verified keyboard-focusable step activation through to the result brief.
- Verified layout fieldset legends, approximate layout `role="img"` label and description target.
- Verified result actions are present.
- Scoped unsafe-wording scan to the Design Studio surface.

This remains an assistive-technology proxy harness, not a human VoiceOver certification. A dedicated human screen-reader pass remains recommended before public release exposure.

Human pass checklist: `docs/design-studio/VOICEOVER_SCREEN_READER_CHECKLIST.md`.
