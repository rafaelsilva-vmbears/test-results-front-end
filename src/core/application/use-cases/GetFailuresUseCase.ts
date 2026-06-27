import type { FailureItem } from "@domain/test-results/types";
import type { GetFailuresParams } from "@infrastructure/api/test-results/TestResultsApiClient";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";

export class GetFailuresUseCase {
  constructor(private readonly testResultsApiClient: TestResultsApiClient) { }

  async execute(params: GetFailuresParams): Promise<FailureItem[]> {
    return this.testResultsApiClient.getFailures(params);
  }
}
