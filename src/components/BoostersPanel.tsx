// src/components/BoostersPanel.tsx — v1.0.0 (активация и отображение бустеров)
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../api/apiClient";

interface Booster {
  id: string;
  type: string;
  duration: number;
  boost: number;
  active_at: string;
  created_at: string;
  updated_at: string;
}

const BOOSTER_LABELS: Record<string, string> = {
  hashrate: "⚡ Hashrate Boost",
  ep_boost: "🔥 EP Boost",
  xp_boost: "🎯 XP Boost",
  pvp_shield: "🛡 PvP Shield",
};

const BoostersPanel: React.FC = () => {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoosters = async () => {
    try {
      const res = await api.get("/boosters");
      setBoosters(res.data.boosters || []);
    } catch (err) {
      console.error("Ошибка загрузки бустеров:", err);
    }
  };

  const activateBooster = async (type: string) => {
    try {
      setLoading(true);
      const res = await api.post("/boosters", { type });
      if (res.data.ok) {
        await fetchBoosters();
      }
    } catch (err) {
      console.error("Ошибка активации бустера:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoosters();
  }, []);

  return (
    <div className="text-white space-y-4 px-4 py-6">
      <h2 className="text-xl font-bold mb-2">🚀 Boosters</h2>

      <div className="space-y-3">
        {Object.keys(BOOSTER_LABELS).map((type) => (
          <button
            key={type}
            disabled={loading}
            onClick={() => activateBooster(type)}
            className="w-full px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:opacity-50 text-sm shadow"
          >
            Активировать {BOOSTER_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">🧪 Активные Boosters</h3>
        {boosters.length === 0 ? (
          <p className="text-sm text-gray-400">Нет активных бустеров</p>
        ) : (
          <ul className="space-y-2">
            {boosters.map((b) => (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-4 py-2 bg-zinc-800 rounded border border-zinc-600 text-sm"
              >
                {BOOSTER_LABELS[b.type] || b.type} • {b.boost}× • {b.duration} мин
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BoostersPanel;
