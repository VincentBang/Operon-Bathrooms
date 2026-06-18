alter table public.bathroom_estimates
  add column if not exists source_route text not null default '/quote',
  add column if not exists landing_page text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists user_agent text,
  add column if not exists ip_hash text,
  add column if not exists status text not null default 'new',
  add column if not exists scoring_result jsonb not null default '{}'::jsonb,
  add column if not exists internal_notes text;

-- Local SQL only. Do not apply to production without reviewing RLS and insert path.
