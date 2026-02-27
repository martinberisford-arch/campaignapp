import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AwarenessPage() {
  requireSession();
  const events = await prisma.awarenessEvent.findMany({ where: { deletedAt: null }, orderBy: { eventDate: "asc" } });
  return <AppShell><h1 className="text-2xl font-semibold">Awareness Calendar</h1><SectionCard title="Events"><div className="space-y-2">{events.map(e=><div key={e.id} className="border rounded p-2">{e.title} · {new Date(e.eventDate).toLocaleDateString()}</div>)}</div></SectionCard></AppShell>;
}
