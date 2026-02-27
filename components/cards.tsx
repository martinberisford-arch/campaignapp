import { ReactNode } from "react";

export function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-card rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-card rounded-xl border border-slate-200 p-5">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </section>
  );
}
