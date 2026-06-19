# Next 100 Big Tasks: QA, Security And Integration Hardening

Date: 2026-06-18

Status: active local execution queue. No deployment, no push to main, no production Netlify changes and no unapproved production Supabase changes.

## Operating Rules

- Work only inside Operon Bathrooms.
- Keep all public language as planning guidance only.
- Do not expose internal rates, supplier costs, labour rates, margins, admin notes, private lead scoring logic, service-role keys or manual review reports publicly.
- Do not build Quote OS, chatbot AI, payment, marketplace, procurement, CRM, 3D design or suburb pages in this queue.
- Prioritise repeatable local QA, security review, copy tightening and integration hardening.

## Batch A: PR And Release QA

1. Confirm PR branch is based on `origin/main`.
2. Confirm PR contains only Operon Bathrooms files.
3. Confirm generated folders are not tracked.
4. Confirm public routes return 200.
5. Confirm every public page has one H1.
6. Confirm every public page has a title tag.
7. Confirm every public page has a canonical.
8. Confirm sitemap excludes admin routes.
9. Confirm sitemap excludes API routes.
10. Confirm robots excludes admin routes.
11. Confirm robots excludes API routes.
12. Confirm public nav excludes admin.
13. Confirm public footer excludes admin.
14. Confirm privacy and terms do not show chatbot.
15. Confirm admin route is noindex.
16. Confirm admin route is token gated.
17. Confirm admin APIs reject missing token.
18. Confirm public APIs reject honeypot spam.
19. Confirm public APIs reject missing consent.
20. Confirm public API responses contain no internal notes.

## Batch B: Public Copy And Safety

21. Scan public pages for final quote claims.
22. Scan public pages for legal advice claims.
23. Scan public pages for guaranteed compliance claims.
24. Scan public pages for fixed-price promises.
25. Scan public pages for cheap-renovation positioning.
26. Scan public pages for DIY waterproofing positioning.
27. Scan public pages for emergency repair positioning.
28. Scan public pages for supply-only positioning.
29. Scan public pages for private rates.
30. Scan public pages for service-role key strings.
31. Confirm pricing examples are labelled example/planning only.
32. Confirm compliance prompts use non-legal wording.
33. Confirm site measure requirement appears on conversion pages.
34. Confirm written scope confirmation appears on conversion pages.
35. Confirm licensed trade check language appears on risk pages.
36. Confirm quote review avoids accusing builders.
37. Confirm chatbot avoids final pricing.
38. Confirm chatbot refuses private pricing.
39. Confirm chatbot routes high-risk topics to review/site measure.
40. Confirm manual report copy remains admin-only.

## Batch C: Lead Flow Integration

41. Smoke test estimate lead API.
42. Smoke test quote review API.
43. Smoke test request review API.
44. Smoke test site measure API.
45. Smoke test chatbot handoff API.
46. Confirm public responses do not include qualification internals.
47. Confirm public responses do not include manual review reports.
48. Confirm public responses do not include internal notes.
49. Confirm public responses do not include private rates.
50. Confirm public responses do not include service-role keys.
51. Confirm attribution fields are accepted.
52. Confirm source route is captured.
53. Confirm UTM fields are accepted.
54. Confirm honeypot field blocks spam.
55. Confirm invalid email blocks submission.
56. Confirm missing privacy acceptance blocks submission.
57. Confirm missing terms acceptance blocks submission.
58. Confirm quote review scoring returns safe customer result.
59. Confirm chatbot handoff returns safe customer result.
60. Confirm notification absence does not fail build.

## Batch D: Admin And Private Boundaries

61. Confirm admin lead reads require token.
62. Confirm admin chatbot reads require token.
63. Confirm admin manual report reads require token.
64. Confirm admin qualification updates require token.
65. Confirm admin evidence updates require token.
66. Confirm admin response templates require token.
67. Confirm admin response templates keep planning-only wording.
68. Confirm admin lead data includes internal fields only after auth.
69. Confirm follow-up tasks are never public.
70. Confirm chatbot qualifications are never public.
71. Confirm local fallback storage is ignored by git.
72. Confirm private rate card is not rendered publicly.
73. Confirm migration verifier checks Stage 3 tables.
74. Confirm anon insert policy is limited to approved tables.
75. Confirm no anon SELECT migration policy exists.
76. Confirm no public storage policy exists.
77. Confirm no public views expose bathroom tables.
78. Confirm service-role key is server-only.
79. Confirm local/staging verification doc is current.
80. Confirm risk register mentions remaining integration limits.

## Batch E: Responsive And UX QA

81. Browser-check homepage at 1440px.
82. Browser-check homepage at 1280px.
83. Browser-check homepage at 768px.
84. Browser-check homepage at 390px.
85. Browser-check quote wizard at target widths.
86. Browser-check quote review at target widths.
87. Browser-check request review at target widths.
88. Browser-check site measure at target widths.
89. Browser-check admin dashboard at target widths.
90. Browser-check chatbot open/close at target widths.
91. Confirm forms are usable on mobile.
92. Confirm chatbot does not cover submit buttons.
93. Confirm sticky/launcher CTAs do not overlap.
94. Confirm no horizontal overflow in visual QA.
95. Confirm focus states are visible.
96. Confirm button labels are clear.
97. Confirm long words/URLs wrap.
98. Confirm local QA limitations are documented.
99. Update next-actions document after this queue.
100. Recommend the next task after checks pass.

## Current Execution Notes

- PR #1 exists as a draft and points to `codex/bathrooms-stage3-chatbot-follow-up`.
- Automated lint, typecheck, tests, build, public crawl and migration verification have passed locally.
- `npm run qa:responsive -- http://127.0.0.1:3000` now covers Batch E routes at 1440px, 1280px,
  768px and 390px with screenshots in `.local/qa-responsive`.
- Authorised admin workflow QA now has repeatable local-store test coverage for lead list filtering,
  manual-review reads, bulk qualification, response templates, manual report preview/persist/update,
  qualification overrides and chatbot follow-up reads.
- Approved local/staging Supabase persistence verification now has an opt-in harness:
  `npm run qa:supabase:staging`.
- Remaining high-value work is running that harness against an approved local/staging Supabase project,
  private upload storage verification and email-provider preview/send checks, without merging or deploying.
