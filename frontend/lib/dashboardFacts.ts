import { CONDIMENTS } from "@/lib/constants";
import { DashboardSummary } from "@/schemas/dashboardSummary";

/** Below this, a count reads more like a pattern than it is. */
export const MIN_MEALS_FOR_FACTS = 3;

export type CountedFacts = {
  headline: string;
  details: string[];
};

const NUTRIENTS = [
  { key: "sodium", label: "Sodium" },
  { key: "potassium", label: "Potassium" },
  { key: "phosphorus", label: "Phosphorus" },
] as const;

function nutrientHeadline(summary: DashboardSummary, periodLabel: string): string {
  const counts = NUTRIENTS.map(({ key, label }) => {
    const levels = summary.nutrientLevels[key];
    return { label, count: levels.MODERATE + levels.HIGH + levels.CRITICAL };
  });
  // Ties keep NUTRIENTS order (sodium first).
  const top = counts.reduce((best, next) => (next.count > best.count ? next : best));

  if (top.count === 0) {
    return `None of your ${summary.mealCount} meals ${periodLabel} had sodium, potassium or phosphorus at moderate or higher.`;
  }
  return `${top.label} was moderate or higher in ${top.count} of your ${summary.mealCount} meals ${periodLabel}.`;
}

function soupDetail({ soup }: DashboardSummary): string | null {
  const { soupMeals, brothConsumed } = soup;
  if (soupMeals === 0) return null;

  const soupPart = soupMeals === 1 ? "1 was a soup" : `${soupMeals} were soups`;
  if (brothConsumed === 0) {
    return `${soupPart}, and you didn't have the broth${soupMeals === 1 ? "" : " in any of them"}.`;
  }
  if (brothConsumed === soupMeals) {
    return `${soupPart}, and you had the broth${soupMeals === 1 ? "" : " in all of them"}.`;
  }
  return `${soupPart}, and you had the broth in ${brothConsumed} of them.`;
}

function condimentDetail({ condiments }: DashboardSummary): string | null {
  const [top] = CONDIMENTS.map(({ id, label }) => ({ label, count: condiments[id] ?? 0 })).sort(
    (a, b) => b.count - a.count,
  );
  if (!top || top.count < 2) return null;
  return `You added ${top.label} to ${top.count} of them.`;
}

/** Fixed-template sentences from counted data. Returns null when there's too little to say. */
export function buildCountedFacts(summary: DashboardSummary, periodLabel: string): CountedFacts | null {
  if (summary.mealCount < MIN_MEALS_FOR_FACTS) return null;

  return {
    headline: nutrientHeadline(summary, periodLabel),
    details: [soupDetail(summary), condimentDetail(summary)].filter(
      (detail): detail is string => detail !== null,
    ),
  };
}
