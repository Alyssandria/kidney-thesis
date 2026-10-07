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
