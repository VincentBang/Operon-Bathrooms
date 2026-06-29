# Operon Bathrooms Private Upload Storage SQL Approval Packet - 2026-06-29

Status: SQL_APPROVAL_PACKET_ONLY_NOT_APPLIED

This packet translates the approved policy design into candidate SQL for review. It is not an active migration and has
not been applied to local, staging or production Supabase.

## Files

- Candidate SQL: `docs/qa/private-upload-storage-sql-approval-packet-2026-06-29.sql`
- Policy design source: `docs/qa/private-upload-storage-policy-design-2026-06-29.md`

## What The Candidate SQL Defines

- Private metadata table: `public.bathroom_lead_evidence_files`.
- RLS enabled on the metadata table.
- No anon policies on the metadata table.
- No authenticated browser policies on the metadata table.
- Service-role-only table access.
- Candidate private bucket row: `bathroom-lead-evidence-files`.
- Private bucket setting: `public = false`.
- File size limit: `10MB`.
- Allowed MIME types: PDF, JPEG, PNG and WebP.
- No `storage.objects` policies.

## What This Packet Does Not Do

- It does not create an active migration under `supabase/migrations`.
- It does not apply SQL to local Supabase.
- It does not apply SQL to staging Supabase.
- It does not apply SQL to production Supabase.
- It does not create upload route handlers.
- It does not create admin download route handlers.
- It does not change public forms.
- It does not enable real user uploads.
- It does not create Quote OS document storage.

## Supabase Guidance Checked

Checked on 2026-06-29:

- Supabase changelog index.
- Supabase Storage access-control docs.
- Supabase RLS docs.

Relevant guidance reflected in this packet:

- Storage operations require explicit policies on `storage.objects`.
- Uploading objects can be allowed with `INSERT`, while upsert also requires `SELECT` and `UPDATE`.
- Service keys bypass RLS and must not be shared publicly.
- RLS should be enabled on tables in exposed schemas.
- Policies should use `TO` clauses rather than deprecated `auth.role()` checks.

## Approval Review Checklist

Reviewers should confirm:

- [ ] The SQL remains in `docs/qa/` and is not an active migration.
- [ ] The table has RLS enabled.
- [ ] There are no anon `SELECT`, `UPDATE`, `DELETE` or `ALL` policies.
- [ ] There are no anon `INSERT` policies.
- [ ] There are no authenticated browser policies in this MVP packet.
- [ ] Service-role access remains server-side only.
- [ ] The bucket is private.
- [ ] No public bucket policy is created.
- [ ] No `storage.objects` policy is created.
- [ ] The allowed file types match the policy design.
- [ ] The file size limit is `10MB`.
- [ ] Public APIs must not return `bucket`, `object_path`, `storage_path`, `publicUrl`, `signedUrl` or Supabase storage host URLs.

## Future Promotion Steps If Approved

Do these only in a separate approved implementation task:

1. Create a real migration using the project migration naming workflow.
2. Copy reviewed SQL into the migration.
3. Update migration verifier private-table checks to include `bathroom_lead_evidence_files`.
4. Add storage-policy verifier checks for the private bucket and absence of public/anon storage reads.
5. Add route-level tests proving public responses do not echo storage internals.
6. Run `npm run verify:supabase:migrations`.
7. Apply only to an approved local or staging Supabase target.
8. Run `npm run qa:supabase:staging` against the approved target.
9. Do not apply to production without a separate explicit production change request.

## Recommended Next Task

Review and approve this SQL approval packet. After merge, the next separate task is a real local migration branch that
adds the migration file and verifier updates, still without applying anything to production.

