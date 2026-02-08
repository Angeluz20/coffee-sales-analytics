import {
  Input,
  Link,
  Text,
  FormControl,
  FormErrorMessage,
  Box,
  Button
} from '@chakra-ui/react';
import { useState } from 'react';

type LoginFormProps = {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
};

export function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  handleSubmit,
  onSwitch
}: LoginFormProps) {
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <Text fontSize="lg" fontWeight="bold">
        Login
      </Text>

      <FormControl isInvalid={touched.email && !isEmailValid}>
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, email: true }))}
        />
        <FormErrorMessage>Email inválido</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={touched.password && !isPasswordValid}>
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, password: true }))}
        />
        <FormErrorMessage>
          A senha deve ter ao menos 6 caracteres
        </FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        bg="#6f4e37"
        color="white"
        _hover={{ opacity: 0.9 }}
        isDisabled={!isFormValid}
      >
        Entrar
      </Button>

      <Link
        cursor="pointer"
        fontSize="12px"
        color="teal.900"
        onClick={onSwitch}
      >
        Novo por aqui? Faça o registro agora.
      </Link>
    </Box>
  );
}
