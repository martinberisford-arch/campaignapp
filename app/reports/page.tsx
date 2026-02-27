import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export default async function ReportsPage() {
  await requireSession();
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Funding Evidence Export Tool</h1>
      <SectionCard title="Generate reports">
        <div className="flex flex-wrap gap-3">
          <Link className="bg-primary text-white" href="/api/reports/funding-summary-pdf">Generate Funding Summary PDF</Link>
          <Link className="bg-muted" href="/api/reports/referral-csv">Referral source CSV</Link>
          <Link className="bg-muted" href="/api/reports/metrics-csv">Monthly metrics CSV</Link>
        </div>
      </SectionCard>
    </AppShell>
  );
}
