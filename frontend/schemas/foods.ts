import z from "zod";
import { FoodCategorySchema } from "./nutrition";

export const FoodSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: FoodCategorySchema,
  serving: z.object({ size: z.number().positive(), unit: z.string() }),
  /** Amounts in one serving. */
  nutrients: z.object({
    energyKcal: z.number(),
    sodiumMg: z.number(),
    potassiumMg: z.number(),
    phosphorusMg: z.number(),
    proteinG: z.number(),
    fluidMl: z.number(),
  }),
  source: z.string(),
});

export const FoodListResponseSchema = z.object({
  items: z.array(FoodSchema),
  hasMore: z.boolean(),
});

export type Food = z.infer<typeof FoodSchema>;
export type FoodListResponse = z.infer<typeof FoodListResponseSchema>;
