export const GUIDELINE_NUTRIENTS = [
  "SODIUM",
  "POTASSIUM",
  "PHOSPHORUS",
  "PROTEIN",
  "ENERGY",
  "FLUID",
] as const;

export type GuidelineNutrient = (typeof GUIDELINE_NUTRIENTS)[number];

/** Units match the per-serving nutrient columns on `foods`. */
export const GUIDELINE_UNITS = {
  SODIUM: "mg",
  POTASSIUM: "mg",
  PHOSPHORUS: "mg",
  PROTEIN: "g",
  ENERGY: "kcal",
  FLUID: "mL",
} as const satisfies Record<GuidelineNutrient, string>;
