import { IProjectManagementRepository } from "@application/ports/IProjectManagementRepository";
import { Environment, Project } from "@domain/project-management/types";
import { TestResultsApiClient } from "../api/test-results/TestResultsApiClient";

export class ApiProjectManagementRepository implements IProjectManagementRepository {
    constructor(private readonly apiClient: TestResultsApiClient) { }

    async getProjects(): Promise<Project[]> {
        const projects = await this.apiClient.getProjects({ limit: 50 });
        return projects.map((p) => ({
            id: p.id,
            name: p.name,
            environments: p.environments?.map((env) => ({
                id: env.name.toLowerCase(),
                name: env.name,
                label: env.name.toUpperCase(),
            })),
        }));
    }

    async getEnvironments(): Promise<Environment[]> {
        const projects = await this.apiClient.getProjects({ limit: 50 });

        // Extract unique environments from all projects
        const environmentsMap = new Map<string, Environment>();

        for (const project of projects) {
            if (project.environments) {
                for (const env of project.environments) {
                    const envId = env.name.toLowerCase();

                    if (!environmentsMap.has(envId)) {
                        environmentsMap.set(envId, {
                            id: envId,
                            name: env.name, // Or capitalize/format as needed
                            label: env.name.toUpperCase(), // Example formatting
                        });
                    }
                }
            }
        }

        return Array.from(environmentsMap.values());
    }
}
