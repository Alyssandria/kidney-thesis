import type { Request, Response } from "express";
import type { GuidelineListResponse } from "../schemas/guideline.schema.js";
import { listGuidelines } from "../services/guideline.service.js";

export const getGuidelines = async (_req: Request, res: Response<GuidelineListResponse>) => {
  res.json(await listGuidelines());
};
