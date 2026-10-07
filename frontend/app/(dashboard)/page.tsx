import { Suspense } from "react";
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
