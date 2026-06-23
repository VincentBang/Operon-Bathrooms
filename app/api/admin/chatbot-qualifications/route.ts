import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { listChatbotQualifications } from "@/lib/chatbot-qualification-store";

export async function GET(request: Request) {
  const auth = validateAdminRequest(request);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const data = await listChatbotQualifications();
  const openTasks = data.tasks.filter((task) => task.status === "open" || task.status === "in_progress");
  const summary = {
    totalQualifications: data.qualifications.length,
    manualReviewNeeded: data.qualifications.filter((qualification) => qualification.manualReviewRequired).length,
    openFollowUps: openTasks.length,
    urgentFollowUps: openTasks.filter((task) => task.priority === "urgent" || task.priority === "high").length
  };

  return NextResponse.json({ ok: true, ...data, summary });
}
