import { api } from "@/lib/config";
import { MealAnalysisResponse } from "@/schemas/mealAnalysisResponse";
import { MealFormValues } from "@/schemas/mealFormSchema";

export type MealRating = "RENAL_SAFE" | "CAUTION_REQUIRED" | "HIGH_RISK";

export async function analyzeMeal(
  values: MealFormValues,
): Promise<MealAnalysisResponse> {
  const { description, isSoup, ingredients, ckdStage, isDialysis, mealType, consumedSoup } =
    values;
  const { data } = await api.post<MealAnalysisResponse>("/meals/analyze", {
    meal: {
      description,
      isSoup,
      mealType,
      consumedSoup,
      ingredients
    },
    patientDetails: {
      ckdStage,
      isDialysis,
    },
  });

  return data;
}
