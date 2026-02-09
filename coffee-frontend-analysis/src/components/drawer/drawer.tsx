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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

export function SidebarDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    const isActive = path
      ? location.pathname === path ||
        location.pathname.startsWith(`${path}/`)
      : false;

    return (
      <Link
        to={path as string}
        onClick={onClick}
        style={{ textDecoration: 'none', width: '100%' }}
      >
        <Flex
          align="center"
          gap={3}
          p={3}
          rounded={20}
          cursor="pointer"
          transition="all 0.2s"
          bg={isActive ? '#584437' : 'transparent'}
          color={isActive ? '#dac568' : 'white'}
          fontWeight={isActive ? 'bold' : 'normal'}
          _hover={{
            bg: '#584437',
            color: '#dac568'
          }}
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
        <IconMenu size={22} />
      </Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#4b3423" color="white">
          <DrawerCloseButton />
          <DrawerHeader>Coffee Insights</DrawerHeader>
          <DrawerHeader fontSize={15}>
            Bem-vindo {user?.username}
          </DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap={1}>
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
