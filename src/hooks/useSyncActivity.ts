import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { calculateEnergy } from "../lib/calculateEnergy";
import { useSession } from "../context/SessionContext";

interface ActivityData {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  energy: number;
  energyGoal: number;
  hasNFT: boolean;
  isPremium: boolean;
  loading: boolean;
  refetch: () => void;
}

export default function useSyncActivity(): ActivityData {
  const { accessToken, sessionLoaded, isAuthenticated } = useSession();
  const [version, setVersion] = useState(0); // 🔁 триггер на обновление

  const [data, setData] = useState<Omit<ActivityData, "refetch">>({
    steps: 0,
    stepsGoal: 10000,
    calories: 0,
    caloriesGoal: 2000, // ✅ новая цель по умолчанию
    energy: 0,
    energyGoal: 100,
    hasNFT: false,
    isPremium: false,
    loading: true,
  });

  const refetch = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    if (!sessionLoaded) return;

    const fetchData = async () => {
      try {
        if (!accessToken || !isAuthenticated) {
          console.warn("❌ accessToken отсутствует или пользователь не авторизован");
          setData((prev) => ({ ...prev, loading: false }));
          return;
        }

        const res = await axios.post(
          "https://api.fitmine.vip/api/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const d = res.data;

        const energy = calculateEnergy({
          steps: d.steps || 0,
          calories: d.calories || 0,
          activeMinutes: d.minutes || 0,
          hasNFT: d.hasNFT || false,
          isPremium: d.isPremium || false,
          isEarlyAccess: d.isEarlyAccess || false,
        });

        setData({
          steps: d.steps || 0,
          stepsGoal: d.stepsGoal || 10000,
          calories: d.calories || 0,
          caloriesGoal: d.caloriesGoal || 2000, // ✅ теперь всегда 2000, даже если сервер ничего не прислал
          energy,
          energyGoal: 100,
          hasNFT: d.hasNFT || false,
          isPremium: d.isPremium || false,
          loading: false,
        });
      } catch (err) {
        console.error("❌ Ошибка синхронизации активности:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [accessToken, sessionLoaded, isAuthenticated, version]);

  return { ...data, refetch };
}
