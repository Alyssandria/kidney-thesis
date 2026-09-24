import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { CalendarCheck, Soup, Utensils } from "lucide-react";
import { USER_TIMEZONE, lastDaysRange } from "@/lib/dates";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { RetryButton } from "./RetryButton";

const DAYS = 7;

function StatTile({
  icon,
  iconClassName,
  value,
  outOf,
  label,
}: {
  icon: ReactNode;
  iconClassName: string;
  value: number;
  outOf?: number;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="text-[32px] font-extrabold leading-none tracking-tight text-kc-ink">
        {value}
        {outOf !== undefined && (
          <span className="text-lg font-bold text-kc-subtle"> / {outOf}</span>
        )}
      </p>
      <p className="text-sm font-medium text-kc-muted">{label}</p>
    </div>
  );
}

function sodiumModerateOrHigher({ nutrientLevels: { sodium } }: DashboardSummary) {
  return sodium.MODERATE + sodium.HIGH + sodium.CRITICAL;
}

export async function LastSevenDays() {
  await connection();

  let summary: DashboardSummary;
  try {
    const { from, to } = lastDaysRange(DAYS, USER_TIMEZONE);
    summary = await getDashboardSummary(from, to);
  } catch {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[22px] bg-white p-5">
        <p className="text-sm font-semibold text-kc-ink">We couldn&apos;t load your last 7 days</p>
        <p className="text-sm text-kc-muted">Your saved meals are safe. Please try again.</p>
        <RetryButton />
      </div>
    );
  }

  if (summary.mealCount === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[22px] bg-white p-5">
        <p className="text-sm font-semibold text-kc-ink">Nothing logged in the last 7 days</p>
        <p className="text-sm text-kc-muted">
          That&apos;s fine. When you&apos;re ready, analyze a meal and save it, and it will show up here.
        </p>
        <Link
          href="/meals/new"
          className="inline-flex h-11 items-center rounded-xl bg-kc-primary-soft px-4 text-sm font-bold text-kc-ink hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kc-primary"
        >
          Analyze a meal
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatTile
        icon={<Utensils size={20} />}
        iconClassName="bg-kc-green-bg text-kc-green-ink"
        value={summary.mealCount}
        label="Meals, last 7 days"
      />
      <StatTile
        icon={<CalendarCheck size={20} />}
        iconClassName="bg-kc-blue-bg text-kc-blue-ink"
        value={summary.daysLogged}
        outOf={DAYS}
        label="Days with a logged meal"
      />
      <StatTile
        icon={<Soup size={20} />}
        iconClassName="bg-kc-lilac-bg text-kc-lilac-ink"
        value={summary.soup.soupMeals}
        label={`Soups · broth eaten in ${summary.soup.brothConsumed}`}
      />
      <StatTile
        icon={<span className="text-[15px] font-extrabold">Na</span>}
        iconClassName="bg-kc-amber-bg text-kc-amber-ink"
        value={sodiumModerateOrHigher(summary)}
        outOf={summary.mealCount}
        label="Meals with sodium moderate or higher"
      />
    </div>
  );
}

export function LastSevenDaysSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4" aria-hidden="true">
      {[0, 1, 2, 3].map((n) => (
        <div key={n} className="flex h-[138px] flex-col gap-3 rounded-[22px] bg-white p-5">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-kc-line" />
          <div className="h-7 w-12 animate-pulse rounded bg-kc-line" />
          <div className="h-3 w-28 animate-pulse rounded bg-kc-line" />
        </div>
      ))}
    </div>
  );
}
