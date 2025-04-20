// useDailyReward.ts — v1.0.0
import { useEffect, useState } from "react";

function getTelegramInitDataRaw() {
  return typeof window !== "undefined" ? window.Telegram?.WebApp?.initData || "" : "";
}

export function useDailyReward() {
  const [reward, setReward] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = getTelegramInitDataRaw();
    if (!initData) {
      setError("initData not found");
      setLoading(false);
      return;
    }

    const claimReward = async () => {
      try {
        const res = await fetch("/api/ep/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        const json = await res.json();

        if (!res.ok) {
          if (json.error === "EP goal not reached yet") {
            // silently ignore
            setLoading(false);
            return;
          }
          throw new Error(json.error || "Unknown error");
        }

        if (json.alreadyClaimed) {
          setAlreadyClaimed(true);
        } else {
          setReward(json.reward || "reward_box");
          setShowModal(true); // 🎉 показываем модалку
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    claimReward();
  }, []);

  return { reward, alreadyClaimed, showModal, setShowModal, loading, error };
}
