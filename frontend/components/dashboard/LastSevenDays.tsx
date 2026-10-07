import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { CalendarCheck, Soup, Utensils } from "lucide-react";
import { USER_TIMEZONE, lastDaysRange } from "@/lib/dates";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { buttonVariants } from "@/components/ui/button";
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
    <div className="flex flex-col gap-2.5 rounded-xl bg-card p-5 shadow-card ring-1 ring-border">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="font-heading text-[32px] font-bold leading-none tracking-tight">
        {value}
        {outOf !== undefined && (
          <span className="text-lg font-bold text-muted-foreground"> / {outOf}</span>
        )}
      </p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
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
      <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-5 shadow-card ring-1 ring-border">
        <p className="text-sm font-semibold text-foreground">We couldn&apos;t load your last 7 days</p>
        <p className="text-sm text-muted-foreground">Your saved meals are safe. Please try again.</p>
        <RetryButton />
      </div>
    );
  }

  if (summary.mealCount === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl bg-card p-5 shadow-card ring-1 ring-border">
        <p className="text-sm font-semibold text-foreground">Nothing logged in the last 7 days</p>
        <p className="text-sm text-muted-foreground">
          That&apos;s fine. When you&apos;re ready, analyze a meal and save it, and it will show up here.
        </p>
        <Link
          href="/meals/new"
          className={buttonVariants({ size: "lg", className: "h-11 rounded-lg px-4 font-semibold" })}
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
        iconClassName="bg-brand-soft text-primary"
        value={summary.mealCount}
        label="Meals, last 7 days"
      />
      <StatTile
        icon={<CalendarCheck size={20} />}
        iconClassName="bg-info-soft text-info"
        value={summary.daysLogged}
        outOf={DAYS}
        label="Days with a logged meal"
      />
      <StatTile
        icon={<Soup size={20} />}
        iconClassName="bg-ok-soft text-ok"
        value={summary.soup.soupMeals}
        label={`Soups · broth eaten in ${summary.soup.brothConsumed}`}
      />
      <StatTile
        icon={<span className="text-[15px] font-extrabold">Na</span>}
        iconClassName="bg-warn-soft text-warn"
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
        <div key={n} className="flex h-[138px] flex-col gap-3 rounded-xl bg-card p-5 shadow-card ring-1 ring-border">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="h-7 w-12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
