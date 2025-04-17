import React, { createContext, useContext, useEffect, useState } from 'react';

type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  isAuthenticated: boolean;
  sessionLoaded: boolean;
  setTokens: (access: string, refresh: string, user: any) => void;
  clearSession: () => void;
  refreshUser: () => Promise<void>; // ✅ новое
};

const SessionContext = createContext<Session | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  // ✅ Гарантированная инициализация токенов из localStorage
  useEffect(() => {
    const syncFromStorage = () => {
      const storedAccess = localStorage.getItem('access_token');
      const storedRefresh = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');

      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    syncFromStorage();
    setSessionLoaded(true);

    // 🔄 Автообновление из других вкладок
    const onStorageChange = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  // ✅ Устанавливаем токены и обновляем стейт
  const setTokens = (access: string, refresh: string, userObj: any) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(userObj));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userObj);
    setSessionLoaded(true);
  };

  // ✅ Обновление user из API /profile
  const refreshUser = async () => {
    if (!accessToken) return;

    try {
      const res = await fetch('https://api.fitmine.vip/api/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.ok && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('✅ Пользователь обновлён через refreshUser');
      }
    } catch (err) {
      console.warn('⚠️ Ошибка при обновлении пользователя:', err);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setSessionLoaded(false);
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
        refreshUser, // ✅ экспортируем
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};