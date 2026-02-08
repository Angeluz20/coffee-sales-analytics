import { api } from "../service/api";


type LoginResponse = {
  access_token: string;
}

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return response.data;
}

export async function registerService(
  username: string,
  email: string,
  password: string
) {
  const { data } = await api.post('/users', {
    username,
    email,
    password,
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get('/users/me');
  return data.data;
}

export function logout() {
  localStorage.removeItem('token');
}
