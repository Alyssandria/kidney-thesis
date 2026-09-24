import { computeMealSummary } from "../dashboard/meal-metrics.js";
import { findMealMetricRows } from "../repositories/meal-log.repository.js";
import { findUserTimezone } from "../repositories/user.repository.js";
import type {
  DashboardSummaryQuery,
  DashboardSummaryResponse,
} from "../schemas/dashboard.schema.js";

export async function getDashboardSummary(
  userId: string,
  { from, to }: DashboardSummaryQuery,
): Promise<DashboardSummaryResponse> {
  const [timezone, rows] = await Promise.all([
    findUserTimezone(userId),
    findMealMetricRows(userId, { from: new Date(from), to: new Date(to) }),
  ]);

  if (!timezone) {
    throw new Error(`User ${userId} not found while building dashboard summary`);
  }

  return { ...computeMealSummary(rows, timezone), timezone };
}
