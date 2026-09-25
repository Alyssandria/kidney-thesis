import { addDays, startOfDayIso } from "@/lib/dates";

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
export const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** [from, to) covering a "YYYY-MM" month in `timeZone`. */
export function monthRange(month: string, timeZone: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  const next = new Date(Date.UTC(year, monthIndex, 1)).toISOString().slice(0, 7);
  return {
    from: startOfDayIso(`${month}-01`, timeZone),
    to: startOfDayIso(`${next}-01`, timeZone),
  };
}

/** [from, to) covering a single "YYYY-MM-DD" day in `timeZone`. */
export function dayRange(date: string, timeZone: string) {
  return {
    from: startOfDayIso(date, timeZone),
    to: startOfDayIso(addDays(date, 1), timeZone),
  };
}

/** A valid "YYYY-MM-DD" that isn't after `today`, or null. */
export function resolveDay(param: unknown, today: string): string | null {
  if (typeof param !== "string" || !DATE_PATTERN.test(param)) return null;
  return param > today ? null : param;
}

/** A valid "YYYY-MM" that isn't after `thisMonth`, otherwise `thisMonth`. */
export function resolveMonth(param: unknown, thisMonth: string): string {
  if (typeof param !== "string" || !MONTH_PATTERN.test(param)) return thisMonth;
  return param > thisMonth ? thisMonth : param;
}

// Calendar dates, not instants, so they're formatted in UTC.
const longDateFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
});

/** e.g. "Thursday, September 24" */
export function formatLongDate(date: string): string {
  return longDateFormat.format(new Date(`${date}T00:00:00Z`));
}

const monthNameFormat = new Intl.DateTimeFormat("en-PH", { timeZone: "UTC", month: "long" });

/** e.g. "September" for "2026-09" */
export function formatMonthName(month: string): string {
  return monthNameFormat.format(new Date(`${month}-01T00:00:00Z`));
}
