import { sql } from "drizzle-orm";
import { check, date, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { guidelineNutrientEnum } from "./enums.js";

// One daily reference amount per nutrient, applied to every patient.
// RLS with no policies: only the owning role (the backend) can access this table.
export const nutrientGuidelines = pgTable(
  "nutrient_guidelines",
  {
    nutrient: guidelineNutrientEnum("nutrient").primaryKey(),
    dailyValue: numeric("daily_value", { precision: 8, scale: 1, mode: "number" }).notNull(),
    source: text("source").notNull(),
    effectiveDate: date("effective_date", { mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("nutrient_guidelines_daily_value_positive", sql`${t.dailyValue} > 0`)],
).enableRLS();

export type NutrientGuideline = typeof nutrientGuidelines.$inferSelect;
export type NewNutrientGuideline = typeof nutrientGuidelines.$inferInsert;
