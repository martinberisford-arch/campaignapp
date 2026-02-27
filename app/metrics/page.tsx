import { format } from "date-fns";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { TrendLine } from "@/components/charts";
import { MetricsForm } from "@/components/metrics-form";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export default async function MetricsPage() {
  await requireSession();
  const metrics = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null }, orderBy: { month: "asc" } });
  const trend = metrics.map((m) => ({ label: format(m.month, "MMM yy"), value: m.facebookFollowers }));

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Simple Engagement Metrics</h1>
      <SectionCard title="Monthly entry">
        <MetricsForm />
      </SectionCard>
      <SectionCard title="Follower growth trend">
        <TrendLine data={trend} />
      </SectionCard>
      <SectionCard title="Downloads">
        <Link className="bg-primary text-white inline-block" href="/api/reports/metrics-csv">Download monthly metrics CSV</Link>
      </SectionCard>
    </AppShell>
  );
}
