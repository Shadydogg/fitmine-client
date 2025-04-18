import React, { useState } from "react";
import { useLandInventory } from "../hooks/useLandInventory";
import LandCard from "../components/LandCard";
import BottomTab from "../components/BottomTab";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";

const LandPage: React.FC = () => {
  const { lands, loading, error, refetch } = useLandInventory();
  const { accessToken } = useSession();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateLand = async () => {
    if (!accessToken) return;
    setCreating(true);
    setCreateError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("https://api.fitmine.vip/api/land/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (data.ok) {
        await refetch();
        setSuccessMessage("🌍 Земля успешно создана!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setCreateError(data.error || "Ошибка минта");
      }
    } catch (err) {
      setCreateError("Ошибка соединения");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-28">
      <AnimatedBackground />

      <h1 className="pt-20 text-3xl font-bold text-center z-10">🌍 Твои Земли</h1>

      {/* 🪙 Кнопка минта */}
      <div className="text-center mt-4 z-10">
        <button
          onClick={handleCreateLand}
          disabled={creating}
          className="px-5 py-2 rounded-full bg-fit-gradient text-black font-semibold shadow-glow hover:scale-105 transition-transform disabled:opacity-50"
        >
          {creating ? "Минтим..." : "🪙 Создать землю"}
        </button>
        {createError && (
          <div className="mt-2 text-sm text-red-400">{createError}</div>
        )}
        {successMessage && (
          <div className="mt-2 text-sm text-green-400 animate-pulse">{successMessage}</div>
        )}
      </div>

      {loading && (
        <div className="text-center mt-8 text-gray-400 z-10 animate-pulse">
          Загрузка земель...
        </div>
      )}

      {error && (
        <div className="text-center mt-8 text-red-500 z-10">
          Ошибка загрузки земель
        </div>
      )}

      {!loading && lands.length === 0 && (
        <div className="text-center mt-8 text-gray-500 z-10">
          У тебя пока нет земель 🏜️
        </div>
      )}

      {/* ✨ Анимация карточек при появлении */}
      <motion.div
        className="px-4 mt-8 flex flex-col gap-6 z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.4,
            },
          },
        }}
      >
        {lands.map((land) => (
          <motion.div
            key={land.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <LandCard land={land} />
          </motion.div>
        ))}
      </motion.div>

      <BottomTab current="land" />
    </div>
  );
};

export default LandPage;
