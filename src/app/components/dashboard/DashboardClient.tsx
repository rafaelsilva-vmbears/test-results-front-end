"use client";

import { Box, Flex, Grid, GridItem, Heading, Text, Icon, Badge, Button } from "@chakra-ui/react";
import { MdAnalytics, MdDownload, MdPictureAsPdf } from "react-icons/md";
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

  const handleDownloadAiReport = () => {
    const aiReport = {
      metadata: {
        generated_at: new Date().toISOString(),
        project: filters.project || "all",
        environment: filters.environment || "all",
      },
      summary: summaryToRender,
      stability: {
        flaky_tests: flakyTests,
        module_health: moduleHealth,
        common_errors: commonErrors
      },
      performance: performanceMetrics,
      mttr: mttr,
      recent_failures: dashboardData.failures
    };

    const blob = new Blob([JSON.stringify(aiReport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-analysis-report-${filters.project || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header para Impressão (Oculto na tela normal) */}
      <Box display="none" sx={{ '@media print': { display: 'block', mb: 8, pb: 4, borderBottom: '2px solid', borderColor: 'gray.200' } }}>
        <Heading size="lg" color="gray.800" mb={2}>Relatório Executivo de Testes</Heading>
        <Flex gap={6}>
          <Text color="gray.600"><b>Projeto:</b> {filters.project || 'Todos'}</Text>
          <Text color="gray.600"><b>Ambiente:</b> {filters.environment || 'Todos'}</Text>
        </Flex>
        {filters.startDate && filters.endDate && (
          <Text color="gray.600" mt={1}><b>Período:</b> {filters.startDate} a {filters.endDate}</Text>
        )}
      </Box>

      {/* Header da Tela Normal (Oculto na impressão) */}
      <Flex sx={{ '@media print': { display: 'none' } }} align="center" mb={10} justify="space-between" flexWrap="wrap" gap={4}>
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

        {filters.project && (
          <Flex gap={3}>
            <Button 
              leftIcon={<MdPictureAsPdf />}
              colorScheme="gray" 
              variant="outline" 
              onClick={() => window.print()}
              boxShadow="sm"
              _hover={{ bg: "gray.50" }}
            >
              Exportar PDF
            </Button>
            <Button 
              leftIcon={<MdDownload />}
              colorScheme="blue" 
              variant="solid" 
              onClick={handleDownloadAiReport}
              boxShadow="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Exportar JSON
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Filters Area (Oculto na impressão) */}
      <Box sx={{ '@media print': { display: 'none' } }}>
        <DashboardFilters currentFilters={filters} projectManagementData={projectManagementData} />
      </Box>

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
            <GridItem sx={{ '@media print': { breakInside: 'avoid' } }}>
              <TestDistributionChart data={testDistributionData} />
            </GridItem>
            <GridItem sx={{ '@media print': { breakInside: 'avoid' } }}>
              <TestStatusOverTimeChart executions={executions} />
            </GridItem>
          </Grid>

          <Box sx={{ '@media print': { breakInside: 'avoid' } }}>
            <StabilityAnalysis flakyTests={flakyTests} moduleHealth={moduleHealth} />
          </Box>

          <Box mt={10} sx={{ '@media print': { breakInside: 'avoid', pageBreakBefore: 'always' } }}>
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
