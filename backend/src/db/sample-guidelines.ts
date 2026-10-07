import { GUIDELINE_NUTRIENTS, type GuidelineNutrient } from "../schemas/guideline.schema.js";
import type { NewNutrientGuideline } from "./schema/index.js";

const SOURCE =
  "Sample reference values for testing. Confirm against the KDOQI 2020 nutrition guideline and the study's dietitian adviser.";
const EFFECTIVE_DATE = "2026-08-01";

const DAILY_VALUES: Record<GuidelineNutrient, number> = {
  SODIUM: 2000,
  POTASSIUM: 2000,
  PHOSPHORUS: 800,
  PROTEIN: 60,
  ENERGY: 1800,
  FLUID: 1500,
};

export const SAMPLE_GUIDELINES: NewNutrientGuideline[] = GUIDELINE_NUTRIENTS.map((nutrient) => ({
  nutrient,
  dailyValue: DAILY_VALUES[nutrient],
  source: SOURCE,
  effectiveDate: EFFECTIVE_DATE,
}));
