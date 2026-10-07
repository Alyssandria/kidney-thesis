/** How a meal was logged: picked from the food database, or described in words and broken down by AI. */
export const MEAL_ENTRY_METHODS = ["SEARCH", "DESCRIBE"] as const;
export type MealEntryMethod = (typeof MEAL_ENTRY_METHODS)[number];

/** Where an item's nutrient values came from. */
export const MEAL_ITEM_SOURCES = ["DATABASE", "AI_ESTIMATE"] as const;
export type MealItemSource = (typeof MEAL_ITEM_SOURCES)[number];
