"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/", "Dashboard"],
  ["/families", "Families"],
  ["/metrics", "Metrics"],
  ["/awareness", "Awareness Calendar"],
  ["/assets", "Assets"],
  ["/reports", "Reports"],
  ["/privacy", "Privacy Notice"]
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-slate-200 p-4">
      <h1 className="text-xl font-semibold text-primary mb-6">Charity Dashboard</h1>
      <nav className="space-y-2">
        {items.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={`block px-4 py-3 text-base rounded-lg ${
              pathname === href ? "bg-muted font-medium" : "hover:bg-slate-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
