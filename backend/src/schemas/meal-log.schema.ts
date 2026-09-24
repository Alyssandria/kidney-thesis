import z from "zod";
import type { CondimentId, MEAL_TYPES } from "./meal.schema.js";
import type { PatientDetailsType } from "./patient.schema.js";
import type { MealAnalysisResponse } from "./prompt-analysis.schema.js";

export const MealIdParamsSchema = z.strictObject({
  id: z.uuid(),
});

export type MealIdParams = z.infer<typeof MealIdParamsSchema>;

export type MealLogDetail = {
  id: string;
  createdAt: string;
  meal: {
    description: string;
    mealType: (typeof MEAL_TYPES)[number] | null;
    isSoup: boolean;
    consumedSoup: boolean | null;
    condiments: CondimentId[];
  };
  patientDetails: PatientDetailsType;
  analysis: MealAnalysisResponse;
};
