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

const BOOSTER_COLORS: Record<string, string> = {
  hashrate: "from-yellow-400 to-orange-500",
  ep_boost: "from-pink-500 to-red-500",
  xp_boost: "from-blue-500 to-purple-500",
  pvp_shield: "from-lime-400 to-emerald-500",
};

function getRemainingMinutes(activatedAt: string, duration: number) {
  const now = new Date();
  const activated = new Date(activatedAt);
  const expires = new Date(activated.getTime() + duration * 60_000);
  const diff = Math.max(0, expires.getTime() - now.getTime());
  return Math.ceil(diff / 60_000);
}

export default function BoostersPanel() {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBoosters = async () => {
    try {
      const res = await api.get("/boosters");
      setBoosters(res.data.boosters || []);
    } catch (err) {
      console.error("❌ Ошибка загрузки бустеров:", err);
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
      console.error("❌ Ошибка активации бустера:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoosters();
    const interval = setInterval(fetchBoosters, 30_000); // 🔁 каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white space-y-6 px-4 py-6">
      <h2 className="text-xl font-bold">🚀 Доступные Бустеры</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.keys(BOOSTER_LABELS).map((type) => (
          <motion.button
            key={type}
            disabled={loading}
            onClick={() => activateBooster(type)}
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-br ${
              BOOSTER_COLORS[type]
            } shadow-md hover:opacity-90 transition-all duration-300 disabled:opacity-50`}
          >
            {BOOSTER_LABELS[type]}
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">🧪 Активные Boosters</h3>

        {boosters.length === 0 ? (
          <p className="text-sm text-gray-400">Нет активных бустеров</p>
        ) : (
          <ul className="space-y-4">
            {boosters.map((b) => {
              const remaining = getRemainingMinutes(b.active_at, b.duration);
              const glow = BOOSTER_COLORS[b.type] || "from-white to-zinc-500";

              return (
                <motion.li
                  key={b.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 overflow-hidden"
                >
                  <motion.div
                    className={`absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-br ${glow}`}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <div className="text-sm font-semibold text-white">
                    {BOOSTER_LABELS[b.type] || b.type}
                  </div>

                  <div className="text-xs text-zinc-400">
                    Эффект:{" "}
                    <span className="text-emerald-400 font-medium">{b.boost}×</span> •{" "}
                    Осталось:{" "}
                    <span className={remaining <= 5 ? "text-yellow-400" : ""}>
                      {remaining} мин
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
