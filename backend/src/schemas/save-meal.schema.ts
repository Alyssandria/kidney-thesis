import z from "zod";
import { AnalyzeMealRequestSchema } from "./analyze-meal.schema.js";
import { MealAnalysisResponseSchema } from "./prompt-analysis.schema.js";

export const SaveMealRequestSchema = AnalyzeMealRequestSchema.extend({
  analysis: MealAnalysisResponseSchema,
});

export type SaveMealRequest = z.infer<typeof SaveMealRequestSchema>;

export type SaveMealResponse = {
  id: string;
  createdAt: string;
};
