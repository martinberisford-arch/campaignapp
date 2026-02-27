import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { referralSourceLabels } from "@/utils/constants";

async function addFamily(formData: FormData) {
  "use server";
  await prisma.familyRecord.create({
    data: {
      dateJoined: new Date(String(formData.get("dateJoined"))),
      referralSource: String(formData.get("referralSource")) as never,
      attendedFirstSession: formData.get("attendedFirstSession") === "on",
      stillAttending: formData.get("stillAttending") === "on",
      notes: String(formData.get("notes") ?? "")
    }
  });
  revalidatePath("/families");
  revalidatePath("/");
}

async function deleteFamily(formData: FormData) {
  "use server";
  await prisma.familyRecord.update({ where: { id: String(formData.get("id")) }, data: { deletedAt: new Date() } });
  revalidatePath("/families");
}

export default async function FamiliesPage() {
  await requireSession();
  const families = await prisma.familyRecord.findMany({ where: { deletedAt: null }, orderBy: { dateJoined: "desc" } });

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Family Referral Tracker</h1>
      <SectionCard title="Add family record">
        <form action={addFamily} className="grid md:grid-cols-2 gap-3">
          <input type="date" name="dateJoined" required />
          <select name="referralSource" required>{Object.entries(referralSourceLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
          <label className="flex items-center gap-2"><input type="checkbox" name="attendedFirstSession" className="w-4" />Attended first session</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="stillAttending" className="w-4" />Still attending</label>
          <textarea name="notes" placeholder="Optional anonymised notes" className="md:col-span-2" />
          <button className="bg-primary text-white md:col-span-2 text-lg">Save record</button>
        </form>
      </SectionCard>
      <SectionCard title="Existing records">
        <div className="space-y-2">
          {families.map((f) => (
            <div key={f.id} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{referralSourceLabels[f.referralSource]}</p>
                <p className="text-sm text-slate-500">Joined {new Date(f.dateJoined).toLocaleDateString()}</p>
              </div>
              <form action={deleteFamily}><input type="hidden" name="id" value={f.id} /><button className="bg-slate-100">Delete</button></form>
            </div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
