import { ReactNode } from "react";

export function StatCard({ title, value }: { title: string; value: string | number }) {
  return <div className="bg-white border rounded p-4"><p className="text-sm text-slate-500">{title}</p><p className="text-2xl font-semibold">{value}</p></div>;
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="bg-white border rounded p-4"><h2 className="font-semibold mb-3">{title}</h2>{children}</section>;
}
