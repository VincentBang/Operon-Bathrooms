# Design Studio Risk Register

| Risk | Severity | Mitigation | Phase | Status |
|---|---:|---|---|---|
| Scope drift into CAD/3D/Quote OS | High | Stage gates and explicit do-not-build list | 0/1 | Open |
| Customer image privacy leak | Critical | Browser-memory-only photos, no upload, no localStorage image data | 0/1 | Open |
| Concept mistaken for measured plan | Critical | Required trust labels and public-language tests | 0/1 | Open |
| Internal pricing exposure | Critical | Handoff excludes prices; bundle safety checks | 0/1 | Open |
| Real supplier/product claim | High | Fictional archetypes only | 0/1 | Open |
| Weak mobile usability | High | Responsive CSS and QA at small widths | 0/1 | Open |
| Unproven market demand | High | Gate requires real user experiments; no fabricated KPI passes | 0/1 | Open |
| Premature release exposure | Critical | Release-exposure criteria require controlled noindex pilot planning, rollback and QA before any flag, nav, sitemap or indexing change | Release exposure | Open |
| Users mistake Design Studio for quote or measured plan | Critical | Keep planning-only labels, noindex pilot, CTA routing and screen-reader/manual QA gates | Release exposure | Open |
| Measurement or AR scope unlocks accidentally | Critical | Keep user-entered measurements and AR/browser-camera experiments locked behind separate approvals | Release exposure | Open |
| Single feature flag exposes sitemap/nav during pilot | High | Discovery split separates route rendering from nav/footer and sitemap discovery; verify with focused tests and post-merge QA before pilot exposure | Pilot prep | Mitigating |
