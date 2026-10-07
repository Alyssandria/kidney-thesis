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

export type GuidelineItem = {
  nutrient: GuidelineNutrient;
  dailyValue: number;
  unit: (typeof GUIDELINE_UNITS)[GuidelineNutrient];
  source: string;
  /** "YYYY-MM-DD" */
  effectiveDate: string;
  updatedAt: string;
};

export type GuidelineListResponse = {
  items: GuidelineItem[];
};
