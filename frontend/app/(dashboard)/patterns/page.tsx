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
            className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"
          >
            Last 7 days
          </h2>
          <Suspense fallback={<LastSevenDaysSkeleton />}>
            <LastSevenDays />
          </Suspense>
        </section>
        <Suspense
          fallback={<div className="h-72 animate-pulse rounded-xl bg-card ring-1 ring-border" aria-hidden="true" />}
        >
          <NutrientPatterns />
        </Suspense>
      </div>
    </>
  );
}
