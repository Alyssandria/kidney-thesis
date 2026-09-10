import { MealType } from "./types"

export const CONDIMENTS = [
  { id: "patis", label: "Patis (Fish Sauce)" },
  { id: "bagoong", label: "Bagoong" },
  { id: "toyomansi", label: "Toyomansi" },
  { id: "soy-sauce", label: "Soy Sauce" },
  { id: "banana-ketchup", label: "Banana Ketchup" },
  { id: "salt", label: "Salt" },
]

export const MEAL_TYPES: { type: MealType, icon: string }[] = [
  { type: "Breakfast", icon: "🌅" },
  { type: "Lunch", icon: "☀️" },
  { type: "Dinner", icon: "🌙" },
  { type: "Snack", icon: "🫐" },
]

export const ANALYSIS_STEPS = [
  "Extracting Pinoy culinary components…",
  "Checking potassium & sodium lab limits…",
  "Generating renal-safe substitutes…",
]