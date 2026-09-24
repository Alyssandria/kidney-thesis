// Placeholder until the user's profile timezone is available to the frontend.
export const USER_TIMEZONE = "Asia/Manila";

/** Calendar date (YYYY-MM-DD) of `instant` in `timeZone`. */
export function toLocalDate(instant: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const part = (type: "year" | "month" | "day") =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** Adds whole days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

/** UTC offset of `timeZone` on `date`, e.g. "+08:00". */
function utcOffset(date: string, timeZone: string): string {
  // Sampled at midday so a DST change at midnight doesn't pick the wrong side.
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(new Date(`${date}T12:00:00Z`))
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  return name === "GMT" ? "+00:00" : name.replace("GMT", "");
}

/** Local midnight at the start of `date` in `timeZone`, as an ISO string with offset. */
export function startOfDayIso(date: string, timeZone: string): string {
  return `${date}T00:00:00${utcOffset(date, timeZone)}`;
}

/** The last `days` calendar days including today, as a [from, to) range. */
export function lastDaysRange(days: number, timeZone: string, now = new Date()) {
  const today = toLocalDate(now, timeZone);
  return {
    from: startOfDayIso(addDays(today, -(days - 1)), timeZone),
    to: startOfDayIso(addDays(today, 1), timeZone),
  };
}

const timeFormats = new Map<string, Intl.DateTimeFormat>();

/** Time of day of `iso` in `timeZone`, e.g. "7:10 AM". */
export function formatTime(iso: string, timeZone: string): string {
  let format = timeFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat("en-PH", { timeZone, hour: "numeric", minute: "2-digit" });
    timeFormats.set(timeZone, format);
  }
  return format.format(new Date(iso));
}

/** "Today", "Yesterday", or a short date such as "Mon, Sep 21", in `timeZone`. */
export function formatDayLabel(iso: string, timeZone: string, now = new Date()): string {
  const date = toLocalDate(new Date(iso), timeZone);
  const today = toLocalDate(now, timeZone);
  if (date === today) return "Today";
  if (date === addDays(today, -1)) return "Yesterday";
  return new Intl.DateTimeFormat("en-PH", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}
