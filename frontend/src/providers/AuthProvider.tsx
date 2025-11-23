import type { AuthResponse, Tokens } from "@/types/auth";
import type { User } from "@/types/user";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  tokens: Tokens | null;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  loading: boolean;
  guest: boolean;
  setGuest: (state: boolean) => void;
  refreshTokens: (newTokens: Tokens) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('accessToken');
  });

  const [tokens, setTokens] = useState<Tokens | null>(() => {
    const stored = localStorage.getItem('tokens');
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [guest, setGuest] = useState<boolean>(false);

  useEffect(() => {
    const storedTokens = localStorage.getItem('tokens');
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
      setAuthenticated(true);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedTokens === "none") {
      setGuest(true);
    }

    setLoading(false);
  }, []);

  const login = (authResponse: AuthResponse) => {
    localStorage.setItem('tokens', JSON.stringify(authResponse.tokens));
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    setTokens(authResponse.tokens);
    setUser(authResponse.user);
    setAuthenticated(true);
    setGuest(false);
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setTokens(null);
    setUser(null);
    setAuthenticated(false);
    setGuest(false);
  };

  // Update tokens after a refresh
  const refreshTokens = (newTokens: Tokens) => {
    localStorage.setItem('tokens', JSON.stringify(newTokens));
    setTokens(newTokens);
    setAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        tokens,
        login,
        logout,
        setUser,
        loading,
        guest,
        setGuest,
        refreshTokens
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
