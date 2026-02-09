import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { GrUpload } from "react-icons/gr";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { HeaderPage } from "../../components/HeaderPages";
import {
  getFileData,
  importFile,
  removeFile,
} from "../../service/importService";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";

export type ImportStatus = "PENDING" | "PROCESSING" | "FINISHED" | "FAILED";

export type ImportItem = {
  id: number;
  originalName: string;
  storedName: string;
  fileHash: string;
  status: ImportStatus;
  totalRecords: number;
  processedRecords: number;
  errorMessage: string;
  createdAt: string;
  finishedAt: string;
  updatedAt: string;
};

export default function UploadFile() {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [filesSaved, setFilesSaved] = useState<ImportItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const IconUpload = GrUpload as React.ElementType;
  const IconFile = PiMicrosoftExcelLogoFill as React.ElementType;

  const formattedDate = (date: string) => {
    if (!date) return "-";

    const dateReceived = new Date(date);

    return dateReceived.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const fetchFiles = useCallback(async () => {
    if (!user?.id) return;

    try {
      const result = await getFileData(user.id);
      setFilesSaved(result.data);
    } catch {
      toast.error("Erro ao carregar arquivos");
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (!file || !user?.id) {
      toast.error("Selecione um arquivo primeiro");
      return;
    }

    setIsUploading(true);

    importFile(user.id, file)
      .then(async () => {
        toast.success("Importado com sucesso!");
        setFile(null);
        await fetchFiles();
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message;

        if (
          errorMessage ===
          "This file has already been imported and no changes were detected"
        ) {
          toast.warn(
            "Este arquivo já foi importado e nenhuma alteração foi detectada."
          );
          return;
        }

        if (
          errorMessage?.startsWith(
            "Invalid file structure. Missing columns:"
          )
        ) {
          const columns = errorMessage
            .replace("Invalid file structure. Missing columns:", "")
            .trim();

          toast.error(
            `Estrutura do arquivo inválida. Coluna(s) obrigatória(s) ausente(s): ${columns}.`
          );
          return;
        }

        toast.error("Erro ao cadastrar o arquivo");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleRemoveItem = async (id: number) => {
    try {
      setDeletingId(id);
      await removeFile(id);
      toast.success("Removido com sucesso!");
      await fetchFiles();
    } catch {
      toast.error("Erro ao remover o arquivo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box>
      <HeaderPage
        label="Importar Dados"
        description="Faça upload do arquivo XLSX com os dados de vendas de café"
      />

      <Box p={10} bg="#fff" border="1px solid" borderColor="#eceae8" rounded="md">
        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor={isDragActive ? "#eceae8" : "gray.300"}
          borderRadius="md"
          bg={file ? "green.50" : "#fff"}
          p={10}
          textAlign="center"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ borderColor: "yellow.400", bg: "#f1eded56" }}
        >
          <input {...getInputProps()} />

          <Flex direction="column" align="center" justify="center" gap={3}>
            <IconUpload size={50} color={file ? "#38A169" : "#a8a8a8"} />
            <Text fontSize="md" color="gray.600">
              {file
                ? `Arquivo selecionado: ${file.name}`
                : isDragActive
                ? "Solte o arquivo aqui"
                : "Arraste ou clique para selecionar"}
            </Text>
          </Flex>
        </Box>

        {file && (
          <Flex
            align="center"
            justify="space-between"
            mt={10}
            border="1px solid"
            borderColor="gray.300"
            bg="#fff"
            borderRadius={10}
            p={3}
          >
            <Flex align="center" gap={2}>
              <IconFile size={30} color="#216641" />
              <Text color="#216641" fontWeight="medium">
                {file.name}
              </Text>
            </Flex>

            <Button
              colorScheme="green"
              isLoading={isUploading}
              loadingText="Enviando"
              onClick={handleUpload}
            >
              Enviar
            </Button>
          </Flex>
        )}
      </Box>

      {filesSaved.length > 0 && (
        <TableContainer bg="#fff" mt={10}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nome</Th>
                <Th>Data</Th>
                <Th>Modificado</Th>
                <Th textAlign="center">Ações</Th>
              </Tr>
            </Thead>

            <Tbody>
              {filesSaved.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.originalName}</Td>
                  <Td>{formattedDate(item.createdAt)}</Td>
                  <Td>{formattedDate(item.updatedAt)}</Td>
                  <Td textAlign="center">
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      isLoading={deletingId === item.id}
                      loadingText="Removendo"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remover
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
