import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex"><Sidebar /><main className="flex-1 p-6 space-y-4">{children}</main></div>;
}
