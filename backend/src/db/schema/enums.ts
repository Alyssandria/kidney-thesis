import { pgEnum } from "drizzle-orm/pg-core";
import { FOOD_CATEGORIES } from "../../schemas/food.schema.js";
import { MEAL_TYPES } from "../../schemas/meal.schema.js";
import { NUTRIENT_LEVELS, PROTEIN_LEVELS } from "../../schemas/prompt-analysis.schema.js";

export const mealTypeEnum = pgEnum("meal_type", MEAL_TYPES);
export const nutrientLevelEnum = pgEnum("nutrient_level", NUTRIENT_LEVELS);
export const proteinLevelEnum = pgEnum("protein_level", PROTEIN_LEVELS);
export const foodCategoryEnum = pgEnum("food_category", FOOD_CATEGORIES);
