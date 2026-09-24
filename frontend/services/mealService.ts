import { isAxiosError } from "axios";
import { api } from "@/lib/config";
import { MealAnalysisResponse } from "@/schemas/mealAnalysisResponse";
import { MealFormValues } from "@/schemas/mealFormSchema";
import { MealLogDetail, MealLogDetailSchema } from "@/schemas/mealLogDetail";
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

/** Returns null when the meal doesn't exist or the id is malformed. */
export async function getMeal(id: string): Promise<MealLogDetail | null> {
  try {
    const { data } = await api.get<unknown>(`/meals/${encodeURIComponent(id)}`);
    return MealLogDetailSchema.parse(data);
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 404 || status === 400) {
      return null;
    }
    throw error;
  }
}
