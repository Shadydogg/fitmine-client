// 📄 src/components/NFTCard.tsx — v1.2.0

import React, { useState } from "react";
import { NFTMiner } from "../types/nft";
import { cn } from "../lib/utils";
import UpgradePanel from "./UpgradePanel";

interface NFTCardProps {
  nft: NFTMiner;
}

const rarityColor: Record<NFTMiner["rarity"], string> = {
  common: "border-gray-300",
  rare: "border-blue-500",
  epic: "border-purple-500",
  legendary: "border-yellow-400",
  mythical: "border-pink-500",
};

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [level, setLevel] = useState(nft.level);

  const componentBonus = nft.components.reduce((sum, c) => sum + c.bonusPercent, 0);
  const miningPower = Math.floor(
    nft.baseHashrate * (1 + componentBonus / 100) * (nft.ep / 500) * nft.landBonus * (1 + level * 0.1)
  );

  return (
    <div
      className={cn(
        "rounded-xl border-4 p-4 shadow bg-white dark:bg-zinc-900",
        rarityColor[nft.rarity]
      )}
    >
      <h2 className="text-lg font-bold capitalize">{nft.rarity} Miner</h2>
      <p className="text-sm">Base Hashrate: {nft.baseHashrate}</p>
      <p className="text-sm">Level: {level}</p>
      <p className="text-sm">EP: {nft.ep}/500</p>
      <p className="text-sm">Land Bonus: {nft.landBonus.toFixed(2)}×</p>
      <p className="text-sm text-green-600 font-semibold">Mining Power: {miningPower}</p>

      <div className="mt-2">
        <p className="text-xs font-medium">Components:</p>
        <ul className="text-xs list-disc list-inside">
          {nft.components.map((comp) => (
            <li key={comp.id}>{comp.type} (+{comp.bonusPercent}%)</li>
          ))}
        </ul>
      </div>

      <UpgradePanel nftId={nft.id} currentLevel={level} onUpgraded={setLevel} />
    </div>
  );
};

export default NFTCard;