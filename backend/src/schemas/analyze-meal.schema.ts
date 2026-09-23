import z from "zod";
import { MealSchema } from "./meal.schema.js";
import { PatientSchema } from "./patient.schema.js";

export const AnalyzeMealRequestSchema = z.strictObject({
  meal: MealSchema,
  patientDetails: PatientSchema,
});

export type AnalyzeMealRequest = z.infer<typeof AnalyzeMealRequestSchema>;
