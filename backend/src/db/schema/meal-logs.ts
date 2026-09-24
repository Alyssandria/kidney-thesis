import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { CondimentId } from "../../schemas/meal.schema.js";
import type { MealAnalysisResponse } from "../../schemas/prompt-analysis.schema.js";
import { mealTypeEnum, nutrientLevelEnum, proteinLevelEnum } from "./enums.js";
import { users } from "./users.js";

// RLS with no policies: only the owning role (the backend) can access this table.
export const mealLogs = pgTable(
  "meal_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

    description: text("description").notNull(),
    mealType: mealTypeEnum("meal_type"),
    isSoup: boolean("is_soup").notNull(),
    consumedSoup: boolean("consumed_soup"),
    condiments: text("condiments")
      .array()
      .$type<CondimentId[]>()
      .notNull()
      .default(sql`'{}'::text[]`),

    // Snapshot of the patient profile at analysis time.
    ckdStage: smallint("ckd_stage").notNull(),
    isDialysis: boolean("is_dialysis").notNull(),

    // Denormalized from `analysis` for aggregation.
    sodiumLevel: nutrientLevelEnum("sodium_level").notNull(),
    potassiumLevel: nutrientLevelEnum("potassium_level").notNull(),
    phosphorusLevel: nutrientLevelEnum("phosphorus_level").notNull(),
    proteinLevel: proteinLevelEnum("protein_level").notNull(),

    analysis: jsonb("analysis").$type<MealAnalysisResponse>().notNull(),
    model: text("model").notNull(),
    promptVersion: text("prompt_version").notNull(),
  },
  (t) => [
    index("meal_logs_user_created_idx").on(t.userId, t.createdAt),
    check("meal_logs_ckd_stage_range", sql`${t.ckdStage} BETWEEN 1 AND 5`),
  ],
).enableRLS();

export type MealLog = typeof mealLogs.$inferSelect;
export type NewMealLog = typeof mealLogs.$inferInsert;
