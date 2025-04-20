// useUserEP.ts — v1.0.1 (встроенная функция получения initData)
import { useEffect, useState } from "react";

function getTelegramInitDataRaw() {
  return typeof window !== "undefined" ? window.Telegram?.WebApp?.initData || "" : "";
}

export function useUserEP() {
  const [ep, setEp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = getTelegramInitDataRaw();
    if (!initData) {
      setError("initData not found");
      setLoading(false);
      return;
    }

    const fetchEP = async () => {
      try {
        const res = await fetch("/api/ep", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Unknown error");
        }

        setEp(Math.round(json.ep));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEP();
  }, []);

  return { ep, loading, error };
}
