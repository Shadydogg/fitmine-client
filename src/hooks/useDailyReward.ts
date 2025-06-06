// useDailyReward.ts — v2.2.0 (ручной вызов claim, нет автозапроса)
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
        setReward(json.rewardId);
        setShowModal(true);
      }
    } catch (err: any) {
      if (err.response?.data?.error === "EP goal not reached yet") {
        return;
      }
      if (err.response?.data?.error === "Reward already claimed") {
        setAlreadyClaimed(true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { reward, alreadyClaimed, showModal, setShowModal, loading, error, claim };
}
