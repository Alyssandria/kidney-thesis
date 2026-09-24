import { Router } from "express";
import { saveMeal } from "../controllers/meals.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { SaveMealRequestSchema } from "../schemas/save-meal.schema.js";

const router = Router();

router.post("/", validateRequestMiddleware({ bodySchema: SaveMealRequestSchema }), saveMeal);

export default router;
