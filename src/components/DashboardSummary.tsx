import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ActivityRingLottie from "./ActivityRingLottie";

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
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <ActivityRingLottie
          steps={steps}
          stepsGoal={stepsGoal}
          calories={calories}
          caloriesGoal={caloriesGoal}
          distance={Math.round((distance / 1000) * 100) / 100}
          distanceGoal={distanceGoal}
        />

        <div className="text-sm text-zinc-300 font-medium mt-4 text-center leading-snug">
          {t("dashboard.ringHint", "Шаги, калории и дистанция объединены в одном кольце.\nОткрой все секции для бонуса!")}
        </div>
      </motion.div>
    </div>
  );
}
