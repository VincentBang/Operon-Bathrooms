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
| Phase 4 deterministic contract | Constraint planning rejects AI/API, provider, pricing and certification drift | Passed in focused `tests/bathroom-design.test.tsx` |
| Phase 4 prompt generation | Constraint prompts cover layout, strata, waterproofing, access, service and evidence topics without private scoring or final claims | Passed in focused `tests/bathroom-design.test.tsx` |
| Phase 4 handoff | Constraint prompts are preserved in local save and estimate handoff safely | Passed in focused `tests/bathroom-design.test.tsx` |
| Phase 4 summary | Copy/print summary includes deterministic constraint prompts and planning-only boundaries | Passed in focused `tests/bathroom-design.test.tsx` |
| Phase 5 evidence contract | Evidence readiness rejects media, AR, verified-online and oversized checklist drift | Passed in `npm run qa:local` |
| Phase 5 evidence handoff | Evidence-readiness context persists without media, pricing or private markers | Passed in `npm run qa:local` |
| Phase 5 evidence controls | Checklist renders accessible status controls without upload or AR claims | Passed in `npm run qa:local` |
| Phase 5 flagged QA | Feature-flagged build, Design Studio a11y proxy and responsive QA | Passed after PR #11 merge on port 3018 |
| Release-exposure criteria | Controlled noindex pilot criteria documented without enabling release exposure | Docs-only branch; `git diff --check` required |
| Release-exposure rollback | Criteria define disable path through `NEXT_PUBLIC_ENABLE_BATHROOM_DESIGN_STUDIO` | Docs-only branch; implementation not approved |
| Release-exposure locks | Criteria keep user-entered measurements, AR/browser-camera, upload/storage, pricing, procurement and Quote OS locked | Docs-only branch; implementation not approved |
| Controlled noindex pilot prep | Runbook documents current single-flag limitation and later discovery-split requirement | Docs/config-only branch; `git diff --check` required |
| Pilot env warning | `.env.example` warns not to enable Design Studio for controlled noindex pilot before route/nav/sitemap behavior is approved | Docs/config-only branch; implementation not approved |
| Discovery split flags | Route rendering and public discovery are separate env gates | Passed before PR #16 merge |
| Discovery split sitemap | Route enabled with hidden discovery excludes `/design-studio`; discovery `public` includes it | Passed before PR #16 merge |
| Controlled noindex pilot proxy | Route enabled, discovery hidden, noindex/nofollow, a11y proxy and responsive checks | Passed locally on 2026-06-25; see `SCREEN_READER_PROXY_PASS_2026-06-25.md` |
| Screen-reader proxy closeout | PR #17 approval recorded without approving external pilot exposure | Docs-only closeout; `git diff --check` passed locally |
| Internal-only pilot approval | Internal route-enabled, noindex, discovery-hidden pilot approval recorded | Docs-only approval; `git diff --check` passed locally |
| Internal pilot pass 1 | Route-enabled internal pilot completed with discovery hidden and first feedback captured | Passed locally on 2026-06-26; see `INTERNAL_ONLY_PILOT_PASS_1_2026-06-26.md` |
| No-feedback continuation | Human feedback deferral and internal operations checklist recorded | Docs-only; `git diff --check` passed locally |
| Internal operations closeout | Operations readiness marked approved with checklist as standing runbook | Docs-only; `git diff --check` passed locally |
| Phase 6 acceptance criteria | Quote OS integration foundation criteria recorded without implementation | Docs-only; `git diff --check` passed locally |
| Phase 6 path decision | Handoff-contract-only path selected without implementation | Docs-only; `git diff --check` passed locally |
| Phase 6 handoff contract | Internal-only Quote OS handoff derives allowlisted v0.5 planning context without pricing, SKU, supplier, admin-note or public-output data | Passed in focused tests and `npm run qa:local` |
| Phase 6 post-merge verification | Updated `main` at merge commit `976d049` remains clean after PR #25 merge | Passed in `npm run qa:local` and `git diff --check` |
| Phase 7 acceptance criteria | Shared Operon System infrastructure criteria recorded without implementation | Docs-only; `git diff --check` passed locally |
| Phase 7 shared architecture map | Shared language, lifecycle and contract layers mapped without implementation | Docs-only; `git diff --check` passed locally |
| Phase 7 shared glossary | Shared vocabulary and forbidden meanings recorded without schemas or implementation | Docs-only; `git diff --check` passed locally |
| Phase 7 lifecycle vocabulary | Public, internal review, evidence, follow-up and handoff lifecycle labels recorded without workflow automation | Docs-only; `git diff --check` passed locally |
| Phase 7 adapter-readiness checklist | Future one-way adapter questions, allowlist principles, reject list, versioning and test expectations recorded without implementation | Docs-only; `git diff --check` required |
| Phase 7 contract field inventory | Bathrooms-local fields classified for future adapter review without implementing an allowlist or shared schema | Docs-only; `git diff --check` required |
| Phase 7 adapter decision packet | Recommended future adapter source and gates recorded without implementing an adapter or destination contract | Docs-only; `git diff --check` required |
| Phase 2 viewport QA | Desktop, laptop, tablet and mobile browser checks | Passed locally; see `PHASE_2_MANUAL_QA.md` |
| Phase 2 accessibility proxy | Fieldsets, labels, preview ARIA and unlabeled controls | Passed locally; dedicated screen-reader pass still recommended |
| Release polish copy | Public labels use gated planning-preview wording | Passed in component test and `npm run qa:local` |
| Release polish focus | Active step exposes `aria-current="step"` and focus states are visible | Passed in component test and CSS review |
| Release polish noindex | `/design-studio` metadata remains noindex/nofollow | Passed in `npm run qa:local` |
| Release polish responsive | `/design-studio` included in responsive QA only when flag enabled | Passed with `npm run qa:responsive` |
| Design Studio a11y harness | Noindex, control names, current step, layout ARIA and result actions | Passed with `npm run qa:design-studio:a11y` |
| Human screen-reader checklist | VoiceOver/equivalent pass steps prepared | Passed before PR #2; repeat still required before external pilot exposure after later feature changes |
