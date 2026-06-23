# Supabase Local/Staging Verification

Status: re-verified against the approved Operon Bathrooms Supabase project on 2026-06-19.

This runbook is for applying Operon Bathrooms migrations to an approved local, staging or explicitly approved Bathrooms Supabase project only. Do not expose service-role keys in browser code, logs, screenshots or committed files.

## Current Environment Finding

- Supabase CLI is not installed in this workspace session.
- `psql` is not installed in this workspace session.
- Docker is not installed in this workspace session.
- No `supabase/config.toml`, `.env`, `.env.local` or local CLI target was found in the repo.
- The Supabase MCP connector was used for the approved Operon Bathrooms project `qulwdtpsljleyqkjfvji`.
- Applied migrations:
  - `operon_bathrooms_stage3_schema`
  - `tighten_operon_bathrooms_anon_grants`

## Static Verification

Run this before any local or staging database apply:

```bash
npm run verify:supabase:migrations
```

Expected result:

- Every `public.bathroom_*` and `public.operon_*` table created by migrations has row level security enabled.
- No anonymous SELECT, UPDATE, DELETE or ALL policy exists on bathroom or Operon Stage 3 tables.
- Anonymous INSERT is only allowed for `public.bathroom_estimates`.
- Manual review, admin notification, lead qualification, chatbot qualification and follow-up task tables have no anonymous policy.
- No public storage, public bathroom views, broad anon grants or security-definer patterns are introduced without review.

## Live Local/Staging Contract Harness

After migrations are applied to an approved non-production project, run:

```bash
OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true \
OPERON_BATHROOMS_SUPABASE_QA_TARGET=staging \
NEXT_PUBLIC_SUPABASE_URL=<approved-local-or-staging-url> \
NEXT_PUBLIC_SUPABASE_ANON_KEY=<approved-local-or-staging-anon-key> \
SUPABASE_SERVICE_ROLE_KEY=<approved-local-or-staging-service-role-key> \
npm run qa:supabase:staging
```

The harness:

- Refuses production-looking targets.
- Does not print keys.
- Inserts one marked anon planning estimate row and cleans it up.
- Confirms anon cannot update or delete the planning estimate row.
- Confirms anon reads from lead, admin, manual-review, chatbot and follow-up tables return no data or are blocked.
- Confirms anon inserts are blocked on quote review, request review, site measure, chatbot qualification and follow-up tables.
- Confirms service-role access can insert/read private chatbot qualification and follow-up task rows.
- Cleans up marked QA rows after the run.

## Apply To Approved Local/Staging Only

Use one of these paths after an approved non-production target is provided.

Local Supabase CLI path:

```bash
supabase start
supabase db reset
```

Approved staging path:

```bash
supabase link --project-ref <staging-project-ref>
supabase db push
```

Before running either command, confirm the target is not production.

## Database Policy Verification SQL

Run these queries after migrations are applied:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and (tablename like 'bathroom_%' or tablename like 'operon_%')
order by tablename;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and (tablename like 'bathroom_%' or tablename like 'operon_%')
order by tablename, policyname;
```

Expected:

- `rowsecurity` is true for every bathroom table.
- `anon` has no SELECT policy.
- `anon` has no UPDATE or DELETE policy.
- Any public insert policy is intentionally limited and reviewed.
- Private manual review/report tables have no anon policy.
- `operon_chatbot_qualifications` and `operon_follow_up_tasks` have no anon policy.

## Completed Verification Snapshot

- Project checked: `qulwdtpsljleyqkjfvji` (`Operon Bathrooms`).
- RLS was true for all checked Bathrooms and Stage 3 tables.
- Only one anon policy existed: INSERT on `public.bathroom_estimates`.
- Only one anon grant existed: INSERT on `public.bathroom_estimates`.
- Anon SELECT on `bathroom_estimates` was blocked with permission denied.
- Anon SELECT on `operon_chatbot_qualifications` was blocked with permission denied.
- Anon UPDATE and DELETE on `bathroom_estimates` were blocked with permission denied.
- Anon INSERT into `bathroom_estimates` succeeded inside a transaction and was rolled back.
- Service-role grants existed for lead/admin/manual-review/chatbot/follow-up tables.
- Service-role preview insert/read worked for `operon_chatbot_qualifications` and `operon_follow_up_tasks`.
- Preview rows were cleaned up after verification; remaining QA task/qualification rows were `0`.
- Security advisors returned expected notices only: private tables have RLS enabled with no policies, and
  `bathroom_estimates` has the approved permissive anon INSERT policy.

## Public Lead Flow Checks

Verify public flows with the anon key only:

- `/quote` estimate submission can create a planning estimate record if the current architecture uses direct anon insert.
- `/quote/review`, `/request-review` and `/site-measure` submissions use server-side functions or approved insert-only paths.
- No public flow can read back rows from `bathroom_estimates`, quote reviews, review requests, site-measure requests, lead qualification events, admin notifications or manual reports.
- No public flow should read chatbot qualifications or follow-up tasks.
- Honeypot spam fields are rejected where implemented.
- Client responses never include internal notes, lead scores, private rate cards, admin response data or manual review report internals.

## Admin And Service-Role Checks

Verify with server-side service-role credentials only:

- Admin lead reads work through server-only routes or functions.
- Manual review report data can be read by internal/admin service-role paths.
- Chatbot qualification and follow-up task data can be read by internal/admin service-role paths.
- Manual review report data cannot be selected with anon credentials.
- Service-role keys are not present in bundled client code, public env vars, logs or committed files.

## Browser/Network QA

Inspect network responses for the public lead forms:

- No internal rates, labour rates, supplier costs, margins or admin notes.
- No private lead scoring logic or manual report text.
- No final quote wording, legal advice or compliance certification wording.
- All responses keep the language as planning guidance only.

## Notes

Supabase changed default table exposure behaviour in 2026 so new tables may not be automatically exposed through the Data and GraphQL APIs. This does not replace RLS. API exposure, grants and policies should still be reviewed explicitly on the approved local or staging project.
