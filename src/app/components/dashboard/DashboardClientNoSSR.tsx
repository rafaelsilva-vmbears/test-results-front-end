"use client";

import dynamic from "next/dynamic";
import type { DashboardFilters as DashboardFiltersType, DashboardData } from "@application/use-cases/GetDashboardDataUseCase";
import type { MetricsSummary, ExecutionListItem, FlakyTestSummary, ModuleHealthSummary, CommonErrorSummary } from "@domain/test-results/types";

// Importa dinamicamente o DashboardClient original com SSR desativado
const DashboardClient = dynamic(
  () => import("./DashboardClient"),
  { ssr: false }
);

interface DashboardClientNoSSRProps {
  filters: DashboardFiltersType;
  summaryToRender: MetricsSummary;
  testDistributionData: Array<{ label: string; value: number; color: string }>;
  executions: ExecutionListItem[];
  dashboardData: DashboardData;
  flakyTests: FlakyTestSummary[];
  moduleHealth: ModuleHealthSummary[];
  commonErrors: CommonErrorSummary[];
  projectManagementData: { projects: Array<{ id: string; name: string }>; environments: Array<{ id: string; name: string }> };
  mttr?: import("@domain/test-results/types").MTTRSummary | null;
  performanceMetrics?: import("@domain/test-results/types").PerformanceMetricsSummary | null;
  trends?: import("@domain/test-results/types").TrendSummary[] | null;
}

export default function DashboardClientNoSSR(props: DashboardClientNoSSRProps) {
  return <DashboardClient {...props} />;
}
