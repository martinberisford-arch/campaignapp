import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.familyRecord.findMany({ where: { deletedAt: null } });
  const count = new Map<string, number>();
  rows.forEach((r) => count.set(r.referralSource, (count.get(r.referralSource) ?? 0) + 1));
  const csv = ["referralSource,count", ...Array.from(count.entries()).map(([k, v]) => `${k},${v}`)].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=referral-breakdown.csv"
    }
  });
}
