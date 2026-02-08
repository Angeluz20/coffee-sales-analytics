import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getMe, login as loginService, logout as logoutService, registerService } from './auth.service';

export type User = {
  id: number;
  email: string;
  username: string
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

type JwtPayload = {
  sub: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.dir(decoded, { depth: null });

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return;
      }

      getMe()
        .then(user => {
          setUser(user);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });

    } catch {
      localStorage.removeItem('token');
    }
  }, []);

  async function signIn(email: string, password: string) {
    const { access_token } = await loginService(email, password);

    localStorage.setItem('token', access_token);

    getMe()
      .then(user => {
        setUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
    });

    setIsAuthenticated(true);
  }

  async function signUp(username: string, email: string, password: string) {
    await registerService(username, email, password);
  }

  function signOut() {
    logoutService();
    localStorage.removeItem('token');

    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
