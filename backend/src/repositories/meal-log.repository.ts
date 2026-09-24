import { db } from "../db/client.js";
import { mealLogs, type MealLog, type NewMealLog } from "../db/schema/index.js";

export async function insertMealLog(values: NewMealLog): Promise<MealLog> {
  const [row] = await db.insert(mealLogs).values(values).returning();
  if (!row) {
    throw new Error("Insert into meal_logs returned no row");
  }
  return row;
}
