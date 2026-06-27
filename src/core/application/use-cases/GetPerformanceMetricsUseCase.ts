import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import { PerformanceMetricsSummary } from "@domain/test-results/types";
import { DashboardFilters } from "./GetDashboardDataUseCase";

export class GetPerformanceMetricsUseCase {
  constructor(private readonly apiClient: TestResultsApiClient) {}

  async execute(filters: DashboardFilters): Promise<PerformanceMetricsSummary> {
    if (!filters.project) {
      throw new Error("Project must be provided.");
    }

    const { project, environment, start_date, end_date } = filters;

    return this.apiClient.getPerformanceMetrics({
      project,
      environment: environment || "dev", // Default environment se não especificado
      start_date,
      end_date,
    });
  }
}
