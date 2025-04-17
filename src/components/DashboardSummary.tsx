import Ring from "./Ring";
import Tooltip from "./Tooltip";
import useSyncActivity from "../hooks/useSyncActivity";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function DashboardSummary() {
  const { t } = useTranslation();

  const {
    steps,
    stepsGoal,
    calories,
    caloriesGoal,
    hasNFT,
    isPremium,
    loading,
  } = useSyncActivity();

  const energy = Math.min(
    (steps / stepsGoal) * 0.5 +
      (calories / caloriesGoal) * 0.5 +
      (isPremium ? 0.1 : 0) +
      (hasNFT ? 0.1 : 0),
    1
  );

  if (loading) {
    return (
      <div className="text-gray-400 text-sm text-center animate-pulse">
        {t("dashboard.loading", "Загрузка данных активности...")}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 py-6">
      <motion.div
        className="flex flex-row items-center justify-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Tooltip content={t("tooltip.steps")}>
          <div className="flex flex-col items-center gap-1">
            <Ring
              progress={stepsGoal ? steps / stepsGoal : 0}
              label={t("ring.steps", "Шаги")}
              color="#00DBDE"
            />
            <span className="text-xs text-gray-300 mt-1">
              {steps} / {stepsGoal}
            </span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-1">
            <Ring
              progress={caloriesGoal ? calories / caloriesGoal : 0}
              label={t("ring.calories", "Калории")}
              color="#FF5F6D"
            />
            <span className="text-xs text-gray-300 mt-1">
              {Math.round(calories)} / {caloriesGoal} ккал
            </span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-1">
            <Ring
              progress={energy}
              label={t("ring.energy", "Энергия")}
              color="#FCEE09"
            />
            <span className="text-xs text-gray-300 mt-1">
              {Math.round(energy * 100)} / 100
            </span>
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}