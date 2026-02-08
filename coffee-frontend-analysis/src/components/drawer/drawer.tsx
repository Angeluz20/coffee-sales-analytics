import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  Flex,
  Text
} from '@chakra-ui/react';
import { TbFileImport } from 'react-icons/tb';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export function SidebarDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const FileIconUpload = TbFileImport as React.ElementType;
  const IconDashboard = MdOutlineSpaceDashboard as React.ElementType;
  const IconMenu = IoMenu as React.ElementType;
  const IconLogOut = FiLogOut as React.ElementType;

  type ItemViewProps = {
    label: string;
    Icon: React.ElementType;
    path?: string;
    onClick?: () => void;
  };

  const ItemView = ({ label, Icon, path, onClick }: ItemViewProps) => {
    return (
      <Link to={path as string} onClick={onClick} style={{ textDecoration: 'none', width: '100%' }}>
        <Flex
          align="center"
          gap={2}
          p={3}
          rounded={20}
          _hover={{ color: '#dac568', bg: '#584437' }}
          cursor="pointer"
        >
          <Icon size={20} />
          <Text>{label}</Text>
        </Flex>
      </Link>
    );
  };

  function handleLogout() {
    signOut();
    onClose();
    navigate('/login');
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
        color="white"
        _hover={{ bg: 'whiteAlpha.200', transform: 'scale(1.1)' }}
        _active={{ bg: 'transparent' }}
        p={2}
      >
        <IconMenu />
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#4b3423" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Coffee Insights</DrawerHeader>
            <DrawerHeader fontSize={15}>Bem-vindo {user?.username}</DrawerHeader>
          <DrawerBody>
            <ItemView
              label="Importar dados"
              Icon={FileIconUpload}
              path="/import"
              onClick={onClose}
            />

            <ItemView
              label="Dashboard"
              Icon={IconDashboard}
              path="/"
              onClick={onClose}
            />

            <ItemView
              label="Sair"
              Icon={IconLogOut}
              onClick={handleLogout}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
