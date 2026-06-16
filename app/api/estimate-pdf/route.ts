import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { EstimateResult, quoteWizardSchema } from "@/lib/estimate-schema";

function cleanText(value: string) {
  return value.replace(/[^\x20-\x7E]/g, "-");
}

export async function POST(request: Request) {
  const body = (await request.json()) as { input: unknown; result: EstimateResult };
  const parsed = quoteWizardSchema.safeParse(body.input);

  if (!parsed.success || !body.result?.range?.label) {
    return NextResponse.json({ error: "Invalid PDF input" }, { status: 400 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const { result } = body;
  let y = 790;

  function line(text: string, size = 11, isBold = false) {
    page.drawText(cleanText(text), {
      x: 48,
      y,
      size,
      font: isBold ? bold : font,
      color: isBold ? rgb(0.1, 0.18, 0.14) : rgb(0.25, 0.3, 0.27),
      maxWidth: 500
    });
    y -= size + 10;
  }

  line("Operon Bathrooms planning estimate", 18, true);
  line("Planning guidance only. Not contract pricing, a contract, legal advice or compliance advice.");
  line(`Indicative range: ${result.range.label}`, 16, true);
  line(`Confidence: ${result.confidenceLabel} (${result.confidenceScore}/100)`);
  y -= 8;
  line("Scope summary", 13, true);
  result.scopeSummary.forEach((item) => line(`- ${item}`));
  y -= 4;
  line("Risk flags", 13, true);
  (result.riskFlags.length ? result.riskFlags : ["No major risk flags from supplied answers."]).forEach(
    (item) => line(`- ${item}`)
  );
  y -= 4;
  line("NSW compliance prompts", 13, true);
  result.compliancePrompts.forEach((item) => line(`- ${item}`));
  y -= 4;
  line("Recommended next step", 13, true);
  line(result.recommendedNextStep);

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=operon-bathrooms-planning-estimate.pdf"
    }
  });
}
