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
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      <motion.div
        className="flex flex-col items-center gap-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <ActivityRingLottie
          steps={steps}
          stepsGoal={stepsGoal}
          calories={calories}
          caloriesGoal={caloriesGoal}
          distance={distance / 1000} // ✅ в км без округления (toFixed внутри компонента)
          distanceGoal={distanceGoal}
        />

        <div className="text-sm text-zinc-300 font-medium text-center leading-snug px-2">
          {t(
            "dashboard.ringHint",
            "Шаги, калории и дистанция объединены в одном кольце.\nОткрой все секции для бонуса!"
          )}
        </div>
      </motion.div>
    </div>
  );
}
