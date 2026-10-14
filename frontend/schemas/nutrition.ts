import z from "zod";

export const NUTRIENTS = ["SODIUM", "POTASSIUM", "PHOSPHORUS", "PROTEIN", "ENERGY", "FLUID"] as const;
export const NutrientSchema = z.enum(NUTRIENTS);
export type Nutrient = z.infer<typeof NutrientSchema>;

export const NutrientUnitSchema = z.enum(["mg", "g", "kcal", "mL"]);

export const NutrientAmountsSchema = z.object({
  SODIUM: z.number(),
  POTASSIUM: z.number(),
  PHOSPHORUS: z.number(),
  PROTEIN: z.number(),
  ENERGY: z.number(),
  FLUID: z.number(),
});
export type NutrientAmounts = z.infer<typeof NutrientAmountsSchema>;

export const NutrientStatusSchema = z.enum(["WITHIN", "APPROACHING", "ABOVE", "INFO"]);
export type NutrientStatus = z.infer<typeof NutrientStatusSchema>;

export const FOOD_CATEGORIES = [
  "GRAINS",
  "PROTEIN",
  "VEGETABLES",
  "FRUIT",
  "SOUPS",
  "PROCESSED",
  "BEVERAGES",
  "MIXED_DISHES",
] as const;
export const FoodCategorySchema = z.enum(FOOD_CATEGORIES);
export type FoodCategory = z.infer<typeof FoodCategorySchema>;
