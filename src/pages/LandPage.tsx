import React from "react";
import { useLandInventory } from "../hooks/useLandInventory";
import LandCard from "../components/LandCard";
import BottomTab from "../components/BottomTab";
import AnimatedBackground from "../components/AnimatedBackground";
import { motion } from "framer-motion";

const LandPage: React.FC = () => {
  const { lands, loading, error } = useLandInventory();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      <h1 className="pt-20 text-3xl font-bold text-center z-10">🌍 Твои Земли</h1>

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
