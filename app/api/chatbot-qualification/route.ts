import { NextResponse } from "next/server";
import { z } from "zod";
import { attributionSchema } from "@/lib/attribution";
import { storeChatbotQualification } from "@/lib/chatbot-qualification-store";
import { detectBathroomChatbotIntent } from "@/lib/chatbot/bathroomChatbotIntents";

const chatbotQualificationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional().default(""),
  suburb: z.string().min(2).max(120),
  preferredNextStep: z.enum(["estimate", "quote_review", "scope_review", "site_measure", "manual_review"]),
  message: z.string().min(10).max(1200),
  latestIntent: z.string().optional(),
  latestAssistantTitle: z.string().max(180).optional(),
  highRiskTopics: z.array(z.string().max(120)).max(12).optional().default([]),
  privacyAccepted: z.literal(true),
  termsAccepted: z.literal(true),
  guidanceAccepted: z.literal(true),
  company: z.string().max(0).optional().default(""),
  attribution: attributionSchema.optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = chatbotQualificationSchema.safeParse(body);

  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ error: "Invalid chatbot handoff" }, { status: 400 });
  }

  const latestIntent = detectBathroomChatbotIntent(parsed.data.message);
  const stored = await storeChatbotQualification({
    ...parsed.data,
    latestIntent,
    request
  });

  if (!stored.ok || !stored.qualification || !stored.followUpTask) {
    return NextResponse.json({ error: "Unable to store chatbot handoff" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    stored: stored.stored,
    qualificationId: stored.qualification.id,
    followUpTaskId: stored.followUpTask.id,
    recommendedNextAction: stored.qualification.recommendedNextAction,
    manualReviewRequired: stored.qualification.manualReviewRequired,
    message:
      "Request received. Operon will use this as planning context only; site measure, selections, licensed trade checks and written scope confirmation are required before contract pricing."
  });
}
