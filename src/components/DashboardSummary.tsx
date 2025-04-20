import { Suspense } from "react";
import Tooltip from "./Tooltip";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import StepRingLottie from "./StepRingLottie";
import CaloriesRingLottie from "./CaloriesRingLottie";
import DistanceRingLottie from "./DistanceRingLottie";

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Tooltip content={t("tooltip.steps")}>
          <div className="flex flex-col items-center gap-3">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <StepRingLottie ep={steps} dailyGoal={stepsGoal} />
            </Suspense>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.calories")}>
          <div className="flex flex-col items-center gap-3">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <CaloriesRingLottie ep={calories} dailyGoal={caloriesGoal} />
            </Suspense>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.distance")}>
          <div className="flex flex-col items-center gap-3">
            <Suspense fallback={<div className="text-sm text-gray-400">Загрузка кольца...</div>}>
              <DistanceRingLottie ep={distance} dailyGoal={distanceGoal} />
            </Suspense>
          </div>
        </Tooltip>
      </motion.div>
    </div>
  );
}
