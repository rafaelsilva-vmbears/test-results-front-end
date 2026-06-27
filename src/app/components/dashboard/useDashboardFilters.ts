import { useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type DashboardFilters as DashboardFiltersType } from "@application/use-cases/GetDashboardDataUseCase";
import { Project, Environment } from "@domain/project-management/types";

interface UseDashboardFiltersProps {
    initialFilters: DashboardFiltersType;
    projects?: Project[];
    environments?: Environment[];
}

export function useDashboardFilters({
    initialFilters,
    projects = [],
    environments = [],
}: UseDashboardFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Local state for filters
    const [project, setProjectState] = useState(initialFilters.project);
    const [environment, setEnvironmentState] = useState(initialFilters.environment);
    const [startDate, setStartDateState] = useState<string | null>(
        initialFilters.start_date
    );
    const [endDate, setEndDateState] = useState<string | null>(
        initialFilters.end_date
    );
    const [limit, setLimitState] = useState(initialFilters.limit ?? 20);

    const updateUrl = useCallback(
        (
            currentProject: string,
            currentEnvironment: string,
            currentStartDate: string | null,
            currentEndDate: string | null,
            currentLimit: number
        ) => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());

                if (currentProject) params.set("project", currentProject);
                else params.delete("project");

                if (currentEnvironment) params.set("environment", currentEnvironment);
                else params.delete("environment");

                if (currentStartDate) params.set("start_date", currentStartDate);
                else params.delete("start_date");

                if (currentEndDate) params.set("end_date", currentEndDate);
                else params.delete("end_date");

                if (currentLimit) params.set("limit", String(currentLimit));
                else params.delete("limit");

                router.push(`/?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    const applyFilters = useCallback(() => {
        updateUrl(project, environment, startDate, endDate, limit);
    }, [project, environment, startDate, endDate, limit, updateUrl]);

    const clearFilters = useCallback(() => {
        startTransition(() => {
            router.push("/");
            // Reset to default values or first available options
            setProjectState(projects[0]?.id || "");
            setEnvironmentState(environments[0]?.id || "");
            setStartDateState(initialFilters.start_date);
            setEndDateState(initialFilters.end_date);
            setLimitState(initialFilters.limit ?? 20);
        });
    }, [router, projects, environments, initialFilters]);

    // Specific setters handling dependencies (like auto-update on project change)
    const setProject = useCallback(
        (newProject: string) => {
            setProjectState(newProject);
            // Automatically update URL when project changes (as per original logic)
            updateUrl(newProject, environment, startDate, endDate, limit);
        },
        [environment, startDate, endDate, limit, updateUrl]
    );

    const setEnvironment = (newEnvironment: string) =>
        setEnvironmentState(newEnvironment);

    const setStartDate = (date: string | null) => setStartDateState(date);

    const setEndDate = (date: string | null) => setEndDateState(date);

    const setLimit = (newLimit: number) => setLimitState(newLimit);

    return {
        // State
        filters: {
            project,
            environment,
            startDate,
            endDate,
            limit
        },
        isPending,

        // Actions
        setProject,
        setEnvironment,
        setStartDate,
        setEndDate,
        setLimit,
        applyFilters,
        clearFilters,
    };
}
