# Private Upload Storage Admin Retrieval Criteria - 2026-07-01

Status: ADMIN_RETRIEVAL_IMPLEMENTATION_LOCKED_CRITERIA_READY

This note defines acceptance criteria for future admin-only evidence file retrieval. It does not create an admin
download route, upload route, Supabase Storage bucket, storage policy, production Supabase change, production Netlify
change, deployment or Quote OS workflow.

## Current Boundary

Admin-lite may track evidence checklist status and safe upload metadata. It must not retrieve, list or download
private files while the storage apply gate remains blocked.

Currently allowed:

- Evidence checklist status updates.
- Manual review notes.
- Safe upload metadata such as file name, type and size if supplied.
- Internal review summaries that do not contain file URLs or object paths.

Currently not allowed:

- Admin file list endpoint.
- Admin file download endpoint.
- Signed download URLs.
- Public file URLs.
- Bucket names or object paths in the dashboard.
- Browser-side Supabase Storage access.
- Service-role key exposure.
- Customer-facing document vault.
- Quote OS document repository.

## Future Admin Retrieval Acceptance Criteria

If private evidence retrieval is later approved, the implementation must satisfy all of these criteria before merge:

1. Admin retrieval requires `OPERON_BATHROOMS_ADMIN_TOKEN` or a separately approved admin auth layer.
2. The route never accepts or returns a client-supplied object path as an authorization boundary.
3. The route looks up file metadata server-side by `leadType`, `leadId` and `fileId`.
4. The route confirms the file belongs to the requested lead before any download is prepared.
5. The service-role key is used server-side only.
6. Signed download URLs are short lived.
7. Public responses never include permanent public URLs.
8. Customer-facing APIs never expose bucket names, object paths or signed URLs.
9. Admin file list responses include only safe display metadata by default.
10. File access is audit logged if implementation is approved.
11. Rejected, deleted or virus-scan-failed files are not downloadable.
12. The route returns safe generic errors without storage internals.
13. Tests cover missing token, invalid token, invalid lead/file relationship and hidden storage fields.
14. Manual QA confirms no public page, sitemap, chatbot response or customer email exposes storage paths.

## Guard Tests Added

`tests/admin-boundary.test.ts` now asserts:

- Admin evidence file retrieval route folders remain absent while storage is locked.
- The admin dashboard does not include signed/public URL, storage path or object path markers.
- The admin dashboard does not expose download-file wording before the retrieval route is approved.

## Resume Criteria

Admin retrieval implementation remains locked until:

1. The approved local/staging Supabase apply gate passes.
2. Private bucket and metadata table boundaries are verified.
3. Upload initiation and completion route criteria are separately approved.
4. Admin retrieval route scope is separately approved.
5. No production Supabase or Netlify change is requested in the same step.

## Confirmation

- No admin retrieval route was added.
- No upload route was added.
- No SQL was applied.
- No Supabase Storage bucket was created.
- No storage policy was created.
- No production Supabase setting was changed.
- No production Netlify setting was changed.
- No deployment was performed.
- Quote OS remains locked.
