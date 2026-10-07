import { findActiveFoods } from "../repositories/food.repository.js";
import type { FoodListQuery, FoodListResponse } from "../schemas/food.schema.js";

export async function listFoods({ q, category, limit }: FoodListQuery): Promise<FoodListResponse> {
  // One extra row tells us whether there are more results.
  const rows = await findActiveFoods({ q, category, limit: limit + 1 });

  return {
    items: rows.slice(0, limit).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      serving: { size: row.servingSize, unit: row.servingUnit },
      nutrients: {
        energyKcal: row.energyKcal,
        sodiumMg: row.sodiumMg,
        potassiumMg: row.potassiumMg,
        phosphorusMg: row.phosphorusMg,
        proteinG: row.proteinG,
        fluidMl: row.fluidMl,
      },
      source: row.source,
    })),
    hasMore: rows.length > limit,
  };
}
