import { ENV } from "../lib/config.js";
import { MEAL_ANALYSIS_PROMPT_VERSION } from "../prompts/mealAnalysis.prompt.js";
import { insertMealLog } from "../repositories/meal-log.repository.js";
import type { SaveMealRequest, SaveMealResponse } from "../schemas/save-meal.schema.js";

export async function saveMealLog(
  userId: string,
  { meal, patientDetails, analysis }: SaveMealRequest,
): Promise<SaveMealResponse> {
  const row = await insertMealLog({
    userId,
    description: meal.description,
    mealType: meal.mealType ?? null,
    isSoup: meal.isSoup,
    consumedSoup: meal.isSoup ? (meal.consumedSoup ?? null) : null,
    condiments: meal.ingredients,
    ckdStage: patientDetails.ckdStage,
    isDialysis: patientDetails.isDialysis,
    sodiumLevel: analysis.nutrientRisks.sodium,
    potassiumLevel: analysis.nutrientRisks.potassium,
    phosphorusLevel: analysis.nutrientRisks.phosphorus,
    proteinLevel: analysis.nutrientRisks.proteinLevel,
    analysis,
    // The client doesn't report these, so they reflect the server config at save time.
    model: ENV.AI_MODEL,
    promptVersion: MEAL_ANALYSIS_PROMPT_VERSION,
  });

  return { id: row.id, createdAt: row.createdAt.toISOString() };
}
