import { api } from "@/lib/config";
import {
  FoodLogDay,
  FoodLogDaySchema,
  FoodLogRange,
  FoodLogRangeSchema,
  SaveFoodLogRequest,
  SaveFoodLogResponse,
  SaveFoodLogResponseSchema,
} from "@/schemas/foodLog";

export async function saveFoodLog(request: SaveFoodLogRequest): Promise<SaveFoodLogResponse> {
  const { data } = await api.post<unknown>("/food-log", request);
  return SaveFoodLogResponseSchema.parse(data);
}

/** Without a date, the server uses today in the user's timezone. */
export async function getFoodLogDay(date?: string): Promise<FoodLogDay> {
  const { data } = await api.get<unknown>("/food-log/day", { params: date ? { date } : {} });
  return FoodLogDaySchema.parse(data);
}

export async function getFoodLogRange(from: string, to: string): Promise<FoodLogRange> {
  const { data } = await api.get<unknown>("/food-log/days", { params: { from, to } });
  return FoodLogRangeSchema.parse(data);
}

export async function removeFoodLogItem(itemId: string): Promise<void> {
  await api.delete(`/food-log/items/${encodeURIComponent(itemId)}`);
}
