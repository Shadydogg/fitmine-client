import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { calculateEnergy } from "../lib/calculateEnergy";
import { useSession } from "../context/SessionContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          console.warn(t("sync.errorNoToken"));
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

        const { steps, calories, hasNFT, isPremium } = res.data;
        const energy = calculateEnergy(res.data);

        setData({
          steps,
          stepsGoal: 10000,
          calories,
          caloriesGoal: 2000,
          energy,
          energyGoal: 100,
          hasNFT,
          isPremium,
          loading: false,
        });
      } catch (error) {
        console.error("Error syncing activity:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [accessToken, sessionLoaded, isAuthenticated, version, t]);

  return { ...data, refetch };
}
