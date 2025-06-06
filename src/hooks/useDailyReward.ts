// /src/hooks/useDailyReward.ts — v2.2.2
import { useState } from "react";
import { api } from "../api/apiClient";

export function useDailyReward() {
  const [reward, setReward] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/ep/claim");
      const json = res.data;

      if (json.alreadyClaimed || json.error === "Reward already claimed") {
        setAlreadyClaimed(true);
      } else if (json.rewardId) {
        setReward(json.rewardId); // ✅ Используем rewardId, как на backend
        setShowModal(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error;
      if (msg === "EP goal not reached yet") return;
      if (msg === "Reward already claimed") setAlreadyClaimed(true);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { reward, alreadyClaimed, showModal, setShowModal, loading, error, claim };
}
