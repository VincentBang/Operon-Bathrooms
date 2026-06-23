# Next 500 Continuation Tasks: Operon Bathrooms Review Gate To Future Phases

Date: 2026-06-23

Status: planning spine for continued Operon Bathrooms work after PR #1 local readiness checks. This file does
not approve merging, deployment, production changes, real email sending, private upload storage or Quote OS
implementation.

## Operating Rules

- Work only inside Operon Bathrooms.
- Do not deploy.
- Do not push to `main`.
- Do not modify production Supabase or Netlify settings.
- Keep public language as planning guidance only.
- Do not expose internal rates, supplier costs, labour rates, margins, admin notes, private scoring logic,
  service-role keys or manual review reports publicly.
- Do not build full Quote OS, SaaS, marketplace, payment, 3D design, procurement, CRM or suburb pages until
  explicitly approved.

## Batch 1: PR #1 Decision Gate, Tasks 1-20

- Confirm PR #1 status, branch, base branch and mergeability.
- Confirm the PR remains scoped to Operon Bathrooms only.
- Confirm PR comments include the latest QA and known limitations.
- Confirm no reviewer-requested changes are unresolved.
- Confirm no production deployment wording is present.
- Confirm no push to `main` has happened.
- Confirm no production Supabase or Netlify changes have happened.
- Confirm the changed-file list is understandable for human review.
- Confirm documentation changes are intentional.
- Confirm migration files are local/staging only.
- Confirm admin routes are noindex and excluded from public navigation.
- Confirm public pages do not link to admin routes.
- Confirm QA screenshots remain ignored.
- Confirm local fallback data remains ignored.
- Confirm only `.env.example` is tracked.
- Confirm no key-shaped secrets are committed.
- Confirm final merge decision belongs to Vincent.
- Confirm real staging email send remains approval-gated.
- Confirm private upload storage remains approval-gated.
- Record review-gate status before any next phase begins.

## Batch 2: Repeatable Local Release Gate, Tasks 21-40

- Run lint, typecheck, tests and build.
- Run migration verifier.
- Run client bundle safety scan.
- Run email staging preview/failure contract.
- Run whitespace check.
- Record test count.
- Record expected Next.js ESLint plugin warning.
- Record expected protected-admin bundle warnings.
- Confirm no private rate-card data in public chunks.
- Confirm no service-role keys in built chunks.
- Confirm no internal notes in public chunks.
- Confirm no manual review report copy in public chunks.
- Confirm no customer proposal wording.
- Confirm no final quote wording.
- Confirm no legal-advice wording.
- Confirm no fixed-price guarantee.
- Confirm no public compliance certification wording.
- Confirm no dependency drift.
- Confirm no npm lockfile drift unless dependency work is intentional.
- Record local release-gate status.

## Batch 3: Browser And Responsive QA, Tasks 41-60

- Start a fresh local dev server.
- Run public crawl.
- Run public safety crawl.
- Run responsive QA.
- Check desktop homepage.
- Check laptop homepage.
- Check tablet homepage.
- Check mobile homepage.
- Check quote wizard mobile usability.
- Check quote review mobile usability.
- Check request review mobile usability.
- Check site measure mobile usability.
- Check admin dashboard token-gated route.
- Confirm chatbot visible on public routes.
- Confirm chatbot hidden on admin.
- Confirm no horizontal overflow.
- Confirm no launcher/form-submit collision.
- Confirm one H1 per checked page.
- Confirm canonical metadata.
- Stop local dev server after QA.

## Batch 4: Public Estimate Flow QA, Tasks 61-80

- Submit standard planning estimate.
- Submit high-risk apartment estimate.
- Submit old-home/asbestos-risk estimate.
- Submit plumbing-relocation estimate.
- Submit electrical-relocation estimate.
- Submit waterproofing-uncertainty estimate.
- Submit access-restriction estimate.
- Confirm planning range wording.
- Confirm confidence score wording.
- Confirm risk flags display safely.
- Confirm compliance prompts are non-legal.
- Confirm next-step CTAs route correctly.
- Confirm PDF route hides private rates.
- Confirm lead payload excludes private rate-card data.
- Confirm invalid contact details are rejected.
- Confirm missing required fields are rejected.
- Confirm success state is planning-only.
- Confirm no final quote language appears.
- Confirm no legal advice appears.
- Record estimate flow QA status.

## Batch 5: Quote Review Flow QA, Tasks 81-100

- Submit a complete quote review.
- Submit quote review with unclear GST.
- Submit quote review with high deposit concern.
- Submit quote review with missing waterproofing.
- Submit quote review with no waterproofing certificate mention.
- Submit quote review with missing demolition.
- Submit quote review with missing waste removal.
- Submit quote review with unclear exclusions.
- Submit quote review with PC/provisional sum risk.
- Submit apartment/strata quote review.
- Submit suspected-asbestos quote review.
- Confirm clarity score is safe and public.
- Confirm missing inclusions are customer-safe.
- Confirm questions to ask builder are non-accusatory.
- Confirm upload placeholder does not expose file paths.
- Confirm honeypot blocks spam.
- Confirm consent is required.
- Confirm success state is planning-only.
- Confirm public result hides internal logic.
- Record quote review QA status.

## Batch 6: Request Review Flow QA, Tasks 101-120

- Submit request review without builder quote.
- Submit request review with builder quote flag.
- Submit request review with photos/plans flag.
- Submit request review with urgent timeline.
- Submit request review with low-budget/bad-fit signal.
- Submit request review with apartment/strata signal.
- Submit request review with waterproofing uncertainty.
- Submit request review with asbestos concern.
- Confirm invalid email rejection.
- Confirm missing consent rejection.
- Confirm honeypot rejection.
- Confirm confirmation state is planning-only.
- Confirm next-prep guidance is useful.
- Confirm attribution fields are accepted.
- Confirm public response hides qualification internals.
- Confirm public response hides private notes.
- Confirm no admin-only data leaks.
- Confirm notification failure does not break capture.
- Confirm local fallback behavior stays private.
- Record request review QA status.

## Batch 7: Site Measure Flow QA, Tasks 121-140

- Submit site measure request with standard access.
- Submit site measure request with strata approval pending.
- Submit site measure request with lift/stairs constraints.
- Submit site measure request with parking constraints.
- Submit site measure request with known leak/mould.
- Submit site measure request with suspected asbestos.
- Submit site measure request with ventilation concern.
- Confirm phone is required.
- Confirm consent is required.
- Confirm honeypot rejection.
- Confirm confirmation state is planning-only.
- Confirm site-measure checklist is clear.
- Confirm contract-pricing boundary is clear.
- Confirm site inspection requirement is clear.
- Confirm licensed trade checks are referenced.
- Confirm written scope confirmation is referenced.
- Confirm no final price promise.
- Confirm attribution capture.
- Confirm no private workflow data leaks.
- Record site measure QA status.

## Batch 8: Chatbot QA, Tasks 141-160

- Test estimate intent.
- Test quote review intent.
- Test site measure intent.
- Test waterproofing intent.
- Test plumbing relocation intent.
- Test electrical relocation intent.
- Test apartment/strata intent.
- Test asbestos intent.
- Test PC/provisional sum intent.
- Test preparation/evidence intent.
- Test emergency/bad-fit intent.
- Test private labour-rate/margin refusal.
- Confirm CTAs route correctly.
- Confirm answers are concise.
- Confirm pricing answers are planning-only.
- Confirm no legal advice.
- Confirm no compliance certification.
- Confirm no internal scoring exposure.
- Confirm chatbot handoff requires consent.
- Record chatbot QA status.

## Batch 9: Admin Boundary QA, Tasks 161-180

- Confirm admin page noindex.
- Confirm unauthenticated admin APIs return safe rejection.
- Confirm lead list requires token.
- Confirm lead detail requires token.
- Confirm manual report routes require token.
- Confirm qualification routes require token.
- Confirm evidence update routes require token.
- Confirm response template routes require token.
- Confirm notification preview requires token.
- Confirm chatbot qualification reads require token.
- Confirm follow-up task reads require token.
- Confirm admin response payloads hide service-role keys.
- Confirm public routes cannot fetch admin data.
- Confirm admin-only notes remain admin-only.
- Confirm manual reports remain admin-only.
- Confirm rate card remains server-only.
- Confirm local fallback store is not public.
- Confirm admin chunks contain no secrets.
- Confirm admin terminology warnings are expected.
- Record admin boundary QA status.

## Batch 10: Admin Workflow QA, Tasks 181-200

- Open lead dashboard with token.
- Review summary cards.
- Filter by lead type.
- Filter by risk status.
- Filter by manual-review status.
- Open estimate lead detail.
- Open quote review detail.
- Open request review detail.
- Open site measure detail.
- Open chatbot qualification context.
- Generate manual review preview.
- Persist manual review report.
- Update manual review report status.
- Update evidence checklist.
- Override qualification status.
- Generate response template.
- Confirm response template is planning-only.
- Confirm follow-up task visibility.
- Confirm internal notes visibility.
- Record admin workflow QA status.

## Batch 11: Supabase Staging Contract, Tasks 201-220

- Confirm approved non-production Supabase target.
- Confirm target is not production.
- Confirm anon key is runtime-only.
- Confirm service-role key is server-side only.
- Run staging contract harness only with approval.
- Verify anon estimate insert.
- Verify anon SELECT block.
- Verify anon UPDATE block.
- Verify anon DELETE block.
- Verify private table anon insert block.
- Verify service-role lead reads.
- Verify service-role manual report reads.
- Verify chatbot qualification insert/read.
- Verify follow-up task insert/read.
- Verify marked QA row cleanup.
- Verify RLS remains enabled.
- Verify no public storage policy exists.
- Record project ref without secrets.
- Record advisor notices.
- Record Supabase QA status.

## Batch 12: Email Staging Contract, Tasks 221-240

- Confirm approval before real send.
- Confirm approved test recipient.
- Confirm approved admin recipient.
- Confirm approved sender.
- Confirm provider key is runtime-only.
- Run preview contract.
- Run provider failure contract.
- Run real send only if approval and env vars exist.
- Confirm lead capture succeeds if email fails.
- Confirm public response is generic on provider error.
- Confirm customer acknowledgement is planning-only.
- Confirm admin notification includes lead type.
- Confirm admin notification includes attribution.
- Confirm admin notification includes risk flags.
- Confirm admin notification hides keys.
- Confirm docs state real send outcome.
- Confirm no production provider use.
- Confirm no real customer address use.
- Confirm email limitations are clear.
- Record email QA status.

## Batch 13: Private Upload Storage Approval Path, Tasks 241-260

- Confirm private storage approval.
- Confirm target storage project.
- Define bucket name.
- Define private bucket policy.
- Define object path strategy.
- Define MIME allowlist.
- Define max file size.
- Define metadata table.
- Define signed URL expiry.
- Define admin retrieval route.
- Define upload API validation.
- Define malware-scan placeholder if needed.
- Define audit log fields.
- Define cleanup policy.
- Write local migration draft.
- Write policy verifier draft.
- Write public leak tests.
- Write admin retrieval tests.
- Document limitations.
- Do not implement without approval.

## Batch 14: Measurement And Attribution, Tasks 261-280

- Audit UTM capture in estimate flow.
- Audit UTM capture in quote review flow.
- Audit UTM capture in request review flow.
- Audit UTM capture in site measure flow.
- Audit UTM capture in chatbot handoff.
- Audit landing page capture.
- Audit source route capture.
- Audit referrer capture.
- Audit user agent handling.
- Audit IP hash placeholder.
- Test attribution normalization.
- Test empty attribution handling.
- Test malformed UTM handling.
- Add admin source summary if approved.
- Add admin campaign summary if approved.
- Confirm no third-party tracker is added.
- Confirm no analytics secret is committed.
- Document measurement limitations.
- Recommend analytics provider decision separately.
- Record attribution QA status.

## Batch 15: SEO And Internal Linking QA, Tasks 281-300

- Crawl homepage links.
- Crawl cost guide links.
- Crawl quote review links.
- Crawl service page links.
- Crawl guide index links.
- Confirm sitemap excludes admin.
- Confirm robots excludes admin.
- Confirm canonicals are unique.
- Confirm no thin suburb pages were added.
- Confirm no empty guide pages are indexed.
- Confirm bad-fit keyword policy holds.
- Confirm no cheap-renovation positioning.
- Confirm no DIY waterproofing positioning.
- Confirm no emergency repair positioning.
- Confirm no legal-advice positioning.
- Confirm quote wizard CTA works.
- Confirm quote review CTA works.
- Confirm site measure CTA works.
- Confirm request review CTA works.
- Record SEO QA status.

## Batch 16: Accessibility And Form Usability, Tasks 301-320

- Check keyboard access on chatbot launcher.
- Check keyboard access on quote wizard.
- Check keyboard access on quote review form.
- Check keyboard access on request review form.
- Check keyboard access on site measure form.
- Check visible focus states.
- Check labels for required inputs.
- Check error message placement.
- Check mobile tap targets.
- Check checkbox usability.
- Check file upload placeholder messaging.
- Check form submit loading states.
- Check confirmation focus handling.
- Check aria labels on chatbot controls.
- Check contrast of key controls.
- Check responsive wrapping of long text.
- Check no form footer collision.
- Check admin table scanability.
- Document accessibility limitations.
- Record accessibility QA status.

## Batch 17: Documentation Hardening, Tasks 321-340

- Review README setup.
- Review README scripts.
- Review Supabase docs.
- Review email QA docs.
- Review private upload decision doc.
- Review risk register.
- Review master plan.
- Review SEO master plan.
- Review agent system plan.
- Review chatbot agent plan.
- Review next-actions doc.
- Review next-100 queue.
- Review next-200 queue.
- Review next-500 queue.
- Ensure docs do not imply deployment.
- Ensure docs do not imply production changes.
- Ensure docs do not publish secrets.
- Ensure docs separate approval-gated work.
- Ensure docs name known limitations.
- Record documentation QA status.

## Batch 18: Security And Privacy QA, Tasks 341-360

- Scan for service-role key assignments.
- Scan for provider key assignments.
- Scan for private key blocks.
- Scan for key-shaped strings.
- Scan for public storage URLs.
- Scan for signed URL exposure.
- Scan for admin URL exposure in public nav.
- Scan for manual report exposure.
- Scan for internal note exposure.
- Scan for private rate exposure.
- Scan API responses for private fields.
- Scan built assets for secret markers.
- Confirm honeypots are retained.
- Confirm consent fields are retained.
- Confirm privacy/terms routes exist.
- Confirm admin token is not logged.
- Confirm notification errors are generic.
- Confirm local fallback files are ignored.
- Document residual security risks.
- Record security QA status.

## Batch 19: Manual Review Report Future Polish, Tasks 361-380

- Review report structure for operators.
- Review evidence checklist.
- Review site-measure readiness logic.
- Review quote-review readiness logic.
- Review bad-fit lead handling.
- Review missing evidence prompts.
- Review strata prompts.
- Review asbestos prompts.
- Review waterproofing prompts.
- Review PC/provisional sum prompts.
- Review exclusions prompts.
- Review customer-boundary language.
- Add tests only if gaps exist.
- Improve copy only if ambiguity exists.
- Keep report internal-only.
- Avoid proposal formatting.
- Avoid final quote wording.
- Avoid legal advice.
- Document future export needs.
- Record manual report polish status.

## Batch 20: Phase 6 Quote OS Boundary Definition, Tasks 381-400

- Define Quote OS goal.
- Define Quote OS non-goals.
- Define planning-only boundary.
- Define contract-pricing boundary.
- Define site-measure dependency.
- Define selections dependency.
- Define licensed trade dependency.
- Define written scope dependency.
- Define estimate-to-scope transition.
- Define evidence model.
- Define allowance model.
- Define exclusion model.
- Define variation-risk model.
- Define operator workflow.
- Define customer handoff boundary.
- Define internal data rules.
- Define migration draft only.
- Define QA draft only.
- Do not implement without approval.
- Record Quote OS prep status.

## Batch 21: Phase 6 Data Model Draft, Tasks 401-420

- Draft scope sections table.
- Draft inclusions table.
- Draft exclusions table.
- Draft allowance categories.
- Draft evidence requirements.
- Draft site-measure observations.
- Draft trade-check observations.
- Draft selection status fields.
- Draft risk register linkage.
- Draft manual review linkage.
- Draft quote versioning.
- Draft operator notes boundary.
- Draft customer-safe summary boundary.
- Draft audit event table.
- Draft RLS requirements.
- Draft admin-only access rules.
- Draft no-anon-select rules.
- Draft migration sequencing.
- Draft rollback considerations.
- Keep as documentation until approved.

## Batch 22: Phase 6 UX Draft, Tasks 421-440

- Draft admin operator flow.
- Draft scope builder flow.
- Draft evidence review flow.
- Draft selection readiness flow.
- Draft risk review flow.
- Draft allowance review flow.
- Draft exclusions review flow.
- Draft internal notes flow.
- Draft response template flow.
- Draft customer handoff flow.
- Draft no-final-quote-online messaging.
- Draft site-measure requirement messaging.
- Draft licensed-trade requirement messaging.
- Draft written-scope requirement messaging.
- Draft mobile admin considerations.
- Draft print/export considerations.
- Draft operator QA checklist.
- Draft accessibility checklist.
- Draft future implementation backlog.
- Keep as documentation until approved.

## Batch 23: Release Notes And Merge Handoff, Tasks 441-460

- Prepare merge-readiness summary.
- Summarize implemented public flows.
- Summarize admin-lite scope.
- Summarize chatbot scope.
- Summarize manual review scope.
- Summarize Supabase migrations.
- Summarize local QA.
- Summarize browser QA.
- Summarize Supabase staging verification.
- Summarize email preview verification.
- Summarize known limitations.
- Summarize approval-gated items.
- Confirm no deployment.
- Confirm no main push.
- Confirm no production Supabase changes.
- Confirm no production Netlify changes.
- Confirm no other Operon repo changes.
- Confirm recommended merge sequence.
- Confirm rollback consideration.
- Record release handoff.

## Batch 24: Post-Merge Local Follow-Up, Tasks 461-480

- Pull updated main only after merge.
- Create a new feature branch after merge.
- Confirm clean working tree.
- Re-run local gate on main after merge.
- Re-run browser crawl on main after merge.
- Confirm docs still point at next task.
- Confirm no deploy happened from local action.
- Confirm Netlify deploy status separately only if asked.
- Confirm production settings were not modified.
- Archive obsolete queue notes only if approved.
- Start approval-gated email send task only if env vars are supplied.
- Start private storage task only if policies are approved.
- Start Quote OS docs only if approved.
- Start Quote OS implementation only if approved.
- Keep all new work on branch.
- Keep PRs small.
- Keep tests with each change.
- Keep public language safe.
- Keep admin/private boundaries intact.
- Record post-merge status.

## Batch 25: Next Decision Set, Tasks 481-500

- Decide whether PR #1 can merge.
- Decide whether real staging email send is approved.
- Decide whether private upload storage is approved.
- Decide whether analytics provider selection is needed.
- Decide whether admin attribution summaries are approved.
- Decide whether manual report export is approved.
- Decide whether Quote OS Phase 6 docs are approved.
- Decide whether Quote OS Phase 6 implementation is approved.
- Decide whether additional SEO guide pages are approved.
- Decide whether local suburb pages remain deferred.
- Decide whether chatbot lead handoff needs more fields.
- Decide whether response templates need operator review.
- Decide whether privacy/terms need legal review.
- Decide whether accessibility QA needs human review.
- Decide whether database migration application needs another staging pass.
- Decide whether screenshot artifacts should be archived.
- Decide whether docs should be condensed before merge.
- Decide whether PR #1 should remain draft.
- Decide whether a new PR should split future work.
- Recommended next task: human PR #1 merge decision, then approval-gated email/storage follow-up.

## Current Recommended Next Task

PR #1 is ready for human merge decision after local QA. Do not merge, deploy, run real staging email sending,
implement private storage or start Quote OS without explicit approval.
