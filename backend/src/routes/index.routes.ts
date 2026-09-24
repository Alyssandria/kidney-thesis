import { Router } from "express";
import healthRoutes from "./health.routes.js";
import mealRoutes from "./meals.routes.js";
import resultRoutes from "./results.routes.js";

const router = Router();

/** HEALTH ROUTES */
router.use("/health", healthRoutes);

/** RESULTS ROUTES */
router.use("/meals/analyze", resultRoutes);

/** MEAL LOG ROUTES */
router.use("/meals", mealRoutes);

export default router;
