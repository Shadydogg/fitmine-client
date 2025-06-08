import { useState } from "react";
import { api } from "../api/apiClient";

export function useDailyReward() {
  const [reward, setReward] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
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

      // 🛑 Уже получено
      if (json.alreadyClaimed || json.error === "Reward already claimed") {
        setAlreadyClaimed(true);
        return { ok: false, error: "Reward already claimed" };
      }

      // ✅ Успешно
      if (json.ok && json.rewardId) {
        setReward(json.rewardId);
        setShowModal(true);
        setAlreadyClaimed(true); // гарантированно, даже если сразу нажал повторно
        return { ok: true, rewardId: json.rewardId };
      }

      return { ok: false, error: json.error || "Unknown error" };
    } catch (err: any) {
      const msg = err.response?.data?.error;

      if (msg === "EP goal not reached yet") return { ok: false, error: msg };
      if (msg === "Reward already claimed") {
        setAlreadyClaimed(true);
        return { ok: false, error: msg };
      }

      setError(err.message || "Unknown error");
      return { ok: false, error: err.message || "Unknown error" };
    } finally {
      setLoading(false);
    }
  };

  return {
    reward,
    alreadyClaimed,
    showModal,
    setShowModal,
    loading,
    error,
    claim,
  };
}
