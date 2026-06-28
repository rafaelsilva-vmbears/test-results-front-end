"use client";

import { Box, Flex, Text, VStack, HStack, Icon, Avatar } from "@chakra-ui/react";
import { MdSpaceDashboard, MdScience, MdTrendingUp, MdLogout } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Flex 
      h="100vh" 
      bg="gray.50" 
      overflow="hidden"
      sx={{ '@media print': { display: 'block', height: 'auto', overflow: 'visible', bg: 'white' } }}
    >
      {/* Premium Sidebar */}
      <Box
        sx={{ '@media print': { display: 'none' } }}
        w="280px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        boxShadow="xl"
        zIndex="sticky"
        display="flex"
        flexDirection="column"
      >
        {/* Logo / Header da Sidebar */}
        <Flex
          h="16"
          align="center"
          px="6"
          bgGradient="linear(to-r, blue.600, purple.700)"
          color="white"
          position="relative"
          overflow="hidden"
          boxShadow="md"
        >
          <Box
            position="absolute"
            top="-50%"
            right="-20%"
            w="32"
            h="32"
            bg="whiteAlpha.400"
            borderRadius="full"
            filter="blur(20px)"
          />
          <Text fontSize="xl" fontWeight="extrabold" letterSpacing="tight" position="relative" zIndex={1}>
            QA Insights
          </Text>
        </Flex>

        {/* User Profile Area */}
        <Box p="4" borderBottom="1px" borderColor="gray.100" bgGradient="linear(to-br, blue.50, purple.50)">
          <HStack spacing="3">
            <Avatar size="sm" name="System Admin" bgGradient="linear(to-br, blue.500, purple.600)" color="white" fontWeight="bold" />
            <Box ml={3} display={{ base: "none", md: "block" }}>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">System Admin</Text>
              <Text fontSize="xs" color="gray.500">Qualidade de Software</Text>
            </Box>
          </HStack>
        </Box>

        {/* Navigation Links */}
        <VStack flex="1" p="4" spacing="2" align="stretch" overflowY="auto">
          <Link href="/" passHref>
            <Flex
              align="center"
              p="3"
              borderRadius="xl"
              bg={pathname === "/" ? "linear-gradient(to right, var(--chakra-colors-blue-50), var(--chakra-colors-purple-50))" : "transparent"}
              color={pathname === "/" ? "blue.700" : "gray.600"}
              fontWeight={pathname === "/" ? "bold" : "medium"}
              borderLeft={pathname === "/" ? "4px solid" : "4px solid transparent"}
              borderColor={pathname === "/" ? "blue.600" : "transparent"}
              _hover={{ bg: "gray.50", color: "gray.900", transform: "translateX(4px)" }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Icon as={MdSpaceDashboard} boxSize="5" mr="3" />
              <Text>Dashboard</Text>
            </Flex>
          </Link>
        </VStack>

        {/* Footer Sidebar */}
        <Box p="4" borderTop="1px" borderColor="gray.100">
          <Flex
            align="center"
            p="3"
            borderRadius="xl"
            color="red.600"
            fontWeight="medium"
            _hover={{ bg: "red.50", color: "red.700" }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <Icon as={MdLogout} boxSize="5" mr="3" />
            <Text>Sair</Text>
          </Flex>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        overflowY="auto"
        bg="gray.50"
        position="relative"
        sx={{ '@media print': { overflowY: 'visible', display: 'block', bg: 'white' } }}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          h="300px"
          bgGradient="radial(ellipse at top, blue.50, transparent)"
          pointerEvents="none"
        />
        <Box p="10" maxW="7xl" mx="auto" position="relative" zIndex={1} sx={{ '@media print': { p: 0, maxW: '100%' } }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
