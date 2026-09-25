"use client";

import { createContext, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { DayButtonProps } from "react-day-picker";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { formatLongDate } from "@/lib/calendar";

export type CalendarDay = {
  date: string;
  count: number;
  highNutrientMeals: number;
};

type MealCalendarViewProps = {
  /** "YYYY-MM" */
  month: string;
  /** "YYYY-MM-DD" in the user's timezone */
  today: string;
  selectedDay: string | null;
  days: CalendarDay[];
};

// The calendar works with local Date objects; these convert to and from the
// "YYYY-MM-DD" strings the server uses, reading only the calendar fields.
function toKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day ?? 1);
}

function HighNutrientMarker({ className = "text-kc-amber-ink" }: { className?: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true" className={className}>
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
    </svg>
  );
}

const DaysContext = createContext<ReadonlyMap<string, CalendarDay>>(new Map());

// Full class strings so Tailwind can see them. The data-[selected-single] variants
// keep a day's own fill when selected; selection is shown with a ring instead.
const DAY_TONES = {
  none: "data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-kc-ink",
  one: "bg-kc-logged text-kc-ink data-[selected-single=true]:bg-kc-logged data-[selected-single=true]:text-kc-ink",
  two: "bg-kc-logged-mid text-kc-ink data-[selected-single=true]:bg-kc-logged-mid data-[selected-single=true]:text-kc-ink",
  many: "bg-kc-logged-strong text-kc-ink data-[selected-single=true]:bg-kc-logged-strong data-[selected-single=true]:text-kc-ink",
  today: "bg-kc-primary text-white hover:bg-kc-primary hover:text-white data-[selected-single=true]:bg-kc-primary data-[selected-single=true]:text-white",
} as const;

const SELECTED_RING =
  "data-[selected-single=true]:ring-2 data-[selected-single=true]:ring-kc-ink data-[selected-single=true]:ring-offset-2";

function dayTone(count: number, isToday: boolean): keyof typeof DAY_TONES {
  if (isToday) return "today";
  if (count >= 3) return "many";
  if (count === 2) return "two";
  if (count === 1) return "one";
  return "none";
}

function MealDayButton({ children, ...props }: DayButtonProps) {
  const info = use(DaysContext).get(toKey(props.day.date));
  const isToday = Boolean(props.modifiers.today);
  const tone = dayTone(info?.count ?? 0, isToday);

  return (
    <CalendarDayButton {...props} className={`${DAY_TONES[tone]} ${SELECTED_RING}`}>
      <span className="flex flex-col items-center gap-0.5 text-sm! font-bold opacity-100!">
        {children}
        {info && (
          <span className="flex items-center gap-0.5">
            <span
              className={`rounded-full px-1.5 py-px text-[10.5px] font-extrabold leading-none ${
                isToday ? "bg-white text-kc-primary" : "bg-kc-primary text-white"
              }`}
            >
              {info.count}
            </span>
            {info.highNutrientMeals > 0 && (
              <HighNutrientMarker className={isToday ? "text-white" : undefined} />
            )}
          </span>
        )}
      </span>
    </CalendarDayButton>
  );
}

export function MealCalendarView({ month, today, selectedDay, days }: MealCalendarViewProps) {
  const router = useRouter();
  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);

  const navigate = (params: { month: string; day?: string }) => {
    const search = new URLSearchParams(params);
    router.push(`/history?${search.toString()}`, { scroll: false });
  };

  function describeDay(date: Date, isToday: boolean, isSelected: boolean) {
    const key = toKey(date);
    const info = byDate.get(key);
    const parts = [
      formatLongDate(key),
      key > today
        ? "upcoming"
        : !info
          ? "nothing logged"
          : info.count === 1
            ? "1 meal"
            : `${info.count} meals`,
    ];
    if (info && info.highNutrientMeals > 0) {
      parts.push(`${info.highNutrientMeals} with a high nutrient level`);
    }
    if (isToday) parts.push("today");
    if (isSelected) parts.push("selected");
    return parts.join(", ");
  }

  return (
    <DaysContext value={byDate}>
      <div className="flex flex-col gap-3">
        <Calendar
          mode="single"
          required={false}
          month={fromKey(`${month}-01`)}
          onMonthChange={(date) => navigate({ month: toKey(date).slice(0, 7) })}
          endMonth={fromKey(`${today.slice(0, 7)}-01`)}
          disabled={{ after: fromKey(today) }}
          today={fromKey(today)}
          selected={selectedDay ? fromKey(selectedDay) : undefined}
          onSelect={(date) => {
            if (date) navigate({ month: toKey(date).slice(0, 7), day: toKey(date) });
          }}
          showOutsideDays={false}
          className="w-full bg-transparent p-0 [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(12)]"
          classNames={{ root: "w-full", today: "rounded-(--cell-radius)" }}
          labels={{
            labelDayButton: (date, modifiers) =>
              describeDay(date, Boolean(modifiers.today), Boolean(modifiers.selected)),
          }}
          components={{ DayButton: MealDayButton }}
        />
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-kc-subtle">
          <li className="flex items-center gap-1.5">
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="h-3 w-3 rounded-[3px] bg-kc-logged" />
              <span className="h-3 w-3 rounded-[3px] bg-kc-logged-mid" />
              <span className="h-3 w-3 rounded-[3px] bg-kc-logged-strong" />
            </span>
            1, 2, 3+ meals logged
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-kc-primary" aria-hidden="true" />
            Today
          </li>
          <li className="flex items-center gap-1.5">
            <HighNutrientMarker />
            A meal with sodium, potassium or phosphorus at High or Very high
          </li>
        </ul>
      </div>
    </DaysContext>
  );
}
