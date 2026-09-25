import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { RecentMeals, RecentMealsSkeleton } from "@/components/dashboard/RecentMeals";
import { TodayCard, TodayCardSkeleton } from "@/components/dashboard/TodayCard";
import { WhatToNotice } from "@/components/dashboard/WhatToNotice";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TodayPage() {
  return (
    <>
      <PageHeader
        title="Your meals"
        description="Analyze a meal to see how it may affect sodium, potassium and phosphorus."
        action={
          <Link
            href="/meals/new"
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-[14px] bg-kc-primary-soft px-5 text-[15px] font-bold text-kc-ink hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary focus-visible:ring-offset-2 sm:self-auto"
          >
            <Plus size={18} aria-hidden="true" />
            Analyze a meal
          </Link>
        }
      />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
        <Suspense fallback={<TodayCardSkeleton />}>
          <TodayCard />
        </Suspense>
        <WhatToNotice />
      </div>
      <DashboardCard id="recent-meals" title="Recent meals" contentClassName="gap-1.5">
        <Suspense fallback={<RecentMealsSkeleton />}>
          <RecentMeals />
        </Suspense>
      </DashboardCard>
    </>
  );
}
