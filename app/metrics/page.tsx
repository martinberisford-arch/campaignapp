import Link from "next/link";
import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { TrendLine } from "@/components/charts";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  requireSession();
  const metrics = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null }, orderBy: { month: "asc" } });
  return <AppShell><h1 className="text-2xl font-semibold">Metrics</h1><SectionCard title="Trend"><TrendLine data={metrics.map(m=>({label:format(m.month,'MMM yy'),value:m.facebookFollowers}))} /></SectionCard><SectionCard title="Downloads"><Link href="/api/reports/metrics-csv" className="bg-teal-700 text-white inline-block">Download CSV</Link></SectionCard></AppShell>;
}
