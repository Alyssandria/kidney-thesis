import { Router } from "express";
import { getResults } from "../controllers/results.controller.js";
import { validateRequestMiddleware } from "../middleware/validateRequest.middleware.js";
import { MealSchema } from "../schemas/meal.schema.js";
import z from "zod";
import { PatientSchema } from "../schemas/patient.schema.js";

const router = Router();

router.post(
  "/",
  validateRequestMiddleware({
    bodySchema: z.strictObject({
      meal: MealSchema,
      patientDetails: PatientSchema,
    }),
  }),
  getResults,
);

export default router;