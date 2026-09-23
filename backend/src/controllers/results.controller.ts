import type { Request, Response } from "express";
import type { AnalyzeMealRequest } from "../schemas/analyze-meal.schema.js";
import { GenerateMealAnalysis } from "../services/meal-analysis.service.js";

export const getResults = async (
  req: Request<Record<string, string>, unknown, AnalyzeMealRequest>,
  res: Response,
) => {
  const result = await GenerateMealAnalysis(req.body);
  res.json(result);
};
