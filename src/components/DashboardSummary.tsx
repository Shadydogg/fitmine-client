// src/components/DashboardSummary.tsx — v3.2.0
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
  doubleGoal: boolean;
}

export default function DashboardSummary({ data, doubleGoal }: Props) {
  const {
    steps,
    calories,
    distance,
    activeMinutes,
    loading,
  } = data;

  // 🎯 Базовые дневные цели
  const baseGoals = {
    steps: 10000,            // шагов
    calories: 2000,          // ккал
    distance: 5000,          // метров (5 км)
    activeMinutes: 45        // минут активности
  };

  // ⚡ Удвоение целей, если PowerBank активен
  const multiplier = doubleGoal ? 2 : 1;

  const stepsGoal = baseGoals.steps * multiplier;
  const caloriesGoal = baseGoals.calories * multiplier;
  const distanceGoal = baseGoals.distance * multiplier;
  const activeMinutesGoal = baseGoals.activeMinutes * multiplier;

  return (
    <ActivityRingSVG
      steps={steps}
      stepsGoal={stepsGoal}
      calories={calories}
      caloriesGoal={caloriesGoal}
      distance={distance / 1000}             // из м в км
      distanceGoal={distanceGoal / 1000}     // из м в км
      activeMinutes={activeMinutes}
      activeMinutesGoal={activeMinutesGoal}
    />
  );
}