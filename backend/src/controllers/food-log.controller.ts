import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import type { SaveFoodLogRequest, SaveFoodLogResponse } from "../schemas/food-log.schema.js";
import { saveDatabaseMeal } from "../services/food-log.service.js";

export const saveFoodLog = async (
  req: Request<Record<string, string>, unknown, SaveFoodLogRequest>,
  res: Response<SaveFoodLogResponse>,
) => {
  const saved = await saveDatabaseMeal(getCurrentUserId(req), req.body);
  res.status(201).json(saved);
};
