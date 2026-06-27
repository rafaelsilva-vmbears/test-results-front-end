import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import type {
  ExecutionListItem,
  MetricsSummary,
  FailureItem,
} from "@domain/test-results/types";

/**
 * Parâmetros de filtro para o dashboard.
 * Representa a configuração de consulta que o usuário pode ajustar na UI.
 */
export type DashboardFilters = {
  project: string;
  environment: string;
  start_date: string; // Formato dd/mm/yyyy
  end_date: string; // Formato dd/mm/yyyy
  limit?: number; // Quantas execuções recentes mostrar (default: 20)
};

/**
 * Dados estruturados para o dashboard.
 * Contém todas as informações necessárias para renderizar a página principal.
 */
export type DashboardData = {
  summary: MetricsSummary | null;
  executions: ExecutionListItem[];
  failures: FailureItem[];
  filters: DashboardFilters; // Inclui os filtros usados para reproduzir a consulta
};

/**
 * Caso de uso para obter todos os dados necessários para o dashboard principal.
 * Orquestra chamadas paralelas aos endpoints de métricas, execuções e falhas.
 *
 * Esta classe pertence à camada de aplicação e não conhece detalhes de infraestrutura
 * (como URLs, headers, ou implementação do HTTP client). Ela apenas coordena
 * os dados de domínio e aplica transformações de negócio.
 */
export class GetDashboardDataUseCase {
  constructor(
    private apiClient: TestResultsApiClient = new TestResultsApiClient()
  ) { }

  /**
   * Executa a consulta para obter dados do dashboard.
   * @param filters Parâmetros de filtro do usuário.
   * @returns Promise que resolve para DashboardData estruturado.
   * @throws ApiError se houver falha na comunicação com a API.
   */
  async execute(filters: DashboardFilters): Promise<DashboardData> {
    const { limit = 20, ...baseFilters } = filters;

    // Executa as 3 chamadas em paralelo para melhor performance
    const [summary, executions, failures] = await Promise.all([
      this.apiClient.getMetricsSummary(baseFilters),
      this.apiClient.listExecutions({ ...baseFilters, limit: limit }),
      this.apiClient.getFailures(baseFilters),
    ]);

    // Transformações de aplicação (lógica de negócio)
    // 1. Ordena execuções por run_number (mais recente primeiro)
    const sortedExecutions = executions.sort(
      (a, b) => b.run_number - a.run_number
    );

    // 2. Ordena falhas por frequência (mais problemáticas primeiro)
    const sortedFailures = failures.sort(
      (a, b) => b.run_numbers.length - a.run_numbers.length
    );

    // 3. Enriquecimento opcional: se summary for null, pode setar valores default
    const enrichedSummary = summary ?? {
      project: baseFilters.project,
      environment: baseFilters.environment,
      total_runs: 0,
      total_tests: 0,
      avg_pass_rate: 0,
      avg_failures: 0,
      last_run_number: 0,
      last_execution_date: null,
    };

    return {
      summary: enrichedSummary,
      executions: sortedExecutions,
      failures: sortedFailures,
      filters, // Retorna os filtros usados para que a UI possa reproduzi-los
    };
  }
}
