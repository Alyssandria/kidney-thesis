import z from "zod";
import type { MealSummary } from "../dashboard/meal-metrics.js";

const MAX_RANGE_DAYS = 366;
const DAY_MS = 24 * 60 * 60 * 1000;

export const DashboardSummaryQuerySchema = z
  .strictObject({
    from: z.iso.datetime({ offset: true }),
    to: z.iso.datetime({ offset: true }),
  })
  .refine((query) => new Date(query.from) < new Date(query.to), {
    error: '"from" must be earlier than "to"',
    path: ["to"],
  })
  .refine(
    (query) => new Date(query.to).getTime() - new Date(query.from).getTime() <= MAX_RANGE_DAYS * DAY_MS,
    { error: `The range can be at most ${MAX_RANGE_DAYS} days`, path: ["to"] },
  );

export type DashboardSummaryQuery = z.infer<typeof DashboardSummaryQuerySchema>;

export type DashboardSummaryResponse = MealSummary & {
  /** Timezone used to group meals into calendar days. */
  timezone: string;
};
