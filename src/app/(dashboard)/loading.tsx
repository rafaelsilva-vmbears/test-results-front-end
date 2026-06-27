"use client";

import { Box, Flex, Spinner, Text } from "@chakra-ui/react";

export default function DashboardLoadingPage() {
  return (
    <Flex h="80vh" align="center" justify="center" direction="column">
      <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" emptyColor="gray.200" mb={4} />
      <Text color="gray.500" fontWeight="medium">Carregando métricas do dashboard...</Text>
    </Flex>
  );
}
