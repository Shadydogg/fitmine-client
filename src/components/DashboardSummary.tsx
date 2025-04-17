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
    <div className="w-full flex flex-col items-center justify-center gap-4 py-6">
      {/* 🔁 Кольца */}
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
          </div>
        </Tooltip>

        <Tooltip content={t("tooltip.energy")}>
          <div className="flex flex-col items-center gap-1">
            <Ring progress={energyGoal ? energy / energyGoal : 0} label={t("ring.energy", "Энергия")} color="#FCEE09" />
            <span className="text-xs text-gray-300 mt-1">{Math.round(energy)} / {energyGoal}</span>
          </div>
        </Tooltip>
      </motion.div>

      {/* 🔥 Кнопка под кольцами */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="text-[11px] mt-1 text-amber-400 hover:text-white transition-colors"
      >
        {showInfo ? "Скрыть расчёт калорий" : "ℹ️ Как мы считаем калории"}
      </button>

      {/* 💬 Раскрывающийся блок */}
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
            <p>Твоя цель — <b>2000 ккал в день</b>, и она включает:</p>
            <ul className="list-disc list-inside pl-2 my-1">
              <li><b>~1500 ккал</b> — в состоянии покоя (BMR)</li>
              <li><b>~500 ккал</b> — активные: шаги, тренировки и движение</li>
            </ul>
            <p>Мы используем <b>данные Google Fit</b>, которые учитывают все сожжённые калории — даже в покое 🧠💓</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
