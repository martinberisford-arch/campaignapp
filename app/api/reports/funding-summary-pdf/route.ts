import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { referralSourceLabels } from "@/utils/constants";

export async function GET() {
  const since = new Date();
  since.setMonth(since.getMonth() - 12);

  const [families, metrics, events] = await Promise.all([
    prisma.familyRecord.findMany({ where: { deletedAt: null, dateJoined: { gte: since } } }),
    prisma.monthlyMetrics.findMany({ where: { deletedAt: null, month: { gte: since } } }),
    prisma.awarenessEvent.findMany({ where: { deletedAt: null, didWePost: true, eventDate: { gte: since } } })
  ]);

  const attendance = families.length ? Math.round((families.filter((f) => f.attendedFirstSession).length / families.length) * 100) : 0;
  const volunteers = metrics.reduce((sum, m) => sum + m.volunteerCount, 0);
  const breakdown = new Map<string, number>();
  families.forEach((f) => breakdown.set(f.referralSource, (breakdown.get(f.referralSource) ?? 0) + 1));
  const top = Array.from(breakdown.entries()).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => referralSourceLabels[k]).join(" and ");

  const narrative = `In the last 12 months we supported ${families.length} families, with the majority finding us via ${top || "community referral"}. Attendance conversion was ${attendance}%. Volunteers contributed across sessions with a cumulative monthly volunteer count of ${volunteers}. We delivered ${events.length} awareness events with published activity.`;

  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  doc.fontSize(20).text("12-Month Impact Summary", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(narrative);
  doc.moveDown();
  doc.text(`Funding awarded in period: £${metrics.reduce((sum, m) => sum + m.fundingAwarded, 0).toFixed(2)}`);
  doc.text(`Awareness events delivered: ${events.length}`);
  doc.end();

  await new Promise<void>((resolve) => doc.on("end", () => resolve()));
  const buffer = Buffer.concat(chunks);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="funding-summary.pdf"'
    }
  });
}
