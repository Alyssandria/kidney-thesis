import { Router } from "express";
import { getSummary } from "../controllers/dashboard.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { DashboardSummaryQuerySchema } from "../schemas/dashboard.schema.js";

const router = Router();

router.get(
  "/summary",
  validateRequestMiddleware({ querySchema: DashboardSummaryQuerySchema }),
  getSummary,
);

export default router;
