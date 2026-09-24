import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import {
  MealListQuerySchema,
  type MealIdParams,
  type MealLogDetail,
  type MealLogListResponse,
} from "../schemas/meal-log.schema.js";
import type { SaveMealRequest, SaveMealResponse } from "../schemas/save-meal.schema.js";
import { getMealLog, listMealLogs, saveMealLog } from "../services/meal-log.service.js";

export const saveMeal = async (
  req: Request<Record<string, string>, unknown, SaveMealRequest>,
  res: Response<SaveMealResponse>,
) => {
  const saved = await saveMealLog(getCurrentUserId(req), req.body);
  res.status(201).json(saved);
};

export const getMeal = async (req: Request<MealIdParams>, res: Response<MealLogDetail>) => {
  const meal = await getMealLog(getCurrentUserId(req), req.params.id);
  res.json(meal);
};

export const listMeals = async (req: Request, res: Response<MealLogListResponse>) => {
  // Already validated by middleware; parsing again applies coercion and defaults,
  // since Express 5 doesn't let the middleware replace req.query.
  const query = MealListQuerySchema.parse(req.query);
  const meals = await listMealLogs(getCurrentUserId(req), query);
  res.json(meals);
};
