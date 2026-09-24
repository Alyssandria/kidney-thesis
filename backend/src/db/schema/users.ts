import { sql } from "drizzle-orm";
import { boolean, check, pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";

// RLS with no policies: only the owning role (the backend) can access this table.
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    displayName: text("display_name"),
    ckdStage: smallint("ckd_stage").notNull(),
    isDialysis: boolean("is_dialysis").notNull().default(false),
    timezone: text("timezone").notNull().default("Asia/Manila"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("users_ckd_stage_range", sql`${t.ckdStage} BETWEEN 1 AND 5`)],
).enableRLS();

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
