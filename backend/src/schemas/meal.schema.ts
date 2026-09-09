import z from "zod";
import { ERROR_MESSAGES } from "../lib/errors.js";

export const MealTypeSchema = z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']);

export const MealSchema = z.strictObject({
    description: z.string().min(3, ERROR_MESSAGES.VALIDATION.MEAL_SCHEMA.DESC_REQUIRED),
    mealType: MealTypeSchema.optional(),
    isSoup: z.boolean(),
    consumedSoup: z.boolean().optional(),
    ingredients: z.array(z.string())
}).refine((data) => !data.isSoup || data.consumedSoup !== undefined, {
    error: ERROR_MESSAGES.VALIDATION.MEAL_SCHEMA.CONSUMED_REQUIRED,
    path: ['consumedSoup']
})

export type MealType = z.infer<typeof MealSchema>;