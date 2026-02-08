import { Box, Text, Divider } from '@chakra-ui/react';

type HeaderPageProps = {
  label: string;
  description?: string;
};

export function HeaderPage({ label, description }: HeaderPageProps) {
  return (
    <Box mb={6}>
      <Text
        fontSize="36px"
        fontWeight="bold"
        color="#6f4e37"
        mb={1}
      >
        {label}
      </Text>

      {description && (
        <Text
          fontSize="16px"
          color="#6f4e3785"
          mb={3}
        >
          {description}
        </Text>
      )}

      <Divider />
    </Box>
  );
}
