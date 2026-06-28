"use client";

import { Box, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { MdBarChart, MdCheckCircleOutline } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

interface TestDistributionChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export function TestDistributionChart({ data }: TestDistributionChartProps) {
  // Use all data to show empty columns if necessary, but keep the 0 check for the whole component
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
    return (
      <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
        <Flex align="center" mb={6}>
          <Flex w={10} h={10} bg="purple.50" color="purple.500" borderRadius="md" align="center" justify="center" mr={3}>
            <Icon as={MdBarChart} boxSize={5} />
          </Flex>
          <Box>
            <Heading size="md" color="gray.800">Distribuição de Testes</Heading>
            <Text fontSize="sm" color="gray.500">Total de testes por status no período</Text>
          </Box>
        </Flex>
        <Flex h="300px" align="center" justify="center" direction="column" color="gray.400">
          <Icon as={MdCheckCircleOutline} boxSize={12} mb={2} color="gray.300" />
          <Text>Sem dados para exibir</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="purple.50" color="purple.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdBarChart} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Distribuição de Testes</Heading>
          <Text fontSize="sm" color="gray.500">Total de testes por status no período</Text>
        </Box>
      </Flex>

      <Box h="320px" w="full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chakra-colors-gray-100)" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 13, fill: "var(--chakra-colors-gray-600)", fontWeight: 500 }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "var(--chakra-colors-gray-500)" }} 
              axisLine={false} 
              tickLine={false} 
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "var(--chakra-colors-gray-50)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const itemData = payload[0].payload;
                  return (
                    <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.100">
                      <Text fontWeight="bold" fontSize="sm" mb={1}>{itemData.label}</Text>
                      <Text fontSize="md" color={itemData.color} fontWeight="bold">{itemData.value} testes</Text>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
              <LabelList dataKey="value" position="top" fill="var(--chakra-colors-gray-600)" fontSize={14} fontWeight="bold" />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
