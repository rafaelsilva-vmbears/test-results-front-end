import { NextResponse } from "next/server";
import { TestResultsApiClient } from "@infrastructure/api/test-results/TestResultsApiClient";
import { ApiProjectManagementRepository } from "@infrastructure/project-management/ApiProjectManagementRepository";
import { format, subDays } from "date-fns";

const currentDate = new Date();
const dateThirtyDaysAgo = subDays(currentDate, 30);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const api = new TestResultsApiClient();
  const repo = new ApiProjectManagementRepository(api);

  try {
    let project = searchParams.get("project");
    let environment = searchParams.get("environment");

    if (!project || !environment) {
      const projects = await repo.getProjects();
      if (projects.length > 0) {
        // Se nenhum projeto foi especificado, usa o primeiro da lista
        const selectedProject = projects.find(p => p.id === project) || projects[0];
        project = selectedProject.id;

        // Tenta pegar os ambientes deste projeto específico
        const projectEnvs = selectedProject.environments || [];

        if (projectEnvs.length > 0) {
          environment = environment || projectEnvs[0].id;
        } else {
          // Fallback se o projeto não tiver ambientes listados, tenta pegar geral ou usa default
          const allEnvs = await repo.getEnvironments();
          environment = environment || allEnvs[0]?.id;
        }
      }
    }

    if (!project) {
      return NextResponse.json({ error: "No project found or specified" }, { status: 400 });
    }

    // Default environment if still missing after project check (e.g. project has no envs, though unlikely in valid setup)
    environment = environment || "rc";

    const start_date = searchParams.get("start_date") || format(currentDate, "dd/MM/yyyy");
    const end_date = searchParams.get("end_date") || format(dateThirtyDaysAgo, "dd/MM/yyyy");

    const summary = await api.getMetricsSummary({
      project,
      environment,
      start_date,
      end_date,
    });

    const executions = await api.listExecutions({
      project,
      environment,
      start_date,
      end_date,
      limit: 20,
    });

    const failures = await api.getFailures({
      project,
      environment,
      start_date,
      end_date,
    });

    return NextResponse.json({ summary, executions, failures });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
