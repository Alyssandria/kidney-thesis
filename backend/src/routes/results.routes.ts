import { Router } from "express";
import { getResults } from "../controllers/results.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { AnalyzeMealRequestSchema } from "../schemas/analyze-meal.schema.js";

const router = Router();

router.post(
  "/",
  validateRequestMiddleware({ bodySchema: AnalyzeMealRequestSchema }),
  getResults,
);

export default router;
