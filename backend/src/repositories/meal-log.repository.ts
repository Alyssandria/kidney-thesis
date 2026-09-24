import { and, desc, eq, gte, lt, sql, type SQL } from "drizzle-orm";
import { db } from "../db/client.js";
import { mealLogs, type MealLog, type NewMealLog } from "../db/schema/index.js";
import type { MealMetricRow } from "../dashboard/meal-metrics.js";

export async function insertMealLog(values: NewMealLog): Promise<MealLog> {
  const [row] = await db.insert(mealLogs).values(values).returning();
  if (!row) {
    throw new Error("Insert into meal_logs returned no row");
  }
  return row;
}

export async function findMealLogById(userId: string, id: string): Promise<MealLog | undefined> {
  const [row] = await db
    .select()
    .from(mealLogs)
    .where(and(eq(mealLogs.id, id), eq(mealLogs.userId, userId)))
    .limit(1);
  return row;
}

export async function findMealLogs(
  userId: string,
  { from, to, limit }: { from?: Date; to?: Date; limit: number },
) {
  const conditions: SQL[] = [eq(mealLogs.userId, userId)];
  if (from) conditions.push(gte(mealLogs.createdAt, from));
  if (to) conditions.push(lt(mealLogs.createdAt, to));

  return db
    .select({
      id: mealLogs.id,
      createdAt: mealLogs.createdAt,
      description: mealLogs.description,
      mealType: mealLogs.mealType,
      isSoup: mealLogs.isSoup,
      consumedSoup: mealLogs.consumedSoup,
      condiments: mealLogs.condiments,
      summary: sql<string>`${mealLogs.analysis} ->> 'summary'`,
      sodiumLevel: mealLogs.sodiumLevel,
      potassiumLevel: mealLogs.potassiumLevel,
      phosphorusLevel: mealLogs.phosphorusLevel,
      proteinLevel: mealLogs.proteinLevel,
    })
    .from(mealLogs)
    .where(and(...conditions))
    .orderBy(desc(mealLogs.createdAt), desc(mealLogs.id))
    .limit(limit);
}

export async function findMealMetricRows(
  userId: string,
  { from, to }: { from: Date; to: Date },
): Promise<MealMetricRow[]> {
  return db
    .select({
      createdAt: mealLogs.createdAt,
      mealType: mealLogs.mealType,
      isSoup: mealLogs.isSoup,
      consumedSoup: mealLogs.consumedSoup,
      condiments: mealLogs.condiments,
      sodiumLevel: mealLogs.sodiumLevel,
      potassiumLevel: mealLogs.potassiumLevel,
      phosphorusLevel: mealLogs.phosphorusLevel,
      proteinLevel: mealLogs.proteinLevel,
    })
    .from(mealLogs)
    .where(
      and(
        eq(mealLogs.userId, userId),
        gte(mealLogs.createdAt, from),
        lt(mealLogs.createdAt, to),
      ),
    );
}
