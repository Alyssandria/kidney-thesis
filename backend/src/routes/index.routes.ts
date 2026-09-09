import { Router } from "express";
import resultRoutes from './results.routes.js'
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { MealSchema } from "../schemas/meal.schema.js";
import z from "zod";

const router = Router();

router.use("/results", validateRequestMiddleware({
    bodySchema: z.strictObject({
        prompt: MealSchema
    })
}), resultRoutes);

export default router;