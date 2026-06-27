import { ApiError } from "../ApiError";
import type {
  MetricsSummary,
  FailureItem,
  ExecutionListItem,
  FlakyTestSummary,
  ModuleHealthSummary,
  TrendSummary,
  MTTRSummary,
  CommonErrorSummary,
  PerformanceMetricsSummary,
} from "@domain/test-results/types";

const BASE_URL = process.env.NEXT_PUBLIC_TEST_RESULTS_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

if (!BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_TEST_RESULTS_API_URL is not defined in .env.local"
  );
}
if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_API_KEY is not defined in .env.local");
}

type ErrorResponse =
  | {
    error?: {
      message: string;
      status_code?: number;
      path?: string;
      type?: string;
      timestamp?: string;
    };
  }
  | { detail: { loc: (string | number)[]; msg: string; type: string }[] };

export type ListExecutionsParams = {
  project: string;
  environment: string;
  start_date: string; // dd/mm/yyyy
  end_date: string; // dd/mm/yyyy
  limit?: number; // 1-500, default 50
};

export type GetMetricsSummaryParams = {
  project: string;
  environment: string;
  start_date: string; // dd/mm/yyyy
  end_date: string; // dd/mm/yyyy
};

export type GetFailuresParams = {
  project: string;
  environment: string;
  start_date: string; // dd/mm/yyyy
  end_date: string; // dd/mm/yyyy
};

export type GetCommonErrorsParams = {
  project: string;
  environment: string;
  start_date: string; // dd/mm/yyyy
  end_date: string; // dd/mm/yyyy
};

export class TestResultsApiClient {
  private async request<T>(
    path: string,
    options?: RequestInit,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryParams?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const res = await fetch(url.toString(), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let parsed: ErrorResponse | undefined;
      try {
        parsed = await res.json();
      } catch (e) {
        // Se não conseguir parsear JSON, cria um erro genérico
        throw new ApiError(
          `API returned an error, but response was not valid JSON. Status: ${res.status
          } - error: ${e instanceof Error ? e.message : "Unknown error"}`,
          {
            statusCode: res.status,
            path: path,
            type: "UnknownError",
          }
        );
      }

      if (parsed && "error" in parsed && parsed.error) {
        throw new ApiError(parsed.error.message, {
          statusCode: parsed.error.status_code ?? res.status,
          path: parsed.error.path ?? path,
          type: parsed.error.type,
          timestamp: parsed.error.timestamp,
        });
      }
      // Trata erros do tipo { detail: [{ msg: "..." }] } (erros de validação FastAPI)
      else if (parsed && "detail" in parsed && parsed.detail.length > 0) {
        const messages = parsed.detail.map((d) => d.msg).join("; ");
        throw new ApiError(`Validation Error: ${messages}`, {
          statusCode: res.status,
          path: path,
          type: "ValidationError",
        });
      } else {
        // Erro genérico se o formato não for reconhecido
        throw new ApiError(`API Error: ${res.statusText || "Unknown error"}`, {
          statusCode: res.status,
          path: path,
          type: "GenericError",
        });
      }
    }

    return res.json();
  }

  /**
   * Lista execuções de testes filtradas por projeto, ambiente e período.
   * @param params Parâmetros de filtro.
   * @returns Uma lista de ExecutionListItem.
   */
  async listExecutions(
    params: ListExecutionsParams
  ): Promise<ExecutionListItem[]> {
    const { project, environment, start_date, end_date, limit } = params;
    return this.request<ExecutionListItem[]>(
      "/executions",
      { method: "GET" },
      {
        project,
        environment,
        start_date,
        end_date,
        limit,
      }
    );
  }

  /**
   * Obtém os detalhes de uma execução de teste específica pelo seu ID.
   * @param executionId O ID da execução a ser buscada.
   * @returns Um objeto ExecutionListItem contendo os detalhes da execução.
   */
  async getExecutionById(executionId: string): Promise<ExecutionListItem> {
    return this.request<ExecutionListItem>(`/executions/${executionId}`, {
      method: "GET",
    });
  }

  /**
   * Obtém um resumo das métricas de um projeto.
   * @param params Parâmetros de filtro.
   * @returns Um objeto MetricsSummary ou null se não houver dados.
   */
  async getMetricsSummary(
    params: GetMetricsSummaryParams
  ): Promise<MetricsSummary | null> {
    const { project, environment, start_date, end_date } = params;

    return this.request<MetricsSummary | null>(
      "/metrics/summary",
      { method: "GET" },
      {
        project,
        environment,
        start_date,
        end_date,
      }
    );
  }

  /**
   * Lista testes com falhas agrupadas por nome.
   * @param params Parâmetros de filtro.
   * @returns Uma lista de FailureItem.
   */
  async getFailures(params: GetFailuresParams): Promise<FailureItem[]> {
    const { project, environment, start_date, end_date } = params;
    return this.request<FailureItem[]>(
      "/metrics/failures",
      { method: "GET" },
      {
        project,
        environment,
        start_date,
        end_date,
      }
    );
  }

  /**
   * Obtém os testes instáveis (flaky tests) de um projeto.
   */
  async getFlakyTests(params: GetFailuresParams): Promise<FlakyTestSummary[]> {
    const { project, environment, start_date, end_date } = params;
    return this.request<FlakyTestSummary[]>(
      "/metrics/flaky-tests",
      { method: "GET" },
      { project, environment, start_date, end_date }
    );
  }

  /**
   * Obtém a saúde dos módulos de um projeto.
   */
  async getModuleHealth(params: GetFailuresParams): Promise<ModuleHealthSummary[]> {
    const { project, environment, start_date, end_date } = params;
    return this.request<ModuleHealthSummary[]>(
      "/metrics/module-health",
      { method: "GET" },
      { project, environment, start_date, end_date }
    );
  }

  /**
   * Obtém a evolução temporal (trends).
   */
  async getTrends(params: GetFailuresParams): Promise<TrendSummary[]> {
    const { project, environment, start_date, end_date } = params;
    return this.request<TrendSummary[]>(
      "/metrics/trends",
      { method: "GET" },
      { project, environment, start_date, end_date }
    );
  }

  /**
   * Obtém a lista de casos de teste.
   */
  async getTestCases(params: { project: string; environment: string }): Promise<string[]> {
    const { project, environment } = params;
    return this.request<string[]>(
      "/metrics/test-cases",
      { method: "GET" },
      { project, environment }
    );
  }

  /**
   * Obtém o MTTR.
   */
  async getMTTR(params: GetFailuresParams): Promise<MTTRSummary> {
    const { project, environment, start_date, end_date } = params;
    return this.request<MTTRSummary>(
      "/metrics/mttr",
      { method: "GET" },
      { project, environment, start_date, end_date }
    );
  }

  /**
   * Obtém os erros comuns (agrupados por mensagem).
   */
  async getCommonErrors(params: GetCommonErrorsParams): Promise<CommonErrorSummary[]> {
    return this.request<CommonErrorSummary[]>(
      "/metrics/common-errors",
      { method: "GET" },
      params
    );
  }

  async getPerformanceMetrics(params: GetCommonErrorsParams): Promise<PerformanceMetricsSummary> {
    return this.request<PerformanceMetricsSummary>(
      "/metrics/performance",
      { method: "GET" },
      params
    );
  }

  /**
   * Lista os projetos disponíveis.
   * @param params Parâmetros de filtro opcionais.
   * @returns Uma lista de ProjectResponseItem.
   */
  async getProjects(params?: {
    limit?: number;
    name?: string;
  }): Promise<ProjectResponseItem[]> {
    return this.request<ProjectResponseItem[]>(
      "/projects",
      { method: "GET" },
      params
    );
  }
}

export type ProjectResponseItem = {
  id: string;
  name: string;
  created_at: string;
  last_seen_at: string;
  environments: {
    name: string;
    total_runs: number;
  }[];
};
