import React from "react";
import { LandNFT } from "../types/land";
import { cn } from "../lib/utils";

interface LandCardProps {
  land: LandNFT;
}

const rarityStyles: Record<LandNFT["rarity"], string> = {
  common: "border-gray-400 text-gray-300",
  rare: "border-blue-500 text-blue-400",
  epic: "border-purple-500 text-purple-400",
  legendary: "border-yellow-400 text-yellow-400",
  mythical: "border-pink-500 text-pink-400",
};

const LandCard: React.FC<LandCardProps> = ({ land }) => {
  const bonusText =
    typeof land.bonusMultiplier === "number"
      ? `${land.bonusMultiplier.toFixed(2)}×`
      : "N/A";

  const connectedCount = Array.isArray(land.connectedMinerIds)
    ? land.connectedMinerIds.length
    : 0;

  return (
    <div
      className={cn(
        "rounded-xl border-4 p-4 shadow-md bg-zinc-900 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]",
        rarityStyles[land.rarity]
      )}
    >
      <h2 className="text-xl font-bold capitalize mb-2">{land.name}</h2>
      <p className="text-sm">
        Rarity: <span className="font-semibold">{land.rarity}</span>
      </p>
      <p className="text-sm">Bonus Multiplier: {bonusText}</p>
      <p className="text-sm">Slots: {land.slots}</p>
      <p className="text-sm mb-2">
        Connected: {connectedCount}/{land.slots}
      </p>

      <div className="flex flex-wrap gap-2 mt-2">
        {connectedCount > 0 ? (
          land.connectedMinerIds.map((id) => (
            <span key={id} className="text-xs px-2 py-1 bg-zinc-800 rounded">
              Miner #{id.slice(0, 4)}…
            </span>
          ))
        ) : (
          <span className="text-xs italic text-zinc-500">No miners placed</span>
        )}
      </div>

      <button className="mt-4 w-full py-1 bg-fit-gradient rounded-md text-sm font-semibold text-black hover:scale-[1.03] transition-transform shadow-glow">
        Управлять
      </button>
    </div>
  );
};

export default LandCard;
