"use client";

import { Box, Flex, Heading, Text, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, Badge, Icon, Stack, Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { MdOutlineWarning, MdCheckCircleOutline, MdErrorOutline, MdInfoOutline } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import type { FlakyTestSummary, ModuleHealthSummary } from "@domain/test-results/types";

interface StabilityAnalysisProps {
  flakyTests: FlakyTestSummary[];
  moduleHealth: ModuleHealthSummary[];
}

export default function StabilityAnalysis({
  flakyTests,
  moduleHealth,
}: StabilityAnalysisProps) {
  // Pega apenas os 10 piores módulos (com maior taxa de falhas ou mais falhas) para o gráfico
  // Vamos ordenar pela taxa de falha (Densidade de Defeitos) ou por quantidade
  const topProblematicModules = [...moduleHealth]
    .filter(m => m.total_tests && m.total_tests >= 5) // Ignora módulos com menos de 5 testes para não distorcer a %
    .sort((a, b) => (Number(b.failure_rate) || 0) - (Number(a.failure_rate) || 0))
    .slice(0, 10)
    .map(m => ({
      name: m.module_name || "Desconhecido",
      failCount: Number(m.fail_count) || 0,
      totalTests: Number(m.total_tests) || 0,
      failureRate: Number(m.failure_rate) || 0,
    }));
    
  // Fallback se todos os módulos tiverem menos de 5 testes
  if (topProblematicModules.length === 0 && moduleHealth.length > 0) {
      topProblematicModules.push(...[...moduleHealth]
        .sort((a, b) => (Number(b.failure_rate) || 0) - (Number(a.failure_rate) || 0))
        .slice(0, 10)
        .map(m => ({
          name: m.module_name || "Desconhecido",
          failCount: Number(m.fail_count) || 0,
          totalTests: Number(m.total_tests) || 0,
          failureRate: Number(m.failure_rate) || 0,
        }))
      );
  }

  // Configuração das cores baseada na Taxa de Falhas (Densidade de defeitos)
  const getBarColor = (failureRate: number) => {
    if (failureRate < 2) return "var(--chakra-colors-green-400)";
    if (failureRate < 10) return "var(--chakra-colors-yellow-400)";
    if (failureRate < 30) return "var(--chakra-colors-orange-400)";
    return "var(--chakra-colors-red-500)";
  };

  const getBadgeColorScheme = (score: number) => {
    if (score < 30) return "green";
    if (score < 70) return "yellow";
    return "red";
  };

  return (
    <Box mt={10}>
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="orange.100" color="orange.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdOutlineWarning} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Análise de Estabilidade</Heading>
          <Text fontSize="sm" color="gray.500">Módulos críticos (Densidade de defeitos) e testes intermitentes (flaky)</Text>
        </Box>
      </Flex>

      <Grid templateColumns="1fr" gap={8}>
        {/* Gráfico de Módulos Problemáticos */}
        <GridItem>
          <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
            <Box mb={6}>
              <Heading size="sm" color="gray.800">Densidade de Falhas (Top 10 Módulos)</Heading>
              <Text fontSize="xs" color="gray.500">Módulos ordenados pela Taxa de Falhas (%). Módulos com altíssima densidade de defeitos apontam problemas estruturais.</Text>
            </Box>

            {topProblematicModules.length === 0 ? (
              <Flex h="300px" align="center" justify="center" direction="column" color="gray.400">
                <Icon as={MdCheckCircleOutline} boxSize={12} mb={2} color="green.300" />
                <Text>Nenhum dado de módulo encontrado no período</Text>
              </Flex>
            ) : (
              <Box h="350px" w="full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProblematicModules} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="var(--chakra-colors-gray-100)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                    {/* Aumentar o width do YAxis para caber o nome sem sobrepor (ex: 280) */}
                    <YAxis dataKey="name" type="category" width={280} tick={{ fontSize: 11, fill: "var(--chakra-colors-gray-600)" }} interval={0} />
                    <Tooltip
                      cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <Box bg="white" p={3} borderRadius="md" boxShadow="lg" border="1px" borderColor="gray.100">
                              <Text fontWeight="bold" fontSize="sm" mb={2} color="gray.800">{data.name}</Text>
                              <Text fontSize="xs" color="gray.600">Testes Totais: <Text as="span" fontWeight="bold">{data.totalTests}</Text></Text>
                              <Text fontSize="xs" color="gray.600">Qtd. Falhas: <Text as="span" fontWeight="bold" color="red.500">{data.failCount}</Text></Text>
                              <Text fontSize="xs" color="gray.600" mt={1}>Densidade (Taxa): <Text as="span" fontWeight="bold" color={getBarColor(Number(data.failureRate))}>{data.failureRate.toFixed(1)}%</Text></Text>
                            </Box>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="failureRate" radius={[0, 4, 4, 0]} barSize={20} name="Taxa de Falhas (%)">
                      {topProblematicModules.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.failureRate)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Box>
        </GridItem>

        {/* Tabela de Testes Flaky */}
        <GridItem>
          <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" h="full">
            <Box mb={6}>
              <Heading size="sm" color="gray.800">Top 10 Testes Instáveis (Flaky Tests)</Heading>
              <Text fontSize="xs" color="gray.500">Testes que falham e passam intermitentemente</Text>
            </Box>

            {flakyTests.length === 0 ? (
              <Flex h="300px" align="center" justify="center" direction="column" color="gray.400">
                <Icon as={MdCheckCircleOutline} boxSize={12} mb={2} color="green.300" />
                <Text>Nenhum teste flaky detectado no período</Text>
              </Flex>
            ) : (
              <Box overflowY="auto" maxH="320px" sx={{
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { bg: 'gray.50' },
                '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
              }}>
                <Table size="sm" variant="simple">
                  <Thead position="sticky" top={0} bg="white" zIndex={1}>
                    <Tr>
                      <Th color="gray.500" fontSize="xs">Teste</Th>
                      <Th isNumeric color="gray.500" fontSize="xs">
                        <Flex align="center" justify="flex-end" gap={1}>
                          Qtd. Falhas
                          <ChakraTooltip label="Número de vezes que o teste falhou no período" placement="top" hasArrow>
                            <span><Icon as={MdInfoOutline} color="gray.400" cursor="help" /></span>
                          </ChakraTooltip>
                        </Flex>
                      </Th>
                      <Th isNumeric color="gray.500" fontSize="xs">
                        <Flex align="center" justify="flex-end" gap={1}>
                          Instabilidade
                          <ChakraTooltip label="Pontuação de instabilidade (0 a 100). Valores maiores indicam mais transições falha/sucesso" placement="top" hasArrow>
                            <span><Icon as={MdInfoOutline} color="gray.400" cursor="help" /></span>
                          </ChakraTooltip>
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {flakyTests.slice(0, 10).map((test, index) => (
                      <Tr key={index} _hover={{ bg: "gray.50" }}>
                        <Td py={3} maxW="250px">
                          <ChakraTooltip label={test.test_name} placement="top" hasArrow openDelay={500}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={2} cursor="default">
                              {test.test_name}
                            </Text>
                          </ChakraTooltip>
                        </Td>
                        <Td isNumeric py={3}>
                          <Flex align="center" justify="flex-end" color="orange.500" fontWeight="bold">
                            <Icon as={MdErrorOutline} mr={1} />
                            {test.fail_count}
                          </Flex>
                        </Td>
                        <Td isNumeric py={3}>
                          <Badge colorScheme={getBadgeColorScheme(Number(test.instability_score) || 0)} variant="subtle" borderRadius="full" px={2}>
                            {(Number(test.instability_score) || 0).toFixed(1)}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}
