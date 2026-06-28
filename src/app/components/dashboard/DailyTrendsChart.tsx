"use client";

import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { MdTrendingUp } from "react-icons/md";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";
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

  // Normaliza os dados para 100% (taxas de cada status)
  const formattedData = trends.map(t => {
    const total = t.total_tests > 0 ? t.total_tests : 1;
    const failRate = (t.total_failures / total) * 100;
    const skipRate = t.total_skipped ? (t.total_skipped / total) * 100 : 0;
    // Força a soma fechar exatamente 100%
    const passRate = Math.max(0, 100 - failRate - skipRate);
    
    return {
      ...t,
      displayDate: format(parseISO(t.date), "dd MMM", { locale: ptBR }),
      passRate: passRate,
      failRate: failRate,
      skipRate: skipRate
    };
  });

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdTrendingUp} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Evolução Diária (Trends)</Heading>
          <Text fontSize="sm" color="gray.500">Proporção diária de testes aprovados, falhos e ignorados</Text>
        </Box>
      </Flex>

      <Box h="350px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-gray-100)" vertical={false} />
            <XAxis dataKey="displayDate" stroke="var(--chakra-colors-gray-500)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="var(--chakra-colors-gray-500)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-10} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid var(--chakra-colors-gray-100)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              labelStyle={{ fontWeight: "bold", color: "var(--chakra-colors-gray-800)", marginBottom: "4px" }}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            
            <Area
              type="monotone"
              dataKey="passRate"
              stackId="1"
              name="Sucesso"
              stroke="var(--chakra-colors-green-500)"
              fill="var(--chakra-colors-green-400)"
            >
              <LabelList dataKey="passRate" position="center" fill="white" fontSize={11} fontWeight="bold" formatter={(val: number) => val > 5 ? `${val.toFixed(0)}%` : ''} />
            </Area>
            
            <Area
              type="monotone"
              dataKey="failRate"
              stackId="1"
              name="Falhas"
              stroke="var(--chakra-colors-red-500)"
              fill="var(--chakra-colors-red-400)"
            >
              <LabelList dataKey="failRate" position="center" fill="white" fontSize={11} fontWeight="bold" formatter={(val: number) => val > 5 ? `${val.toFixed(0)}%` : ''} />
            </Area>
            
            <Area
              type="monotone"
              dataKey="skipRate"
              stackId="1"
              name="Ignorados"
              stroke="var(--chakra-colors-gray-500)"
              fill="var(--chakra-colors-gray-400)"
            >
              <LabelList dataKey="skipRate" position="center" fill="white" fontSize={11} fontWeight="bold" formatter={(val: number) => val > 5 ? `${val.toFixed(0)}%` : ''} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
