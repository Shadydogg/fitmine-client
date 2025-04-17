import Ring from "./Ring";
import Tooltip from "./Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";

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

  const [showInfo, setShowInfo] = useState(false);

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
            <span className="text-xs text-gray-300 mt-1">
              {Math.round(calories)} / {caloriesGoal} ккал
            </span>

            {/* 🔥 Кнопка раскрытия */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-[10px] mt-1 text-amber-400 hover:text-white transition-colors"
            >
              {showInfo ? "Скрыть расчёт" : "ℹ️ Как мы считаем калории"}
            </button>
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={energyGoal ? energy / energyGoal : 0} label={t("ring.energy", "Энергия")} color="#FCEE09" />
            <span className="text-xs text-gray-300 mt-1">{Math.round(energy)} / {energyGoal}</span>
          </div>
        </Tooltip>
      </motion.div>

      {/* 💬 Раскрывающийся текст */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-xs text-gray-400 max-w-xs text-left bg-white/5 p-3 rounded-xl mt-2 border border-white/10 backdrop-blur"
          >
            <p className="text-amber-300 font-semibold mb-1">🔥 Как мы считаем калории</p>
            <p>Твоя цель — 2000 ккал в день, и она учитывает:</p>
            <ul className="list-disc list-inside pl-2 my-1">
              <li><b>~1500 ккал</b> — калории, которые организм тратит в покое (BMR)</li>
              <li><b>~500 ккал</b> — активные калории за счёт ходьбы и тренировок</li>
            </ul>
            <p>Мы используем данные Google Fit, включающие все потраченные калории — и в покое, и в движении 🧠💓</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
