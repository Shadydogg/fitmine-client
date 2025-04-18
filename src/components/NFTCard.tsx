import React, { useState, useEffect, useMemo } from "react";
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

  const componentBonus = useMemo(
    () => nft.components?.reduce((sum, c) => sum + c.bonusPercent, 0) || 0,
    [nft.components]
  );

  const miningPower = useMemo(() => {
    const base = typeof nft.baseHashrate === "number" ? nft.baseHashrate : 0;
    const ep = typeof nft.ep === "number" ? nft.ep : 0;
    const landBonus = typeof nft.landBonus === "number" ? nft.landBonus : 1;

    return Math.floor(base * (1 + componentBonus / 100) * (ep / 500) * landBonus * (1 + level * 0.1));
  }, [nft.baseHashrate, nft.ep, nft.landBonus, componentBonus, level]);

  useEffect(() => {
    if (miningPower <= 0) {
      setAnimatedPower(0);
      return;
    }

    let start = 0;
    const step = () => {
      if (start < miningPower) {
        start += Math.ceil(miningPower / 20);
        setAnimatedPower(Math.min(start, miningPower));
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
      {/* 🏷️ Бейдж редкости */}
      <span
        className={cn(
          "absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold shadow",
          rarityBadge[nft.rarity]
        )}
      >
        {nft.rarity.toUpperCase()}
      </span>

      {/* ⚙️ Иконка */}
      <div className="absolute top-2 right-2 w-7 h-7 animate-spin-slow opacity-30">
        <img
          src="/gear.svg"
          alt="gear"
          className="w-full h-full drop-shadow-[0_0_6px_rgba(0,255,255,0.5)]"
        />
      </div>

      {/* 📊 Статы */}
      <div className="mt-6 text-sm space-y-1">
        <p className="text-gray-300">Base Hashrate: <span className="text-white">{nft.baseHashrate ?? "N/A"}</span></p>
        <p className="text-gray-300">Level: <span className="text-white">{level}</span></p>
        <p className="text-gray-300">EP: <span className="text-white">{nft.ep ?? 0}/500</span></p>
        <p className="text-gray-300">Land Bonus: <span className="text-white">{typeof nft.landBonus === "number" ? nft.landBonus.toFixed(2) + "×" : "N/A"}</span></p>
        <p className="text-fit-primary font-semibold">Mining Power: {isNaN(miningPower) ? "N/A" : animatedPower}</p>
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
