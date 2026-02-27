import { prisma } from "@/lib/prisma";
import { simplePdf } from "@/utils/pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  const families = await prisma.familyRecord.count({ where: { deletedAt: null } });
  const metrics = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null } });
  const funding = metrics.reduce((s,m)=>s+m.fundingAwarded,0);
  const pdf = simplePdf(["12-Month Impact Summary", `Families supported: ${families}`, `Funding awarded: £${funding.toFixed(2)}`]);
  return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf" } });
}
