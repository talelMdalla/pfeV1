import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiService, User } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, '_id'>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEYS = {
  token: "token",
  user: "user",
} as const;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.token);
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);

      setToken(storedToken);

      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser) as User);
      } catch {
        setUser(null);
      }
    };

    syncSession();
    setIsLoading(false);
    window.addEventListener("storage", syncSession);
    window.addEventListener("mentora:session-cleared", syncSession as EventListener);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("mentora:session-cleared", syncSession as EventListener);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);

      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(STORAGE_KEYS.token, response.token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, '_id'>) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      if (response.token && response.user) {
        const normalized = {
          ...response.user,
          id: response.user.id ?? response.user._id,
          _id: response.user._id ?? response.user.id,
        };
        setToken(response.token);
        setUser(normalized);
        localStorage.setItem(STORAGE_KEYS.token, response.token);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalized));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
