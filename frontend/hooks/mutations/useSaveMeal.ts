import { saveMeal } from "@/services/mealService";
import { useMutation } from "@tanstack/react-query";

export function useSaveMeal() {
  return useMutation({
    mutationFn: saveMeal,
  });
}
