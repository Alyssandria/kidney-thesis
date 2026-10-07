import { and, asc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "../db/client.js";
import { foods, type Food } from "../db/schema/index.js";
import { containsPattern } from "../lib/like-pattern.js";
import type { FoodCategory } from "../schemas/food.schema.js";

export async function findActiveFoods({
  q,
  category,
  limit,
}: {
  q?: string;
  category?: FoodCategory;
  limit: number;
}): Promise<Food[]> {
  const conditions: SQL[] = [eq(foods.isActive, true)];
  if (q) conditions.push(ilike(foods.name, containsPattern(q)));
  if (category) conditions.push(eq(foods.category, category));

  return db
    .select()
    .from(foods)
    .where(and(...conditions))
    .orderBy(asc(foods.name))
    .limit(limit);
}
