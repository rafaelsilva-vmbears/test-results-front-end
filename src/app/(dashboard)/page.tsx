import { Suspense } from "react";
import {
  GetDashboardDataUseCase,
  type DashboardFilters as DashboardFiltersType,
} from "@application/use-cases/GetDashboardDataUseCase";

import { GetProjectManagementDataUseCase } from "@application/use-cases/GetProjectManagementDataUseCase";
import { ApiProjectManagementRepository } from "@infrastructure/project-management/ApiProjectManagementRepository";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import type { MetricsSummary } from "@domain/test-results/types";
import { GetFlakyTestsUseCase } from "@application/use-cases/GetFlakyTestsUseCase";
import { GetModuleHealthUseCase } from "@application/use-cases/GetModuleHealthUseCase";
import { GetMetricsSummaryUseCase } from "@application/use-cases/GetMetricsSummaryUseCase";
import { ListExecutionsUseCase } from "@application/use-cases/ListExecutionsUseCase";
import DashboardClientNoSSR from "@/components/dashboard/DashboardClientNoSSR";
import { format, subDays } from "date-fns";
import { DashboardStatsCalculator } from "@domain/dashboard/DashboardStatsCalculator";

const currentDate = new Date();
const dateThirtyDaysAgo = subDays(currentDate, 30);

// Filtros padrão quando não há parâmetros na URL
const DEFAULT_FILTERS: DashboardFiltersType = {
  project: "",
  environment: "rc",
  start_date: format(dateThirtyDaysAgo, "dd/MM/yyyy"),
  end_date: format(currentDate, "dd/MM/yyyy"),
  limit: 20,
};

// Objeto MetricsSummary padrão para quando não há dados
const EMPTY_SUMMARY: MetricsSummary = {
  project: DEFAULT_FILTERS.project,
  environment: DEFAULT_FILTERS.environment,
  total_runs: 0,
  total_tests: 0,
  avg_pass_rate: 0,
  avg_failures: 0,
  last_run_number: 0,
  last_execution_date: null,
  avg_skipped: 0,
};

export const revalidate = 0;

interface DashboardPageProps {
  project?: string;
  environment?: string;
  start_date?: string;
  end_date?: string;
  limit?: string;
}

export default async function DashboardPage(props: {
  searchParams: Promise<DashboardPageProps>;
}) {
  const resolvedSearchParams = (await props.searchParams) || {};

  const apiClient = new TestResultsApiClient();
  const useCase = new GetDashboardDataUseCase(apiClient);
  const projectManagementUseCase = new GetProjectManagementDataUseCase(
    new ApiProjectManagementRepository(apiClient)
  );
  const listExecutionsUseCase = new ListExecutionsUseCase(apiClient);
  const getMetricsSummaryUseCase = new GetMetricsSummaryUseCase(apiClient);
  const getFlakyTestsUseCase = new GetFlakyTestsUseCase(apiClient);
  const getModuleHealthUseCase = new GetModuleHealthUseCase(apiClient);
  const { GetCommonErrorsUseCase } = await import("@application/use-cases/GetCommonErrorsUseCase");
  const getCommonErrorsUseCase = new GetCommonErrorsUseCase(apiClient);

  const [projectManagementData] = await Promise.all([
    projectManagementUseCase.execute(),
  ]);

  const filters: DashboardFiltersType = {
    project:
      resolvedSearchParams.project ||
      projectManagementData.projects[0]?.id ||
      DEFAULT_FILTERS.project,
    environment:
      resolvedSearchParams.environment ||
      projectManagementData.environments[0]?.id ||
      DEFAULT_FILTERS.environment,
    start_date: resolvedSearchParams.start_date || DEFAULT_FILTERS.start_date,
    end_date: resolvedSearchParams.end_date || DEFAULT_FILTERS.end_date,
    limit:
      resolvedSearchParams.limit !== undefined
        ? Number(resolvedSearchParams.limit)
        : DEFAULT_FILTERS.limit,
  };

  // Se o projeto for vazio (nenhum projeto no banco e nenhum na URL), não faz as chamadas à API
  if (!filters.project) {
    return (
      <DashboardClientNoSSR
        filters={filters}
        summaryToRender={EMPTY_SUMMARY}
        testDistributionData={DashboardStatsCalculator.calculateTestDistribution(null)}
        executions={[]}
        dashboardData={{ summary: null, failures: [], executions: [], filters: filters }}
        flakyTests={[]}
        moduleHealth={[]}
        commonErrors={[]}
        projectManagementData={projectManagementData}
      />
    );
  }

  const dashboardData = await useCase.execute(filters);

  // Garante que sempre exista um summary para renderizar
  const summaryToRender: MetricsSummary =
    dashboardData.summary || EMPTY_SUMMARY;

  const { GetMTTRUseCase } = await import("@application/use-cases/GetMTTRUseCase");
  const getMTTRUseCase = new GetMTTRUseCase(apiClient);
  
  const { GetPerformanceMetricsUseCase } = await import("@application/use-cases/GetPerformanceMetricsUseCase");
  const getPerformanceMetricsUseCase = new GetPerformanceMetricsUseCase(apiClient);

  const { GetTrendsUseCase } = await import("@application/use-cases/GetTrendsUseCase");
  const getTrendsUseCase = new GetTrendsUseCase(apiClient);

  const [executionsData, metricsSummary, flakyTests, moduleHealth, commonErrors, mttr, performanceMetrics, trends] = await Promise.all([
    listExecutionsUseCase.execute(filters),
    getMetricsSummaryUseCase.execute(filters),
    getFlakyTestsUseCase.execute(filters),
    getModuleHealthUseCase.execute(filters),
    getCommonErrorsUseCase.execute(filters),
    getMTTRUseCase.execute(filters).catch(() => null), // fail gracefully
    getPerformanceMetricsUseCase.execute(filters).catch(() => null),
    getTrendsUseCase.execute(filters).catch(() => []),
  ]);

  const testDistributionData = DashboardStatsCalculator.calculateTestDistribution(metricsSummary);

  // Calcula o global_flakiness_rate de forma dinâmica usando os flakyTests recuperados
  const totalFlakyFailures = flakyTests.reduce((acc, test) => acc + (test.fail_count || 0), 0);
  const globalFlakinessRate = summaryToRender.total_tests > 0 
    ? (totalFlakyFailures / summaryToRender.total_tests) * 100 
    : 0.0;
  
  const summaryWithFlakiness = {
    ...summaryToRender,
    global_flakiness_rate: globalFlakinessRate
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardClientNoSSR
        filters={filters}
        summaryToRender={summaryWithFlakiness}
        testDistributionData={testDistributionData}
        executions={executionsData.executions}
        dashboardData={dashboardData}
        flakyTests={flakyTests}
        moduleHealth={moduleHealth}
        commonErrors={commonErrors}
        projectManagementData={projectManagementData}
        mttr={mttr}
        performanceMetrics={performanceMetrics}
        trends={trends}
      />
    </Suspense>
  );
}
