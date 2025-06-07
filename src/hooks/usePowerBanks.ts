import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext"; // ✅ получаем accessToken

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
  const { accessToken } = useSession(); // ✅ доступ к токену
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [powerbanks, setPowerbanks] = useState<PowerBank[]>([]);

  const fetch = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const { data } = await axios.get("/api/powerbanks", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ добавлен Authorization
        },
      });

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
  }, [accessToken]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { count, powerbanks, loading, refetch: fetch };
}
