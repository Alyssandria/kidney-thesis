import type { Request, Response } from "express";
import { getCurrentUserId } from "../lib/current-user.js";
import {
  DashboardSummaryQuerySchema,
  type DashboardSummaryResponse,
} from "../schemas/dashboard.schema.js";
import { getDashboardSummary } from "../services/dashboard.service.js";

export const getSummary = async (req: Request, res: Response<DashboardSummaryResponse>) => {
  // Already validated by middleware; parsed again for typed values (see listMeals).
  const query = DashboardSummaryQuerySchema.parse(req.query);
  const summary = await getDashboardSummary(getCurrentUserId(req), query);
  res.json(summary);
};
