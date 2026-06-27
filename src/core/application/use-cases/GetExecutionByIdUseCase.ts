import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import type { ExecutionListItem } from "@domain/test-results/types";

/**
 * Dados retornados pelo caso de uso de obtenção de execução por ID.
 */
export type GetExecutionByIdData = {
  execution: ExecutionListItem;
};

/**
 * Caso de uso para obter os detalhes de uma execução de teste específica por ID.
 * Abstrai a lógica de busca da API e pode adicionar transformações futuras.
 */
export class GetExecutionByIdUseCase {
  constructor(private apiClient: TestResultsApiClient) { }

  /**
   * Executa o caso de uso para buscar os detalhes de uma execução.
   * @param executionId O ID da execução a ser buscada.
   * @returns Um objeto GetExecutionByIdData contendo os detalhes da execução.
   * @throws ApiError se a execução não for encontrada ou houver um erro na API.
   */
  async execute(executionId: string): Promise<GetExecutionByIdData> {
    const execution = await this.apiClient.getExecutionById(executionId);

    return {
      execution,
    };
  }
}
