import z from "zod";
import { ERROR_MESSAGES } from "../lib/errors.js";

export const MEAL_DESCRIPTION_MAX_LENGTH = 1000;

// Keep in sync with CONDIMENTS in frontend/lib/constants.ts.
export const CONDIMENT_IDS = [
  "patis",
  "bagoong",
  "toyomansi",
  "soy-sauce",
  "banana-ketchup",
  "salt",
] as const;

export type CondimentId = (typeof CONDIMENT_IDS)[number];

export const CONDIMENT_LABELS: Record<CondimentId, string> = {
  patis: "Patis (fish sauce)",
  bagoong: "Bagoong",
  toyomansi: "Toyomansi",
  "soy-sauce": "Soy sauce",
  "banana-ketchup": "Banana ketchup",
  salt: "Salt",
};

export const CondimentIdSchema = z.enum(CONDIMENT_IDS);

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const;

export const MealTypeSchema = z.enum(MEAL_TYPES);

export const MealSchema = z
  .strictObject({
    description: z
      .string()
      .trim()
      .min(3, ERROR_MESSAGES.VALIDATION.MEAL_SCHEMA.DESC_REQUIRED)
      .max(
        MEAL_DESCRIPTION_MAX_LENGTH,
        ERROR_MESSAGES.VALIDATION.MEAL_SCHEMA.DESC_TOO_LONG,
      ),
    mealType: MealTypeSchema.optional(),
    isSoup: z.boolean(),
    consumedSoup: z.boolean().optional(),
    // Condiment IDs.
    ingredients: z.array(CondimentIdSchema).max(CONDIMENT_IDS.length),
  })
  .refine((data) => !data.isSoup || data.consumedSoup !== undefined, {
    error: ERROR_MESSAGES.VALIDATION.MEAL_SCHEMA.CONSUMED_REQUIRED,
    path: ["consumedSoup"],
  });

export type MealType = z.infer<typeof MealSchema>;
