alter table public.bathroom_estimates
  add column if not exists lead_fit_score integer,
  add column if not exists lead_fit_tier text,
  add column if not exists qualification_status text not null default 'unreviewed',
  add column if not exists urgency text,
  add column if not exists project_value_band text,
  add column if not exists risk_level text,
  add column if not exists evidence_quality text,
  add column if not exists manual_review_required boolean not null default false,
  add column if not exists manual_review_reason jsonb,
  add column if not exists missing_evidence jsonb,
  add column if not exists disqualification_flags jsonb,
  add column if not exists recommended_next_action text,
  add column if not exists qualification_summary text,
  add column if not exists customer_safe_next_step text,
  add column if not exists qualification_notes text,
  add column if not exists qualification_updated_at timestamptz,
  add column if not exists qualification_updated_by text,
  add column if not exists evidence_checklist jsonb not null default '{}'::jsonb;

alter table public.bathroom_quote_reviews
  add column if not exists lead_fit_score integer,
  add column if not exists lead_fit_tier text,
  add column if not exists qualification_status text not null default 'unreviewed',
  add column if not exists urgency text,
  add column if not exists project_value_band text,
  add column if not exists risk_level text,
  add column if not exists evidence_quality text,
  add column if not exists manual_review_required boolean not null default false,
  add column if not exists manual_review_reason jsonb,
  add column if not exists missing_evidence jsonb,
  add column if not exists disqualification_flags jsonb,
  add column if not exists recommended_next_action text,
  add column if not exists qualification_summary text,
  add column if not exists customer_safe_next_step text,
  add column if not exists qualification_notes text,
  add column if not exists qualification_updated_at timestamptz,
  add column if not exists qualification_updated_by text,
  add column if not exists evidence_checklist jsonb not null default '{}'::jsonb;

alter table public.bathroom_review_requests
  add column if not exists lead_fit_score integer,
  add column if not exists lead_fit_tier text,
  add column if not exists qualification_status text not null default 'unreviewed',
  add column if not exists urgency text,
  add column if not exists project_value_band text,
  add column if not exists risk_level text,
  add column if not exists evidence_quality text,
  add column if not exists manual_review_required boolean not null default false,
  add column if not exists manual_review_reason jsonb,
  add column if not exists missing_evidence jsonb,
  add column if not exists disqualification_flags jsonb,
  add column if not exists recommended_next_action text,
  add column if not exists qualification_summary text,
  add column if not exists customer_safe_next_step text,
  add column if not exists qualification_notes text,
  add column if not exists qualification_updated_at timestamptz,
  add column if not exists qualification_updated_by text,
  add column if not exists evidence_checklist jsonb not null default '{}'::jsonb;

alter table public.bathroom_site_measure_requests
  add column if not exists lead_fit_score integer,
  add column if not exists lead_fit_tier text,
  add column if not exists qualification_status text not null default 'unreviewed',
  add column if not exists urgency text,
  add column if not exists project_value_band text,
  add column if not exists risk_level text,
  add column if not exists evidence_quality text,
  add column if not exists manual_review_required boolean not null default false,
  add column if not exists manual_review_reason jsonb,
  add column if not exists missing_evidence jsonb,
  add column if not exists disqualification_flags jsonb,
  add column if not exists recommended_next_action text,
  add column if not exists qualification_summary text,
  add column if not exists customer_safe_next_step text,
  add column if not exists qualification_notes text,
  add column if not exists qualification_updated_at timestamptz,
  add column if not exists qualification_updated_by text,
  add column if not exists evidence_checklist jsonb not null default '{}'::jsonb;

create table if not exists public.bathroom_lead_qualification_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null check (lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure')),
  lead_id uuid not null,
  event_type text not null,
  old_value jsonb,
  new_value jsonb,
  actor text,
  note text
);

alter table public.bathroom_lead_qualification_events enable row level security;

-- No anon SELECT or anon UPDATE policies are defined.
-- Public users must never read or update qualification fields.
-- Admin and qualification updates should run only through server-side service-role paths.
