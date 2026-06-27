import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import { TrendSummary } from "@domain/test-results/types";
import { DashboardFilters } from "./GetDashboardDataUseCase";

export class GetTrendsUseCase {
  constructor(private readonly apiClient: TestResultsApiClient) {}

  async execute(filters: DashboardFilters): Promise<TrendSummary[]> {
    if (!filters.project) {
      throw new Error("Project must be provided.");
    }

    const { project, environment, start_date, end_date } = filters;

    return this.apiClient.getTrends({
      project,
      environment: environment || "dev", // Default environment
      start_date,
      end_date,
    });
  }
}
