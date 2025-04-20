// useDailyReward.ts — v2.0.0 (переведён на JWT + axios)
import { useEffect, useState } from "react";
import { api } from "../api/apiClient";

export function useDailyReward() {
  const [reward, setReward] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const claimReward = async () => {
      try {
        const res = await api.post("/ep/claim");
        const json = res.data;

        if (json.alreadyClaimed) {
          setAlreadyClaimed(true);
        } else {
          setReward(json.reward || "reward_box");
          setShowModal(true);
        }
      } catch (err: any) {
        if (err.response?.data?.error === "EP goal not reached yet") {
          setLoading(false);
          return; // не показываем ошибку
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    claimReward();
  }, []);

  return { reward, alreadyClaimed, showModal, setShowModal, loading, error };
}
