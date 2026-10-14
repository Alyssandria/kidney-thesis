import z from "zod";
import { daysInclusive } from "../lib/calendar-dates.js";
import type {
  Contributor,
  NutrientAlert,
  NutrientAmounts,
  NutrientStatus,
} from "../nutrition/daily-analysis.js";
import type { GUIDELINE_UNITS, GuidelineNutrient } from "./guideline.schema.js";
import type { MealItemSource } from "./meal-item.schema.js";
import { MEAL_TYPES } from "./meal.schema.js";

type GuidelineUnit = (typeof GUIDELINE_UNITS)[GuidelineNutrient];

export const MAX_ITEMS_PER_MEAL = 30;
export const MAX_SERVINGS = 20;

export const SaveFoodLogRequestSchema = z.strictObject({
  mealType: z.enum(MEAL_TYPES),
  items: z
    .array(
      z.strictObject({
        foodId: z.uuid(),
        servings: z.number().positive().max(MAX_SERVINGS).multipleOf(0.25),
      }),
    )
    .min(1)
    .max(MAX_ITEMS_PER_MEAL)
    .refine((items) => new Set(items.map((item) => item.foodId)).size === items.length, {
      error: "Each food can appear only once per meal; change its servings instead.",
    }),
});

export type SaveFoodLogRequest = z.infer<typeof SaveFoodLogRequestSchema>;

export type SaveFoodLogResponse = {
  id: string;
  /** "YYYY-MM-DD" in the user's timezone */
  logDate: string;
  mealType: (typeof MEAL_TYPES)[number];
  itemCount: number;
  createdAt: string;
};

export const MAX_RANGE_DAYS = 92;

export const FoodLogDayQuerySchema = z.strictObject({
  /** Defaults to today in the user's timezone. */
  date: z.iso.date().optional(),
});

export type FoodLogDayQuery = z.infer<typeof FoodLogDayQuerySchema>;

export const FoodLogRangeQuerySchema = z
  .strictObject({
    from: z.iso.date(),
    to: z.iso.date(),
  })
  .refine((query) => query.from <= query.to, {
    error: '"from" must not be later than "to"',
    path: ["to"],
  })
  .refine((query) => daysInclusive(query.from, query.to) <= MAX_RANGE_DAYS, {
    error: `The range can be at most ${MAX_RANGE_DAYS} days`,
    path: ["to"],
  });

export type FoodLogRangeQuery = z.infer<typeof FoodLogRangeQuerySchema>;

export const MealItemIdParamsSchema = z.strictObject({
  id: z.uuid(),
});

export type MealItemIdParams = z.infer<typeof MealItemIdParamsSchema>;

type NutrientResult = {
  nutrient: GuidelineNutrient;
  unit: GuidelineUnit;
  total: number;
  reference: number;
  percent: number;
};

export type FoodLogItem = {
  id: string;
  mealId: string;
  foodName: string;
  source: MealItemSource;
  serving: { size: number; unit: string };
  servings: number;
  /** Amounts eaten: per-serving values × servings. */
  nutrients: NutrientAmounts;
  loggedAt: string;
};

export type FoodLogMealGroup = {
  mealType: (typeof MEAL_TYPES)[number];
  items: FoodLogItem[];
  totals: NutrientAmounts;
};

export type FoodLogDayResponse = {
  date: string;
  isToday: boolean;
  /** Always all four meal types, in order, even when empty. */
  meals: FoodLogMealGroup[];
  nutrients: (NutrientResult & { status: NutrientStatus })[];
  alerts: (NutrientResult & {
    status: NutrientAlert["status"];
    topContributors: Contributor[];
  })[];
};

export type FoodLogRangeResponse = {
  from: string;
  to: string;
  references: NutrientAmounts;
  units: typeof GUIDELINE_UNITS;
  /** Every date in the range, including days with nothing logged. */
  days: {
    date: string;
    itemCount: number;
    totals: NutrientAmounts;
    statuses: Record<GuidelineNutrient, NutrientStatus>;
  }[];
};
