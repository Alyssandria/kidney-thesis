import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import {
  FoodLogDayQuerySchema,
  FoodLogRangeQuerySchema,
  type FoodLogDayResponse,
  type FoodLogRangeResponse,
  type MealItemIdParams,
  type SaveFoodLogRequest,
  type SaveFoodLogResponse,
} from "../schemas/food-log.schema.js";
import {
  getFoodLogDay,
  getFoodLogRange,
  removeFoodLogItem,
  saveDatabaseMeal,
} from "../services/food-log.service.js";

export const saveFoodLog = async (
  req: Request<Record<string, string>, unknown, SaveFoodLogRequest>,
  res: Response<SaveFoodLogResponse>,
) => {
  const saved = await saveDatabaseMeal(getCurrentUserId(req), req.body);
  res.status(201).json(saved);
};

// Queries are already validated by middleware; parsing again applies defaults,
// since Express 5 doesn't let the middleware replace req.query.
export const getDay = async (req: Request, res: Response<FoodLogDayResponse>) => {
  const query = FoodLogDayQuerySchema.parse(req.query);
  res.json(await getFoodLogDay(getCurrentUserId(req), query));
};

export const getRange = async (req: Request, res: Response<FoodLogRangeResponse>) => {
  const query = FoodLogRangeQuerySchema.parse(req.query);
  res.json(await getFoodLogRange(getCurrentUserId(req), query));
};

export const deleteItem = async (req: Request<MealItemIdParams>, res: Response) => {
  await removeFoodLogItem(getCurrentUserId(req), req.params.id);
  res.status(204).end();
};
