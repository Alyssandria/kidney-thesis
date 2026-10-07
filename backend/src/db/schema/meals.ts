import { date, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { mealEntryMethodEnum, mealTypeEnum } from "./enums.js";
import { users } from "./users.js";

// One save from the Log food screen. A day can have several meals of the same type.
// RLS with no policies: only the owning role (the backend) can access this table.
export const meals = pgTable(
  "meals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Calendar date in the user's timezone when the meal was logged. */
    logDate: date("log_date", { mode: "string" }).notNull(),
    mealType: mealTypeEnum("meal_type").notNull(),
    entryMethod: mealEntryMethodEnum("entry_method").notNull(),
    /** The patient's own words, for meals logged by description. */
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("meals_user_log_date_idx").on(t.userId, t.logDate)],
).enableRLS();

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
