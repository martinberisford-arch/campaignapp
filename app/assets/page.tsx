import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  requireSession();
  const assets = await prisma.asset.findMany({ where: { deletedAt: null }, orderBy: { uploadedAt: "desc" } });
  return <AppShell><h1 className="text-2xl font-semibold">Assets</h1><SectionCard title="Asset library"><div className="space-y-2">{assets.length===0?<p className="text-slate-500">No assets yet.</p>:assets.map(a=><div key={a.id} className="border rounded p-2 flex justify-between"><span>{a.title}</span><Link href={`/api/assets/${a.id}`} className="bg-slate-100 px-3 py-1 rounded">Download</Link></div>)}</div></SectionCard></AppShell>;
}
