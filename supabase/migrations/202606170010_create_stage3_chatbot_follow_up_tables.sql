-- Stage 3 additive schema for chatbot qualification and follow-up task handling.
-- These tables are private/admin-side by default.
-- No anon SELECT, UPDATE or DELETE policies are defined.

create table if not exists public.operon_chatbot_qualifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in (
    'new',
    'reviewed',
    'converted_to_lead',
    'manual_review_needed',
    'not_fit',
    'archived'
  )),
  source_route text not null default 'chatbot',
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text,
  session_id text,
  lead_type text check (lead_type is null or lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure', 'chatbot')),
  lead_id uuid,
  contact_info jsonb not null default '{}'::jsonb,
  chatbot_payload jsonb not null default '{}'::jsonb,
  qualification_result jsonb not null default '{}'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  missing_evidence jsonb not null default '[]'::jsonb,
  recommended_next_action text,
  confidence_score integer check (confidence_score is null or confidence_score between 0 and 100),
  manual_review_required boolean not null default false,
  privacy_accepted boolean not null default false,
  terms_accepted boolean not null default false,
  guidance_accepted boolean not null default false,
  internal_notes text
);

create index if not exists operon_chatbot_qualifications_created_idx
  on public.operon_chatbot_qualifications (created_at desc);

create index if not exists operon_chatbot_qualifications_status_idx
  on public.operon_chatbot_qualifications (status, manual_review_required, created_at desc);

create index if not exists operon_chatbot_qualifications_lead_idx
  on public.operon_chatbot_qualifications (lead_type, lead_id)
  where lead_id is not null;

alter table public.operon_chatbot_qualifications enable row level security;

create table if not exists public.operon_follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'open' check (status in (
    'open',
    'in_progress',
    'waiting_on_customer',
    'completed',
    'cancelled',
    'archived'
  )),
  priority text not null default 'normal' check (priority in ('urgent', 'high', 'normal', 'low')),
  task_type text not null default 'follow_up' check (task_type in (
    'follow_up',
    'request_evidence',
    'quote_review',
    'site_measure',
    'manual_review',
    'customer_response',
    'admin_check'
  )),
  lead_type text check (lead_type is null or lead_type in ('estimate', 'quote_review', 'request_review', 'site_measure', 'chatbot')),
  lead_id uuid,
  chatbot_qualification_id uuid references public.operon_chatbot_qualifications(id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz,
  completed_at timestamptz,
  assigned_to text,
  source_route text,
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  risk_flags jsonb not null default '[]'::jsonb,
  task_payload jsonb not null default '{}'::jsonb,
  internal_notes text
);

create index if not exists operon_follow_up_tasks_due_idx
  on public.operon_follow_up_tasks (status, priority, due_at nulls last);

create index if not exists operon_follow_up_tasks_lead_idx
  on public.operon_follow_up_tasks (lead_type, lead_id, created_at desc)
  where lead_id is not null;

create index if not exists operon_follow_up_tasks_chatbot_idx
  on public.operon_follow_up_tasks (chatbot_qualification_id)
  where chatbot_qualification_id is not null;

alter table public.operon_follow_up_tasks enable row level security;

revoke all privileges on table public.bathroom_admin_activity_log from anon;
revoke all privileges on table public.bathroom_estimates from anon;
revoke all privileges on table public.bathroom_lead_qualification_events from anon;
revoke all privileges on table public.bathroom_lead_response_events from anon;
revoke all privileges on table public.bathroom_manual_review_reports from anon;
revoke all privileges on table public.bathroom_quote_reviews from anon;
revoke all privileges on table public.bathroom_review_requests from anon;
revoke all privileges on table public.bathroom_site_measure_requests from anon;
revoke all privileges on table public.operon_chatbot_qualifications from anon;
revoke all privileges on table public.operon_follow_up_tasks from anon;

grant all on table public.operon_chatbot_qualifications to service_role;
grant all on table public.operon_follow_up_tasks to service_role;

-- Existing approved browser-side estimate path: insert only, no anon select/update/delete.
grant insert on table public.bathroom_estimates to anon;

-- Server-side admin/API paths use service role. These grants make Data API access explicit on new Supabase defaults.
grant all on table public.bathroom_estimates to service_role;
grant all on table public.bathroom_quote_reviews to service_role;
grant all on table public.bathroom_review_requests to service_role;
grant all on table public.bathroom_site_measure_requests to service_role;
grant all on table public.bathroom_lead_response_events to service_role;
grant all on table public.bathroom_lead_qualification_events to service_role;
grant all on table public.bathroom_admin_activity_log to service_role;
grant all on table public.bathroom_manual_review_reports to service_role;
