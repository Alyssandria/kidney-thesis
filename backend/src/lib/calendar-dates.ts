const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcMs(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

/** Every "YYYY-MM-DD" date from `from` to `to`, both included. */
export function eachDate(from: string, to: string): string[] {
  const dates: string[] = [];
  for (let ms = toUtcMs(from); ms <= toUtcMs(to); ms += DAY_MS) {
    dates.push(new Date(ms).toISOString().slice(0, 10));
  }
  return dates;
}

/** Number of days from `from` to `to`, both included. */
export function daysInclusive(from: string, to: string): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS) + 1;
}
