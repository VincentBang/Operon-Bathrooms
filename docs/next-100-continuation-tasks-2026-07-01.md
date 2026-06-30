# Next 100 Continuation Tasks: Operon Bathrooms Storage Gate To Post-Apply Hardening

Date: 2026-07-01

Status: continuation spine after private upload storage policy, SQL approval packet, local migration packet and
staging apply gate documentation. This file does not approve deployment, production Supabase changes, production
Netlify changes, upload implementation, admin download implementation, Quote OS or public release exposure.

## Operating Rules

- Work only inside Operon Bathrooms.
- Do not touch Operon Flooring, Operon Kitchens or Oz Timber Floor.
- Do not deploy.
- Do not modify production Supabase or Netlify settings.
- Do not apply migrations to production.
- Do not expose private rates, margins, supplier costs, service-role keys, admin notes, file paths or signed URLs.
- Keep public wording planning-only.
- Keep private upload storage implementation locked until the local/staging apply gate passes.
- Keep Quote OS locked until separately approved.

## Current Gate

Private upload storage local/staging apply is blocked until approved non-production Supabase inputs are available:

- `OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true`
- `OPERON_BATHROOMS_SUPABASE_QA_TARGET=local` or `staging`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- a database connection method such as `SUPABASE_DB_URL`, `DATABASE_URL`, `POSTGRES_URL`, Supabase CLI or `psql`

## Batch 1: Apply Gate Inputs, Tasks 1-10

1. Confirm the target is local or staging, not production.
2. Confirm the target project name/reference is approved.
3. Confirm the anon key belongs to the approved non-production project.
4. Confirm the service-role key belongs to the approved non-production project.
5. Confirm a database connection method is available.
6. Confirm `OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true` is set.
7. Confirm `OPERON_BATHROOMS_SUPABASE_QA_TARGET` is `local` or `staging`.
8. Confirm no production-looking URL or target name is present.
9. Confirm keys will not be printed in logs.
10. Record the approved target in a local/staging verification note.

## Batch 2: Migration Apply, Tasks 11-20

11. Review `supabase/migrations/202606290001_create_bathroom_lead_evidence_files.sql`.
12. Confirm the migration creates `bathroom_lead_evidence_files`.
13. Confirm RLS is enabled.
14. Confirm anon privileges are revoked.
15. Confirm authenticated privileges are revoked.
16. Confirm service-role-only table access.
17. Confirm bucket row remains private.
18. Confirm no `storage.objects` policy exists.
19. Apply only to the approved local/staging target.
20. Record apply output without printing secrets.

## Batch 3: Staging Contract Verification, Tasks 21-30

21. Run `npm run verify:supabase:migrations`.
22. Run `npm run qa:supabase:staging`.
23. Confirm anon can insert only into `bathroom_estimates`.
24. Confirm anon cannot select `bathroom_lead_evidence_files`.
25. Confirm anon cannot insert `bathroom_lead_evidence_files`.
26. Confirm anon cannot update or delete private tables.
27. Confirm service role can insert/read private file metadata.
28. Confirm marked QA rows are cleaned up.
29. Confirm no storage paths or signed URLs are returned publicly.
30. Record pass/fail evidence.

## Batch 4: Storage Implementation Readiness, Tasks 31-40

31. Keep implementation locked until Batch 3 passes.
32. Define upload initiation route acceptance criteria.
33. Define upload completion route acceptance criteria.
34. Define admin download route acceptance criteria.
35. Define audit logging requirements.
36. Define signed URL expiry requirement.
37. Define file count and size limits.
38. Define MIME sniffing and filename sanitation expectations.
39. Define user-facing failure copy.
40. Define admin-only visibility rules.

## Batch 5: Public Upload UI Hardening, Tasks 41-50

41. Keep current placeholder-safe UI until implementation is approved.
42. Confirm mobile usability for quote review upload control.
43. Confirm request review does not imply public storage.
44. Confirm site measure does not imply public storage.
45. Confirm chatbot does not collect files directly.
46. Confirm public responses never echo `bucket`.
47. Confirm public responses never echo `object_path`.
48. Confirm public responses never echo `signedUrl`.
49. Confirm public responses never echo `publicUrl`.
50. Confirm upload failure states are planning-only and safe.

## Batch 6: Admin Retrieval Design, Tasks 51-60

51. Keep admin download implementation locked until storage apply passes.
52. Define token/auth requirements for admin download.
53. Define signed download URL expiry.
54. Define admin file list columns.
55. Define no-public-listing rule.
56. Define audit event fields.
57. Define deleted/rejected file states.
58. Define virus scan placeholder states.
59. Define manual review report file references as internal-only.
60. Define evidence update route compatibility.

## Batch 7: Automated Tests, Tasks 61-70

61. Add public API test for upload initiation rejection before approval.
62. Add public API test that fake storage fields are not echoed.
63. Add admin API test for missing token on file list.
64. Add admin API test for missing token on file download.
65. Add service-role local-store test for file metadata if implementation starts.
66. Add migration verifier test for private evidence table.
67. Add bundle safety marker for storage internals.
68. Add chatbot safety test for file upload guidance.
69. Add manual review report test that file paths remain hidden.
70. Add QA docs for expected failures without env vars.

## Batch 8: Manual QA, Tasks 71-80

71. Run desktop upload UI check.
72. Run mobile upload UI check.
73. Check quote review form with PDF metadata.
74. Check quote review form with image metadata.
75. Check invalid MIME type rejection.
76. Check oversize file rejection.
77. Check honeypot and consent still work.
78. Check public confirmation copy.
79. Check admin route remains hidden from public nav.
80. Check no horizontal overflow after any upload UI changes.

## Batch 9: Release Boundary, Tasks 81-90

81. Confirm no deployment.
82. Confirm no production Supabase change.
83. Confirm no production Netlify change.
84. Confirm no Quote OS implementation.
85. Confirm no public document vault.
86. Confirm no customer-facing file browser.
87. Confirm no legal/compliance certification from files.
88. Confirm no final quote wording from uploaded evidence.
89. Confirm no supplier/procurement workflow.
90. Record release-boundary status.

## Batch 10: Post-Storage Decision, Tasks 91-100

91. Decide whether to implement upload initiation route.
92. Decide whether to implement upload completion route.
93. Decide whether to implement admin download route.
94. Decide whether to keep storage paused after staging proof.
95. Decide whether real staging email verification comes first.
96. Decide whether physical human review is required before release exposure.
97. Decide whether human screen-reader QA is required before release exposure.
98. Decide whether Quote OS acceptance criteria can begin as docs-only.
99. Keep Quote OS implementation locked.
100. Record the next approved gate.

## Recommended Next Task

Provide approved local/staging Supabase inputs and rerun the private upload storage apply/verification gate. If inputs
remain unavailable, work may continue only on docs, tests and safety checks that do not require live Supabase access.

