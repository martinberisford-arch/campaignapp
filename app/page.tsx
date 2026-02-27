import { format } from "date-fns";
import { AppShell } from "@/components/app-shell";
import { ReferralPie, TrendLine } from "@/components/charts";
import { SectionCard, StatCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { referralSourceLabels } from "@/utils/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  requireSession();
  const families = await prisma.familyRecord.findMany({ where: { deletedAt: null } });
  const metrics = await prisma.monthlyMetrics.findMany({ where: { deletedAt: null } });
  const total = families.length;
  const attendance = total ? Math.round((families.filter((f) => f.attendedFirstSession).length / total) * 100) : 0;
  const breakdown = Object.entries(families.reduce((a, f) => ({ ...a, [f.referralSource]: (a[f.referralSource] ?? 0) + 1 }), {} as Record<string, number>)).map(([k,v])=>({name: referralSourceLabels[k], value:v}));
  const trend = families.reduce((a,f)=>{const k=format(f.dateJoined,'MMM yy');a[k]=(a[k]??0)+1;return a;},{} as Record<string,number>);
  return <AppShell><h1 className="text-2xl font-semibold">Dashboard</h1><div className="grid md:grid-cols-3 gap-3"><StatCard title="Families supported" value={total} /><StatCard title="Attendance rate" value={`${attendance}%`} /><StatCard title="Funding total" value={`£${metrics.reduce((s,m)=>s+m.fundingAwarded,0).toFixed(0)}`} /></div><div className="grid lg:grid-cols-2 gap-3"><SectionCard title="Referral breakdown"><ReferralPie data={breakdown} /></SectionCard><SectionCard title="Monthly joins"><TrendLine data={Object.entries(trend).map(([label,value])=>({label,value}))} /></SectionCard></div></AppShell>;
}
