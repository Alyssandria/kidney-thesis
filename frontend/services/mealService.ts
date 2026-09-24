import { api } from "@/lib/config";
import { MealAnalysisResponse } from "@/schemas/mealAnalysisResponse";
import { MealFormValues } from "@/schemas/mealFormSchema";
import { SaveMealResponse, SaveMealResponseSchema } from "@/schemas/saveMealResponse";

export type MealRating = "RENAL_SAFE" | "CAUTION_REQUIRED" | "HIGH_RISK";

function toMealRequest(values: MealFormValues) {
  const { description, isSoup, ingredients, ckdStage, isDialysis, mealType, consumedSoup } =
    values;

  return {
    meal: {
      description,
      isSoup,
      mealType,
      consumedSoup,
      ingredients,
    },
    patientDetails: {
      ckdStage,
      isDialysis,
    },
  };
}

export async function analyzeMeal(
  values: MealFormValues,
): Promise<MealAnalysisResponse> {
  const { data } = await api.post<MealAnalysisResponse>("/meals/analyze", toMealRequest(values));

  return data;
}

export async function saveMeal({
  values,
  analysis,
}: {
  values: MealFormValues;
  analysis: MealAnalysisResponse;
}): Promise<SaveMealResponse> {
  const { data } = await api.post<unknown>("/meals", {
    ...toMealRequest(values),
    analysis,
  });

  return SaveMealResponseSchema.parse(data);
}
