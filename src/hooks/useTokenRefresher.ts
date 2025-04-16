// useSession.ts — v1.0.0
import { useEffect, useState } from 'react';

export default function useSession() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = () => {
      setAccessToken(localStorage.getItem('access_token'));
      setRefreshToken(localStorage.getItem('refresh_token'));
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    load();

    // 🔄 Обновление при изменении в другом табе
    const sync = () => load();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const isAuthenticated = !!accessToken;

  const setTokens = (access_token: string, refresh_token: string, user: any) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));

    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setUser(user);
  };

  const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setTokens,
    clearSession,
  };
}
