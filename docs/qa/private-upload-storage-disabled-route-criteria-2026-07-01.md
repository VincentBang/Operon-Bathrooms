# Private Upload Storage Disabled Route Criteria - 2026-07-01

Status: STORAGE_IMPLEMENTATION_LOCKED_TEST_GUARD_READY

This note defines the route acceptance criteria while private upload storage remains disabled. It does not approve
Supabase Storage bucket creation, storage policies, upload route handlers, admin download handlers, production
Supabase changes, production Netlify changes, deployment or Quote OS work.

## Current Boundary

Public lead flows may collect safe evidence metadata only:

- File name.
- File type.
- File size.
- Whether photos, plans or a builder quote exist.

Public lead flows must not collect or return:

- `bucket`
- `object_path`
- `storage_path`
- `publicUrl`
- `signedUrl`
- Supabase storage host URLs.
- Internal notes.
- Manual review report content.
- Lead qualification or scoring internals.
- Service-role keys or storage credentials.

## Disabled Storage Acceptance Criteria

Until the approved local/staging Supabase apply gate passes:

1. No public upload initiation route is added.
2. No public upload completion route is added.
3. No admin file download route is added.
4. Public quote-review, request-review and site-measure submissions continue to work without storage env vars.
5. Public responses never echo storage-looking fields submitted by a client.
6. The quote-review upload UI remains local metadata only and says public file storage is not enabled.
7. Request-review and site-measure flows do not imply files are stored.
8. Notification summaries returned publicly remain generic and never include file URLs or object paths.
9. Local fallback storage must not require Supabase Storage.
10. No customer-facing copy implies uploaded evidence confirms compliance, final pricing or contract scope.

## Tests Added

`tests/public-api-safety.test.ts` now injects storage-looking fields into:

- `/api/quote-review`
- `/api/request-review`
- `/api/site-measure`

The test asserts public responses do not include storage paths, bucket names, public URLs, signed URLs, service-role
markers, internal notes, manual review reports, private scoring or rate-card wording.

## Resume Criteria For Real Upload Work

Real private upload implementation remains locked until:

1. Approved local or staging Supabase target inputs are present.
2. `supabase/migrations/202606290001_create_bathroom_lead_evidence_files.sql` is applied only to that approved
   non-production target.
3. `npm run qa:supabase:staging` passes against the approved non-production target.
4. Route implementation is separately approved.
5. Admin retrieval and signed URL expiry rules are reviewed before coding.

## Confirmation

- No SQL was applied.
- No Supabase Storage bucket was created.
- No storage policies were created.
- No production Supabase setting was changed.
- No production Netlify setting was changed.
- No deployment was performed.
- No Quote OS work was unlocked.
