import { MetricsSummary } from "@domain/test-results/types";

export type TestDistribution = {
    label: string;
    value: number;
    color: string;
}[];

export class DashboardStatsCalculator {
    static calculateTestDistribution(summary: MetricsSummary | null): TestDistribution {
        const totalTests = summary?.total_tests || 0;
        const avgPassRate = summary?.avg_pass_rate || 0;
        const avgFailures = summary?.avg_failures || 0;

        // Business Logic: Calculate passed tests based on pass rate percentage
        const passedTests = Math.round(totalTests * (avgPassRate / 100));

        // Business Logic: Use explicit average failures
        const failedTests = avgFailures;

        // Business Logic: Remainder are skipped
        const skippedTests = Math.max(0, totalTests - passedTests - failedTests);

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
