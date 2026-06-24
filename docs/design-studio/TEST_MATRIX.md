# Design Studio Test Matrix

| Area | Required Check | Status |
|---|---|---|
| Schema | Valid draft accepted and invalid enums rejected | Passed in `npm run test` |
| Privacy | Saved draft excludes image/blob/base64 fields | Passed in `npm run test` |
| Feature flag | Route/nav/sitemap discovery hidden when disabled | Passed in `npm run test`; enabled route manually returned 200 |
| Style data | Exactly six styles and two palettes per style | Passed in `npm run test` |
| Variants | Maximum three variants | Passed in `npm run test` |
| Handoff | Only allowlisted non-price fields serialised | Passed in `npm run test` |
| Handoff expiry | Invalid/expired handoff ignored safely | Passed in `npm run test` |
| Labels | Required inspiration/approximate/planning labels present | Passed in `npm run test` and enabled route render check |
| Accessibility | Core flow uses semantic controls and keyboard-operable buttons | Passed component test; full assistive-tech audit not yet run |
| Bundle safety | No supplier/rate/private data in client bundle | Passed `npm run qa:bundle-safety` with existing admin warnings only |
| Phase 2 schema | Layout planning and risk prompts accepted only within bounded schema | Passed in `npm run test` |
| Phase 2 layout controls | Room shape, size, entry and fixture-zone controls render safely | Passed in `npm run test` |
| Phase 2 preview | Approximate 2D preview avoids measured CAD and final-pricing claims | Passed in `npm run test` |
| Phase 2 handoff | Layout and prompt context preserved without scoring or pricing logic | Passed in `npm run test` |
| Phase 3 catalogue candidates | Local candidates are bounded and contain no supplier, SKU or price fields | Passed in `npm run test` |
| Phase 3 handoff | Product shortlist context is preserved with safety flags and no private pricing markers | Passed in `npm run test` |
| Phase 2 viewport QA | Desktop, laptop, tablet and mobile browser checks | Passed locally; see `PHASE_2_MANUAL_QA.md` |
| Phase 2 accessibility proxy | Fieldsets, labels, preview ARIA and unlabeled controls | Passed locally; dedicated screen-reader pass still recommended |
| Release polish copy | Public labels use gated planning-preview wording | Passed in component test and `npm run qa:local` |
| Release polish focus | Active step exposes `aria-current="step"` and focus states are visible | Passed in component test and CSS review |
| Release polish noindex | `/design-studio` metadata remains noindex/nofollow | Passed in `npm run qa:local` |
| Release polish responsive | `/design-studio` included in responsive QA only when flag enabled | Passed with `npm run qa:responsive` |
| Design Studio a11y harness | Noindex, control names, current step, layout ARIA and result actions | Passed with `npm run qa:design-studio:a11y` |
| Human screen-reader checklist | VoiceOver/equivalent pass steps prepared | Pending human execution before public exposure |
