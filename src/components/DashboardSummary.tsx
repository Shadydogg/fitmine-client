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
    <div className="w-full flex flex-col items-center justify-center gap-8 py-6">
      <motion.div
        className="flex flex-row items-center justify-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Tooltip content={t("tooltip.steps")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={stepsGoal ? steps / stepsGoal : 0} label={t("ring.steps", "Шаги")} color="#00DBDE" />
            <span className="text-xs text-gray-300 mt-1">{steps} / {stepsGoal}</span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={caloriesGoal ? calories / caloriesGoal : 0} label={t("ring.calories", "Калории")} color="#FF5F6D" />
            <span className="text-xs text-gray-300 mt-1">{Math.round(calories)} / {caloriesGoal} ккал</span>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={energyGoal ? energy / energyGoal : 0} label={t("ring.energy", "Энергия")} color="#FCEE09" />
            <span className="text-xs text-gray-300 mt-1">{Math.round(energy)} / {energyGoal}</span>
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}
