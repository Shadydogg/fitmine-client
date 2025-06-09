// src/hooks/useUserEP.ts — v2.2.0
import { useEffect, useState, useCallback } from "react";
import { api } from "../api/apiClient";

type EpResponse = {
  ep: number;
  double_goal?: boolean;
  ep_reward_claimed?: boolean;
};

export function useUserEP() {
  const [ep, setEp] = useState<number>(0);
  const [doubleGoal, setDoubleGoal] = useState<boolean>(false);
  const [epClaimed, setEpClaimed] = useState<boolean>(false);
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
        const res = await api.get<EpResponse>("/ep");
        const rawEP = Math.round(res.data.ep || 0);
        setEp(rawEP);
        setDoubleGoal(!!res.data.double_goal);
        setEpClaimed(!!res.data.ep_reward_claimed);
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

  // ❗️Цель EP всегда фиксированная, даже если doubleGoal
  const goal = 1000;

  return { ep, goal, doubleGoal, epClaimed, loading, error, refetch };
}
