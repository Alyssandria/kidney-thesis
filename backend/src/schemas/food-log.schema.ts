import z from "zod";
import { MEAL_TYPES } from "./meal.schema.js";

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
