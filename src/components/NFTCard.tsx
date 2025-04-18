// 📄 src/components/NFTCard.tsx — v1.4.1

import React, { useState, useEffect } from "react";
import { NFTMiner } from "../types/nft";
import { cn } from "../lib/utils";
import UpgradePanel from "./UpgradePanel";
import NFT3DPreview from "./NFT3DPreview";

interface NFTCardProps {
  nft: NFTMiner;
}

const rarityColor: Record<NFTMiner["rarity"], string> = {
  common: "border-gray-300 shadow-md",
  rare: "border-blue-500 shadow-blue-500/30",
  epic: "border-purple-500 shadow-purple-500/30",
  legendary: "border-yellow-400 shadow-yellow-400/30",
  mythical: "border-pink-500 shadow-pink-500/30",
};

const rarityTextColor: Record<NFTMiner["rarity"], string> = {
  common: "text-gray-600",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-yellow-400",
  mythical: "text-pink-400",
};

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [level, setLevel] = useState(nft.level);
  const [animatedPower, setAnimatedPower] = useState(0);

  const componentBonus = nft.components.reduce((sum, c) => sum + c.bonusPercent, 0);
  const miningPower = Math.floor(
    (nft.baseHashrate || 0) *
    (1 + componentBonus / 100) *
    ((nft.ep || 0) / 500) *
    (nft.landBonus || 1) *
    (1 + level * 0.1)
  );

  useEffect(() => {
    let start = 0;
    const step = () => {
      if (start < miningPower) {
        start += Math.ceil(miningPower / 20);
        setAnimatedPower(start > miningPower ? miningPower : start);
        requestAnimationFrame(step);
      }
    };
    step();
  }, [miningPower]);

  return (
    <div
      className={cn(
        "relative rounded-xl border-4 p-4 shadow-md bg-white dark:bg-zinc-900 transition-all duration-300 transform hover:rotate-[-1deg] hover:scale-[1.02]",
        rarityColor[nft.rarity]
      )}
    >
      <div className="absolute top-2 right-2 w-6 h-6 animate-spin-slow opacity-30">
        <img src="/gear.svg" alt="gear" className="w-full h-full" />
      </div>

      <h2 className={cn("text-lg font-bold capitalize", rarityTextColor[nft.rarity])}>
        {nft.rarity} Miner
      </h2>
      <p className="text-sm">Base Hashrate: {nft.baseHashrate}</p>
      <p className="text-sm">Level: {level}</p>
      <p className="text-sm">EP: {nft.ep}/500</p>
      <p className="text-sm">
        Land Bonus: {typeof nft.landBonus === "number" ? nft.landBonus.toFixed(2) + "×" : "N/A"}
      </p>
      <p className="text-sm text-green-600 font-semibold">
        Mining Power: {isNaN(miningPower) ? "N/A" : animatedPower}
      </p>

      <div className="mt-2">
        <p className="text-xs font-medium">Components:</p>
        <ul className="text-xs list-disc list-inside">
          {nft.components.map((comp) => (
            <li key={comp.id}>{comp.type} (+{comp.bonusPercent}%)</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <NFT3DPreview />
      </div>

      <UpgradePanel nftId={nft.id} currentLevel={level} onUpgraded={setLevel} />
    </div>
  );
};

export default NFTCard;
