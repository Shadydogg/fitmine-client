// /src/hooks/usePowerBanks.ts — v2.2.0
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type PowerBank = {
  id: string;
  used: boolean;
  used_at?: string;
  claimed_at?: string;
  powerbank_type?: string;
  source?: string;
  ep_amount?: number;
};

export function usePowerBanks() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [powerbanks, setPowerbanks] = useState<PowerBank[]>([]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/powerbanks");
      if (Array.isArray(data.powerbanks)) {
        const cleanList: PowerBank[] = data.powerbanks.map((pb: any) => ({
          ...pb,
          used: pb.used === true, // явно приводим к boolean
        }));

        const available = cleanList.filter((pb) => !pb.used).length;
        setPowerbanks(cleanList);
        setCount(available);
      } else {
        setPowerbanks([]);
        setCount(0);
      }
    } catch (err) {
      console.error("❌ usePowerBanks fetch error:", err);
      setPowerbanks([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { count, powerbanks, loading, refetch: fetch };
}
