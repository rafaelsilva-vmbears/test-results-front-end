import { TestResultsApiClient, GetFailuresParams } from "@infrastructure/api/test-results/TestResultsApiClient";
import { FlakyTestSummary } from "@domain/test-results/types";

export class GetFlakyTestsUseCase {
  constructor(private readonly apiClient: TestResultsApiClient) {}

  async execute(params: GetFailuresParams): Promise<FlakyTestSummary[]> {
    return this.apiClient.getFlakyTests(params);
  }
}
