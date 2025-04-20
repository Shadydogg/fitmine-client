// useUserEP.ts — v2.0.0 (переведён на JWT + axios)
import { useEffect, useState } from "react";
import { api } from "../api/apiClient";

export function useUserEP() {
  const [ep, setEp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEP = async () => {
      try {
        const res = await api.get("/ep");
        setEp(Math.round(res.data.ep || 0));
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
