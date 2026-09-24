import { cache } from "react";
import { api } from "@/lib/config";
import { DashboardSummary, DashboardSummarySchema } from "@/schemas/dashboardSummary";

// Cached per request, so sections that need the same range share one call.
export const getDashboardSummary = cache(
  async (from: string, to: string): Promise<DashboardSummary> => {
    const { data } = await api.get<unknown>("/dashboard/summary", { params: { from, to } });
    return DashboardSummarySchema.parse(data);
  },
);
