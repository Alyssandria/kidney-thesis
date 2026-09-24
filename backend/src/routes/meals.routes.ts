import { Router } from "express";
import { getMeal, listMeals, saveMeal } from "../controllers/meals.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { MealIdParamsSchema, MealListQuerySchema } from "../schemas/meal-log.schema.js";
import { SaveMealRequestSchema } from "../schemas/save-meal.schema.js";

const router = Router();

router.get("/", validateRequestMiddleware({ querySchema: MealListQuerySchema }), listMeals);

router.post("/", validateRequestMiddleware({ bodySchema: SaveMealRequestSchema }), saveMeal);

router.get("/:id", validateRequestMiddleware({ paramsSchema: MealIdParamsSchema }), getMeal);

export default router;
