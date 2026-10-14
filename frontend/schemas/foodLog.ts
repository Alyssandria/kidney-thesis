import z from "zod";
import { MealTypeSchema } from "./mealFormSchema";
import {
  NutrientAmountsSchema,
  NutrientSchema,
  NutrientStatusSchema,
  NutrientUnitSchema,
} from "./nutrition";

export type SaveFoodLogRequest = {
  mealType: z.infer<typeof MealTypeSchema>;
  items: { foodId: string; servings: number }[];
};

export const SaveFoodLogResponseSchema = z.object({
  id: z.uuid(),
  logDate: z.iso.date(),
  mealType: MealTypeSchema,
  itemCount: z.number().int(),
  createdAt: z.iso.datetime(),
});
export type SaveFoodLogResponse = z.infer<typeof SaveFoodLogResponseSchema>;

const NutrientResultSchema = z.object({
  nutrient: NutrientSchema,
  unit: NutrientUnitSchema,
  total: z.number(),
  reference: z.number(),
  percent: z.number(),
});

export const FoodLogItemSchema = z.object({
  id: z.uuid(),
  mealId: z.uuid(),
  foodName: z.string(),
  source: z.enum(["DATABASE", "AI_ESTIMATE"]),
  serving: z.object({ size: z.number(), unit: z.string() }),
  servings: z.number(),
  /** Amounts eaten. */
  nutrients: NutrientAmountsSchema,
  loggedAt: z.iso.datetime(),
});

export const FoodLogDaySchema = z.object({
  date: z.iso.date(),
  isToday: z.boolean(),
  meals: z.array(
    z.object({
      mealType: MealTypeSchema,
      items: z.array(FoodLogItemSchema),
      totals: NutrientAmountsSchema,
    }),
  ),
  nutrients: z.array(NutrientResultSchema.extend({ status: NutrientStatusSchema })),
  alerts: z.array(
    NutrientResultSchema.extend({
      status: z.enum(["APPROACHING", "ABOVE"]),
      topContributors: z.array(
        z.object({ foodName: z.string(), amount: z.number(), sharePercent: z.number() }),
      ),
    }),
  ),
});

export const FoodLogRangeSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  references: NutrientAmountsSchema,
  units: z.object({
    SODIUM: NutrientUnitSchema,
    POTASSIUM: NutrientUnitSchema,
    PHOSPHORUS: NutrientUnitSchema,
    PROTEIN: NutrientUnitSchema,
    ENERGY: NutrientUnitSchema,
    FLUID: NutrientUnitSchema,
  }),
  days: z.array(
    z.object({
      date: z.iso.date(),
      itemCount: z.number().int(),
      totals: NutrientAmountsSchema,
      statuses: z.object({
        SODIUM: NutrientStatusSchema,
        POTASSIUM: NutrientStatusSchema,
        PHOSPHORUS: NutrientStatusSchema,
        PROTEIN: NutrientStatusSchema,
        ENERGY: NutrientStatusSchema,
        FLUID: NutrientStatusSchema,
      }),
    }),
  ),
});

export type FoodLogItem = z.infer<typeof FoodLogItemSchema>;
export type FoodLogDay = z.infer<typeof FoodLogDaySchema>;
export type FoodLogRange = z.infer<typeof FoodLogRangeSchema>;
