"use client";

import { Box, Flex, Grid, GridItem, Heading, Text, Icon, Badge } from "@chakra-ui/react";
import { MdAnalytics } from "react-icons/md";
import type { MetricsSummary, ExecutionListItem, FlakyTestSummary, ModuleHealthSummary, CommonErrorSummary } from "@domain/test-results/types";
import { DashboardFilters as DashboardFiltersType, DashboardData } from "@application/use-cases/GetDashboardDataUseCase";

// Mocks to avoid complex imports during migration, we will build these next
// import DashboardFilters from "./DashboardFilters";
// import { SummaryCards } from "./DashboardSummaryCards";
import { TestDistributionChart } from "./TestDistributionChart";
import { TestStatusOverTimeChart } from "./TestStatusOverTimeChart";
import { ExecutionsListTable } from "./ExecutionsListTable";
import { FailuresTable } from "./FailuresTable";
import { CommonErrorsTable } from "./CommonErrorsTable";
import { SlowestTestsTable } from "./SlowestTestsTable";

import { DashboardFilters } from "./DashboardFilters";
import { SummaryCards } from "./SummaryCards";
import StabilityAnalysis from "./StabilityAnalysis";
import { DailyTrendsChart } from "./DailyTrendsChart";

interface DashboardClientProps {
  filters: DashboardFiltersType;
  summaryToRender: MetricsSummary;
  testDistributionData: Array<{ label: string; value: number; color: string }>;
  executions: ExecutionListItem[];
  dashboardData: DashboardData;
  flakyTests: FlakyTestSummary[];
  moduleHealth: ModuleHealthSummary[];
  commonErrors: CommonErrorSummary[];
  projectManagementData: { projects: Array<{ id: string; name: string }>; environments: Array<{ id: string; name: string }> };
  mttr?: import("@domain/test-results/types").MTTRSummary | null;
  performanceMetrics?: import("@domain/test-results/types").PerformanceMetricsSummary | null;
  trends?: import("@domain/test-results/types").TrendSummary[] | null;
}

export default function DashboardClient({
  filters,
  summaryToRender,
  testDistributionData,
  executions,
  dashboardData,
  flakyTests,
  moduleHealth,
  commonErrors,
  projectManagementData,
  mttr,
  performanceMetrics,
  trends
}: DashboardClientProps) {

  return (
    <Box>
      {/* Header */}
      <Flex align="center" mb={10} justify="space-between" flexWrap="wrap" gap={4}>
        <Flex align="center">
          <Flex
            w={12}
            h={12}
            align="center"
            justify="center"
            bgGradient="linear(to-br, blue.400, purple.600)"
            color="white"
            borderRadius="xl"
            boxShadow="md"
            mr={4}
          >
            <Icon as={MdAnalytics} boxSize={6} />
          </Flex>
          <Box>
            <Heading size="lg" color="gray.800" letterSpacing="tight">Dashboard</Heading>
            <Text color="gray.500" fontSize="sm">Visão geral das execuções de testes do período selecionado.</Text>
          </Box>
        </Flex>

      </Flex>

      {/* Filters Area */}
      <DashboardFilters currentFilters={filters} projectManagementData={projectManagementData} />

      {!filters.project ? (
        <Box textAlign="center" py={20} bg="white" borderRadius="xl" border="1px" borderColor="gray.200" mt={10}>
          <Heading size="md" color="gray.600" mb={4}>Nenhum projeto selecionado ou encontrado</Heading>
          <Text color="gray.500">
            Parece que não há dados de projeto disponíveis no banco de dados ainda. 
            Comece executando seus testes e enviando os resultados via API.
          </Text>
        </Box>
      ) : (
        <>
          <Heading size="md" mb={4} color="gray.800">Métricas Gerais</Heading>
          {/* Stats Cards */}
          <SummaryCards 
            summary={summaryToRender} 
            mttr={mttr} 
            performanceMetrics={performanceMetrics} 
          />

          <Grid templateColumns="1fr" gap={8} mb={8}>
            <GridItem>
              <TestDistributionChart data={testDistributionData} />
            </GridItem>
            <GridItem>
              <TestStatusOverTimeChart executions={executions} />
            </GridItem>
            {trends && trends.length > 0 && (
              <GridItem>
                <DailyTrendsChart trends={trends} />
              </GridItem>
            )}
          </Grid>

          <StabilityAnalysis flakyTests={flakyTests} moduleHealth={moduleHealth} />

          <Box mt={10}>
            <CommonErrorsTable errors={commonErrors || []} />
          </Box>

          {performanceMetrics && performanceMetrics.slowest_tests && performanceMetrics.slowest_tests.length > 0 && (
            <Box mt={10}>
              <SlowestTestsTable slowestTests={performanceMetrics.slowest_tests} />
            </Box>
          )}

          <Box mt={10}>
            <FailuresTable failures={dashboardData.failures || []} />
          </Box>

          <Box mt={10}>
            <ExecutionsListTable executions={executions} />
          </Box>
        </>
      )}
    </Box>
  );
}
