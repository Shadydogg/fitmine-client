import { motion } from "framer-motion";

interface Props {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  distance: number; // в КМ
  distanceGoal: number;
}

export default function ActivityRingSVG({
  steps,
  stepsGoal,
  calories,
  caloriesGoal,
  distance,
  distanceGoal,
}: Props) {
  const stepsPercent = Math.min(steps / stepsGoal, 1);
  const caloriesPercent = Math.min(calories / caloriesGoal, 1);
  const distancePercent = Math.min(distance / distanceGoal, 1);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const renderRing = (
    color: string,
    percent: number,
    offset: number,
    strokeWidth = 10
  ) => {
    const progress = circumference * (1 - percent);
    return (
      <>
        <circle
          cx="100"
          cy="100"
          r={normalizedRadius - offset}
          stroke="#1f1f1f"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={normalizedRadius - offset}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1 }}
        />
      </>
    );
  };

  return (
    <div className="relative w-72 h-72 flex flex-col items-center justify-center">
      <svg width="200" height="200" className="rotate-[-90deg]">
        {renderRing("#00DBDE", stepsPercent, 0)}
        {renderRing("#FF5F6D", caloriesPercent, 10)}
        {renderRing("#FCEE09", distancePercent, 20)}
      </svg>

      {/* Подписи */}
      <div className="absolute bottom-0 w-full text-sm text-center text-white leading-tight mt-2 px-2 pointer-events-none">
        <div>👟 {Math.round(steps)} / {stepsGoal} шагов</div>
        <div>🔥 {Math.round(calories)} / {caloriesGoal} ккал</div>
        <div>📏 {distance.toFixed(2)} / {distanceGoal} км</div>
      </div>
    </div>
  );
}
