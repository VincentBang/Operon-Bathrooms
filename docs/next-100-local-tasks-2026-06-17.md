# Next 100 Local Tasks: Stage 3 Chatbot, Follow-Up And QA

Date: 2026-06-17

Deployment status: not needed. Do not deploy, push to main, trigger Netlify, or change production Netlify settings from this queue.

## Operating Rule

Work only inside Operon Bathrooms. Keep public wording planning-only. Do not expose rates, margins, internal notes, private qualification logic, service-role keys, manual review reports or follow-up internals publicly.

## Stage 3 Schema And Storage

1. Confirm active Operon Bathrooms Supabase project.
2. Check live migration history.
3. Check existing live public tables.
4. Add local migration for `operon_chatbot_qualifications`.
5. Add local migration for `operon_follow_up_tasks`.
6. Enable RLS on new Stage 3 tables.
7. Add service-role grants for new Stage 3 tables.
8. Revoke anon table grants from private lead/admin tables.
9. Keep anon insert only on `bathroom_estimates`.
10. Update static migration verifier for `operon_*` tables.
11. Apply additive Stage 3 schema to approved Bathrooms Supabase project.
12. Apply anon grant tightening migration.
13. Verify RLS on all checked tables.
14. Verify no anon SELECT/UPDATE/DELETE policy.
15. Verify no anon SELECT/UPDATE/DELETE grant.
16. Verify service-role access on private tables.
17. Run preview chatbot qualification insert.
18. Run preview follow-up task insert.
19. Run joined dashboard-style read.
20. Clean up preview rows.

## Chatbot Handoff

21. Add server-side chatbot qualification store.
22. Add local fallback store for chatbot qualifications.
23. Add local fallback store for follow-up tasks.
24. Add Supabase insert mapping for chatbot qualifications.
25. Add Supabase insert mapping for follow-up tasks.
26. Infer risk flags from chatbot message and selected prompt context.
27. Infer missing evidence from risk flags.
28. Infer recommended next action.
29. Keep qualification internals server-side.
30. Add public chatbot qualification endpoint.
31. Reject honeypot spam.
32. Require privacy acceptance.
33. Require terms acceptance.
34. Require planning-guidance acknowledgement.
35. Return only safe public confirmation.
36. Do not return private scoring internals.
37. Add chatbot handoff CTA.
38. Add compact handoff form.
39. Capture source route and UTM attribution.
40. Capture chatbot session id locally.
41. Keep handoff optional and consent-based.
42. Keep chatbot hidden from admin/privacy/terms/internal routes.
43. Ensure handoff copy does not promise final quotes.
44. Ensure handoff copy does not give legal advice.
45. Test invalid consent rejection.

## Admin Follow-Up

46. Add admin chatbot qualification read endpoint.
47. Token-protect admin chatbot endpoint.
48. Add admin summary for total chatbot handoffs.
49. Add admin summary for manual-review handoffs.
50. Add admin summary for open follow-ups.
51. Add admin summary for urgent/high follow-ups.
52. Add dashboard button to load chatbot handoffs.
53. Add dashboard summary cards.
54. Add recent chatbot handoff panel.
55. Add open follow-up task panel.
56. Show risk flags without exposing private rates.
57. Show missing evidence without public proposal wording.
58. Keep follow-up task notes internal.
59. Do not add public task access.
60. Do not add customer portal.

## Local QA And Automation

61. Add local public crawl script.
62. Add tests for chatbot handoff validation.
63. Add tests for consent-required handoff.
64. Add tests for admin token protection.
65. Add tests for admin chatbot summary.
66. Run migration verifier.
67. Run lint.
68. Run typecheck.
69. Run tests.
70. Run production build.
71. Run git diff whitespace check.
72. Run local public crawl.
73. Review public wording for final quote claims.
74. Review public wording for legal advice.
75. Review public pages for admin links.
76. Review client code for service-role key exposure.
77. Review chatbot for private rate requests.
78. Review admin endpoint output for private/public separation.
79. Check dashboard mobile layout locally.
80. Check chatbot handoff mobile layout locally.

## Documentation And Release Discipline

81. Update execution log with Stage 3 schema verification.
82. Update risk register with Supabase grant tightening outcome.
83. Update next-actions document.
84. Document known limitation: no customer portal.
85. Document known limitation: no automatic email follow-up.
86. Document known limitation: no file upload storage yet.
87. Document known limitation: no Quote OS.
88. Document recommended next task after this batch.
89. Keep deployment status explicit.
90. Keep Supabase changes explicit.
91. Keep Netlify status explicit.
92. Keep repo-boundary confirmation explicit.
93. Keep no push-to-main confirmation explicit.
94. Do not create suburb pages.
95. Do not add payment.
96. Do not add marketplace/procurement.
97. Do not add paid AI API.
98. Do not expose lead scores publicly.
99. Prepare final local handoff.
100. Recommend the next task after checks pass.

## Current Status

Tasks 1-68 are complete locally or verified in this run. Continue from build/manual QA/documentation checks, then move to a controlled admin QA pass.

## Recommended Next Task

Run browser QA for `/`, `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads` and the chatbot handoff at 1440px, 1280px, 768px and 390px.
