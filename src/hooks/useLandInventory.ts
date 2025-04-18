import { useEffect, useState } from "react";
import { LandNFT } from "../types/land";
import api from "../api/apiClient";

export function useLandInventory() {
  const [lands, setLands] = useState<LandNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const { data } = await api.get("/land");
        setLands(data);
      } catch (err: any) {
        console.error("❌ Ошибка загрузки земель:", err);
        setError(err.message || "Failed to load lands");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  return { lands, loading, error };
}
