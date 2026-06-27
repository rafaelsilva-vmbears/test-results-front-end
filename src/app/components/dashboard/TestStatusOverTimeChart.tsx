"use client";

import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { MdTimeline, MdCheckCircleOutline } from "react-icons/md";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ExecutionListItem } from "@domain/test-results/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TestStatusOverTimeChartProps {
  executions: ExecutionListItem[];
}

export function TestStatusOverTimeChart({ executions }: TestStatusOverTimeChartProps) {
  // Ordena por data (mais antigas primeiro) para o gráfico fluir da esquerda para a direita
  const sortedExecutions = [...executions].sort((a, b) => 
    new Date(a.execution_date || a.created_at).getTime() - new Date(b.execution_date || b.created_at).getTime()
  );

  const data = sortedExecutions.map(exec => ({
    name: `#${exec.run_number}`,
    date: format(new Date(exec.execution_date || exec.created_at), "dd MMM", { locale: ptBR }),
    fullDate: format(new Date(exec.execution_date || exec.created_at), "dd/MM/yyyy HH:mm"),
    passed: Number(exec.passed) || 0,
    failed: Number(exec.failures) || 0,
    skipped: Number(exec.skipped) || 0,
    passRate: Number(exec.pass_rate) || 0,
  }));

  if (data.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
        <Flex align="center" mb={6}>
          <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
            <Icon as={MdTimeline} boxSize={5} />
          </Flex>
          <Box>
            <Heading size="md" color="gray.800">Evolução de Testes</Heading>
            <Text fontSize="sm" color="gray.500">Histórico de execuções ao longo do tempo</Text>
          </Box>
        </Flex>
        <Flex h="300px" align="center" justify="center" direction="column" color="gray.400">
          <Icon as={MdCheckCircleOutline} boxSize={12} mb={2} color="gray.300" />
          <Text>Nenhuma execução encontrada no período</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdTimeline} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Evolução de Testes</Heading>
          <Text fontSize="sm" color="gray.500">Histórico de execuções ao longo do tempo</Text>
        </Box>
      </Flex>

      <Box h="320px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chakra-colors-green-400)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chakra-colors-green-400)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chakra-colors-red-400)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chakra-colors-red-400)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSkipped" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chakra-colors-gray-400)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chakra-colors-gray-400)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--chakra-colors-gray-500)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--chakra-colors-gray-500)" }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chakra-colors-gray-100)" />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.100">
                      <Text fontWeight="bold" fontSize="sm" mb={1}>{label} - {data.date}</Text>
                      <Text fontSize="xs" color="gray.500" mb={2}>{data.fullDate}</Text>
                      <Flex direction="column" gap={1}>
                        <Text fontSize="xs" color="green.600" fontWeight="bold">Passou: {data.passed}</Text>
                        <Text fontSize="xs" color="red.600" fontWeight="bold">Falhou: {data.failed}</Text>
                        <Text fontSize="xs" color="gray.600" fontWeight="bold">Ignorado: {data.skipped}</Text>
                        <Text fontSize="xs" color="blue.600" fontWeight="bold" mt={1}>Taxa: {data.passRate.toFixed(1)}%</Text>
                      </Flex>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="passed" stackId="1" stroke="var(--chakra-colors-green-500)" fill="url(#colorPassed)" />
            <Area type="monotone" dataKey="failed" stackId="1" stroke="var(--chakra-colors-red-500)" fill="url(#colorFailed)" />
            <Area type="monotone" dataKey="skipped" stackId="1" stroke="var(--chakra-colors-gray-500)" fill="url(#colorSkipped)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
