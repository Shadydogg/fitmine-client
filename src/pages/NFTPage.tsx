/// <reference path="../types/nft.ts" /> 

import React from "react";
import { useNFTInventory } from "../hooks/useNFTInventory";
import NFTCard from "../components/NFTCard";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const NFTPage: React.FC = () => {
  const { nfts, loading, error } = useNFTInventory();
  const { user } = useSession();
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      {/* 👤 Профиль */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform z-20"
      >
        <img src={user?.photo_url || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
      </button>

      {/* 🎯 XP */}
      <motion.button
        onClick={() => navigate("/xp")}
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm bg-fit-gradient shadow-glow hover:scale-105 transition-glow z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        🎯 XP и Уровень
      </motion.button>

      <motion.h1
        className="text-3xl font-extrabold mt-20 mb-4 text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎮 Твои NFT майнеры
      </motion.h1>

      <motion.div
        className="w-full px-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.5 },
          },
        }}
      >
        {loading && <div className="text-gray-500 mt-6 animate-pulse text-center">Загрузка NFT...</div>}
        {error && <div className="text-red-400 text-center mt-6">Ошибка загрузки NFT</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </motion.div>

      <BottomTab current="nft" />
    </div>
  );
};

export default NFTPage;
