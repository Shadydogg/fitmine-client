// src/hooks/useBoosters.ts — v1.0.0 (получение активных бустеров)
import { useEffect, useState, useCallback } from "react";
import { api } from "../api/apiClient";

export interface Booster {
  id: string;
  type: string;
  boost: number;
  duration: number;
  active_at: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export function useBoosters() {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoosters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/boosters");
      setBoosters(res.data.boosters || []);
      setError(null);
    } catch (err: any) {
      console.error("❌ Ошибка загрузки бустеров:", err);
      setError(err.message || "Ошибка загрузки бустеров");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoosters();
  }, [fetchBoosters]);

  return { boosters, loading, error, refetch: fetchBoosters };
}
