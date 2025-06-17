import { useEffect, useState, useCallback } from "react";
import { api } from "../api/apiClient";

type EpResponse = {
  ep: number;
  double_goal: boolean;
  ep_reward_claimed: boolean;
  ep_frozen: boolean;
};

export function useUserEP() {
  const [ep, setEp] = useState(0);
  const [doubleGoal, setDoubleGoal] = useState(false);
  const [epClaimed, setEpClaimed] = useState(false);
  const [epFrozen, setEpFrozen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); // 🔁 триггер перезагрузки

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const fetchEP = async () => {
      setLoading(true);
      try {
        const res = await api.get<EpResponse>("/ep");

        setEp(Math.round(res.data.ep ?? 0));
        setDoubleGoal(!!res.data.double_goal);
        setEpClaimed(!!res.data.ep_reward_claimed);
        setEpFrozen(!!res.data.ep_frozen);
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

  const goal = 1000; // 🎯 ежедневная цель

  return {
    ep,
    goal,
    doubleGoal,
    epClaimed,
    epFrozen,
    loading,
    error,
    refetch,
  };
}