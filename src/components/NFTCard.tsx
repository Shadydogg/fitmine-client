import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NFTMiner } from "../types/nft";
import { cn } from "../lib/utils";
import UpgradePanel from "./UpgradePanel";
import NFT3DPreview from "./NFT3DPreview";

interface NFTCardProps {
  nft: NFTMiner;
}

const rarityColor: Record<NFTMiner["rarity"], string> = {
  common: "bg-zinc-800 border-gray-600",
  rare: "bg-zinc-800 border-blue-500 shadow-blue-500/30",
  epic: "bg-zinc-800 border-purple-500 shadow-purple-500/30",
  legendary: "bg-zinc-800 border-yellow-400 shadow-yellow-400/30",
  mythical: "bg-zinc-800 border-pink-500 shadow-pink-500/30",
};

const rarityBadge: Record<NFTMiner["rarity"], string> = {
  common: "bg-gray-600 text-white",
  rare: "bg-blue-500 text-white",
  epic: "bg-purple-500 text-white",
  legendary: "bg-yellow-400 text-black",
  mythical: "bg-pink-500 text-white",
};

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [level, setLevel] = useState(typeof nft.level === "number" ? nft.level : 1);
  const [animatedPower, setAnimatedPower] = useState(0);
  const miningPower = nft.miningPower ?? 0;
  const ep = Math.min(nft.ep ?? 0, 1000);
  const epPercent = ep / 1000;

  useEffect(() => {
    if (miningPower <= 0) {
      setAnimatedPower(0);
      return;
    }
    let current = 0;
    const step = () => {
      if (current < miningPower) {
        current += Math.ceil(miningPower / 20);
        setAnimatedPower(Math.min(current, miningPower));
        requestAnimationFrame(step);
      }
    };
    step();
  }, [miningPower]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-2xl border-2 p-4 shadow-md text-white",
        "transition-all duration-300 transform hover:scale-[1.015]",
        rarityColor[nft.rarity]
      )}
    >
      {/* 🌟 Glow-анимация при активном майнинге */}
      {miningPower > 0 && (
        <motion.div
          className="absolute -inset-1 rounded-2xl z-0 bg-emerald-400 blur-xl opacity-10 pointer-events-none"
          animate={{ opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* 🏷️ Бейдж редкости */}
      <span
        className={cn(
          "absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold shadow z-10",
          rarityBadge[nft.rarity]
        )}
      >
        {nft.rarity.toUpperCase()}
      </span>

      {/* ⚙️ Иконка */}
      <div className="absolute top-2 right-2 w-7 h-7 animate-spin-slow opacity-30 z-10">
        <img
          src="/gear.svg"
          alt="gear"
          className="w-full h-full drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]"
        />
      </div>

      {/* 📊 Статы */}
      <div className="mt-6 text-sm space-y-1 relative z-10">
        <p className="text-gray-300">Base Hashrate: <span className="text-white">{nft.baseHashrate ?? "N/A"}</span></p>
        <p className="text-gray-300">Level: <span className="text-white">{nft.level ?? 1}</span></p>
        <p className="text-gray-300">EP: <span className="text-white">{ep}/1000</span></p>

        {/* 🔋 Индикатор EP */}
        <div className="relative h-2 w-full bg-zinc-700 rounded mt-1 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-lime-400 to-emerald-500"
            initial={{ width: "0%" }}
            animate={{ width: `${epPercent * 100}%` }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </div>

        <p className="text-gray-300">Effective EP: <span className="text-white">{nft.effectiveEP?.toFixed(2) ?? "0.00"}</span></p>
        <p className="text-gray-300">Land Bonus: <span className="text-white">{nft.landBonus?.toFixed(2) ?? "1.0"}×</span></p>
        <p className="text-fit-primary font-semibold">
          Mining Power: {miningPower === 0 ? "⛔" : animatedPower}
        </p>

        {!nft.isPremium && ep === 0 && (
          <p className="text-xs text-yellow-400">🔒 Нет активности — 0 EP</p>
        )}
        {nft.isPremium && ep === 0 && (
          <p className="text-xs text-emerald-300">⚡ Премиум бонус — 50% мощности</p>
        )}
      </div>

      {/* ⚙️ Компоненты */}
      <div className="mt-2">
        <p className="text-xs text-gray-400 font-medium">Components:</p>
        <ul className="text-xs list-disc list-inside text-white">
          {nft.components?.length > 0 ? (
            nft.components.map((comp) => (
              <li key={comp.id}>
                {comp.type} (+{comp.bonusPercent}%)
              </li>
            ))
          ) : (
            <li className="text-gray-500">None</li>
          )}
        </ul>
      </div>

      {/* 🧊 3D модель */}
      <div className="mt-4">
        <NFT3DPreview />
      </div>

      {/* ⬆️ Апгрейд */}
      <div className="mt-4">
        <UpgradePanel nftId={nft.id} currentLevel={level} onUpgraded={setLevel} />
      </div>
    </motion.div>
  );
};

export default NFTCard;
