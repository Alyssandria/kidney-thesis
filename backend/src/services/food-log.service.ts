import { toLocalDate } from "../dashboard/meal-metrics.js";
import { eachDate } from "../lib/calendar-dates.js";
import { AppError } from "../lib/errors.js";
import {
  analyzeDay,
  analyzeTotals,
  dayAlerts,
  sumNutrients,
  type FoodEntry,
  type NutrientAnalysis,
  type NutrientStatus,
} from "../nutrition/daily-analysis.js";
import { buildDatabaseItems, toFoodEntry } from "../nutrition/meal-items.js";
import { findActiveFoodsByIds } from "../repositories/food.repository.js";
import {
  deleteMealItem,
  findDayItems,
  findItemOwnership,
  findRangeItems,
  insertMealWithItems,
} from "../repositories/meal.repository.js";
import { findUserTimezone } from "../repositories/user.repository.js";
import type {
  FoodLogDayQuery,
  FoodLogDayResponse,
  FoodLogRangeQuery,
  FoodLogRangeResponse,
  SaveFoodLogRequest,
  SaveFoodLogResponse,
} from "../schemas/food-log.schema.js";
import { GUIDELINE_UNITS, type GuidelineNutrient } from "../schemas/guideline.schema.js";
import { MEAL_TYPES } from "../schemas/meal.schema.js";
import { getReferenceAmounts } from "./guideline.service.js";

async function todayFor(userId: string): Promise<string> {
  const timezone = await findUserTimezone(userId);
  if (!timezone) {
    throw new Error(`User ${userId} not found`);
  }
  return toLocalDate(new Date(), timezone);
}

export async function saveDatabaseMeal(
  userId: string,
  { mealType, items }: SaveFoodLogRequest,
): Promise<SaveFoodLogResponse> {
  const [today, foundFoods] = await Promise.all([
    todayFor(userId),
    findActiveFoodsByIds(items.map((item) => item.foodId)),
  ]);

  const built = buildDatabaseItems(items, foundFoods);
  if (!built.ok) {
    throw new AppError("FOOD_UNAVAILABLE", {
      cause: `Missing or inactive foods: ${built.missingFoodIds.join(", ")}`,
    });
  }

  const meal = await insertMealWithItems(
    { userId, logDate: today, mealType, entryMethod: "SEARCH" },
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

export async function getFoodLogDay(
  userId: string,
  { date }: FoodLogDayQuery,
): Promise<FoodLogDayResponse> {
  const today = await todayFor(userId);
  const day = date ?? today;
  const [rows, references] = await Promise.all([findDayItems(userId, day), getReferenceAmounts()]);

  const withEntries = rows.map((row) => ({ row, entry: toFoodEntry(row) }));
  const entries: FoodEntry[] = withEntries.map(({ entry }) => entry);

  return {
    date: day,
    isToday: day === today,
    meals: MEAL_TYPES.map((mealType) => {
      const group = withEntries.filter(({ row }) => row.mealType === mealType);
      return {
        mealType,
        items: group.map(({ row, entry }) => ({
          id: row.id,
          mealId: row.mealId,
          foodName: row.foodName,
          source: row.source,
          serving: { size: row.servingSize, unit: row.servingUnit },
          servings: row.servings,
          nutrients: sumNutrients([entry]),
          loggedAt: row.createdAt.toISOString(),
        })),
        totals: sumNutrients(group.map(({ entry }) => entry)),
      };
    }),
    nutrients: analyzeDay(entries, references).map((result) => ({
      ...result,
      unit: GUIDELINE_UNITS[result.nutrient],
    })),
    alerts: dayAlerts(entries, references).map((alert) => ({
      ...alert,
      unit: GUIDELINE_UNITS[alert.nutrient],
    })),
  };
}

export async function getFoodLogRange(
  userId: string,
  { from, to }: FoodLogRangeQuery,
): Promise<FoodLogRangeResponse> {
  const [rows, references] = await Promise.all([
    findRangeItems(userId, { from, to }),
    getReferenceAmounts(),
  ]);

  const entriesByDate = new Map<string, FoodEntry[]>();
  for (const row of rows) {
    const list = entriesByDate.get(row.logDate) ?? [];
    list.push(toFoodEntry(row));
    entriesByDate.set(row.logDate, list);
  }

  return {
    from,
    to,
    references,
    units: GUIDELINE_UNITS,
    days: eachDate(from, to).map((date) => {
      const entries = entriesByDate.get(date) ?? [];
      const totals = sumNutrients(entries);
      const analysis = analyzeTotals(totals, references);
      return {
        date,
        itemCount: entries.length,
        totals,
        statuses: {
          SODIUM: statusOf(analysis, "SODIUM"),
          POTASSIUM: statusOf(analysis, "POTASSIUM"),
          PHOSPHORUS: statusOf(analysis, "PHOSPHORUS"),
          PROTEIN: statusOf(analysis, "PROTEIN"),
          ENERGY: statusOf(analysis, "ENERGY"),
          FLUID: statusOf(analysis, "FLUID"),
        },
      };
    }),
  };
}

function statusOf(analysis: NutrientAnalysis[], nutrient: GuidelineNutrient): NutrientStatus {
  const result = analysis.find((item) => item.nutrient === nutrient);
  if (!result) {
    throw new Error(`Analysis is missing ${nutrient}`);
  }
  return result.status;
}

export async function removeFoodLogItem(userId: string, itemId: string): Promise<void> {
  const [today, item] = await Promise.all([todayFor(userId), findItemOwnership(userId, itemId)]);
  if (!item) {
    throw new AppError("MEAL_ITEM_NOT_FOUND");
  }
  if (item.logDate !== today) {
    throw new AppError("MEAL_LOCKED");
  }
  await deleteMealItem(itemId, item.mealId);
}
