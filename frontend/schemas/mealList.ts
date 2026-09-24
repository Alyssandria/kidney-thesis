import z from "zod";
import { MealTypeSchema } from "./mealFormSchema";

const NutrientLevelSchema = z.enum(["LOW", "MODERATE", "HIGH", "CRITICAL"]);

export const MealListItemSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  description: z.string(),
  mealType: MealTypeSchema.nullable(),
  isSoup: z.boolean(),
  consumedSoup: z.boolean().nullable(),
  condiments: z.array(z.string()),
  summary: z.string(),
  nutrientLevels: z.object({
    sodium: NutrientLevelSchema,
    potassium: NutrientLevelSchema,
    phosphorus: NutrientLevelSchema,
    protein: z.enum(["OPTIMAL", "TOO_LOW", "TOO_HIGH"]),
  }),
});

export const MealListResponseSchema = z.object({
  items: z.array(MealListItemSchema),
  hasMore: z.boolean(),
});

export type MealListItem = z.infer<typeof MealListItemSchema>;
export type MealListResponse = z.infer<typeof MealListResponseSchema>;
