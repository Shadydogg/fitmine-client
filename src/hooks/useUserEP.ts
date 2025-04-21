// useUserEP.ts — v2.1.0
import { useEffect, useState, useCallback } from "react";
import { api } from "../api/apiClient";

export function useUserEP() {
  const [ep, setEp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // 🔁 для refetch

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const fetchEP = async () => {
      setLoading(true);
      try {
        const res = await api.get("/ep");
        setEp(Math.round(res.data.ep || 0));
        setError(null);
      } catch (err: any) {
        console.error("❌ Ошибка получения EP:", err);
        setError(err.message || "Ошибка загрузки EP");
      } finally {
        setLoading(false);
      }
    };

    fetchEP();
  }, [version]);

  return { ep, loading, error, refetch };
}
