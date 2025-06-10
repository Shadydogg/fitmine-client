import ActivityRingSVG from "./ActivityRingSVG";

interface Props {
  data: {
    steps: number;
    calories: number;
    distance: number; // метры
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

  // 🎯 Цели по умолчанию
  const baseGoals = {
    steps: 8000,
    calories: 400,
    distance: 5000, // в метрах
    activeMinutes: 45,
  };

  // ✅ Удвоенные цели, если doubleGoal = true
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
      distance={distance / 1000} // переводим в километры
      distanceGoal={distanceGoal / 1000}
      activeMinutes={activeMinutes}
      activeMinutesGoal={activeMinutesGoal}
    />
  );
}