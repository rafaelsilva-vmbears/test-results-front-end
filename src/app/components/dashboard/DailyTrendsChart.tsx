"use client";

import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { MdTrendingUp } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TrendSummary } from "@domain/test-results/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyTrendsChartProps {
  trends: TrendSummary[];
}

export function DailyTrendsChart({ trends }: DailyTrendsChartProps) {
  if (!trends || trends.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
        <Flex align="center" mb={6}>
          <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
            <Icon as={MdTrendingUp} boxSize={5} />
          </Flex>
          <Box>
            <Heading size="md" color="gray.800">Evolução Diária</Heading>
            <Text fontSize="sm" color="gray.500">Métricas agrupadas por dia</Text>
          </Box>
        </Flex>
        <Flex justify="center" align="center" h="300px" color="gray.400">
          Sem dados de tendências
        </Flex>
      </Box>
    );
  }

  // Format dates for display
  const formattedData = trends.map(t => ({
    ...t,
    displayDate: format(parseISO(t.date), "dd MMM", { locale: ptBR })
  }));

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdTrendingUp} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Evolução Diária (Trends)</Heading>
          <Text fontSize="sm" color="gray.500">Taxa de sucesso, falhas absolutas e quarentena agrupados por dia</Text>
        </Box>
      </Flex>

      <Box h="350px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-gray-100)" vertical={false} />
            <XAxis dataKey="displayDate" stroke="var(--chakra-colors-gray-500)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="var(--chakra-colors-gray-500)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--chakra-colors-gray-500)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid var(--chakra-colors-gray-100)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              labelStyle={{ fontWeight: "bold", color: "var(--chakra-colors-gray-800)", marginBottom: "4px" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avg_pass_rate"
              name="Pass Rate (%)"
              stroke="var(--chakra-colors-green-500)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_failures"
              name="Falhas Totais"
              stroke="var(--chakra-colors-red-500)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_skipped"
              name="Testes Ignorados (Quarentena)"
              stroke="var(--chakra-colors-gray-500)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
