// DashboardSummary.tsx — v2.3.0 (замена Energy на Distance по PROMPT 9.5)
import { lazy, Suspense } from "react";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Ring3D = lazy(() => import("./Ring3D"));

interface Props {
  data: {
    steps: number;
    stepsGoal: number;
    calories: number;
    caloriesGoal: number;
    distance: number;
    distanceGoal: number;
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
    distance,
    distanceGoal,
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
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <Ring3D ep={steps} dailyGoal={stepsGoal} color="#00DBDE" label={t("ring.steps", "Шаги")} />
            </Suspense>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}> 
          <div className="flex flex-col items-center gap-2">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <Ring3D ep={calories} dailyGoal={caloriesGoal} color="#FF5F6D" label={t("ring.calories", "Калории")} />
            </Suspense>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.distance")}> 
          <div className="flex flex-col items-center gap-2">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <Ring3D ep={distance} dailyGoal={distanceGoal} color="#FCEE09" label={t("ring.distance", "Дистанция")} />
            </Suspense>
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}
