import { analyzeMeal } from "@/services/mealService";
import { useMutation } from "@tanstack/react-query";


export function useAnalyzeMeal() {
  return useMutation({
    mutationFn: analyzeMeal,
  });
}
