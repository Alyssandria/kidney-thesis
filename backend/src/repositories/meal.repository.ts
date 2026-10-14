import { and, asc, eq, gte, lte } from "drizzle-orm";
import { db } from "../db/client.js";
import { mealItems, meals, type Meal, type NewMeal, type NewMealItem } from "../db/schema/index.js";

/** Saves a meal and its items together; if any insert fails, nothing is saved. */
export async function insertMealWithItems(
  meal: NewMeal,
  items: readonly Omit<NewMealItem, "mealId">[],
): Promise<Meal> {
  return db.transaction(async (tx) => {
    const [saved] = await tx.insert(meals).values(meal).returning();
    if (!saved) {
      throw new Error("Insert into meals returned no row");
    }
    await tx.insert(mealItems).values(items.map((item) => ({ ...item, mealId: saved.id })));
    return saved;
  });
}

const itemColumns = {
  id: mealItems.id,
  mealId: mealItems.mealId,
  foodName: mealItems.foodName,
  source: mealItems.source,
  servingSize: mealItems.servingSize,
  servingUnit: mealItems.servingUnit,
  servings: mealItems.servings,
  energyKcal: mealItems.energyKcal,
  sodiumMg: mealItems.sodiumMg,
  potassiumMg: mealItems.potassiumMg,
  phosphorusMg: mealItems.phosphorusMg,
  proteinG: mealItems.proteinG,
  fluidMl: mealItems.fluidMl,
  createdAt: mealItems.createdAt,
};

export async function findDayItems(userId: string, logDate: string) {
  return db
    .select({ ...itemColumns, mealType: meals.mealType, mealCreatedAt: meals.createdAt })
    .from(mealItems)
    .innerJoin(meals, eq(mealItems.mealId, meals.id))
    .where(and(eq(meals.userId, userId), eq(meals.logDate, logDate)))
    .orderBy(asc(meals.createdAt), asc(mealItems.createdAt), asc(mealItems.id));
}

export async function findRangeItems(userId: string, { from, to }: { from: string; to: string }) {
  return db
    .select({ ...itemColumns, logDate: meals.logDate })
    .from(mealItems)
    .innerJoin(meals, eq(mealItems.mealId, meals.id))
    .where(and(eq(meals.userId, userId), gte(meals.logDate, from), lte(meals.logDate, to)));
}

export async function findItemOwnership(userId: string, itemId: string) {
  const [row] = await db
    .select({ mealId: mealItems.mealId, logDate: meals.logDate })
    .from(mealItems)
    .innerJoin(meals, eq(mealItems.mealId, meals.id))
    .where(and(eq(mealItems.id, itemId), eq(meals.userId, userId)))
    .limit(1);
  return row;
}

/** Removes one item, and its meal too once the meal has no items left. */
export async function deleteMealItem(itemId: string, mealId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(mealItems).where(eq(mealItems.id, itemId));
    const [remaining] = await tx
      .select({ id: mealItems.id })
      .from(mealItems)
      .where(eq(mealItems.mealId, mealId))
      .limit(1);
    if (!remaining) {
      await tx.delete(meals).where(eq(meals.id, mealId));
    }
  });
}
