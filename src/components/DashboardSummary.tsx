// DashboardSummary.tsx — v2.1.0 (Ring v3.0.0 совместимость + стили)
import Ring from "./Ring";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  } = data;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 py-6 px-4">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Tooltip content={t("tooltip.steps")}>
          <div className="flex flex-col items-center gap-2">
            <Ring ep={steps} dailyGoal={stepsGoal} color="#00DBDE" />
            <div className="text-center">
              <span className="text-xs text-gray-300">{t("ring.steps", "Шаги")}</span>
              <div className="text-sm font-semibold text-white">
                {steps} / {stepsGoal}
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-2">
            <Ring ep={calories} dailyGoal={caloriesGoal} color="#FF5F6D" />
            <div className="text-center">
              <span className="text-xs text-gray-300">{t("ring.calories", "Калории")}</span>
              <div className="text-sm font-semibold text-white">
                {Math.round(calories)} / {caloriesGoal} ккал
              </div>
            </div>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-2">
            <Ring ep={energy} dailyGoal={energyGoal} color="#FCEE09" />
            <div className="text-center">
              <span className="text-xs text-gray-300">{t("ring.energy", "Энергия")}</span>
              <div className="text-sm font-semibold text-white">
                {Math.round(energy)} / {energyGoal}
              </div>
            </div>
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}
