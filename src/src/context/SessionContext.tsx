// SessionContext.tsx — v1.1.0
import React, { createContext, useContext, useEffect, useState } from 'react';

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  isAuthenticated: boolean;
  sessionLoaded: boolean;
  setTokens: (access: string, refresh: string, user: any) => void;
  clearSession: () => void;
};

const SessionContext = createContext<Session | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false); // 🔑 добавлен

  useEffect(() => {
    const storedAccess = localStorage.getItem('access_token');
    const storedRefresh = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');

    if (storedAccess) setAccessToken(storedAccess);
    if (storedRefresh) setRefreshToken(storedRefresh);
    if (storedUser) setUser(JSON.parse(storedUser));

    setSessionLoaded(true); // ✅ теперь context готов
  }, []);

  const setTokens = (access: string, refresh: string, userObj: any) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(userObj));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userObj);
  };

  const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken && sessionLoaded,
        sessionLoaded,
        setTokens,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// 🔌 Глобальный хук
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
