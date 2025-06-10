// src/hooks/useSyncActivity.ts — v2.1.0
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext";

interface ActivityData {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  distance: number; // в километрах
  distanceGoal: number; // в километрах
  activeMinutes: number;
  activeMinutesGoal: number;
  hasNFT: boolean;
  isPremium: boolean;
  loading: boolean;
  refetch: () => void;
}

export default function useSyncActivity(): ActivityData {
  const { accessToken, sessionLoaded, isAuthenticated } = useSession();
  const [version, setVersion] = useState(0);

  const [data, setData] = useState<Omit<ActivityData, "refetch">>({
    steps: 0,
    stepsGoal: 10000,
    calories: 0,
    caloriesGoal: 2000,
    distance: 0,
    distanceGoal: 5,
    activeMinutes: 0,
    activeMinutesGoal: 45,
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
          console.warn("❌ Нет accessToken или пользователь не авторизован");
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

        const distanceMeters = d.distance ?? 0;
        const distanceKm = distanceMeters / 1000;

        setData({
          steps: d.steps ?? 0,
          stepsGoal: d.stepsGoal ?? 10000,
          calories: d.calories ?? 0,
          caloriesGoal: d.caloriesGoal ?? 2000,
          distance: distanceKm,
          distanceGoal: d.distanceGoal ?? 5,
          activeMinutes: d.minutes ?? 0,
          activeMinutesGoal: d.minutesGoal ?? 45,
          hasNFT: !!d.hasNFT,
          isPremium: !!d.isPremium,
          loading: false,
        });
      } catch (err) {
        console.error("❌ Ошибка при синхронизации данных:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [accessToken, sessionLoaded, isAuthenticated, version]);

  return { ...data, refetch };
}