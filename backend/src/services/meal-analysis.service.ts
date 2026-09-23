import { generateStructured } from "../lib/gemini.js";
import { getMealAnalysisPrompts } from "../prompts/mealAnalysis.prompt.js";
import type { AnalyzeMealRequest } from "../schemas/analyze-meal.schema.js";
import {
  MealAnalysisResponseSchema,
  type MealAnalysisResponse,
} from "../schemas/prompt-analysis.schema.js";

export const GenerateMealAnalysis = async (
  request: AnalyzeMealRequest,
): Promise<MealAnalysisResponse> => {
  const { systemInstruction, userPrompt } = getMealAnalysisPrompts(request);

  const { data } = await generateStructured({
    systemInstruction,
    input: userPrompt,
    schema: MealAnalysisResponseSchema,
  });

  return data;
};
