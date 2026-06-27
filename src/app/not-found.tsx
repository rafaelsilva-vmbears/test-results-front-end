"use client";

import { Box, Button, Flex, Heading, Text, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { MdSearchOff } from "react-icons/md";

export default function NotFound() {
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
      >
        <Icon as={MdSearchOff} boxSize={20} color="blue.500" mb={6} />
        <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, blue.400, purple.600)" backgroundClip="text" mb={2}>
          404
        </Heading>
        <Heading as="h3" size="lg" color="gray.800" mt={4} mb={2}>
          Página não encontrada
        </Heading>
        <Text color="gray.500" mb={8}>
          A rota que você está tentando acessar não existe, foi movida ou você não tem as permissões necessárias.
        </Text>
        <Button
          as={NextLink}
          href="/"
          colorScheme="blue"
          bgGradient="linear(to-r, blue.500, purple.600)"
          color="white"
          variant="solid"
          size="lg"
          px={8}
          _hover={{ bgGradient: "linear(to-r, blue.600, purple.700)", color: "white" }}
        >
          Voltar para o Dashboard
        </Button>
      </Box>
    </Flex>
  );
}
