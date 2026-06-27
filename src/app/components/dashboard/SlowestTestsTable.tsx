"use client";

import { Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Icon, Tooltip } from "@chakra-ui/react";
import { MdAccessTime, MdInfoOutline } from "react-icons/md";
import type { SlowestTestSummary } from "@domain/test-results/types";

interface SlowestTestsTableProps {
  slowestTests: SlowestTestSummary[];
}

export function SlowestTestsTable({ slowestTests }: SlowestTestsTableProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${mins}m ${secs}s`;
  };

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="purple.50" color="purple.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdAccessTime} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Top 10 Testes Mais Lentos</Heading>
          <Text fontSize="sm" color="gray.500">Testes que estão impactando a velocidade do CI/CD (Pipeline Velocity)</Text>
        </Box>
      </Flex>

      <Box overflowX="auto" overflowY="auto" maxH="400px" sx={{
        '&::-webkit-scrollbar': { width: '6px', height: '6px' },
        '&::-webkit-scrollbar-track': { bg: 'gray.50' },
        '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
      }}>
        <Table variant="simple" size="sm">
          <Thead bg="gray.50" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th color="gray.500" fontSize="xs" py={3} width="70%">Nome do Teste</Th>
              <Th color="gray.500" fontSize="xs" py={3} width="30%" isNumeric>
                <Flex align="center" justify="flex-end" gap={1}>
                  Duração (Média)
                  <Tooltip label="Tempo médio gasto na execução deste teste no período" placement="top" hasArrow>
                    <span><Icon as={MdInfoOutline} color="gray.400" cursor="help" /></span>
                  </Tooltip>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {slowestTests.length === 0 ? (
              <Tr>
                <Td colSpan={2} textAlign="center" py={8} color="gray.400">
                  Nenhum teste registrado no período.
                </Td>
              </Tr>
            ) : (
              slowestTests.map((test, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td py={3}>
                    <Tooltip label={test.test_name} placement="top" hasArrow openDelay={500}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        isTruncated
                        maxW="400px"
                        cursor="default"
                      >
                        {test.test_name}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td py={3} isNumeric>
                    <Badge colorScheme={test.avg_duration_seconds > 120 ? "red" : test.avg_duration_seconds > 60 ? "orange" : "purple"} variant="subtle" borderRadius="full" px={2} py={0.5}>
                      {formatDuration(test.avg_duration_seconds)}
                    </Badge>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
