import type { CommonErrorSummary } from "@domain/test-results/types";
import type { GetCommonErrorsParams } from "@infrastructure/api/test-results/TestResultsApiClient";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";

export class GetCommonErrorsUseCase {
  constructor(private readonly testResultsApiClient: TestResultsApiClient) {}

  async execute(params: GetCommonErrorsParams): Promise<CommonErrorSummary[]> {
    return this.testResultsApiClient.getCommonErrors(params);
  }
}
