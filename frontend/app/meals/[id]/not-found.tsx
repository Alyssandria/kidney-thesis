import Link from "next/link";

export default function MealNotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-md mx-auto px-5 py-16 flex flex-col items-center gap-3 text-center">
        <h1 className="text-lg font-semibold text-slate-900">We couldn&apos;t find this meal</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          It may have been removed, or the link may be incomplete.
        </p>
        <Link
          href="/meals/new"
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Log a meal
        </Link>
      </main>
    </div>
  );
}
