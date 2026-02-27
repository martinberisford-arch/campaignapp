import Link from "next/link";

const items = [
  ["/", "Dashboard"],
  ["/families", "Families"],
  ["/metrics", "Metrics"],
  ["/awareness", "Awareness Calendar"],
  ["/assets", "Assets"],
  ["/reports", "Reports"],
  ["/privacy", "Privacy"]
] as const;

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4 space-y-2">
      <h1 className="font-semibold text-xl mb-4">Charity Dashboard</h1>
      {items.map(([href, label]) => <Link key={href} href={href} className="block p-2 rounded hover:bg-slate-100">{label}</Link>)}
      <form action="/api/logout" method="post"><button className="w-full mt-4 bg-slate-100">Log out</button></form>
    </aside>
  );
}
