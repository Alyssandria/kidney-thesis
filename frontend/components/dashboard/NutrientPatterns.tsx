import { connection } from "next/server";
import type { ReactNode } from "react";
import { formatMonthName, monthRange } from "@/lib/calendar";
import { USER_TIMEZONE, toLocalDate } from "@/lib/dates";
import { MIN_MEALS_FOR_PATTERNS, nutrientRings } from "@/lib/nutrientPatterns";
import { DashboardSummary } from "@/schemas/dashboardSummary";
import { getDashboardSummary } from "@/services/dashboardService";
import { NutrientLevelRing } from "./NutrientLevelRing";
import { DashboardCard } from "./DashboardCard";
import { RetryButton } from "./RetryButton";

function PatternsCard({ description, children }: { description?: string; children: ReactNode }) {
  return (
    <DashboardCard id="patterns" title="Nutrient levels this month" description={description}>
      {children}
    </DashboardCard>
  );
}

export async function NutrientPatterns() {
  await connection();

  const month = toLocalDate(new Date(), USER_TIMEZONE).slice(0, 7);
  const monthName = formatMonthName(month);

  let summary: DashboardSummary;
  try {
    const { from, to } = monthRange(month, USER_TIMEZONE);
    summary = await getDashboardSummary(from, to);
  } catch {
    return (
      <PatternsCard>
        <p className="text-sm font-semibold">We couldn&apos;t load this month&apos;s patterns</p>
        <div>
          <RetryButton />
        </div>
      </PatternsCard>
    );
  }

  if (summary.mealCount < MIN_MEALS_FOR_PATTERNS) {
    return (
      <PatternsCard>
        <p className="text-base font-bold">Patterns appear after {MIN_MEALS_FOR_PATTERNS} meals</p>
        <div
          role="img"
          aria-label={`${summary.mealCount} of ${MIN_MEALS_FOR_PATTERNS} meals logged this month`}
          className="flex gap-1.5"
        >
          {Array.from({ length: MIN_MEALS_FOR_PATTERNS }, (_, n) => (
            <span
              key={n}
              className={`h-2 flex-grow rounded ${n < summary.mealCount ? "bg-kc-primary" : "bg-kc-line"}`}
            />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-kc-muted">
          You&apos;ve logged {summary.mealCount} {summary.mealCount === 1 ? "meal" : "meals"} in{" "}
          {monthName}. With only a few meals, a pattern could be misleading, so we wait until there
          are more.
        </p>
      </PatternsCard>
    );
  }

  const { TOO_HIGH, TOO_LOW } = summary.proteinLevels;

  return (
    <PatternsCard description={`Out of your ${summary.mealCount} analyses in ${monthName}`}>
      <div className="grid grid-cols-3 gap-2">
        {nutrientRings(summary).map((ring) => (
          <NutrientLevelRing key={ring.nutrient} ring={ring} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-kc-mist pt-3.5">
        <ul aria-label="Ring key" className="flex flex-wrap gap-3.5 text-[13px] text-kc-ink-soft">
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-kc-level-high" aria-hidden="true" />
            High or very high
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-kc-level-moderate" aria-hidden="true" />
            Moderate
          </li>
        </ul>
        <span className="text-[13px] text-kc-muted">
          Protein above range: {TOO_HIGH}
          {TOO_LOW > 0 && ` · below range: ${TOO_LOW}`}
        </span>
      </div>
    </PatternsCard>
  );
}
