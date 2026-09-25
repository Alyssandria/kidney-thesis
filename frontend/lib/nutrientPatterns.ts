import { DashboardSummary } from "@/schemas/dashboardSummary";

/** Below this, rings drawn from a few meals could suggest a pattern that isn't there. */
export const MIN_MEALS_FOR_PATTERNS = 5;

export type NutrientKey = "sodium" | "potassium" | "phosphorus";

export type NutrientRing = {
  nutrient: NutrientKey;
  label: string;
  highOrAbove: number;
  moderate: number;
  rest: number;
  total: number;
};

const NUTRIENTS: { nutrient: NutrientKey; label: string }[] = [
  { nutrient: "sodium", label: "Sodium" },
  { nutrient: "potassium", label: "Potassium" },
  { nutrient: "phosphorus", label: "Phosphorus" },
];

export function nutrientRings(summary: DashboardSummary): NutrientRing[] {
  return NUTRIENTS.map(({ nutrient, label }) => {
    const levels = summary.nutrientLevels[nutrient];
    const highOrAbove = levels.HIGH + levels.CRITICAL;
    return {
      nutrient,
      label,
      highOrAbove,
      moderate: levels.MODERATE,
      rest: summary.mealCount - highOrAbove - levels.MODERATE,
      total: summary.mealCount,
    };
  });
}

/** Screen-reader description of one ring. */
export function describeRing(ring: NutrientRing): string {
  return `${ring.label}: ${ring.highOrAbove} of ${ring.total} meals high or very high, ${ring.moderate} moderate`;
}
