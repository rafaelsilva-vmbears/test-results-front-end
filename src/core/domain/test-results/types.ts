/**
 * Representa um único teste dentro de uma execução.
 * Baseado em TestSchema do OpenAPI.
 */
export type Test = {
  name: string;
  status: "passed" | "failed" | "skipped" | "error"; // Assumindo estes status
  time?: number | null; // Duração do teste em segundos
  message?: string | null; // Mensagem de erro ou log
};

/**
 * Representa um item de execução simplificado para listagens.
 * Baseado em ExecutionListItemSchema do OpenAPI.
 */
export type ExecutionListItem = {
  id: string;
  project: string;
  environment: string;
  run_number: number;
  created_at: string; // Formato ISO 8601 (e.g., "2023-10-01T12:00:00Z")
  execution_date?: string | null;
  total: number;
  failures: number;
  skipped: number;
  passed?: number | null; // Pode ser nulo
  pass_rate: number;
  failure_rate: number;
  skipped_rate: number;
  tests?: Test[] | null; // Lista completa de testes (pode ser nulo)
  failed_cases?: Test[] | null; // Lista de casos falhos (pode ser nulo)
};

/**
 * Representa o resumo das métricas de um projeto.
 * Baseado em MetricsSummaryResponseSchema do OpenAPI.
 */
export type MetricsSummary = {
  project: string;
  environment: string;
  total_runs: number;
  total_tests: number;
  avg_pass_rate: number;
  avg_failures: number;
  avg_skipped?: number | null; // Torne opcional ou adicione | null
  last_run_number: number;
  last_execution_date: string | null;
  global_flakiness_rate?: number;
};
/**
 * Representa um item de falha agrupado por nome do teste.
 * Baseado em FailureItemSchema do OpenAPI.
 */
export type FailureItem = {
  name: string;
  run_numbers: number[]; // Lista de run_numbers onde este teste falhou
  last_message: string; // Última mensagem de erro para este teste
};

export type FlakyTestSummary = {
  test_name: string;
  fail_count: number;
  instability_score: number;
};

export type ModuleHealthSummary = {
  module_name: string;
  fail_count: number;
  total_tests?: number;
  failure_rate?: number;
};

export type TrendSummary = {
  date: string;
  total_runs: number;
  total_tests: number;
  avg_pass_rate: number;
  total_failures: number;
  total_skipped?: number;
};

export type MTTRSummary = {
  project: string;
  environment: string;
  mttr_hours: number;
  total_recoveries: number;
};

export type CommonErrorSummary = {
  message: string;
  count: number;
  affected_tests: string[];
  affected_runs: number[];
};

export type SlowestTestSummary = {
  test_name: string;
  avg_duration_seconds: number;
};

export type PerformanceMetricsSummary = {
  project: string;
  environment: string;
  avg_execution_time_seconds: number;
  slowest_tests: SlowestTestSummary[];
};
