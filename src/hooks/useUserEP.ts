// src/hooks/useUserEP.ts — v2.3.0
import { useEffect, useState, useCallback } from "react";
import { api } from "../api/apiClient";

type EpResponse = {
  ep: number;
  double_goal: boolean;
  ep_reward_claimed: boolean;
};

export function useUserEP() {
  const [ep, setEp] = useState(0);
  const [doubleGoal, setDoubleGoal] = useState(false);
  const [epClaimed, setEpClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // 🔁 для ручного refetch

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const fetchEP = async () => {
      setLoading(true);
      try {
        const res = await api.get<EpResponse>("/ep");

        const rawEP = Math.round(res.data.ep || 0);
        const isDouble = !!res.data.double_goal;
        const isClaimed = !!res.data.ep_reward_claimed;

        setEp(rawEP);
        setDoubleGoal(isDouble);
        setEpClaimed(isClaimed);
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

  // ❗️Цель всегда 1000 — даже при double goal, он влияет на отображение и прогресс
  const goal = 1000;

  return {
    ep,
    goal,
    doubleGoal,
    epClaimed,
    loading,
    error,
    refetch,
  };
}
