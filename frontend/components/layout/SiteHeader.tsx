import Link from "next/link";
import { Leaf } from "lucide-react";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex h-14 items-center gap-2 rounded text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Leaf size={16} className="text-emerald-600" aria-hidden="true" />
          KidneyCare
        </Link>
        <nav aria-label="Main">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
