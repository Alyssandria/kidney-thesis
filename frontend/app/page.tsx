import { Suspense } from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { Plus } from "lucide-react";
import { LastSevenDays, LastSevenDaysSkeleton } from "@/components/dashboard/LastSevenDays";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function DashboardPage() {
  return (
    <div className={`flex-1 bg-kc-canvas text-kc-ink ${dmSans.className}`}>
      <main className="max-w-5xl mx-auto px-5 py-7 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Your meals</h1>
            <p className="text-sm text-kc-muted mt-1">
              Analyze a meal to see how it may affect sodium, potassium and phosphorus.
            </p>
          </div>
          <Link
            href="/meals/new"
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-[14px] bg-kc-primary-soft px-5 text-[15px] font-bold text-kc-ink hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary focus-visible:ring-offset-2 sm:self-auto"
          >
            <Plus size={18} aria-hidden="true" />
            Analyze a meal
          </Link>
        </div>

        <section aria-labelledby="last-7-days-heading" className="flex flex-col gap-3">
          <h2
            id="last-7-days-heading"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-kc-subtle"
          >
            Last 7 days
          </h2>
          <Suspense fallback={<LastSevenDaysSkeleton />}>
            <LastSevenDays />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
