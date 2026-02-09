import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Flex, Box, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';

import { useAuth } from '../../auth/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import Logo from '../../imgs/coffee-logo.png';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    signIn(email, password)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        const errorMessage = err.response.data.message;
        if(errorMessage === 'User not found') {
            toast.error('Usuário não encontrado. Verifique seus dados e tente novamente.');
            return
        }
        toast.error('Erro ao fazer login');
      });
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    signUp(name, email, password)
      .then(() => {
        toast.success('Conta criada com sucesso!');
        setMode('login');
      })
      .catch(() => {
        toast.error('Erro ao criar conta');
      });
  }

  return (
    <Flex
      bg="#fcfbfb"
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
    >
      <Box
        bg="white"
        color="#222"
        p={4}
        borderRadius="4px"
        w="340px"
        display="flex"
        flexDirection="column"
        gap={3}
        border="1px solid"
        borderColor="#eceae8"
      >
        <Flex
          p={2}
          align="center"
          justify="center"
          direction="column"
        >
          <Image src={Logo} w="160px" p="10px" />
          <Text
            color="#6f4e37"
            fontWeight="600"
            fontSize="22px"
          >
            Coffee Insights
          </Text>
        </Flex>

        {mode === 'login' ? (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSubmit={handleLogin}
            onSwitch={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            name={name}
            email={email}
            password={password}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSubmit={handleRegister}
            onSwitch={() => setMode('login')}
          />
        )}
      </Box>
    </Flex>
  );
}
