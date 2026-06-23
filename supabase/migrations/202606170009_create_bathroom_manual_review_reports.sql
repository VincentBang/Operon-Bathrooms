-- Local SQL only. Do not apply to production without review.
-- Stores internal/admin-only bathroom manual review reports.

create table if not exists public.bathroom_manual_review_reports (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lead_type text not null check (lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure')),
  lead_id uuid not null,
  report_version integer not null default 1,
  report_status text not null default 'generated' check (report_status in ('draft', 'generated', 'reviewed', 'superseded', 'archived')),
  report_confidence text not null check (report_confidence in ('high', 'medium', 'low')),
  headline_summary text not null,
  recommended_next_action text,
  recommended_admin_status text,
  manual_review_required boolean not null default false,
  do_not_quote_reasons jsonb not null default '[]'::jsonb,
  missing_evidence jsonb not null default '[]'::jsonb,
  customer_follow_up_questions jsonb not null default '[]'::jsonb,
  report_payload jsonb not null,
  generated_by text,
  reviewed_at timestamptz,
  reviewed_by text
);

create index if not exists bathroom_manual_review_reports_lead_idx
  on public.bathroom_manual_review_reports (lead_type, lead_id, created_at desc);

create index if not exists bathroom_manual_review_reports_status_idx
  on public.bathroom_manual_review_reports (report_status, report_confidence);

alter table public.bathroom_manual_review_reports enable row level security;

-- No anon SELECT, INSERT or UPDATE policies are defined.
-- Reports are internal/admin-only and should be accessed only through server-side service-role routes.
-- Do not expose report payloads, uploaded file URLs, internal notes, rate cards, supplier costs or margins publicly.
