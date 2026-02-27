import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { referralSourceLabels } from "@/utils/constants";

export const dynamic = "force-dynamic";

async function addFamily(formData: FormData) {
  "use server";
  await prisma.familyRecord.create({ data: { dateJoined: new Date(String(formData.get("dateJoined"))), referralSource: String(formData.get("referralSource")) as never, attendedFirstSession: formData.get("attendedFirstSession") === "on", stillAttending: formData.get("stillAttending") === "on", notes: String(formData.get("notes") ?? "") } });
  revalidatePath("/families");
}

export default async function FamiliesPage() {
  requireSession();
  const families = await prisma.familyRecord.findMany({ where: { deletedAt: null }, orderBy: { dateJoined: "desc" } });
  return <AppShell><h1 className="text-2xl font-semibold">Families</h1><SectionCard title="Add family record"><form action={addFamily} className="grid md:grid-cols-2 gap-2"><input type="date" name="dateJoined" required /><select name="referralSource">{Object.entries(referralSourceLabels).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select><label><input className="w-auto mr-2" type="checkbox" name="attendedFirstSession"/>Attended first session</label><label><input className="w-auto mr-2" type="checkbox" name="stillAttending"/>Still attending</label><textarea name="notes" className="md:col-span-2" placeholder="Optional notes"/><button className="md:col-span-2 bg-teal-700 text-white">Save</button></form></SectionCard><SectionCard title="Records"><div className="space-y-2">{families.map(f=><div key={f.id} className="border rounded p-2">{referralSourceLabels[f.referralSource]} · {new Date(f.dateJoined).toLocaleDateString()}</div>)}</div></SectionCard></AppShell>;
}
