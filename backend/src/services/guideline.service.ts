import { AppError } from "../lib/errors.js";
import type { NutrientAmounts } from "../nutrition/daily-analysis.js";
import { findAllGuidelines } from "../repositories/guideline.repository.js";
import {
  GUIDELINE_NUTRIENTS,
  GUIDELINE_UNITS,
  type GuidelineListResponse,
  type GuidelineNutrient,
} from "../schemas/guideline.schema.js";

const displayOrder = (nutrient: GuidelineNutrient) => GUIDELINE_NUTRIENTS.indexOf(nutrient);

export async function listGuidelines(): Promise<GuidelineListResponse> {
  const rows = await findAllGuidelines();

  return {
    items: [...rows]
      .sort((a, b) => displayOrder(a.nutrient) - displayOrder(b.nutrient))
      .map((row) => ({
        nutrient: row.nutrient,
        dailyValue: row.dailyValue,
        unit: GUIDELINE_UNITS[row.nutrient],
        source: row.source,
        effectiveDate: row.effectiveDate,
        updatedAt: row.updatedAt.toISOString(),
      })),
  };
}

/** The daily reference for every nutrient. Fails if any nutrient has no guideline. */
export async function getReferenceAmounts(): Promise<NutrientAmounts> {
  const rows = await findAllGuidelines();
  const byNutrient = new Map(rows.map((row) => [row.nutrient, row.dailyValue]));
  const missing = GUIDELINE_NUTRIENTS.filter((nutrient) => !byNutrient.has(nutrient));
  if (missing.length > 0) {
    throw new AppError("GUIDELINES_INCOMPLETE", { cause: `No guideline for: ${missing.join(", ")}` });
  }

  const value = (nutrient: GuidelineNutrient) => byNutrient.get(nutrient) ?? 0;
  return {
    SODIUM: value("SODIUM"),
    POTASSIUM: value("POTASSIUM"),
    PHOSPHORUS: value("PHOSPHORUS"),
    PROTEIN: value("PROTEIN"),
    ENERGY: value("ENERGY"),
    FLUID: value("FLUID"),
  };
}
