import { NextResponse } from "next/server";
import {
  prepareAndSendBathroomNotifications,
  publicNotificationSummary,
  responseStatusForNotification
} from "@/lib/bathroom-notifications";
import { quoteReviewSchema } from "@/lib/intake-schemas";
import { storeStructuredLead, updateLeadResponse } from "@/lib/lead-store";
import { reviewBathroomQuote } from "@/lib/quote-review";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteReviewSchema.safeParse(body.input ?? body);

  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ error: "Invalid quote review input" }, { status: 400 });
  }

  const result = reviewBathroomQuote(parsed.data);
  const stored = await storeStructuredLead({
    leadType: "quote_review",
    sourceRoute: "/quote/review",
    payload: { ...parsed.data, company: undefined },
    riskFlags: result.highRiskFlags,
    scoringResult: result,
    privacyAccepted: parsed.data.consent.privacyAccepted,
    termsAccepted: parsed.data.consent.termsAccepted,
    guidanceAccepted: parsed.data.consent.guidanceAccepted,
    attribution: parsed.data.attribution,
    request,
    contact: parsed.data.contact,
    timeline: parsed.data.quote.timeline,
    quoteClarityScore: result.clarityScore,
    quoteAmount: parsed.data.quote.amount,
    recommendedNextStep: result.recommendedNextStep
  });

  if (!stored.ok) {
    return NextResponse.json({ error: "Lead storage failed" }, { status: 500 });
  }

  const notification = await prepareAndSendBathroomNotifications(stored.lead);
  await updateLeadResponse(
    "quote_review",
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
    ...publicNotificationSummary(notification),
    result
  });
}
