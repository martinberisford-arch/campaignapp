import { revalidatePath } from "next/cache";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";
async function updateRetention(formData: FormData) {
  "use server";
  const value = Number(formData.get("retentionYears"));
  const existing = await prisma.appSetting.findFirst();
  if (existing) {
    await prisma.appSetting.update({ where: { id: existing.id }, data: { retentionYears: value } });
  } else {
    await prisma.appSetting.create({ data: { retentionYears: value } });
  }
  revalidatePath("/privacy");
}

export default async function PrivacyPage() {
  await requireSession();
  const setting = await prisma.appSetting.findFirst();
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Privacy Notice</h1>
      <SectionCard title="Data protection by design">
        <ul className="list-disc ml-5 space-y-2">
          <li>No names, diagnoses, or medical details are stored.</li>
          <li>Only anonymised service data is collected for impact reporting.</li>
          <li>All records support soft delete.</li>
          <li>Role-based access: Admin and User.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Data retention">
        <form action={updateRetention} className="max-w-sm space-y-3">
          <label>Retention years (default 3)</label>
          <input type="number" min={1} max={10} name="retentionYears" defaultValue={setting?.retentionYears ?? 3} />
          <button className="bg-primary text-white">Save retention policy</button>
        </form>
      </SectionCard>
    </AppShell>
  );
}
