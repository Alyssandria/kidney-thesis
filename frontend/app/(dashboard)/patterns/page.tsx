import type { Metadata } from "next";
import { Suspense } from "react";
import { LastSevenDays, LastSevenDaysSkeleton } from "@/components/dashboard/LastSevenDays";
import { NutrientPatterns } from "@/components/dashboard/NutrientPatterns";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Patterns",
};

export default function PatternsPage() {
  return (
    <>
      <PageHeader
        title="Patterns"
        description="Counts from the meals you saved. They describe your log, not your health."
      />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
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
        <Suspense
          fallback={<div className="h-72 animate-pulse rounded-[26px] bg-white" aria-hidden="true" />}
        >
          <NutrientPatterns />
        </Suspense>
      </div>
    </>
  );
}
