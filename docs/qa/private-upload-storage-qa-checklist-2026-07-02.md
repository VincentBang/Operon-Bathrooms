# Private Upload Storage QA Checklist Packet - 2026-07-02

Status: STORAGE_QA_CHECKLIST_READY_IMPLEMENTATION_LOCKED

This packet defines the QA checklist for any future private evidence upload implementation. It does not create upload
routes, admin retrieval routes, Supabase Storage buckets, storage policies, production Supabase changes, production
Netlify changes, deployment or Quote OS behavior.

## Current Locked State

Storage remains disabled.

Current quote-review upload behavior:

- Local browser metadata only.
- Allowed file types are PDF, JPEG, PNG and WebP.
- Maximum file size is 10MB.
- Public copy says file storage is not enabled.
- No bytes are uploaded.
- No public API response returns storage paths, buckets, public URLs or signed URLs.

## Future File Limits Checklist

Before any real upload route is merged:

- [ ] Maximum file size is 10MB per file.
- [ ] Maximum first-release file count is 5 files per lead.
- [ ] Total request payload limits are documented for local and Netlify runtime behavior.
- [ ] Oversize file rejection happens before storage writes.
- [ ] Oversize file rejection copy is customer-safe and does not mention internal infrastructure.
- [ ] Tests cover an oversize file.
- [ ] Tests cover multiple files above the count limit.
- [ ] Admin notes do not include raw file bytes or base64 data.

## Future MIME Checks

Allowed MIME types:

- `application/pdf`
- `image/jpeg`
- `image/png`
- `image/webp`

Before any real upload route is merged:

- [ ] Client-side accept list matches server-side allowlist.
- [ ] Server-side MIME allowlist is the source of truth.
- [ ] File extension is not trusted without MIME validation.
- [ ] SVG, HTML, Office documents, ZIP files and executables are rejected.
- [ ] Unknown or empty MIME type is rejected.
- [ ] Tests cover each allowed MIME type.
- [ ] Tests cover at least one disallowed MIME type.

## Future Filename Sanitisation

Before any real upload route is merged:

- [ ] Original filename is stored as display metadata only.
- [ ] Object path is generated server-side.
- [ ] Sanitised filename removes slashes, path traversal, null bytes, control characters and unsafe punctuation.
- [ ] Sanitised filename is length-limited.
- [ ] Empty sanitised filename receives a safe fallback.
- [ ] Customer filename is never used as an authorization boundary.
- [ ] Tests cover spaces, Unicode, path traversal, duplicate names and very long names.

## Future Safe Failure Copy

Public failure copy must:

- Say the upload could not be prepared or accepted.
- Ask the user to try a PDF, JPG, PNG or WebP file up to 10MB.
- Explain that the review can still proceed with written details if storage is unavailable.
- Remain planning guidance only.

Public failure copy must not mention:

- Bucket names.
- Object paths.
- Signed URLs.
- Service-role keys.
- Supabase errors.
- Provider stack traces.
- Internal lead scoring.
- Manual review report internals.
- Final quote or compliance certification.

## Future Manual QA Evidence

Manual QA should record:

- Desktop 1440px upload UI.
- Laptop 1280px upload UI.
- Tablet 768px upload UI.
- Mobile 390px upload UI.
- Valid PDF metadata path.
- Valid JPG metadata path.
- Valid PNG metadata path.
- Valid WebP metadata path.
- Disallowed file rejection.
- Oversize file rejection.
- Honeypot and consent still work.
- Public confirmation copy remains planning-only.
- Admin route remains hidden from public navigation.
- No public route, sitemap, robots or chatbot response exposes storage paths.

## Guard Tests Added

`tests/public-api-safety.test.ts` now asserts the disabled quote-review upload placeholder:

- Includes the approved MIME types.
- Keeps the 10MB limit.
- Uses safe placeholder failure copy.
- Does not mention disallowed document/archive/web formats, unlimited uploads or final-quote language.

## Resume Criteria

Private upload implementation remains locked until:

1. Approved local/staging Supabase inputs are available.
2. The private evidence migration is applied only to an approved non-production target.
3. `npm run qa:supabase:staging` passes.
4. Upload initiation/completion implementation is separately approved.
5. Admin retrieval implementation is separately approved.
6. This QA checklist is converted into automated and manual evidence for the implementation PR.

## Confirmation

- No upload initiation route was added.
- No upload completion route was added.
- No admin retrieval route was added.
- No SQL was applied.
- No Supabase Storage bucket was created.
- No storage policy was created.
- No production Supabase setting was changed.
- No production Netlify setting was changed.
- No deployment was performed.
- Quote OS remains locked.
