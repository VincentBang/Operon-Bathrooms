# Next 200 Continuation Tasks: Post-PR Readiness To Quote OS Prep

Date: 2026-06-21

Status: planning spine for continued Operon Bathrooms work after the Stage 3 chatbot, admin-lite,
manual review and QA hardening PR is ready for review.

## Operating Rules

- Work only inside Operon Bathrooms.
- Do not deploy.
- Do not push to `main`.
- Do not modify production Supabase or Netlify settings.
- Keep public language as planning guidance only.
- Do not expose internal rates, supplier costs, labour rates, margins, admin notes, private scoring logic,
  service-role keys or manual review reports publicly.
- Do not build full Quote OS, SaaS, marketplace, payment, 3D design, procurement, CRM or suburb pages
  until explicitly approved.

## Batch A: PR Review And Merge Approval

1. Re-open PR #1 and confirm title/scope.
2. Confirm all PR comments are current.
3. Confirm branch is up to date with `origin/main`.
4. Confirm changed files are only Operon Bathrooms files.
5. Confirm no generated QA screenshots are tracked.
6. Confirm no local fallback JSON files are tracked.
7. Confirm no `.env.local` files are tracked.
8. Confirm `.env.example` contains placeholders only.
9. Confirm production Supabase settings are untouched.
10. Confirm production Netlify settings are untouched.
11. Confirm no Operon Flooring files changed.
12. Confirm no Operon Kitchens files changed.
13. Confirm no Oz Timber Floor files changed.
14. Confirm PR summary lists known limitations.
15. Confirm PR summary says no deployment happened.
16. Confirm PR summary says no push to `main` happened.
17. Confirm README scripts match `package.json`.
18. Confirm execution log includes latest QA.
19. Confirm next-actions doc points at the right next task.
20. Ask for merge approval only after manual QA is accepted.

## Batch B: Fresh Local Gate

21. Run lint.
22. Run typecheck.
23. Run tests.
24. Run build.
25. Run migration verifier.
26. Run client bundle safety scan.
27. Run email staging contract preview.
28. Run whitespace check.
29. Record expected Next.js ESLint plugin warning.
30. Record expected admin bundle label warnings.
31. Confirm test count.
32. Confirm no failing tests.
33. Confirm no changed files after QA.
34. Confirm no npm lockfile churn.
35. Confirm no dependency drift.
36. Confirm no new vulnerable runtime package was added without need.
37. Confirm no server-only package is imported by public client components.
38. Confirm no private rate card appears in client chunks.
39. Confirm no service-role key markers appear in built chunks.
40. Confirm no internal notes appear in public chunks.

## Batch C: Local Browser QA

41. Start local dev server.
42. Crawl public routes.
43. Run public safety crawl.
44. Run responsive QA.
45. Check homepage at 1440px.
46. Check homepage at 1280px.
47. Check homepage at 768px.
48. Check homepage at 390px.
49. Check quote wizard at 390px.
50. Check quote review at 390px.
51. Check request review at 390px.
52. Check site measure at 390px.
53. Check admin dashboard with token.
54. Confirm chatbot is hidden on admin.
55. Confirm chatbot appears on public routes.
56. Confirm chatbot launcher does not cover form submit buttons.
57. Confirm sticky CTA does not collide with chatbot.
58. Confirm no horizontal overflow.
59. Confirm H1 uniqueness.
60. Confirm canonical tags.

## Batch D: Public Lead Flow QA

61. Submit standard estimate.
62. Submit high-risk apartment estimate.
63. Submit quote review with missing waterproofing.
64. Submit quote review with deposit concern.
65. Submit quote review with unclear GST.
66. Submit quote review with unclear exclusions.
67. Submit request review with no quote.
68. Submit request review with photos/plans flag.
69. Submit site measure with strata constraints.
70. Submit site measure with access constraints.
71. Submit chatbot handoff with consent.
72. Submit chatbot handoff honeypot spam.
73. Confirm invalid emails are rejected.
74. Confirm missing privacy acceptance is rejected.
75. Confirm missing terms acceptance is rejected.
76. Confirm success states stay planning-only.
77. Confirm public responses hide internal scoring.
78. Confirm public responses hide manual review reports.
79. Confirm public responses hide internal notes.
80. Confirm public responses hide private storage paths.

## Batch E: Admin Workflow QA

81. Open admin lead dashboard with token.
82. Confirm unauthenticated admin page/API rejection.
83. Filter by lead type.
84. Filter by manual review.
85. Filter by high-risk status.
86. Open estimate lead detail.
87. Open quote review lead detail.
88. Open site measure lead detail.
89. Open chatbot qualification detail.
90. Generate manual review preview.
91. Persist manual review report.
92. Update report status.
93. Update evidence checklist.
94. Override qualification status.
95. Generate response template.
96. Confirm internal notes stay admin-only.
97. Confirm follow-up tasks stay admin-only.
98. Confirm private report copy is not proposal wording.
99. Confirm no rate/margin fields are exposed publicly.
100. Record admin QA outcome.

## Batch F: Staging Email Verification

101. Confirm email send approval before real send.
102. Confirm approved test recipient.
103. Confirm approved provider key is supplied at runtime only.
104. Confirm approved from address.
105. Confirm approved admin recipient.
106. Run preview contract.
107. Run provider failure contract.
108. Run real staging send only if approved.
109. Confirm lead capture still succeeds if delivery fails.
110. Confirm customer acknowledgement copy is planning-only.
111. Confirm admin notification includes attribution.
112. Confirm admin notification includes risk flags.
113. Confirm admin notification hides service-role keys.
114. Confirm public notification errors are generic.
115. Confirm no email env vars are committed.
116. Confirm docs record send outcome.
117. Confirm no production email provider was used.
118. Confirm no customer real addresses were used for QA.
119. Confirm unsubscribe/operational copy is appropriate if added later.
120. Defer deliverability polish until provider approval.

## Batch G: Private Upload Storage Approval Path

121. Confirm whether private upload storage is approved.
122. Confirm local/staging Supabase Storage target.
123. Draft private bucket migration.
124. Draft metadata table migration if needed.
125. Define allowed MIME types.
126. Define max file size.
127. Define object path strategy.
128. Define signed URL expiry.
129. Define admin-only retrieval route.
130. Define anon upload boundary if approved.
131. Confirm no public bucket policy.
132. Add storage verifier.
133. Add upload safety tests.
134. Add admin file retrieval tests.
135. Add public response leakage tests.
136. Add docs for storage setup.
137. Run local/staging storage verification.
138. Record artifact cleanup.
139. Keep placeholder UI if approval is missing.
140. Do not implement storage without explicit approval.

## Batch H: Manual Review Report Generator Polish

141. Review report sections with operator lens.
142. Add missing evidence grouping.
143. Add risk explanation grouping.
144. Add next-step recommendation grouping.
145. Add site-measure readiness grouping.
146. Add quote-review readiness grouping.
147. Add apartment/strata prompts.
148. Add asbestos prompts.
149. Add waterproofing prompts.
150. Add PC/provisional sum prompts.
151. Add exclusions prompts.
152. Add evidence quality flags.
153. Add tests for public boundary copy.
154. Add tests for internal-only routing.
155. Add tests for bad-fit lead handling.
156. Add tests for report persistence.
157. Add tests for report update events.
158. Confirm no customer proposal wording.
159. Confirm no final quote wording.
160. Document limitations.

## Batch I: Measurement And Attribution

161. Audit UTM capture across all lead forms.
162. Audit landing page capture.
163. Audit referrer capture.
164. Audit source route capture.
165. Audit user agent handling.
166. Audit IP hash placeholder behavior.
167. Add tests for attribution normalization.
168. Add admin table columns for attribution if missing.
169. Add admin filters for source route if approved.
170. Add admin filters for UTM campaign if approved.
171. Add export-free summary cards.
172. Add source quality summary.
173. Add conversion path summary.
174. Confirm no analytics secret exposure.
175. Confirm no third-party tracker was added without approval.
176. Document measurement limitations.
177. Confirm SEO page to lead route links.
178. Confirm chatbot route attribution.
179. Confirm manual review origin is recorded.
180. Recommend analytics decision separately.

## Batch J: Phase 6 Quote OS Foundation Prep

181. Define Quote OS boundaries.
182. Define what remains planning-only.
183. Define what requires site measure.
184. Define what requires selections.
185. Define what requires licensed trade checks.
186. Define written scope confirmation requirements.
187. Define internal quote-building data model draft.
188. Define estimate-to-scope transition draft.
189. Define exclusions model draft.
190. Define allowance model draft.
191. Define variation-risk model draft.
192. Define evidence requirements draft.
193. Define admin operator workflow draft.
194. Define customer-facing boundary draft.
195. Define no-public-rate rule.
196. Define no-contract-pricing-online rule.
197. Define migration plan draft only.
198. Define QA plan draft only.
199. Do not build Quote OS until approved.
200. Recommended next task after this queue: approved manual QA and merge decision for PR #1.

## Current Recommended Next Task

Final PR readiness review is the active task. If this passes, the next task is approved manual QA and
merge decision for PR #1. Real staging email sending and private upload storage remain approval-gated.
