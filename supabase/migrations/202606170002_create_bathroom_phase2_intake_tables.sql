create table if not exists public.bathroom_quote_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  source_route text not null default '/quote/review',
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text,
  form_payload jsonb not null,
  risk_flags jsonb not null default '[]'::jsonb,
  scoring_result jsonb not null default '{}'::jsonb,
  internal_notes text,
  guidance_accepted boolean not null default false,
  privacy_accepted boolean not null default false,
  terms_accepted boolean not null default false
);

create table if not exists public.bathroom_review_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  source_route text not null default '/request-review',
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text,
  form_payload jsonb not null,
  risk_flags jsonb not null default '[]'::jsonb,
  scoring_result jsonb not null default '{}'::jsonb,
  internal_notes text,
  guidance_accepted boolean not null default false,
  privacy_accepted boolean not null default false,
  terms_accepted boolean not null default false
);

create table if not exists public.bathroom_site_measure_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  source_route text not null default '/site-measure',
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text,
  form_payload jsonb not null,
  risk_flags jsonb not null default '[]'::jsonb,
  scoring_result jsonb not null default '{}'::jsonb,
  internal_notes text,
  guidance_accepted boolean not null default false,
  privacy_accepted boolean not null default false,
  terms_accepted boolean not null default false
);

alter table public.bathroom_quote_reviews enable row level security;
alter table public.bathroom_review_requests enable row level security;
alter table public.bathroom_site_measure_requests enable row level security;

-- No anon select policies are defined. Insert policies should be added only after choosing
-- a server-side insert path or reviewed public insert contract for the bathroom-specific project.
