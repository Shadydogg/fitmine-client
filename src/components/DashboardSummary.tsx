import dynamic from "next/dynamic";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// ⛔ SSR отключен — гарантирует рендер Canvas только на клиенте
const Ring3D = dynamic(() => import("./Ring3D"), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 flex items-center justify-center text-sm text-gray-500">
      Loading 3D Ring...
    </div>
  ),
});

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
            <Ring3D
              ep={steps}
              dailyGoal={stepsGoal}
              color="#00DBDE"
              label={t("ring.steps", "Шаги")}
            />
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-2">
            <Ring3D
              ep={calories}
              dailyGoal={caloriesGoal}
              color="#FF5F6D"
              label={t("ring.calories", "Калории")}
            />
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-2">
            <Ring3D
              ep={energy}
              dailyGoal={energyGoal}
              color="#FCEE09"
              label={t("ring.energy", "Энергия")}
            />
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}
