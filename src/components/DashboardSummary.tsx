import Ring from "./Ring";
import Tooltip from "./Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Props {
  data: {
    steps: number;
    stepsGoal: number;
    calories: number;
    caloriesGoal: number;
    energy: number;
    energyGoal: number;
    hasNFT: boolean;
    isPremium: boolean;
    loading: boolean;
  };
}

export default function DashboardSummary({ data }: Props) {
  const { t } = useTranslation();
  const {
    steps,
    stepsGoal,
    calories,
    caloriesGoal,
    energy,
    energyGoal,
    hasNFT,
    isPremium,
    loading
  } = data;

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
      {/* 🔁 Кольца */}
      <motion.div
        className="flex flex-row items-center justify-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Tooltip content={t("tooltip.steps")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={stepsGoal ? steps / stepsGoal : 0} label={t("ring.steps")} color="#00DBDE" />
            <span className="text-xs text-gray-300 mt-1">{steps} / {stepsGoal}</span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={caloriesGoal ? calories / caloriesGoal : 0} label={t("ring.calories")} color="#FC00FF" />
            <span className="text-xs text-gray-300 mt-1">{calories} / {caloriesGoal}</span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={energyGoal ? energy / energyGoal : 0} label={t("ring.energy")} color="#FF7300" />
            <span className="text-xs text-gray-300 mt-1">{energy} / {energyGoal}</span>
          </div>
        </Tooltip>
      </motion.div>

      {/* 🎖 NFT / Premium */}
      <AnimatePresence>
        {(hasNFT || isPremium) && (
          <motion.div
            className="flex items-center gap-2 mt-2 text-xs text-green-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {hasNFT && <span>🧬 {t("badge.nft")}</span>}
            {isPremium && <span>✨ {t("badge.premium")}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
