import { NextResponse } from "next/server";
import { attributionSchema } from "@/lib/attribution";
import {
  prepareAndSendBathroomNotifications,
  publicNotificationSummary,
  responseStatusForNotification
} from "@/lib/bathroom-notifications";
import { EstimateResult, quoteWizardSchema } from "@/lib/estimate-schema";
import { storeStructuredLead, updateLeadResponse } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input: unknown;
    result: EstimateResult;
    attribution?: unknown;
  };
  const parsed = quoteWizardSchema.safeParse(body.input);
  const attribution = attributionSchema.safeParse(body.attribution);

  if (!parsed.success || !body.result?.range) {
    return NextResponse.json({ error: "Invalid lead input" }, { status: 400 });
  }

  const stored = await storeStructuredLead({
    leadType: "estimate",
    sourceRoute: "/quote",
    payload: parsed.data,
    riskFlags: body.result.riskFlags,
    scoringResult: {
      estimateRange: body.result.range,
      confidenceScore: body.result.confidenceScore,
      confidenceLabel: body.result.confidenceLabel,
      recommendedNextStep: body.result.recommendedNextStep
    },
    privacyAccepted: true,
    termsAccepted: true,
    guidanceAccepted: true,
    attribution: attribution.success ? attribution.data : undefined,
    request,
    contact: parsed.data.contact,
    bathroomType: parsed.data.projectType,
    timeline: parsed.data.timeline,
    estimateRange: body.result.range.label,
    confidenceScore: body.result.confidenceScore,
    recommendedNextStep: body.result.recommendedNextStep
  });

  if (!stored.ok) {
    return NextResponse.json({ ok: false, stored: false, reason: stored.reason || "Lead storage failed" }, { status: 500 });
  }

  const notification = await prepareAndSendBathroomNotifications(stored.lead);
  await updateLeadResponse(
    "estimate",
    stored.lead.id,
    {
      responseStatus: responseStatusForNotification(notification),
      notificationSentAt: notification.adminNotificationSentAt,
      acknowledgementSentAt: notification.customerAcknowledgementSentAt,
      notificationResult: notification
    },
    "notification_prepared"
  );

  return NextResponse.json({
    ok: true,
    stored: stored.stored,
    leadId: stored.lead.id,
    responsePriority: stored.lead.responsePriority,
    responseDueAt: stored.lead.responseDueAt,
    ...publicNotificationSummary(notification)
  });
}
