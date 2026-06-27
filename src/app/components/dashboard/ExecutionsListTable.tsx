"use client";

import { Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Icon, Link } from "@chakra-ui/react";
import { MdFormatListBulleted, MdArrowForward } from "react-icons/md";
import type { ExecutionListItem } from "@domain/test-results/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExecutionsListTableProps {
  executions: ExecutionListItem[];
}

export function ExecutionsListTable({ executions }: ExecutionsListTableProps) {
  // Configuração das cores da badge de status
  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return "green";
    if (rate >= 70) return "yellow";
    return "red";
  };

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm">
      <Flex align="center" mb={6} justify="space-between" flexWrap="wrap" gap={4}>
        <Flex align="center">
          <Flex w={10} h={10} bg="blue.50" color="blue.500" borderRadius="md" align="center" justify="center" mr={3}>
            <Icon as={MdFormatListBulleted} boxSize={5} />
          </Flex>
          <Box>
            <Heading size="md" color="gray.800">Histórico de Execuções</Heading>
            <Text fontSize="sm" color="gray.500">Últimas 20 execuções registradas</Text>
          </Box>
        </Flex>
      </Flex>

      <Box overflowX="auto" sx={{
        '&::-webkit-scrollbar': { height: '6px' },
        '&::-webkit-scrollbar-track': { bg: 'gray.50' },
        '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
      }}>
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th color="gray.500" fontSize="xs" py={3}>Execução</Th>
              <Th color="gray.500" fontSize="xs" py={3}>Data</Th>
              <Th isNumeric color="gray.500" fontSize="xs" py={3}>Total</Th>
              <Th isNumeric color="gray.500" fontSize="xs" py={3}>Pass</Th>
              <Th isNumeric color="gray.500" fontSize="xs" py={3}>Fail</Th>
              <Th isNumeric color="gray.500" fontSize="xs" py={3}>Skip</Th>
              <Th isNumeric color="gray.500" fontSize="xs" py={3}>Pass Rate</Th>
              <Th color="gray.500" fontSize="xs" py={3}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {executions.length === 0 ? (
              <Tr>
                <Td colSpan={8} textAlign="center" py={8} color="gray.400">
                  Nenhuma execução encontrada no período.
                </Td>
              </Tr>
            ) : (
              executions.map((exec) => {
                const passRate = Number(exec.pass_rate) || 0;
                return (
                  <Tr key={exec.id || exec.run_number} _hover={{ bg: "gray.50" }}>
                    <Td py={3} fontWeight="bold" color="blue.600">
                      #{exec.run_number}
                    </Td>
                    <Td py={3} color="gray.600" fontSize="sm" suppressHydrationWarning>
                      {format(new Date(exec.execution_date || exec.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </Td>
                    <Td isNumeric py={3} color="gray.600">{exec.total}</Td>
                    <Td isNumeric py={3} color="green.500" fontWeight="medium">{exec.passed || 0}</Td>
                    <Td isNumeric py={3} color="red.500" fontWeight="medium">{exec.failures || 0}</Td>
                    <Td isNumeric py={3} color="gray.500">{exec.skipped || 0}</Td>
                    <Td isNumeric py={3}>
                      <Badge colorScheme={getPassRateColor(passRate)} variant="subtle" borderRadius="full" px={2}>
                        {passRate.toFixed(1)}%
                      </Badge>
                    </Td>
                    <Td py={3}>
                      <Flex justify="flex-end">
                        <Link 
                          href={`/executions/${exec.id}`} 
                          color="blue.500" 
                          display="flex" 
                          alignItems="center" 
                          fontSize="sm" 
                          fontWeight="medium"
                          _hover={{ textDecoration: "none", color: "blue.700" }}
                        >
                          Ver Detalhes <Icon as={MdArrowForward} ml={1} />
                        </Link>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
