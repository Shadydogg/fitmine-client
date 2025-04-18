import { useEffect, useState } from "react";
import { LandNFT } from "../types/land";
import api from "../api/apiClient";

export function useLandInventory() {
  const [lands, setLands] = useState<LandNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLands = async () => {
    try {
      const { data } = await api.get("/land");
      const mapped = data.map((land: any) => ({
        ...land,
        bonusMultiplier: land.bonus_multiplier,
        connectedMinerIds: land.connected_miner_ids,
        telegramId: land.telegram_id,
      }));
      setLands(mapped);
    } catch (err: any) {
      console.error("❌ Ошибка загрузки земель:", err);
      setError(err.message || "Failed to load lands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  return { lands, loading, error, refetch: fetchLands };
}
