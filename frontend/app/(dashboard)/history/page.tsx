import type { Metadata } from "next";
import { Suspense } from "react";
import { MealCalendar, MealCalendarSkeleton } from "@/components/dashboard/MealCalendar";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Meal history",
};

export default async function HistoryPage({ searchParams }: PageProps<"/history">) {
  const { month, day } = await searchParams;

  return (
    <>
      <PageHeader
        title="Meal history"
        description="See which days you logged meals, and open any day to review them."
      />
      <div className="w-full max-w-2xl">
        <Suspense fallback={<MealCalendarSkeleton />}>
          <MealCalendar monthParam={month} dayParam={day} />
        </Suspense>
      </div>
    </>
  );
}
