import { api } from "@/lib/config";
import { MealFormValues } from "@/schemas/mealFormSchema";

export type MealRating =
  | "RENAL_SAFE"
  | "CAUTION_REQUIRED"
  | "HIGH_RISK";

export interface AnalyzeMealResponse {
  success: boolean;
  data: {
    id: string;
    rating: MealRating;
    message?: string;
  };
  message?: string;
}

export async function analyzeMeal(
  values: MealFormValues,
): Promise<AnalyzeMealResponse> {
  const { data } = await api.post<AnalyzeMealResponse>(
    "/meals/analyze",
    values,
  );

  return data;
}
