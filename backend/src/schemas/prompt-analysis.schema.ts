import { z } from "zod";
export const NUTRIENT_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"] as const;
export const PROTEIN_LEVELS = ["OPTIMAL", "TOO_LOW", "TOO_HIGH"] as const;

const NutrientLevelSchema = z.enum(NUTRIENT_LEVELS);

export const MealAnalysisResponseSchema = z.object({
  score: z.number().int().min(1).max(10),
  safetyRating: z.enum(["SAFE", "MODERATE_RISK", "HIGH_RISK", "CRITICAL_HAZARD"]),
  summary: z.string().max(300),
  nutrientRisks: z.object({
    sodium: NutrientLevelSchema,
    potassium: NutrientLevelSchema,
    phosphorus: NutrientLevelSchema,
    proteinLevel: z.enum(PROTEIN_LEVELS),
  }),
  flaggedIngredients: z.array(
    z.object({
      name: z.string(),
      category: z.enum(["SODIUM", "POTASSIUM", "PHOSPHORUS", "PROTEIN", "FLUID"]),
      severity: z.enum(["MILD", "MODERATE", "SEVERE"]),
      reasoning: z.string(),
    }),
  ),
  actionableAdvice: z.array(z.string()),
  pinoySubstitutes: z.array(
    z.object({
      originalIngredient: z.string(),
      suggestedAlternative: z.string(),
      explanation: z.string(),
    }),
  ),
});

export type MealAnalysisResponse = z.infer<typeof MealAnalysisResponseSchema>;
