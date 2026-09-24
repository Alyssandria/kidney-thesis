import { api } from "@/lib/config";
import { DashboardSummary, DashboardSummarySchema } from "@/schemas/dashboardSummary";

export async function getDashboardSummary(range: {
  from: string;
  to: string;
}): Promise<DashboardSummary> {
  const { data } = await api.get<unknown>("/dashboard/summary", { params: range });
  return DashboardSummarySchema.parse(data);
}
