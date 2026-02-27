import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/cards";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  requireSession();
  return <AppShell><h1 className="text-2xl font-semibold">Privacy</h1><SectionCard title="Notice"><ul className="list-disc pl-5 space-y-1"><li>No names or medical details are stored.</li><li>Records are anonymised and can be deleted.</li><li>Default retention is 3 years.</li></ul></SectionCard></AppShell>;
}
