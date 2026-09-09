import { z } from 'zod';

export const MealAnalysisResponseSchema = z.object({
  score: z.number().int().min(1).max(10),
  safetyRating: z.enum(['SAFE', 'MODERATE_RISK', 'HIGH_RISK', 'CRITICAL_HAZARD']),
  summary: z.string().max(300),
  nutrientRisks: z.object({
    sodium: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
    potassium: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
    phosphorus: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
    proteinLevel: z.enum(['OPTIMAL', 'TOO_LOW', 'TOO_HIGH']),
  }),
  flaggedIngredients: z.array(
    z.object({
      name: z.string(),
      category: z.enum(['SODIUM', 'POTASSIUM', 'PHOSPHORUS', 'PROTEIN', 'FLUID']),
      severity: z.enum(['MILD', 'MODERATE', 'SEVERE']),
      reasoning: z.string(),
    })
  ),
  actionableAdvice: z.array(z.string()),
  pinoySubstitutes: z.array(
    z.object({
      originalIngredient: z.string(),
      suggestedAlternative: z.string(),
      explanation: z.string(),
    })
  ),
});

export type MealAnalysisResponse = z.infer<typeof MealAnalysisResponseSchema>;