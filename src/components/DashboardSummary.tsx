import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUserEP } from "../hooks/useUserEP";
import ActivityRingSVG from "./ActivityRingSVG";

interface Props {
  data: {
    steps: number;
    calories: number;
    distance: number; // в метрах
    activeMinutes: number;
    hasNFT: boolean;
    isPremium: boolean;
    loading: boolean;
  };
}

export default function DashboardSummary({ data }: Props) {
  const { t } = useTranslation();
  const { doubleGoal } = useUserEP();

  // 🎯 Цели в зависимости от PowerBank
  const stepsGoal = doubleGoal ? 20000 : 10000;
  const caloriesGoal = doubleGoal ? 4000 : 2000;
  const distanceGoal = doubleGoal ? 10 : 5; // км
  const activeMinutesGoal = doubleGoal ? 90 : 45;

  // 📊 Метрики пользователя
  const { steps, calories, distance, activeMinutes } = data;
  const distanceKm = distance / 1000;

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
          distance={distanceKm}
          distanceGoal={distanceGoal}
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