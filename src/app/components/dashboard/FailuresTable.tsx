"use client";

import { Box, Flex, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Icon } from "@chakra-ui/react";
import { MdBugReport } from "react-icons/md";
import type { FailureItem } from "@domain/test-results/types";

interface FailuresTableProps {
  failures: FailureItem[];
}

export function FailuresTable({ failures }: FailuresTableProps) {
  // Ordena por quantidade de falhas (decrescente)
  const sortedFailures = [...failures].sort((a, b) => b.run_numbers.length - a.run_numbers.length);

  return (
    <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm">
      <Flex align="center" mb={6}>
        <Flex w={10} h={10} bg="red.50" color="red.500" borderRadius="md" align="center" justify="center" mr={3}>
          <Icon as={MdBugReport} boxSize={5} />
        </Flex>
        <Box>
          <Heading size="md" color="gray.800">Histórico de Falhas</Heading>
          <Text fontSize="sm" color="gray.500">Testes que falharam nas últimas execuções</Text>
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
              <Th color="gray.500" fontSize="xs" py={3} width="30%">Nome do Teste</Th>
              <Th color="gray.500" fontSize="xs" py={3} width="50%">Última Mensagem de Erro</Th>
              <Th color="gray.500" fontSize="xs" py={3} width="20%">Execuções Afetadas</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedFailures.length === 0 ? (
              <Tr>
                <Td colSpan={3} textAlign="center" py={8} color="gray.400">
                  Nenhuma falha registrada no período.
                </Td>
              </Tr>
            ) : (
              sortedFailures.map((failure, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td py={3}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" whiteSpace="normal" wordBreak="break-word">
                      {failure.name}
                    </Text>
                  </Td>
                  <Td py={3}>
                    <Box 
                      fontSize="xs" 
                      color="red.600" 
                      bg="red.50" 
                      p={2} 
                      borderRadius="md" 
                      fontFamily="monospace"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                      maxH="100px"
                      overflowY="auto"
                      sx={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { bg: 'red.200', borderRadius: 'full' },
                      }}
                    >
                      {failure.last_message || "Erro desconhecido"}
                    </Box>
                  </Td>
                  <Td py={3}>
                    <Flex flexWrap="wrap" gap={1}>
                      {failure.run_numbers.slice(0, 10).map((runNumber, idx) => (
                        <Badge key={idx} colorScheme="red" variant="subtle" fontSize="2xs" px={1.5} borderRadius="sm">
                          #{runNumber}
                        </Badge>
                      ))}
                      {failure.run_numbers.length > 10 && (
                        <Badge colorScheme="gray" variant="subtle" fontSize="2xs" px={1.5} borderRadius="sm">
                          +{failure.run_numbers.length - 10}
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
