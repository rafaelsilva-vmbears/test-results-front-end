"use client";

import { Grid, GridItem, Box, Text, Flex, Icon } from "@chakra-ui/react";
import { MdTrendingUp, MdErrorOutline, MdCheckCircleOutline, MdAccessTime, MdRemoveCircleOutline } from "react-icons/md";
import type { MetricsSummary } from "@domain/test-results/types";

interface SummaryCardsProps {
  summary: MetricsSummary;
  mttr?: import("@domain/test-results/types").MTTRSummary | null;
  performanceMetrics?: import("@domain/test-results/types").PerformanceMetricsSummary | null;
}

export function SummaryCards({ summary, mttr, performanceMetrics }: SummaryCardsProps) {
  const formatPercentage = (value: number | string | undefined | null) => {
    if (value == null) return "N/A";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return !isNaN(num) ? `${num.toFixed(1)}%` : "N/A";
  };

  const formatInteger = (value: number | string | undefined | null) => {
    if (value == null) return "N/A";
    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return !isNaN(num) ? num.toLocaleString() : "N/A";
  };

  const lastExecutionDate = summary.last_execution_date
    ? new Date(summary.last_execution_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const passRateColor =
    summary.avg_pass_rate != null && summary.avg_pass_rate >= 90
      ? "green.500"
      : summary.avg_pass_rate != null && summary.avg_pass_rate >= 70
      ? "yellow.500"
      : "red.500";

  const avgTestsPerRun = summary.total_runs > 0 ? summary.total_tests / summary.total_runs : 0;
  const failureRate = avgTestsPerRun > 0 ? (summary.avg_failures / avgTestsPerRun) * 100 : 0;
  const skippedRate = summary.avg_skipped != null && avgTestsPerRun > 0 
    ? (summary.avg_skipped / avgTestsPerRun) * 100 
    : (summary.avg_skipped == null ? null : 0);

  const cards = [
    { title: "Total de Execuções", value: formatInteger(summary.total_runs), desc: "Execuções no período", icon: MdAccessTime, color: "blue.500" },
    { title: "Total de Testes", value: formatInteger(summary.total_tests), desc: "Testes executados no total", icon: MdCheckCircleOutline, color: "blue.500" },
    { title: "Taxa de Sucesso (Média)", value: formatPercentage(summary.avg_pass_rate), desc: "Média de aprovação no período", icon: MdTrendingUp, color: passRateColor },
    { title: "Taxa de Falhas (Média)", value: formatPercentage(failureRate), desc: `Média de ~${Math.round(summary.avg_failures)} testes/exec.`, icon: MdErrorOutline, color: "red.500" },
    { title: "Taxa de Ignorados (Média)", value: formatPercentage(skippedRate), desc: summary.avg_skipped != null ? `Média de ~${Math.round(summary.avg_skipped)} testes/exec.` : "N/A", icon: MdRemoveCircleOutline, color: "gray.500" },
  ];
  
  if (mttr && mttr.mttr_hours > 0) {
    cards.push({
      title: "MTTR",
      value: `${mttr.mttr_hours}h`,
      desc: `Média de recuperação p/ build`,
      icon: MdAccessTime,
      color: mttr.mttr_hours > 24 ? "red.500" : "green.500"
    });
  }

  if (performanceMetrics && performanceMetrics.avg_execution_time_seconds > 0) {
    const mins = Math.floor(performanceMetrics.avg_execution_time_seconds / 60);
    const secs = Math.floor(performanceMetrics.avg_execution_time_seconds % 60);
    cards.push({
      title: "Duração (Média)",
      value: `${mins}m ${secs}s`,
      desc: `Tempo médio por execução`,
      icon: MdAccessTime,
      color: "purple.500"
    });
  }

  if (summary.global_flakiness_rate !== undefined && summary.global_flakiness_rate >= 0) {
    cards.push({
      title: "Instabilidade Global",
      value: formatPercentage(summary.global_flakiness_rate),
      desc: "Flakiness da plataforma",
      icon: MdErrorOutline,
      color: summary.global_flakiness_rate > 5 ? "red.500" : "orange.500"
    });
  }

  // Ensure "Última Execução" is always the last card
  cards.push({ title: "Última Execução", value: `#${summary.last_run_number}`, desc: lastExecutionDate, icon: MdAccessTime, color: "blue.500" });

  return (
    <Grid 
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
      sx={{ '@media print': { gridTemplateColumns: 'repeat(3, 1fr) !important' } }}
      gap={6} 
      mb={8}
    >
      {cards.map((card, i) => (
        <GridItem key={i}>
          <Box p={5} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100" transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}>
            <Flex justify="space-between" align="start">
              <Box>
                <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>{card.title}</Text>
                <Text fontSize="2xl" fontWeight="bold" color={card.color}>{card.value}</Text>
                <Text fontSize="xs" color="gray.400" mt={1} suppressHydrationWarning>{card.desc}</Text>
              </Box>
              <Flex w={10} h={10} borderRadius="lg" bg="gray.50" align="center" justify="center">
                <Icon as={card.icon} boxSize={5} color={card.color} />
              </Flex>
            </Flex>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
}
