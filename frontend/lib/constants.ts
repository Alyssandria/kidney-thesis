import z from "zod"
import { MealTypeSchema } from "@/schemas/mealFormSchema"

export const CONDIMENTS = [
  { id: "patis", label: "Patis (Fish Sauce)" },
  { id: "bagoong", label: "Bagoong" },
  { id: "toyomansi", label: "Toyomansi" },
  { id: "soy-sauce", label: "Soy Sauce" },
  { id: "banana-ketchup", label: "Banana Ketchup" },
  { id: "salt", label: "Salt" },
]

export const MEAL_TYPES: { type: z.infer<typeof MealTypeSchema>, icon: string }[] = [
  { type: "BREAKFAST", icon: "🌅" },
  { type: "LUNCH", icon: "☀️" },
  { type: "DINNER", icon: "🌙" },
  { type: "SNACK", icon: "🫐" },
]

export const ANALYSIS_STEPS = [
  "Extracting Pinoy culinary components…",
  "Checking potassium & sodium lab limits…",
  "Generating renal-safe substitutes…",
]

export const MEAL_TYPE_LABELS: Record<z.infer<typeof MealTypeSchema>, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
}
