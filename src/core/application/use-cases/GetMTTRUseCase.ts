import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import { MTTRSummary } from "@domain/test-results/types";
import { DashboardFilters } from "./GetDashboardDataUseCase";

export class GetMTTRUseCase {
  constructor(private readonly apiClient: TestResultsApiClient) {}

  async execute(filters: DashboardFilters): Promise<MTTRSummary> {
    if (!filters.project) {
      throw new Error("Project must be provided.");
    }

    const { project, environment, start_date, end_date } = filters;

    return this.apiClient.getMTTR({
      project,
      environment: environment || "dev", // Default environment
      start_date,
      end_date,
    });
  }
}
