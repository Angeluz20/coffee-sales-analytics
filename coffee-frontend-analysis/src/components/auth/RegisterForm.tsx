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

type RegisterFormProps = {
  name: string;
  email: string;
  password: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
};

export function RegisterForm({
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  handleSubmit,
  onSwitch
}: RegisterFormProps) {
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  const isNameValid = name.trim().length >= 3;
  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid;

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <Text fontSize="lg" fontWeight="bold">
        Crie sua conta
      </Text>

      <FormControl isInvalid={touched.name && !isNameValid}>
        <Input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
        />
        <FormErrorMessage>
          Nome deve ter ao menos 3 caracteres
        </FormErrorMessage>
      </FormControl>

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
        Registrar
      </Button>

      <Link
        cursor="pointer"
        fontSize="12px"
        color="teal.900"
        onClick={onSwitch}
      >
        Já tem uma conta? Faça login.
      </Link>
    </Box>
  );
}
