import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useNFTInventory } from "../hooks/useNFTInventory";
import { useSession } from "../context/SessionContext";

import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import NFTCard from "../components/NFTCard";

const NFTPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, accessToken } = useSession();
  const { nfts, loading, error } = useNFTInventory();
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      {/* 👤 Профиль */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform z-20"
      >
        <img
          src={user?.photo_url || "/default-avatar.png"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
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

      {/* 🧠 Заголовок */}
      <motion.h1
        className="mt-20 text-3xl font-extrabold text-center tracking-wide z-10 drop-shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("nft.title", "Твои NFT майнеры")}
      </motion.h1>

      {/* 🧩 Контент */}
      {loading ? (
        <div className="text-gray-500 mt-8 animate-pulse z-10">
          {t("nft.loading", "Загрузка NFT...")}
        </div>
      ) : error ? (
        <div className="text-red-500 mt-8 z-10">
          {t("nft.error", "Ошибка загрузки NFT")}
        </div>
      ) : (
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 z-10 px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.6 },
            },
          }}
        >
          {nfts.map((nft) => (
            <motion.div
              key={nft.id}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <NFTCard nft={nft} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <BottomTab current="nft" />
    </div>
  );
};

export default NFTPage;
