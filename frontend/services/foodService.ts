import { api } from "@/lib/config";
import { FoodListResponse, FoodListResponseSchema } from "@/schemas/foods";
import type { FoodCategory } from "@/schemas/nutrition";

export async function listFoods(params: {
  q?: string;
  category?: FoodCategory;
  limit?: number;
} = {}): Promise<FoodListResponse> {
  const { data } = await api.get<unknown>("/foods", { params });
  return FoodListResponseSchema.parse(data);
}
