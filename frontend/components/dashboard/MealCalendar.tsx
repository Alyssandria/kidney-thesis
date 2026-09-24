import Link from "next/link";
import { connection } from "next/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  MONTH_PATTERN,
  addMonths,
  currentMonth,
  formatLongDate,
  formatMonthTitle,
  monthCells,
  monthRange,
  type Month,
} from "@/lib/calendar";
import { USER_TIMEZONE, toLocalDate } from "@/lib/dates";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { RetryButton } from "./RetryButton";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Falls back to the current month for missing, malformed or future values. */
export function resolveMonth(param: string | string[] | undefined, thisMonth: Month): Month {
  if (typeof param !== "string" || !MONTH_PATTERN.test(param)) return thisMonth;
  return param > thisMonth ? thisMonth : param;
}

function monthHref(month: Month, thisMonth: Month) {
  return month === thisMonth ? "/" : `/?month=${month}`;
}

const navButtonClass =
  "flex h-10 items-center justify-center rounded-xl border border-kc-line bg-white text-kc-ink-soft hover:bg-kc-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary";

function DayCell({ date, count, isToday, isFuture }: {
  date: string;
  count: number;
  isToday: boolean;
  isFuture: boolean;
}) {
  const label = `${formatLongDate(date)}: ${
    isFuture ? "upcoming" : count === 0 ? "nothing logged" : count === 1 ? "1 meal" : `${count} meals`
  }${isToday ? ", today" : ""}`;

  const tone = isFuture
    ? "border border-dashed border-kc-line text-kc-faint"
    : count > 0
      ? "border border-kc-logged-line bg-kc-logged text-kc-ink"
      : "border border-kc-empty-line bg-white text-kc-ink";

  return (
    <li
      className={`flex h-[50px] flex-col items-center justify-center gap-[3px] rounded-[14px] ${tone} ${
        isToday ? "outline-2 outline-kc-primary -outline-offset-2" : ""
      }`}
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="text-sm font-bold leading-none">
        {Number(date.slice(8))}
      </span>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="rounded-full bg-kc-primary px-1.5 py-0.5 text-[10.5px] font-extrabold leading-none text-white"
        >
          {count}
        </span>
      )}
    </li>
  );
}

export async function MealCalendar({ monthParam }: { monthParam: string | string[] | undefined }) {
  await connection();

  const thisMonth = currentMonth(USER_TIMEZONE);
  const month = resolveMonth(monthParam, thisMonth);
  const today = toLocalDate(new Date(), USER_TIMEZONE);
  const isCurrentMonth = month === thisMonth;
  const title = formatMonthTitle(month);

  let summary: DashboardSummary | null = null;
  try {
    const { from, to } = monthRange(month, USER_TIMEZONE);
    summary = await getDashboardSummary(from, to);
  } catch {
    summary = null;
  }

  const counts = new Map(summary?.dailyCounts.map(({ date, count }) => [date, count]));

  return (
    <section
      aria-labelledby="calendar-heading"
      className="flex flex-col gap-3.5 rounded-[26px] bg-white px-7 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="calendar-heading" className="text-[19px] font-bold">
          {title}
        </h2>
        <nav aria-label="Calendar months" className="flex gap-1.5">
          <Link
            href={monthHref(addMonths(month, -1), thisMonth)}
            scroll={false}
            aria-label="Previous month"
            className={`${navButtonClass} w-10`}
          >
            <ChevronLeft size={16} strokeWidth={2.4} aria-hidden="true" />
          </Link>
          {!isCurrentMonth && (
            <Link
              href="/"
              scroll={false}
              className={`${navButtonClass} px-3 text-[13px] font-bold text-kc-primary`}
            >
              Today
            </Link>
          )}
          {isCurrentMonth ? (
            <button
              type="button"
              disabled
              aria-label="Next month"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-kc-mist bg-kc-canvas text-kc-line"
            >
              <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={monthHref(addMonths(month, 1), thisMonth)}
              scroll={false}
              aria-label="Next month"
              className={`${navButtonClass} w-10`}
            >
              <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>

      {summary === null ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm font-semibold text-kc-ink">We couldn&apos;t load your calendar</p>
          <RetryButton />
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="grid grid-cols-7 gap-1.5 text-center text-[11.5px] font-bold uppercase text-kc-subtle"
          >
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <ol aria-label={`Meals logged in ${title}`} className="grid grid-cols-7 gap-1.5">
            {monthCells(month).map((date, index) =>
              date === null ? (
                <li key={`pad-${index}`} aria-hidden="true" />
              ) : (
                <DayCell
                  key={date}
                  date={date}
                  count={counts.get(date) ?? 0}
                  isToday={date === today}
                  isFuture={date > today}
                />
              ),
            )}
          </ol>
          <p className="text-[13px] text-kc-subtle">
            {summary.mealCount === 0
              ? `No meals logged in ${title}. Gaps are normal; the calendar only shows meals you saved.`
              : `${summary.mealCount} ${summary.mealCount === 1 ? "meal" : "meals"} on ${summary.daysLogged} ${
                  summary.daysLogged === 1 ? "day" : "days"
                } in ${title}.`}
          </p>
        </>
      )}
    </section>
  );
}

export function MealCalendarSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 rounded-[26px] bg-white px-7 py-6" aria-hidden="true">
      <div className="h-6 w-40 animate-pulse rounded bg-kc-line" />
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }, (_, n) => (
          <div key={n} className="h-[50px] animate-pulse rounded-[14px] bg-kc-mist" />
        ))}
      </div>
    </div>
  );
}
