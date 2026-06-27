import {
  TestResultsApiClient,
  type ListExecutionsParams,
} from "@infrastructure/api/test-results/TestResultsApiClient";
import type { ExecutionListItem } from "@domain/test-results/types";

/**
 * Parâmetros para listar execuções.
 * Reutiliza ListExecutionsParams do cliente da API.
 */
export type ListExecutionsFilters = ListExecutionsParams;

/**
 * Dados retornados pelo caso de uso de listagem de execuções.
 */
export type ListExecutionsData = {
  executions: ExecutionListItem[];
  filters: ListExecutionsFilters;
};

/**
 * Caso de uso para listar execuções de testes.
 * Abstrai a lógica de busca da API e pode adicionar transformações futuras.
 */
export class ListExecutionsUseCase {
  constructor(private apiClient: TestResultsApiClient) { }

  async execute(filters: ListExecutionsFilters): Promise<ListExecutionsData> {
    const executions = await this.apiClient.listExecutions(filters);

    // Opcional: Adicionar lógica de negócio ou ordenação aqui
    const sortedExecutions = executions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      executions: sortedExecutions,
      filters,
    };
  }
}
