"use client";

import { Box, Flex, FormControl, FormLabel, Select, Input, Button, Icon } from "@chakra-ui/react";
import { MdFilterList } from "react-icons/md";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import type { DashboardFilters as DashboardFiltersType } from "@application/use-cases/GetDashboardDataUseCase";
import { format, parse } from "date-fns";

interface DashboardFiltersProps {
  currentFilters: DashboardFiltersType;
  projectManagementData: {
    projects: Array<{ id: string; name: string }>;
    environments: Array<{ id: string; name: string }>;
  };
}

export function DashboardFilters({ currentFilters, projectManagementData }: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // O Date Input do HTML5 usa formato YYYY-MM-DD
  // Nossa API e useCase usam DD/MM/YYYY. Precisamos converter.
  const parseDateToInput = (dateStr: string) => {
    try {
      const parsed = parse(dateStr, "dd/MM/yyyy", new Date());
      return format(parsed, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const parseInputToApi = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
      return format(parsed, "dd/MM/yyyy");
    } catch {
      return "";
    }
  };

  const [project, setProject] = useState(currentFilters.project);
  const [environment, setEnvironment] = useState(currentFilters.environment);
  const [startDate, setStartDate] = useState(parseDateToInput(currentFilters.start_date));
  const [endDate, setEndDate] = useState(parseDateToInput(currentFilters.end_date));

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (project) params.set("project", project);
    if (environment) params.set("environment", environment);
    
    const apiStartDate = parseInputToApi(startDate);
    const apiEndDate = parseInputToApi(endDate);
    
    if (apiStartDate) params.set("start_date", apiStartDate);
    if (apiEndDate) params.set("end_date", apiEndDate);

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box p={5} bg="white" borderRadius="xl" border="1px" borderColor="gray.100" boxShadow="sm" mb={8}>
      <Flex direction={{ base: "column", md: "row" }} gap={4} align={{ base: "stretch", md: "flex-end" }}>
        
        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Projeto</FormLabel>
          <Select 
            value={project} 
            onChange={(e) => setProject(e.target.value)}
            bg="gray.50" 
            borderColor="gray.200" 
            _hover={{ borderColor: "blue.400" }}
            size="md"
            borderRadius="md"
          >
            {projectManagementData.projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            {projectManagementData.projects.length === 0 && (
              <option value={project}>{project.toUpperCase()}</option>
            )}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Ambiente</FormLabel>
          <Select 
            value={environment} 
            onChange={(e) => setEnvironment(e.target.value)}
            bg="gray.50" 
            borderColor="gray.200" 
            _hover={{ borderColor: "blue.400" }}
            size="md"
            borderRadius="md"
          >
            {projectManagementData.environments.map(e => (
              <option key={e.id} value={e.id}>{e.name.toUpperCase()}</option>
            ))}
            {projectManagementData.environments.length === 0 && (
              <option value={environment}>{environment.toUpperCase()}</option>
            )}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Data Inicial</FormLabel>
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            bg="gray.50" 
            borderColor="gray.200" 
            _hover={{ borderColor: "blue.400" }}
            size="md"
            borderRadius="md"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Data Final</FormLabel>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            bg="gray.50" 
            borderColor="gray.200" 
            _hover={{ borderColor: "blue.400" }}
            size="md"
            borderRadius="md"
          />
        </FormControl>

        <Button 
          colorScheme="blue" 
          onClick={handleApplyFilters} 
          leftIcon={<Icon as={MdFilterList} />}
          size="md"
          px={8}
          borderRadius="md"
          w={{ base: "full", md: "auto" }}
        >
          Filtrar
        </Button>
      </Flex>
    </Box>
  );
}
