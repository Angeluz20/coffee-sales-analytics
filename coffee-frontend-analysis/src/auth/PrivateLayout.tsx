import { Flex, Box } from '@chakra-ui/react';
import { SidebarDrawer } from '../components/drawer/drawer';

export function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh" bg="#4b3423">
      <SidebarDrawer />

      <Box flex="1" p={6} bg="#f9f7f5">
        {children}
      </Box>
    </Flex>
  );
}
