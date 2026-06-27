"use client";

import { Box, Flex, Heading, Text, Grid, Icon, Button, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { MdArrowBack, MdCheckCircle, MdError, MdRemoveCircle, MdAssignment } from "react-icons/md";
import { IconType } from "react-icons";
import type { ExecutionListItem, Test, CommonErrorSummary } from "@domain/test-results/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { TestDistributionChart } from "../dashboard/TestDistributionChart";
import { CommonErrorsTable } from "../dashboard/CommonErrorsTable";

interface ExecutionDetailsClientProps {
  execution: ExecutionListItem;
}

export default function ExecutionDetailsClient({ execution }: ExecutionDetailsClientProps) {
  const passedTests = execution.passed ?? 0;
  const failedTests = execution.failures || 0;
  const skippedTests = execution.skipped || 0;

  // Calculate common errors dynamically for this single execution
  const calculateCommonErrors = (failedCases: Test[] | null | undefined, runNumber: number): CommonErrorSummary[] => {
    if (!failedCases) return [];
    
    const errorMap = new Map<string, CommonErrorSummary>();

    failedCases.forEach(test => {
      const msg = test.message || "Erro desconhecido";
      const firstLine = msg.split('\n')[0].trim();
      
      if (!errorMap.has(firstLine)) {
        errorMap.set(firstLine, {
          message: firstLine, // Use first line for grouping
          count: 0,
          affected_tests: [],
          affected_runs: [runNumber],
        });
      }
      
      const summary = errorMap.get(firstLine)!;
      summary.count += 1;
      if (!summary.affected_tests.includes(test.name)) {
        summary.affected_tests.push(test.name);
      }
    });

    return Array.from(errorMap.values()).sort((a, b) => b.count - a.count);
  };

  const commonErrorsForExecution = calculateCommonErrors(execution.failed_cases, execution.run_number);

  const testDistributionData = [
    {
      label: "Passados",
      value: passedTests,
      color: "var(--chakra-colors-green-500)",
    },
    {
      label: "Falhas",
      value: failedTests,
      color: "var(--chakra-colors-red-500)",
    },
    {
      label: "Ignorados",
      value: skippedTests,
      color: "var(--chakra-colors-gray-500)",
    },
  ];

  const renderTestsTable = (tests: Test[], title: string, icon: IconType, color: string, bg: string) => (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" mt={8}>
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg={bg} color={color} borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={icon} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">{title}</Heading>
          <Text fontSize="sm" color="gray.500">{tests.length} testes encontrados</Text>
        </Box>
      </Flex>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th py={3}>Nome do Teste</Th>
              <Th py={3}>Mensagem</Th>
              <Th isNumeric py={3}>Tempo (s)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tests.map((test, idx) => (
              <Tr key={idx} _hover={{ bg: "gray.50" }}>
                <Td py={3} fontWeight="medium" color="gray.700" whiteSpace="normal" wordBreak="break-word" maxW="300px">
                  {test.name}
                </Td>
                <Td py={3}>
                  {test.message ? (
                    <Box 
                      fontSize="xs" 
                      color="gray.600" 
                      bg="gray.50" 
                      p={2} 
                      borderRadius="md" 
                      fontFamily="monospace"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      maxH="100px"
                      overflowY="auto"
                    >
                      {test.message}
                    </Box>
                  ) : (
                    <Text fontSize="xs" color="gray.400">-</Text>
                  )}
                </Td>
                <Td isNumeric py={3} color="gray.500">
                  {test.time ? test.time.toFixed(2) : "-"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={8}>
        <Button as={Link} href="/" variant="ghost" leftIcon={<MdArrowBack />} colorScheme="blue" mb={4} px={0} _hover={{ bg: "transparent", color: "blue.700" }}>
          Voltar para o Dashboard
        </Button>
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={4}>
          <Heading size="lg" color="gray.800" letterSpacing="tight">
            Detalhes da Execução #{execution.run_number}
          </Heading>
          <Box textAlign={{ base: "left", md: "right" }} fontSize="sm" color="gray.500">
            <Text>Projeto: <Text as="span" fontWeight="bold">{execution.project.toUpperCase()}</Text></Text>
            <Text>Ambiente: <Text as="span" fontWeight="bold">{execution.environment.toUpperCase()}</Text></Text>
            <Text>Data: <Text as="span" fontWeight="bold" suppressHydrationWarning>{format(new Date(execution.execution_date || execution.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}</Text></Text>
          </Box>
        </Flex>
      </Box>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
        <Box p={5} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100">
          <Flex justify="space-between" align="start">
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>Total de Testes</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">{execution.total}</Text>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="gray.50" align="center" justify="center">
              <Icon as={MdAssignment} boxSize={5} color="blue.500" />
            </Flex>
          </Flex>
        </Box>

        <Box p={5} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100">
          <Flex justify="space-between" align="start">
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>Passados</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">{passedTests}</Text>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="gray.50" align="center" justify="center">
              <Icon as={MdCheckCircle} boxSize={5} color="green.500" />
            </Flex>
          </Flex>
        </Box>

        <Box p={5} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100">
          <Flex justify="space-between" align="start">
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>Falhas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.500">{failedTests}</Text>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="gray.50" align="center" justify="center">
              <Icon as={MdError} boxSize={5} color="red.500" />
            </Flex>
          </Flex>
        </Box>

        <Box p={5} bg="white" borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100">
          <Flex justify="space-between" align="start">
            <Box>
              <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={1}>Ignorados</Text>
              <Text fontSize="2xl" fontWeight="bold" color="gray.500">{skippedTests}</Text>
            </Box>
            <Flex w={10} h={10} borderRadius="lg" bg="gray.50" align="center" justify="center">
              <Icon as={MdRemoveCircle} boxSize={5} color="gray.500" />
            </Flex>
          </Flex>
        </Box>
      </Grid>

      {/* Chart */}
      <Box mb={8}>
        <TestDistributionChart data={testDistributionData} />
      </Box>

      {/* Common Errors Table */}
      {commonErrorsForExecution.length > 0 && (
        <Box mb={8}>
          <CommonErrorsTable errors={commonErrorsForExecution} />
        </Box>
      )}

      {/* Failed Tests Table */}
      {execution.failed_cases && execution.failed_cases.length > 0 && (
        renderTestsTable(execution.failed_cases, "Testes com Falhas", MdError, "red.500", "red.50")
      )}

      {/* Skipped Tests Table */}
      {execution.skipped > 0 && execution.tests && (
        renderTestsTable(execution.tests.filter(t => t.status === "skipped"), "Testes Ignorados", MdRemoveCircle, "gray.500", "gray.50")
      )}
    </Box>
  );
}
