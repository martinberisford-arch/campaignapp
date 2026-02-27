import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  requireSession();
  return <AppShell><h1 className="text-2xl font-semibold">Reports</h1><SectionCard title="Exports"><div className="flex gap-2"><Link href="/api/reports/funding-summary-pdf" className="bg-teal-700 text-white">Funding PDF</Link><Link href="/api/reports/referral-csv" className="bg-slate-100">Referral CSV</Link><Link href="/api/reports/metrics-csv" className="bg-slate-100">Metrics CSV</Link></div></SectionCard></AppShell>;
}
