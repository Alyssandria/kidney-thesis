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
