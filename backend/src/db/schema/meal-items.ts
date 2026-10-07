import { sql } from "drizzle-orm";
import { check, index, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { mealItemSourceEnum } from "./enums.js";
import { foods } from "./foods.js";
import { meals } from "./meals.js";

// Food name, serving and nutrient values are copied from `foods` when the item is saved,
// so later edits to the food database don't change what a patient already logged.
// RLS with no policies: only the owning role (the backend) can access this table.
export const mealItems = pgTable(
  "meal_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mealId: uuid("meal_id")
      .notNull()
      .references(() => meals.id, { onDelete: "cascade" }),
    foodId: uuid("food_id").references(() => foods.id, { onDelete: "restrict" }),
    source: mealItemSourceEnum("source").notNull(),

    foodName: text("food_name").notNull(),
    servingSize: numeric("serving_size", { precision: 8, scale: 2, mode: "number" }).notNull(),
    servingUnit: text("serving_unit").notNull(),
    servings: numeric("servings", { precision: 6, scale: 2, mode: "number" }).notNull(),

    // Per serving, like `foods`.
    energyKcal: numeric("energy_kcal", { precision: 8, scale: 1, mode: "number" }).notNull(),
    sodiumMg: numeric("sodium_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    potassiumMg: numeric("potassium_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    phosphorusMg: numeric("phosphorus_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    proteinG: numeric("protein_g", { precision: 6, scale: 1, mode: "number" }).notNull(),
    fluidMl: numeric("fluid_ml", { precision: 8, scale: 1, mode: "number" }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("meal_items_meal_idx").on(t.mealId),
    index("meal_items_food_idx").on(t.foodId),
    check("meal_items_database_has_food", sql`${t.source} <> 'DATABASE' OR ${t.foodId} IS NOT NULL`),
    check("meal_items_servings_positive", sql`${t.servings} > 0`),
    check("meal_items_serving_size_positive", sql`${t.servingSize} > 0`),
    check(
      "meal_items_nutrients_non_negative",
      sql`${t.energyKcal} >= 0 AND ${t.sodiumMg} >= 0 AND ${t.potassiumMg} >= 0 AND ${t.phosphorusMg} >= 0 AND ${t.proteinG} >= 0 AND ${t.fluidMl} >= 0`,
    ),
  ],
).enableRLS();

export type MealItem = typeof mealItems.$inferSelect;
export type NewMealItem = typeof mealItems.$inferInsert;
