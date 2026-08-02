import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';

// ========================
// Auth Context Definition
// ========================

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check token and load current user profile on initial mount
    async function loadUser() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get<User>('/api/auth/me');
          setUser(res.data);
        } catch {
          localStorage.removeItem('access_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const res = await api.post<{ access_token: string; user: User }>('/api/auth/login', credentials);
    localStorage.setItem('access_token', res.data.access_token);
    setUser(res.data.user);
  };

  const register = async (data: RegisterRequest) => {
    const res = await api.post<{ access_token: string; user: User }>('/api/auth/register', data);
    localStorage.setItem('access_token', res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
