// /src/hooks/usePowerBanks.ts — v2.1.0
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function usePowerBanks() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/powerbanks");
      const available = Array.isArray(data.powerbanks)
        ? data.powerbanks.filter((pb: any) => !pb.used).length
        : 0;
      setCount(available);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { count, loading, refetch: fetch };
}
