import { Router } from "express";
import { deleteItem, getDay, getRange, saveFoodLog } from "../controllers/food-log.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import {
  FoodLogDayQuerySchema,
  FoodLogRangeQuerySchema,
  MealItemIdParamsSchema,
  SaveFoodLogRequestSchema,
} from "../schemas/food-log.schema.js";

const router = Router();

router.post("/", validateRequestMiddleware({ bodySchema: SaveFoodLogRequestSchema }), saveFoodLog);

router.get("/day", validateRequestMiddleware({ querySchema: FoodLogDayQuerySchema }), getDay);

router.get("/days", validateRequestMiddleware({ querySchema: FoodLogRangeQuerySchema }), getRange);

router.delete(
  "/items/:id",
  validateRequestMiddleware({ paramsSchema: MealItemIdParamsSchema }),
  deleteItem,
);

export default router;
