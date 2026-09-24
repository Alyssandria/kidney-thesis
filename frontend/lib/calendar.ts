import { startOfDayIso, toLocalDate } from "@/lib/dates";

/** A month as "YYYY-MM". */
export type Month = string;

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function currentMonth(timeZone: string, now = new Date()): Month {
  return toLocalDate(now, timeZone).slice(0, 7);
}

export function addMonths(month: Month, months: number): Month {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthIndex - 1 + months, 1)).toISOString().slice(0, 7);
}

/** [from, to) covering the whole month in `timeZone`. */
export function monthRange(month: Month, timeZone: string) {
  return {
    from: startOfDayIso(`${month}-01`, timeZone),
    to: startOfDayIso(`${addMonths(month, 1)}-01`, timeZone),
  };
}

/**
 * Dates of the month laid out in Sunday-first weeks. `null` pads the first and
 * last week so every row has seven cells.
 */
export function monthCells(month: Month): (string | null)[] {
  const [year, monthIndex] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, monthIndex - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();

  const cells: (string | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${month}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// Dates here are calendar dates, not instants, so they're formatted in UTC.
const monthTitleFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: "UTC",
  month: "long",
  year: "numeric",
});
const longDateFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: "UTC",
  weekday: "long",
  month: "long",
  day: "numeric",
});

export function formatMonthTitle(month: Month): string {
  return monthTitleFormat.format(new Date(`${month}-01T00:00:00Z`));
}

/** e.g. "Thursday, September 24" */
export function formatLongDate(date: string): string {
  return longDateFormat.format(new Date(`${date}T00:00:00Z`));
}
