import type { Food, NewMealItem } from "../db/schema/index.js";

export type RequestedItem = { foodId: string; servings: number };

export type DatabaseItemsResult =
  | { ok: true; items: Omit<NewMealItem, "mealId">[] }
  | { ok: false; missingFoodIds: string[] };

/**
 * Copies each requested food's name, serving and nutrient values into a meal item,
 * keeping the request's order. Fails if any food wasn't found.
 */
export function buildDatabaseItems(
  requested: readonly RequestedItem[],
  foundFoods: readonly Food[],
): DatabaseItemsResult {
  const byId = new Map(foundFoods.map((food) => [food.id, food]));
  const missingFoodIds = requested.map((item) => item.foodId).filter((id) => !byId.has(id));
  if (missingFoodIds.length > 0) return { ok: false, missingFoodIds };

  return {
    ok: true,
    items: requested.flatMap(({ foodId, servings }) => {
      const food = byId.get(foodId);
      if (!food) return [];
      return [
        {
          foodId: food.id,
          source: "DATABASE" as const,
          foodName: food.name,
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
          servings,
          energyKcal: food.energyKcal,
          sodiumMg: food.sodiumMg,
          potassiumMg: food.potassiumMg,
          phosphorusMg: food.phosphorusMg,
          proteinG: food.proteinG,
          fluidMl: food.fluidMl,
        },
      ];
    }),
  };
}
