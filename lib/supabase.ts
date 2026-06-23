import { createClient } from "@supabase/supabase-js";
import { EstimateResult, QuoteWizardInput } from "./estimate-schema";

export type BathroomEstimateRecord = {
  id?: string;
  created_at?: string;
  user_input: QuoteWizardInput;
  estimate_range: EstimateResult["range"];
  confidence_score: number;
  risk_flags: string[];
  contact_info: QuoteWizardInput["contact"];
};

export function getBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

export async function storeBathroomEstimate(record: BathroomEstimateRecord) {
  const client = getBrowserSupabaseClient();

  if (!client) {
    return { ok: false, reason: "Supabase is not configured for local development." };
  }

  const { error } = await client.from("bathroom_estimates").insert(record);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
