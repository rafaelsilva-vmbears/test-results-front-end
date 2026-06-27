"use client";

import { useEffect } from "react";
import { Box, Button, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";
import NextLink from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aqui você poderia integrar com Sentry, Datadog ou outro serviço de log
    console.error("Aplicação encontrou um erro:", error);
  }, [error]);

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={4}
    >
      <Box
        textAlign="center"
        py={10}
        px={6}
        bg="white"
        boxShadow="xl"
        borderRadius="2xl"
        maxW="lg"
        w="full"
        borderTop="4px solid"
        borderColor="red.500"
      >
        <Icon as={MdErrorOutline} boxSize={20} color="red.500" mb={6} />
        <Heading as="h2" size="xl" color="gray.800" mb={4}>
          Ops! Algo deu errado.
        </Heading>
        <Text color="gray.500" mb={6}>
          Encontramos um erro inesperado ao tentar carregar esta tela. 
          Nossa equipe técnica já deve ter sido notificada.
        </Text>
        
        <Box bg="red.50" p={4} borderRadius="md" mb={8} textAlign="left" overflowX="auto" maxH="150px" overflowY="auto">
            <Text fontSize="sm" color="red.800" fontFamily="monospace" whiteSpace="pre-wrap">
              {error.message || "Erro interno do servidor"}
            </Text>
        </Box>

        <Flex justify="center" gap={4}>
            <Button
              as={NextLink}
              href="/"
              colorScheme="red"
              variant="outline"
            >
              Ir para o Início
            </Button>
            <Button
              colorScheme="blue"
              bgGradient="linear(to-r, blue.500, purple.600)"
              color="white"
              onClick={() => reset()}
              _hover={{ bgGradient: "linear(to-r, blue.600, purple.700)" }}
            >
              Tentar Novamente
            </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
