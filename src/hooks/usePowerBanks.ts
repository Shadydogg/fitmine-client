// hooks/usePowerBanks.ts — v2.0.0 (расширен: возвращает список, рефетч и загрузку)
import { useEffect, useState } from 'react';
import axios from 'axios';

export function usePowerBanks() {
  const [powerbanks, setPowerbanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/powerbanks');
      setPowerbanks(data.powerbanks || []);
    } catch {
      setPowerbanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    powerbanks,
    refetch: load,
    loading,
  };
}
