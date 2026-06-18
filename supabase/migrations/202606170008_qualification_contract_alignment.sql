-- Local SQL only. Do not apply to production without review.
-- Aligns qualification enum constraints with the admin manual-review workflow.

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'bathroom_estimates',
    'bathroom_quote_reviews',
    'bathroom_review_requests',
    'bathroom_site_measure_requests'
  ]
  loop
    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_lead_fit_tier_check');
    execute format(
      'alter table public.%I add constraint %I check (lead_fit_tier is null or lead_fit_tier in (
        ''strong_fit'', ''good_fit'', ''needs_review'', ''weak_fit'', ''not_fit''
      ))',
      table_name,
      table_name || '_lead_fit_tier_check'
    );

    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_qualification_status_check');
    execute format(
      'alter table public.%I add constraint %I check (qualification_status in (
        ''unreviewed'',
        ''system_qualified'',
        ''manual_review_needed'',
        ''evidence_requested'',
        ''evidence_received'',
        ''qualified'',
        ''not_fit'',
        ''ready_for_site_measure'',
        ''ready_for_quote_review'',
        ''archived''
      ))',
      table_name,
      table_name || '_qualification_status_check'
    );

    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_urgency_check');
    execute format(
      'alter table public.%I add constraint %I check (urgency is null or urgency in (
        ''urgent'', ''high'', ''normal'', ''low''
      ))',
      table_name,
      table_name || '_urgency_check'
    );

    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_project_value_band_check');
    execute format(
      'alter table public.%I add constraint %I check (project_value_band is null or project_value_band in (
        ''low'', ''medium'', ''high'', ''premium'', ''unknown''
      ))',
      table_name,
      table_name || '_project_value_band_check'
    );

    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_risk_level_check');
    execute format(
      'alter table public.%I add constraint %I check (risk_level is null or risk_level in (
        ''low'', ''medium'', ''high'', ''critical''
      ))',
      table_name,
      table_name || '_risk_level_check'
    );

    execute format('alter table public.%I drop constraint if exists %I', table_name, table_name || '_evidence_quality_check');
    execute format(
      'alter table public.%I add constraint %I check (evidence_quality is null or evidence_quality in (
        ''complete'', ''adequate'', ''thin'', ''missing''
      ))',
      table_name,
      table_name || '_evidence_quality_check'
    );
  end loop;
end $$;

-- No anon SELECT or anon UPDATE policies are defined here.
-- Admin qualification reads and writes should remain server-side through service-role API routes only.
