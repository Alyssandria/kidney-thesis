import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import type { MealIdParams, MealLogDetail } from "../schemas/meal-log.schema.js";
import type { SaveMealRequest, SaveMealResponse } from "../schemas/save-meal.schema.js";
import { getMealLog, saveMealLog } from "../services/meal-log.service.js";

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
