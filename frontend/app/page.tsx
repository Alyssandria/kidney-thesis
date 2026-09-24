import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-5 py-7 flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Your meals</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Analyze a meal to see how it may affect sodium, potassium and phosphorus.
            </p>
          </div>
          <Link
            href="/meals/new"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:self-auto"
          >
            <Sparkles size={14} aria-hidden="true" />
            Analyze a meal
          </Link>
        </div>
      </main>
    </div>
  );
}
