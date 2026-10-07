import { Router } from "express";
import dashboardRoutes from "./dashboard.routes.js";
import foodRoutes from "./foods.routes.js";
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

/** DASHBOARD ROUTES */
router.use("/dashboard", dashboardRoutes);

/** FOOD DATABASE ROUTES */
router.use("/foods", foodRoutes);

export default router;
