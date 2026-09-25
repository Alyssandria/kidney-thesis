import z from "zod";

const count = z.number().int().nonnegative();

const NutrientLevelCountsSchema = z.object({
  LOW: count,
  MODERATE: count,
  HIGH: count,
  CRITICAL: count,
});

export const DashboardSummarySchema = z.object({
  mealCount: count,
  daysLogged: count,
  dailyCounts: z.array(z.object({ date: z.iso.date(), count, highNutrientMeals: count })),
  nutrientLevels: z.object({
    sodium: NutrientLevelCountsSchema,
    potassium: NutrientLevelCountsSchema,
    phosphorus: NutrientLevelCountsSchema,
  }),
  proteinLevels: z.object({ OPTIMAL: count, TOO_LOW: count, TOO_HIGH: count }),
  condiments: z.record(z.string(), count),
  soup: z.object({ soupMeals: count, brothConsumed: count }),
  mealTypes: z.object({
    BREAKFAST: count,
    LUNCH: count,
    DINNER: count,
    SNACK: count,
    NOT_SET: count,
  }),
  timezone: z.string(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
