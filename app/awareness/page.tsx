import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";
async function saveEvent(formData: FormData) {
  "use server";
  const file = formData.get("artwork") as File;
  const links = String(formData.get("resourceLinks") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const payload: Record<string, unknown> = {
    id: String(formData.get("id")),
    notes: String(formData.get("notes") ?? ""),
    draftIdeas: String(formData.get("draftIdeas") ?? ""),
    resourceLinks: links,
    didWePost: formData.get("didWePost") === "on"
  };

  if (file?.size) {
    const buffer = Buffer.from(await file.arrayBuffer());
    payload.artworkName = file.name;
    payload.artworkMime = file.type;
    payload.artworkData = buffer;
  }

  await prisma.awarenessEvent.update({ where: { id: String(formData.get("id")) }, data: payload });
  revalidatePath("/awareness");
  revalidatePath("/");
}

export default async function AwarenessPage() {
  await requireSession();
  const events = await prisma.awarenessEvent.findMany({ where: { deletedAt: null }, orderBy: { eventDate: "asc" } });

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Annual Awareness Planner</h1>
      <SectionCard title="Calendar view">
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <form key={event.id} action={saveEvent} className="border border-slate-200 rounded-lg p-4 space-y-2">
              <input type="hidden" name="id" value={event.id} />
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-slate-500">{format(event.eventDate, "d MMMM")}</p>
              <textarea name="notes" defaultValue={event.notes ?? ""} placeholder="Simple notes" />
              <textarea name="draftIdeas" defaultValue={event.draftIdeas ?? ""} placeholder="Draft ideas" />
              <textarea name="resourceLinks" defaultValue={(event.resourceLinks ?? []).join("\n")} placeholder="Useful links (one per line)" />
              <input type="file" name="artwork" accept="image/*" />
              <label className="flex items-center gap-2"><input type="checkbox" name="didWePost" defaultChecked={event.didWePost} className="w-4" />Did we post?</label>
              <button className="bg-primary text-white">Save event</button>
            </form>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
