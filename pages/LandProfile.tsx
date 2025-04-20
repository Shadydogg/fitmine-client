import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useSession } from "../context/SessionContext";
import { useLandInventory } from "../hooks/useLandInventory";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";

const LandProfile: React.FC = () => {
  const { t } = useTranslation();
  const { landId } = useParams();
  const { user } = useSession();
  const { lands } = useLandInventory();
  const navigate = useNavigate();

  const land = lands.find((l) => l.id === landId);

  if (!land) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-black">
        {t("land.not_found", "Земля не найдена")}
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      <button
        onClick={() => navigate("/lands")}
        className="absolute top-4 left-4 px-4 py-1 bg-zinc-800 text-sm rounded-full border border-zinc-600 hover:bg-zinc-700 z-20"
      >
        ← Назад
      </button>

      {/* 👤 Профиль */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform z-20"
      >
        <img src={user?.photo_url || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
      </button>

      {/* Заголовок */}
      <motion.h1
        className="mt-20 text-3xl font-extrabold text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🏞️ {land.name}
      </motion.h1>

      <motion.div
        className="mt-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900 w-[90%] max-w-md text-sm space-y-2 shadow-md z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p>Редкость: <span className="font-semibold capitalize">{land.rarity}</span></p>
        <p>Бонус добычи: <span className="text-fit-primary">{land.bonusMultiplier.toFixed(2)}×</span></p>
        <p>Слоты: <span>{land.connectedMinerIds.length} / {land.slots}</span></p>
        {land.description && <p className="text-gray-400 pt-2">{land.description}</p>}

        {/* 🧩 Подключённые майнеры */}
        <div className="pt-3">
          <p className="text-xs font-medium text-gray-300 mb-1">Привязанные майнеры:</p>
          <ul className="text-xs space-y-1">
            {land.connectedMinerIds.length > 0 ? (
              land.connectedMinerIds.map((id) => (
                <li key={id} className="bg-zinc-800 rounded px-3 py-1 text-white">
                  🛠️ Miner #{id.slice(0, 6)}…
                </li>
              ))
            ) : (
              <li className="text-gray-500">Нет привязанных NFT</li>
            )}
          </ul>
        </div>

        <button
          onClick={() => navigate(`/land/${land.id}/manage`)}
          className="mt-4 w-full py-2 bg-fit-gradient text-black font-semibold rounded-xl shadow-glow hover:scale-105 transition-transform"
        >
          ⚙️ Управлять землёй
        </button>
      </motion.div>

      <BottomTab current="land" />
    </div>
  );
};

export default LandProfile;
