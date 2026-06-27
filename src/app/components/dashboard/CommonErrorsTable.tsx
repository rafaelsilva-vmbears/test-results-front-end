"use client";

import { Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Icon, Tooltip } from "@chakra-ui/react";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import type { CommonErrorSummary } from "@domain/test-results/types";

interface CommonErrorsTableProps {
  errors: CommonErrorSummary[];
}

export function CommonErrorsTable({ errors }: CommonErrorsTableProps) {
  // Já deve vir ordenado da API, mas garantimos ordenação por count decrescente
  const sortedErrors = [...errors].sort((a, b) => b.count - a.count);

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="orange.50" color="orange.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdErrorOutline} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Falhas Mais Comuns</Heading>
          <Text fontSize="sm" color="gray.500">Agrupamento de falhas por mensagem de erro recorrente</Text>
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
              <Th color="gray.500" fontSize="xs" py={3} width="40%">Mensagem de Erro</Th>
              <Th color="gray.500" fontSize="xs" py={3} width="10%" isNumeric>
                <Flex align="center" justify="flex-end" gap={1}>
                  Frequência
                  <Tooltip label="Quantidade de vezes que este erro exato ocorreu no período selecionado" placement="top" hasArrow>
                    <span><Icon as={MdInfoOutline} color="gray.400" cursor="help" /></span>
                  </Tooltip>
                </Flex>
              </Th>
              <Th color="gray.500" fontSize="xs" py={3} width="25%">Testes Afetados</Th>
              <Th color="gray.500" fontSize="xs" py={3} width="25%">Execuções Afetadas</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedErrors.length === 0 ? (
              <Tr>
                <Td colSpan={4} textAlign="center" py={8} color="gray.400">
                  Nenhuma falha comum registrada no período.
                </Td>
              </Tr>
            ) : (
              sortedErrors.map((error, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td py={3}>
                    <Box 
                      fontSize="xs" 
                      color="orange.700" 
                      bg="orange.50" 
                      p={2} 
                      borderRadius="md" 
                      fontFamily="monospace"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      maxH="150px"
                      overflowY="auto"
                      sx={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { bg: 'orange.200', borderRadius: 'full' },
                      }}
                    >
                      {error.message || "Erro desconhecido"}
                    </Box>
                  </Td>
                  <Td py={3} isNumeric>
                    <Badge colorScheme="orange" variant="solid" borderRadius="full" px={2}>
                      {error.count}
                    </Badge>
                  </Td>
                  <Td py={3}>
                    <Flex flexWrap="wrap" gap={1}>
                      {error.affected_tests.slice(0, 3).map((testName, idx) => (
                        <Tooltip key={idx} label={testName} placement="top" hasArrow openDelay={500}>
                          <Badge colorScheme="gray" variant="outline" fontSize="2xs" px={1.5} borderRadius="sm" maxW="200px" isTruncated cursor="default">
                            {testName}
                          </Badge>
                        </Tooltip>
                      ))}
                      {error.affected_tests.length > 3 && (
                        <Badge colorScheme="gray" variant="subtle" fontSize="2xs" px={1.5} borderRadius="sm">
                          +{error.affected_tests.length - 3} testes
                        </Badge>
                      )}
                    </Flex>
                  </Td>
                  <Td py={3}>
                    <Flex flexWrap="wrap" gap={1}>
                      {error.affected_runs.slice(0, 10).map((runNumber, idx) => (
                        <Badge key={idx} colorScheme="orange" variant="subtle" fontSize="2xs" px={1.5} borderRadius="sm">
                          #{runNumber}
                        </Badge>
                      ))}
                      {error.affected_runs.length > 10 && (
                        <Badge colorScheme="gray" variant="subtle" fontSize="2xs" px={1.5} borderRadius="sm">
                          +{error.affected_runs.length - 10}
                        </Badge>
                      )}
                    </Flex>
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
