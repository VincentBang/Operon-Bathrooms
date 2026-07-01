# Operon Bathrooms Private Upload Storage Staging Apply Gate - 2026-07-01

Status: BLOCKED_ENV_NOT_APPLIED

This note records the attempt to apply and verify the private upload storage migration after PR #45 merged. The
migration was not applied because the current shell does not contain the approved local/staging Supabase inputs needed
to run safely.

## Requested Task

Apply the private upload storage migration only to an approved local/staging Supabase target, then run staging
verification.

Migration intended for approval-gated apply:

- `supabase/migrations/202606290001_create_bathroom_lead_evidence_files.sql`

## Current Shell State

Available:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Missing:

- `OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true`
- `OPERON_BATHROOMS_SUPABASE_QA_TARGET=local` or `staging`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- A database connection URL such as `SUPABASE_DB_URL`, `DATABASE_URL` or `POSTGRES_URL`
- Supabase CLI
- `psql`

## Result

No migration was applied.

No Supabase Storage bucket was created.

No storage policies were created.

No production Supabase changes were made.

No production Netlify changes were made.

No deployment was performed.

## Follow-Up Attempt - 2026-07-01

Vincent approved continuing the gate run after PR #47 merged. The follow-up shell check still did not contain the
complete approved local/staging inputs required to apply SQL safely.

Present in the shell:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Missing from the shell:

- `OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true`
- `OPERON_BATHROOMS_SUPABASE_QA_TARGET=local` or `staging`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- A database connection URL such as `SUPABASE_DB_URL`, `DATABASE_URL` or `POSTGRES_URL`
- Supabase CLI
- `psql`

Verifier result:

- `npm run qa:supabase:staging` refused to run because the approval flag, target and public Supabase inputs were
  missing.
- `npm run verify:supabase:migrations` passed locally and confirmed the migration contract still limits anon insert
  to `bathroom_estimates`.

Follow-up result:

- No SQL was applied.
- No local/staging Supabase database was changed.
- No production Supabase database was changed.
- No Supabase Storage bucket or storage policy was created.
- No deployment was performed.

## Verifier Update

The staging contract verifier was updated so it is ready once approved credentials are supplied:

- Adds `bathroom_lead_evidence_files` to anon `SELECT` checks.
- Adds `bathroom_lead_evidence_files` to blocked anon `INSERT` checks.
- Adds service-role insert/read verification for private file metadata.
- Cleans up marked QA rows after verification.

## Required Inputs To Resume

Provide these only for an approved local or staging project:

```bash
export OPERON_BATHROOMS_SUPABASE_QA_APPROVED=true
export OPERON_BATHROOMS_SUPABASE_QA_TARGET=staging
export NEXT_PUBLIC_SUPABASE_URL="..."
export NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
export SUPABASE_SERVICE_ROLE_KEY="..."
export SUPABASE_DB_URL="..."
```

The target must not be production.

## Resume Steps

After approved non-production inputs are available:

1. Apply `supabase/migrations/202606290001_create_bathroom_lead_evidence_files.sql` to the approved local/staging database.
2. Run `npm run verify:supabase:migrations`.
3. Run `npm run qa:supabase:staging`.
4. Confirm anon cannot read, insert, update or delete private file metadata.
5. Confirm service-role can insert/read/delete marked private file metadata rows.
6. Confirm no public route or API response exposes bucket, object path, signed URL or public URL values.

## Recommended Next Task

Provide approved local/staging Supabase environment variables and a database connection method, then rerun the staging
apply and verification gate. Production remains locked.
