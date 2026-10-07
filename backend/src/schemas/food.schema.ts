import z from "zod";

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

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export const FoodListQuerySchema = z.strictObject({
  q: z.string().trim().min(1).max(100).optional(),
  category: z.enum(FOOD_CATEGORIES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type FoodListQuery = z.infer<typeof FoodListQuerySchema>;

export type FoodListItem = {
  id: string;
  name: string;
  category: FoodCategory;
  serving: { size: number; unit: string };
  /** Amounts in one serving. */
  nutrients: {
    energyKcal: number;
    sodiumMg: number;
    potassiumMg: number;
    phosphorusMg: number;
    proteinG: number;
    fluidMl: number;
  };
  source: string;
};

export type FoodListResponse = {
  items: FoodListItem[];
  hasMore: boolean;
};
