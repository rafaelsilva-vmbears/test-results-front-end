import type { MetricsSummary } from "@domain/test-results/types";
import type { GetMetricsSummaryParams } from "@infrastructure/api/test-results/TestResultsApiClient";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";

export class GetMetricsSummaryUseCase {
  constructor(private readonly testResultsApiClient: TestResultsApiClient) { }

  async execute(
    params: GetMetricsSummaryParams
  ): Promise<MetricsSummary | null> {
    return this.testResultsApiClient.getMetricsSummary(params);
  }
}
