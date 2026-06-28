import { MetricsSummary } from "@domain/test-results/types";

export type TestDistribution = {
    label: string;
    value: number;
    color: string;
}[];

export class DashboardStatsCalculator {
    static calculateTestDistribution(summary: MetricsSummary | null): TestDistribution {
        const totalTests = summary?.total_tests || 0;
        const totalRuns = summary?.total_runs || 1;
        const avgFailures = summary?.avg_failures || 0;
        const avgSkipped = summary?.avg_skipped || 0;

        // Business Logic: Calcula os valores totais absolutos para o período
        const failedTests = Math.round(avgFailures * totalRuns);
        const skippedTests = Math.round(avgSkipped * totalRuns);
        
        // Os passados são o resto do total (garantindo que a soma feche exatamente no total de testes)
        const passedTests = Math.max(0, totalTests - failedTests - skippedTests);

        return [
            { label: "Passados", value: passedTests, color: "#22c55e" }, // green-500
            { label: "Falhas", value: failedTests, color: "#ef4444" },   // red-500
            {
                label: "Ignorados",
                value: skippedTests,
                color: "#eab308", // yellow-500
            },
        ];
    }
}
