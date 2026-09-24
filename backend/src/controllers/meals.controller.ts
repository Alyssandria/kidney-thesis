import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import type { SaveMealRequest, SaveMealResponse } from "../schemas/save-meal.schema.js";
import { saveMealLog } from "../services/meal-log.service.js";

export const saveMeal = async (
  req: Request<Record<string, string>, unknown, SaveMealRequest>,
  res: Response<SaveMealResponse>,
) => {
  const saved = await saveMealLog(getCurrentUserId(req), req.body);
  res.status(201).json(saved);
};
