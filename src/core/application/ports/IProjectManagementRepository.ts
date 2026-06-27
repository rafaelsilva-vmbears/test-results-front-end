import type { Project, Environment } from "@domain/project-management/types";

/**
 * Interface que define o contrato para repositórios de gerenciamento de projetos.
 * Esta é a "porta" na arquitetura hexagonal.
 */
export interface IProjectManagementRepository {
  getProjects(): Promise<Project[]>;
  getEnvironments(): Promise<Environment[]>;
}
