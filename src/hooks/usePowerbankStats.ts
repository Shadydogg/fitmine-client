// /src/hooks/usePowerbankStats.ts — v1.0.0
import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';

type Stats = {
  usedCount: number;
  lastUsedAt: string | null;
  usedToday: boolean;
};

export function usePowerbankStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // 🔁 for refetch

  const refetch = () => setVersion((v) => v + 1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/powerbanks/stats');
        if (res.data.ok) {
          setStats(res.data);
          setError(null);
        } else {
          setError(res.data.error || 'Ошибка запроса');
        }
      } catch (err: any) {
        console.error('❌ Ошибка получения статистики PowerBank:', err);
        setError(err.message || 'Ошибка запроса');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [version]);

  return { ...stats, loading, error, refetch };
}
