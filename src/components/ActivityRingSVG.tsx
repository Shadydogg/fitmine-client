import { motion } from "framer-motion";

interface Props {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  distance: number; // в км
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

  const renderRing = (
    color: string,
    percent: number,
    offset: number,
    delay: number,
    glowColor: string
  ) => {
    const currentRadius = radius - stroke / 2 - offset;
    const circumference = 2 * Math.PI * currentRadius;
    const dashOffset = circumference * (1 - percent);

    return (
      <>
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${offset}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={glowColor} />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={glowColor} />
          </filter>
        </defs>

        {/* Фон круга */}
        <circle
          cx="100"
          cy="100"
          r={currentRadius}
          stroke="#1f1f1f"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Анимированный прогресс с glow */}
        <motion.circle
          cx="100"
          cy="100"
          r={currentRadius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            filter: `url(#glow-${offset})`,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, delay }}
        />
      </>
    );
  };

  return (
    <div className="relative w-72 h-72 flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95">
      <svg
        width="200"
        height="200"
        className="-rotate-90"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderRing("#00DBDE", stepsPercent, 0, 0.2, "#00FFFF")}        {/* Steps */}
        {renderRing("#FF5F6D", caloriesPercent, 10, 0.6, "#FF5F6D")}     {/* Calories */}
        {renderRing("#FCEE09", distancePercent, 20, 1.0, "#FCEE09")}     {/* Distance */}
      </svg>

      <div className="absolute bottom-0 w-full text-sm text-center text-white leading-tight mt-2 px-2 pointer-events-none">
        <div>👟 {Math.round(steps)} / {stepsGoal} шагов</div>
        <div>🔥 {Math.round(calories)} / {caloriesGoal} ккал</div>
        <div>📏 {distance.toFixed(2)} / {distanceGoal} км</div>
      </div>
    </div>
  );
}
