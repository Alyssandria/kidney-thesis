import type { Food } from "@/schemas/foods";
import type { FoodCategory, NutrientAmounts } from "@/schemas/nutrition";
import type { MealType } from "@/schemas/mealFormSchema";

/** One serving at or above this share of a daily reference counts as high. */
export const HIGH_SHARE = 0.2;
export const LOW_SODIUM_MG = 140;

export type FlaggedNutrient = "SODIUM" | "POTASSIUM" | "PHOSPHORUS";

const PER_SERVING: Record<FlaggedNutrient, (food: Food) => number> = {
  SODIUM: (food) => food.nutrients.sodiumMg,
  POTASSIUM: (food) => food.nutrients.potassiumMg,
  PHOSPHORUS: (food) => food.nutrients.phosphorusMg,
};

export function highNutrients(food: Food, references: NutrientAmounts): FlaggedNutrient[] {
  return (["SODIUM", "POTASSIUM", "PHOSPHORUS"] as const).filter(
    (nutrient) => PER_SERVING[nutrient](food) >= references[nutrient] * HIGH_SHARE,
  );
}

/** Drinks are left out: almost all are low in sodium, so the label would add noise. */
export function isLowSodium(food: Food): boolean {
  return food.category !== "BEVERAGES" && food.nutrients.sodiumMg <= LOW_SODIUM_MG;
}

export function filterFoods(
  foods: readonly Food[],
  { query, category }: { query: string; category: FoodCategory | "ALL" },
): Food[] {
  const needle = query.trim().toLowerCase();
  return foods.filter(
    (food) =>
      (category === "ALL" || food.category === category) &&
      (needle === "" || food.name.toLowerCase().includes(needle)),
  );
}

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

/** The first meal with nothing logged today, or Snack once the main meals are done. */
export function nextMealType(loggedCounts: Record<MealType, number>): MealType {
  return MEAL_ORDER.find((meal) => loggedCounts[meal] === 0) ?? "SNACK";
}
