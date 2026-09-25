import { Suspense } from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";
import { Plus } from "lucide-react";
import { LastSevenDays, LastSevenDaysSkeleton } from "@/components/dashboard/LastSevenDays";
import { MealCalendar, MealCalendarSkeleton } from "@/components/dashboard/MealCalendar";
import { NutrientPatterns } from "@/components/dashboard/NutrientPatterns";
import { RecentMeals, RecentMealsSkeleton } from "@/components/dashboard/RecentMeals";
import { TodayCard, TodayCardSkeleton } from "@/components/dashboard/TodayCard";
import { WhatToNotice } from "@/components/dashboard/WhatToNotice";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default async function DashboardPage({ searchParams }: PageProps<"/">) {
  const { month, day } = await searchParams;

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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Suspense fallback={<TodayCardSkeleton />}>
            <TodayCard />
          </Suspense>

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
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
          <section
            aria-labelledby="recent-meals-heading"
            className="flex flex-col gap-1.5 rounded-[26px] bg-white px-7 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <h2 id="recent-meals-heading" className="mb-2 text-[19px] font-bold">
              Recent meals
            </h2>
            <Suspense fallback={<RecentMealsSkeleton />}>
              <RecentMeals />
            </Suspense>
          </section>

          <Suspense fallback={<MealCalendarSkeleton />}>
            <MealCalendar monthParam={month} dayParam={day} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
          <WhatToNotice />
          <Suspense fallback={<div className="h-72 animate-pulse rounded-[26px] bg-white" aria-hidden="true" />}>
            <NutrientPatterns />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
