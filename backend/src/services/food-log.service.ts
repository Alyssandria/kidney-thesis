import { toLocalDate } from "../dashboard/meal-metrics.js";
import { AppError } from "../lib/errors.js";
import { buildDatabaseItems } from "../nutrition/meal-items.js";
import { findActiveFoodsByIds } from "../repositories/food.repository.js";
import { insertMealWithItems } from "../repositories/meal.repository.js";
import { findUserTimezone } from "../repositories/user.repository.js";
import type { SaveFoodLogRequest, SaveFoodLogResponse } from "../schemas/food-log.schema.js";

export async function saveDatabaseMeal(
  userId: string,
  { mealType, items }: SaveFoodLogRequest,
): Promise<SaveFoodLogResponse> {
  const [timezone, foundFoods] = await Promise.all([
    findUserTimezone(userId),
    findActiveFoodsByIds(items.map((item) => item.foodId)),
  ]);

  if (!timezone) {
    throw new Error(`User ${userId} not found while saving a meal`);
  }

  const built = buildDatabaseItems(items, foundFoods);
  if (!built.ok) {
    throw new AppError("FOOD_UNAVAILABLE", {
      cause: `Missing or inactive foods: ${built.missingFoodIds.join(", ")}`,
    });
  }

  const meal = await insertMealWithItems(
    {
      userId,
      logDate: toLocalDate(new Date(), timezone),
      mealType,
      entryMethod: "SEARCH",
    },
    built.items,
  );

  return {
    id: meal.id,
    logDate: meal.logDate,
    mealType: meal.mealType,
    itemCount: built.items.length,
    createdAt: meal.createdAt.toISOString(),
  };
}
