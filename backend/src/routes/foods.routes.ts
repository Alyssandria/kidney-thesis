import { Router } from "express";
import { getFoods } from "../controllers/foods.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { FoodListQuerySchema } from "../schemas/food.schema.js";

const router = Router();

router.get("/", validateRequestMiddleware({ querySchema: FoodListQuerySchema }), getFoods);

export default router;
