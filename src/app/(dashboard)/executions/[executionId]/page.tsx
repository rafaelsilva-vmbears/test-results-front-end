import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import type { ExecutionListItem } from "@domain/test-results/types";
import { GetExecutionByIdUseCase } from "@application/use-cases/GetExecutionByIdUseCase";
import ExecutionDetailsClientNoSSR from "@/components/executions/ExecutionDetailsClientNoSSR";

export const revalidate = 0;

interface ExecutionDetailsPageProps {
  params: Promise<{ executionId: string }>;
}

export default async function ExecutionDetailsPage(
  props: ExecutionDetailsPageProps
) {
  const { executionId } = await props.params;

  if (!executionId) {
    notFound();
  }

  const apiClient = new TestResultsApiClient();
  const getExecutionByIdUseCase = new GetExecutionByIdUseCase(apiClient);

  let executionData: ExecutionListItem | null = null;
  try {
    const { execution } = await getExecutionByIdUseCase.execute(executionId);
    executionData = execution;
  } catch (error) {
    console.error("Erro ao buscar execução:", error);
    notFound();
  }

  if (!executionData) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ExecutionDetailsClientNoSSR execution={executionData} />
    </Suspense>
  );
}
