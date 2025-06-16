import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "../context/SessionContext";
import { PowerBank } from "../types/PowerBank";

export function usePowerBanks() {
  const { accessToken } = useSession();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [powerbanks, setPowerbanks] = useState<PowerBank[]>([]);

  const fetch = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const { data } = await axios.get("/api/powerbanks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (Array.isArray(data.powerbanks)) {
        const today = new Date().toISOString().slice(0, 10);

        const cleanList: PowerBank[] = data.powerbanks
          .map((pb: any) => {
            const used_at = pb.used_at ? new Date(pb.used_at).toISOString().slice(0, 10) : null;
            return {
              ...pb,
              used: pb.used === true,
              usedToday: used_at === today,
            };
          })
          .sort((a: PowerBank, b: PowerBank) => {
            const dateA = new Date(a.claimed_at || "").getTime();
            const dateB = new Date(b.claimed_at || "").getTime();
            return dateB - dateA;
          });

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