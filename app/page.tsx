import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { SectionCard, StatCard } from "@/components/cards";
import { ReferralPie, TrendLine } from "@/components/charts";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { referralSourceLabels } from "@/utils/constants";

export default async function DashboardPage() {
  await requireSession();
  const [families, metrics, events] = await Promise.all([
    prisma.familyRecord.findMany({ where: { deletedAt: null } }),
    prisma.monthlyMetrics.findMany({ where: { deletedAt: null }, orderBy: { month: "asc" } }),
    prisma.awarenessEvent.findMany({ where: { deletedAt: null, eventDate: { gte: new Date() } }, orderBy: { eventDate: "asc" }, take: 1 })
  ]);

  const totalFamilies = families.length;
  const attendanceRate = totalFamilies === 0 ? 0 : Math.round((families.filter((f) => f.attendedFirstSession).length / totalFamilies) * 100);
  const breakdownMap = new Map<string, number>();
  families.forEach((f) => breakdownMap.set(f.referralSource, (breakdownMap.get(f.referralSource) ?? 0) + 1));
  const pieData = [...breakdownMap.entries()].map(([key, value]) => ({ name: referralSourceLabels[key], value }));
  const monthlyJoinMap = new Map<string, number>();
  families.forEach((f) => {
    const k = format(f.dateJoined, "MMM yy");
    monthlyJoinMap.set(k, (monthlyJoinMap.get(k) ?? 0) + 1);
  });
  const trendData = [...monthlyJoinMap.entries()].map(([label, value]) => ({ label, value }));
  const funding = metrics.reduce((sum, m) => sum + m.fundingAwarded, 0);

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Welcome</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Families supported" value={totalFamilies} />
        <StatCard title="Attendance rate" value={`${attendanceRate}%`} />
        <StatCard title="Funding total this year" value={`£${funding.toFixed(0)}`} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <SectionCard title="How families found us">
          <ReferralPie data={pieData} />
        </SectionCard>
        <SectionCard title="Monthly family joins">
          <TrendLine data={trendData} />
        </SectionCard>
      </div>
      <SectionCard title="Next awareness event">
        {events[0] ? (
          <p className="text-lg">{events[0].title} on {format(events[0].eventDate, "d MMMM yyyy")}</p>
        ) : (
          <p>No upcoming event yet.</p>
        )}
      </SectionCard>
    </AppShell>
  );
}
