import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null }, orderBy: { month: "asc" } });
  const csv = [
    "month,facebookFollowers,facebookEngagement,sessionsDelivered,familiesAttendingSessions,volunteerCount,fundingApplicationsSubmitted,fundingAwarded",
    ...rows.map((r) => [r.month.toISOString().slice(0, 10), r.facebookFollowers, r.facebookEngagement ?? 0, r.sessionsDelivered, r.familiesAttendingSessions, r.volunteerCount, r.fundingApplicationsSubmitted, r.fundingAwarded].join(","))
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=monthly-metrics.csv"
    }
  });
}
