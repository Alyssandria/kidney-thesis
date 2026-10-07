import { sql } from "drizzle-orm";
import { boolean, check, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { foodCategoryEnum } from "./enums.js";

// Nutrient values are per serving (servingSize × servingUnit), not per 100 g.
// RLS with no policies: only the owning role (the backend) can access this table.
export const foods = pgTable(
  "foods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    category: foodCategoryEnum("category").notNull(),

    servingSize: numeric("serving_size", { precision: 8, scale: 2, mode: "number" }).notNull(),
    servingUnit: text("serving_unit").notNull(),

    energyKcal: numeric("energy_kcal", { precision: 8, scale: 1, mode: "number" }).notNull(),
    sodiumMg: numeric("sodium_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    potassiumMg: numeric("potassium_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    phosphorusMg: numeric("phosphorus_mg", { precision: 8, scale: 1, mode: "number" }).notNull(),
    proteinG: numeric("protein_g", { precision: 6, scale: 1, mode: "number" }).notNull(),
    fluidMl: numeric("fluid_ml", { precision: 8, scale: 1, mode: "number" }).notNull().default(0),

    source: text("source").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check("foods_serving_size_positive", sql`${t.servingSize} > 0`),
    check(
      "foods_nutrients_non_negative",
      sql`${t.energyKcal} >= 0 AND ${t.sodiumMg} >= 0 AND ${t.potassiumMg} >= 0 AND ${t.phosphorusMg} >= 0 AND ${t.proteinG} >= 0 AND ${t.fluidMl} >= 0`,
    ),
  ],
).enableRLS();

export type Food = typeof foods.$inferSelect;
export type NewFood = typeof foods.$inferInsert;
