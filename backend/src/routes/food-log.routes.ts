import { Router } from "express";
import { saveFoodLog } from "../controllers/food-log.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { SaveFoodLogRequestSchema } from "../schemas/food-log.schema.js";

const router = Router();

router.post("/", validateRequestMiddleware({ bodySchema: SaveFoodLogRequestSchema }), saveFoodLog);

export default router;
