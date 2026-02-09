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
import { ImportItem } from "../uploadFile";
import { getFileData } from "../../service/importService";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";

type TopCoffee = {
  coffeeName: string;
  totalSales: number;
};

type ProfitableMonth = {
  month: string;
  totalAmount: number;
};

export default function Dashboard() {
  const { user } = useAuth();

  const [topCoffees, setTopCoffees] = useState<TopCoffee[]>([]);
  const [profitableMonths, setProfitableMonths] = useState<ProfitableMonth[]>([]);
  const [filesSaved, setFilesSaved] = useState<ImportItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  const [coffeeLimit, setCoffeeLimit] = useState(3);
  const [monthLimit, setMonthLimit] = useState(3);
  const [loadingCoffee, setLoadingCoffee] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);

  const fetchFiles = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await getFileData(user.id);
      setFilesSaved(result.data);

      if (result.data.length > 0) {
        setSelectedFileId(result.data[0].id);
      }
    } catch {
      toast.error("Erro ao carregar arquivos");
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const fetchTopCoffees = useCallback(async () => {
    if (!selectedFileId) return;

    try {
      setLoadingCoffee(true);
      const coffees = await getTopSellingCoffees(
        coffeeLimit,
        selectedFileId
      );
      console.dir(coffees, {depth: null})
      setTopCoffees(coffees);
    } finally {
      setLoadingCoffee(false);
    }
  }, [coffeeLimit, selectedFileId]);

  const fetchProfitableMonths = useCallback(async () => {
    if (!selectedFileId) return;

    try {
      setLoadingMonth(true);
      const months = await getMostProfitableMonths(
        monthLimit,
        selectedFileId
      );
      console.dir(months, {depth: null})
      setProfitableMonths(months);
    } finally {
      setLoadingMonth(false);
    }
  }, [monthLimit, selectedFileId]);

  useEffect(() => {
    fetchTopCoffees();
  }, [fetchTopCoffees]);

  useEffect(() => {
    fetchProfitableMonths();
  }, [fetchProfitableMonths]);

  return (
    <Box>
      <HeaderPage label="Dashboard" />

      <Box
        bg="#fff"
        border="1px solid"
        borderColor="#eceae8"
        rounded="md"
        p={4}
        mt={6}
      >
        <Flex align="center" gap={4}>
          <Text fontWeight="bold">Arquivo:</Text>

          <Select
            maxW="300px"
            value={selectedFileId ?? ""}
            onChange={(e) => setSelectedFileId(Number(e.target.value))}
          >
            {filesSaved.map((file) => (
              <option key={file.id} value={file.id}>
                {file.originalName}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>

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
                    R$ {item.totalSales.toFixed(2)}
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
                    R$ {(item.totalAmount ?? 0).toFixed(2)}
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
