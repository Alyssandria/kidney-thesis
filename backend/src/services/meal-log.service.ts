import { ENV } from "../lib/config.js";
import { AppError } from "../lib/errors.js";
import { MEAL_ANALYSIS_PROMPT_VERSION } from "../prompts/mealAnalysis.prompt.js";
import {
  findMealLogById,
  insertMealLog,
  findMealLogs,
} from "../repositories/meal-log.repository.js";
import type {
  MealListQuery,
  MealLogDetail,
  MealLogListResponse,
} from "../schemas/meal-log.schema.js";
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

export async function getMealLog(userId: string, id: string): Promise<MealLogDetail> {
  const row = await findMealLogById(userId, id);
  if (!row) {
    throw new AppError("MEAL_NOT_FOUND");
  }

  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    meal: {
      description: row.description,
      mealType: row.mealType,
      isSoup: row.isSoup,
      consumedSoup: row.consumedSoup,
      condiments: row.condiments,
    },
    patientDetails: {
      ckdStage: row.ckdStage,
      isDialysis: row.isDialysis,
    },
    analysis: row.analysis,
  };
}

export async function listMealLogs(
  userId: string,
  { from, to, limit }: MealListQuery,
): Promise<MealLogListResponse> {
  // One extra row tells us whether there are more without a separate count query.
  const rows = await findMealLogs(userId, {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    limit: limit + 1,
  });

  return {
    items: rows.slice(0, limit).map((row) => ({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      description: row.description,
      mealType: row.mealType,
      isSoup: row.isSoup,
      consumedSoup: row.consumedSoup,
      condiments: row.condiments,
      summary: row.summary,
      nutrientLevels: {
        sodium: row.sodiumLevel,
        potassium: row.potassiumLevel,
        phosphorus: row.phosphorusLevel,
        protein: row.proteinLevel,
      },
    })),
    hasMore: rows.length > limit,
  };
}
