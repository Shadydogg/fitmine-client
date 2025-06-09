// /src/hooks/useDailyReward.ts — v2.0.0 (аудит по MASTER BLUEPRINT)
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api/apiClient";

export function useDailyReward() {
  const [reward, setReward] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [doubleGoalActive, setDoubleGoalActive] = useState(false);
  const [goalNotReached, setGoalNotReached] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = async (): Promise<{
    ok: boolean;
    rewardId?: string;
    error?: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/ep/claim");
      const json = res.data;

      if (json.alreadyClaimed) {
        setAlreadyClaimed(true);
        toast.info("⚡ PowerBank уже получен сегодня");
        return { ok: false, error: "already_claimed" };
      }

      if (json.doubleGoalActive) {
        setDoubleGoalActive(true);
        toast.warning("⚡ PowerBank уже был применён сегодня");
        return { ok: false, error: "double_goal_active" };
      }

      if (json.goalNotReached) {
        setGoalNotReached(true);
        toast.info(`⛔ Сначала нужно достичь цели активности`);
        return { ok: false, error: "goal_not_reached" };
      }

      if (json.ok && json.rewardId) {
        setReward(json.rewardId);
        setShowModal(true);
        setAlreadyClaimed(true);
        toast.success("🎁 PowerBank получен!");
        return { ok: true, rewardId: json.rewardId };
      }

      toast.error("❌ Не удалось получить PowerBank");
      return { ok: false, error: json.error || "Unknown error" };
    } catch (err: any) {
      const msg = err.response?.data?.error || "Ошибка при получении награды";
      toast.error(`❌ ${msg}`);
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    reward,
    alreadyClaimed,
    doubleGoalActive,
    goalNotReached,
    showModal,
    setShowModal,
    loading,
    error,
    claim,
  };
}
