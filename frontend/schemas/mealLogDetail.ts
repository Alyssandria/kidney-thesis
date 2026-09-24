import z from "zod";
import { MealAnalysisResponseSchema } from "./mealAnalysisResponse";
import { MealTypeSchema } from "./mealFormSchema";

export const MealLogDetailSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  meal: z.object({
    description: z.string(),
    mealType: MealTypeSchema.nullable(),
    isSoup: z.boolean(),
    consumedSoup: z.boolean().nullable(),
    condiments: z.array(z.string()),
  }),
  patientDetails: z.object({
    ckdStage: z.number().int(),
    isDialysis: z.boolean(),
  }),
  analysis: MealAnalysisResponseSchema,
});

export type MealLogDetail = z.infer<typeof MealLogDetailSchema>;
