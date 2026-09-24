"use client";

import Link from "next/link";

export default function MealError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex-1">
      <main className="max-w-md mx-auto px-5 py-16 flex flex-col items-center gap-3 text-center">
        <h1 className="text-lg font-semibold text-slate-900">We couldn&apos;t load this meal</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your saved meals are safe. Check your connection and try again.
        </p>
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link href="/meals/new" className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline">
            Log a meal
          </Link>
        </div>
      </main>
    </div>
  );
}
