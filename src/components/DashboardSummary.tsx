// src/components/DashboardSummary.tsx — v2.7.0 (добавлено active_minutes и обновлено описание)
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ActivityRingSVG from "./ActivityRingSVG";

interface Props {
  data: {
    steps: number;
    stepsGoal: number;
    calories: number;
    caloriesGoal: number;
    distance: number; // в метрах
    distanceGoal: number; // в километрах
    activeMinutes: number;
    activeMinutesGoal: number;
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
    activeMinutes,
    activeMinutesGoal,
  } = data;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4">
      <motion.div
        className="flex flex-col items-center w-full max-w-md gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ActivityRingSVG
          steps={steps}
          stepsGoal={stepsGoal}
          calories={calories}
          caloriesGoal={caloriesGoal}
          distance={distance} // в метрах
          distanceGoal={distanceGoal} // в км
          activeMinutes={activeMinutes}
          activeMinutesGoal={activeMinutesGoal}
        />

        <motion.div
          className="text-sm text-zinc-300 font-medium text-center leading-relaxed px-4 whitespace-pre-line text-balance"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t(
            "dashboard.ringHint",
            "Все 4 цели: шаги, калории, дистанция и активные минуты объединены в кольцо.\nЗаполни каждую секцию — получи бонус!"
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
