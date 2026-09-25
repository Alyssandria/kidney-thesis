import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { monthRange, resolveDay, resolveMonth } from "@/lib/calendar";
import { USER_TIMEZONE, toLocalDate } from "@/lib/dates";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { DayMealsPanel, DayMealsPanelSkeleton } from "./DayMealsPanel";
import { MealCalendarView } from "./MealCalendarView";
import { RetryButton } from "./RetryButton";

type MealCalendarProps = {
  monthParam: unknown;
  dayParam: unknown;
};

function CalendarShell({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="calendar-heading"
      className="flex flex-col gap-4 rounded-[26px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-7"
    >
      <h2 id="calendar-heading" className="text-[19px] font-bold">
        Meal calendar
      </h2>
      {children}
    </section>
  );
}

export async function MealCalendar({ monthParam, dayParam }: MealCalendarProps) {
  await connection();

  const today = toLocalDate(new Date(), USER_TIMEZONE);
  const thisMonth = today.slice(0, 7);
  const requestedDay = resolveDay(dayParam, today);
  const month = requestedDay?.slice(0, 7) ?? resolveMonth(monthParam, thisMonth);
  // With no day chosen, today is selected when its month is showing.
  const selectedDay = requestedDay ?? (month === thisMonth ? today : null);

  let summary: DashboardSummary;
  try {
    const { from, to } = monthRange(month, USER_TIMEZONE);
    summary = await getDashboardSummary(from, to);
  } catch {
    return (
      <CalendarShell>
        <p className="text-sm font-semibold text-kc-ink">We couldn&apos;t load your calendar</p>
        <div>
          <RetryButton />
        </div>
      </CalendarShell>
    );
  }

  return (
    <CalendarShell>
      <MealCalendarView
        month={month}
        today={today}
        selectedDay={selectedDay}
        days={summary.dailyCounts}
      />
      <div aria-live="polite" className="border-t border-kc-mist pt-3.5">
        {selectedDay ? (
          <Suspense key={selectedDay} fallback={<DayMealsPanelSkeleton />}>
            <DayMealsPanel day={selectedDay} today={today} />
          </Suspense>
        ) : (
          <p className="text-sm text-kc-muted">Select a day to see the meals you saved.</p>
        )}
      </div>
    </CalendarShell>
  );
}

export function MealCalendarSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[26px] bg-white px-7 py-6" aria-hidden="true">
      <div className="h-6 w-40 animate-pulse rounded bg-kc-line" />
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }, (_, n) => (
          <div key={n} className="aspect-square animate-pulse rounded-xl bg-kc-mist" />
        ))}
      </div>
    </div>
  );
}
