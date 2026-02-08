import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { HeaderPage } from "../../components/HeaderPages";
import {
  getTopSellingCoffees,
  getMostProfitableMonths,
} from "../../service/coffeeSaleService";

type TopCoffee = {
  coffeeName: string;
  totalAmount: number;
};

type ProfitableMonth = {
  month: string;
  totalAmount: number;
};

export default function Dashboard() {
  const [topCoffees, setTopCoffees] = useState<TopCoffee[]>([]);
  const [profitableMonths, setProfitableMonths] = useState<ProfitableMonth[]>([]);
  const [coffeeLimit, setCoffeeLimit] = useState(3);
  const [monthLimit, setMonthLimit] = useState(3);
  const [loadingCoffee, setLoadingCoffee] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const fetchTopCoffees = useCallback(async () => {
    try {
      setLoadingCoffee(true);
      const coffees = await getTopSellingCoffees(coffeeLimit);
      setTopCoffees(coffees);
    } finally {
      setLoadingCoffee(false);
    }
  }, [coffeeLimit]);

  const fetchProfitableMonths = useCallback(async () => {
    try {
      setLoadingMonth(true);
      const months = await getMostProfitableMonths(monthLimit);
      setProfitableMonths(months);
    } finally {
      setLoadingMonth(false);
    }
  }, [monthLimit]);

  useEffect(() => {
    fetchTopCoffees();
  }, [fetchTopCoffees]);

  useEffect(() => {
    fetchProfitableMonths();
  }, [fetchProfitableMonths]);

  return (
    <Box>
      <HeaderPage label="Dashboard" />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
        <Box
          bg="#fff"
          border="1px solid"
          borderColor="#eceae8"
          rounded="md"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Cafés mais vendidos
            </Text>

            <Select
              w="110px"
              size="sm"
              value={coffeeLimit}
              onChange={(e) => setCoffeeLimit(Number(e.target.value))}
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </Select>
          </Flex>

          {loadingCoffee ? (
            <Spinner />
          ) : topCoffees.length > 0 ? (
            <Flex direction="column" gap={2}>
              {topCoffees.map((item, index) => (
                <Flex
                  key={index}
                  justify="space-between"
                  borderBottom="1px dashed"
                  borderColor="gray.200"
                  pb={1}
                >
                  <Text>
                    {index + 1}. {item.coffeeName}
                  </Text>
                  <Text fontWeight="bold" color="green.600">
                    R$ {item.totalAmount.toFixed(2)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text color="gray.500">Nenhum dado disponível</Text>
          )}
        </Box>

        <Box
          bg="#fff"
          border="1px solid"
          borderColor="#eceae8"
          rounded="md"
          p={6}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Meses mais lucrativos
            </Text>

            <Select
              w="110px"
              size="sm"
              value={monthLimit}
              onChange={(e) => setMonthLimit(Number(e.target.value))}
            >
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </Select>
          </Flex>

          {loadingMonth ? (
            <Spinner />
          ) : profitableMonths.length > 0 ? (
            <Flex direction="column" gap={2}>
              {profitableMonths.map((item, index) => (
                <Flex
                  key={index}
                  justify="space-between"
                  borderBottom="1px dashed"
                  borderColor="gray.200"
                  pb={1}
                >
                  <Text>
                    {index + 1}. {item.month}
                  </Text>
                  <Text fontWeight="bold" color="green.600">
                    R$ {item.totalAmount.toFixed(2)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Text color="gray.500">Nenhum dado disponível</Text>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
