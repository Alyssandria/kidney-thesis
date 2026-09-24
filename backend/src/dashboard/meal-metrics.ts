import { CONDIMENT_IDS, MEAL_TYPES, type CondimentId } from "../schemas/meal.schema.js";
import { NUTRIENT_LEVELS, PROTEIN_LEVELS } from "../schemas/prompt-analysis.schema.js";

type MealTypeValue = (typeof MEAL_TYPES)[number];
type NutrientLevel = (typeof NUTRIENT_LEVELS)[number];
type ProteinLevel = (typeof PROTEIN_LEVELS)[number];

export type MealMetricRow = {
  createdAt: Date;
  mealType: MealTypeValue | null;
  isSoup: boolean;
  consumedSoup: boolean | null;
  condiments: CondimentId[];
  sodiumLevel: NutrientLevel;
  potassiumLevel: NutrientLevel;
  phosphorusLevel: NutrientLevel;
  proteinLevel: ProteinLevel;
};

export type DailyCount = {
  /** Calendar date in the user's timezone, formatted YYYY-MM-DD. */
  date: string;
  count: number;
  /** Meals with sodium, potassium or phosphorus at HIGH or CRITICAL. */
  highNutrientMeals: number;
};

export type MealSummary = {
  mealCount: number;
  daysLogged: number;
  dailyCounts: DailyCount[];
  nutrientLevels: {
    sodium: Record<NutrientLevel, number>;
    potassium: Record<NutrientLevel, number>;
    phosphorus: Record<NutrientLevel, number>;
  };
  proteinLevels: Record<ProteinLevel, number>;
  condiments: Record<CondimentId, number>;
  soup: {
    soupMeals: number;
    brothConsumed: number;
  };
  mealTypes: Record<MealTypeValue | "NOT_SET", number>;
};

function zeroCounts<K extends string>(keys: readonly K[]): Record<K, number> {
  // Every key is assigned below, so the partial object is complete when returned.
  const counts = {} as Record<K, number>;
  for (const key of keys) counts[key] = 0;
  return counts;
}

function countBy<K extends string>(keys: readonly K[], values: Iterable<K>): Record<K, number> {
  const counts = zeroCounts(keys);
  for (const value of values) counts[value] += 1;
  return counts;
}

export function toLocalDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: "year" | "month" | "day") =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function hasHighNutrient(row: MealMetricRow): boolean {
  return [row.sodiumLevel, row.potassiumLevel, row.phosphorusLevel].some(
    (level) => level === "HIGH" || level === "CRITICAL",
  );
}

export function dailyCounts(rows: readonly MealMetricRow[], timeZone: string): DailyCount[] {
  const byDate = new Map<string, DailyCount>();
  for (const row of rows) {
    const date = toLocalDate(row.createdAt, timeZone);
    const day = byDate.get(date) ?? { date, count: 0, highNutrientMeals: 0 };
    day.count += 1;
    if (hasHighNutrient(row)) day.highNutrientMeals += 1;
    byDate.set(date, day);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function nutrientLevelCounts(rows: readonly MealMetricRow[]): MealSummary["nutrientLevels"] {
  return {
    sodium: countBy(NUTRIENT_LEVELS, rows.map((row) => row.sodiumLevel)),
    potassium: countBy(NUTRIENT_LEVELS, rows.map((row) => row.potassiumLevel)),
    phosphorus: countBy(NUTRIENT_LEVELS, rows.map((row) => row.phosphorusLevel)),
  };
}

export function proteinLevelCounts(rows: readonly MealMetricRow[]): Record<ProteinLevel, number> {
  return countBy(PROTEIN_LEVELS, rows.map((row) => row.proteinLevel));
}

/** Number of meals that included each condiment. */
export function condimentCounts(rows: readonly MealMetricRow[]): Record<CondimentId, number> {
  return countBy(CONDIMENT_IDS, rows.flatMap((row) => [...new Set(row.condiments)]));
}

export function soupCounts(rows: readonly MealMetricRow[]): MealSummary["soup"] {
  const soupRows = rows.filter((row) => row.isSoup);
  return {
    soupMeals: soupRows.length,
    brothConsumed: soupRows.filter((row) => row.consumedSoup === true).length,
  };
}

export function mealTypeCounts(rows: readonly MealMetricRow[]): MealSummary["mealTypes"] {
  return countBy(
    [...MEAL_TYPES, "NOT_SET"] as const,
    rows.map((row) => row.mealType ?? "NOT_SET"),
  );
}

export function computeMealSummary(rows: readonly MealMetricRow[], timeZone: string): MealSummary {
  const days = dailyCounts(rows, timeZone);
  return {
    mealCount: rows.length,
    daysLogged: days.length,
    dailyCounts: days,
    nutrientLevels: nutrientLevelCounts(rows),
    proteinLevels: proteinLevelCounts(rows),
    condiments: condimentCounts(rows),
    soup: soupCounts(rows),
    mealTypes: mealTypeCounts(rows),
  };
}
