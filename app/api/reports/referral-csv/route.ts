import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.familyRecord.findMany({ where: { deletedAt: null } });
  const map = rows.reduce((a, r) => ({ ...a, [r.referralSource]: (a[r.referralSource] ?? 0) + 1 }), {} as Record<string, number>);
  const csv = ["source,count", ...Object.entries(map).map(([k,v]) => `${k},${v}`)].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv" } });
}
