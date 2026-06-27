import { TestResultsApiClient, GetFailuresParams } from "@infrastructure/api/test-results/TestResultsApiClient";
import { ModuleHealthSummary } from "@domain/test-results/types";

export class GetModuleHealthUseCase {
  constructor(private readonly apiClient: TestResultsApiClient) {}

  async execute(params: GetFailuresParams): Promise<ModuleHealthSummary[]> {
    return this.apiClient.getModuleHealth(params);
  }
}
