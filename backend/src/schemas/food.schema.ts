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
