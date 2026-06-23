import { NextResponse } from "next/server";
import { calculateEstimate } from "@/lib/estimate";
import { quoteWizardSchema } from "@/lib/estimate-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteWizardSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid estimate input" }, { status: 400 });
  }

  const result = calculateEstimate(parsed.data);
  return NextResponse.json(result);
}
