import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { EstimateResult, quoteWizardSchema } from "@/lib/estimate-schema";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input: unknown;
    result: EstimateResult;
  };
  const parsed = quoteWizardSchema.safeParse(body.input);

  if (!parsed.success || !body.result?.range) {
    return NextResponse.json({ error: "Invalid lead input" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, reason: "Supabase server credentials not configured" });
  }

  const supabase = createClient(url, serviceKey);
  const { error } = await supabase.from("bathroom_estimates").insert({
    user_input: parsed.data,
    estimate_range: body.result.range,
    confidence_score: body.result.confidenceScore,
    risk_flags: body.result.riskFlags,
    contact_info: parsed.data.contact
  });

  if (error) {
    return NextResponse.json({ ok: false, reason: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
