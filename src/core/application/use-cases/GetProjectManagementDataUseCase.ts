import type { Project, Environment } from "@domain/project-management/types";
import { IProjectManagementRepository } from "@application/ports/IProjectManagementRepository";

/**
 * Interface para os dados retornados pelo caso de uso.
 */
export type ProjectManagementData = {
  projects: Project[];
  environments: Environment[];
};

/**
 * Caso de uso para obter dados de gerenciamento de projetos e ambientes.
 * Abstrai a fonte dos dados (API real ou mock).
 */
export class GetProjectManagementDataUseCase {
  constructor(private repository: IProjectManagementRepository) { }

  async execute(): Promise<ProjectManagementData> {
    const [projects, environments] = await Promise.all([
      this.repository.getProjects(),
      this.repository.getEnvironments(),
    ]);

    return { projects, environments };
  }
}
