import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null }, orderBy: { month: "asc" } });
  const csv = ["month,facebookFollowers,sessionsDelivered,familiesAttendingSessions,volunteerCount,fundingApplicationsSubmitted,fundingAwarded", ...rows.map((r) => [r.month.toISOString().slice(0, 10), r.facebookFollowers, r.sessionsDelivered, r.familiesAttendingSessions, r.volunteerCount, r.fundingApplicationsSubmitted, r.fundingAwarded].join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv" } });
}
