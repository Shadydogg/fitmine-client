import ActivityRingSVG from "./ActivityRingSVG";

interface Props {
  data: {
    steps: number;
    calories: number;
    distance: number; // в километрах
    activeMinutes: number;
    hasNFT: boolean;
    isPremium: boolean;
    loading: boolean;
    stepsGoal: number;
    caloriesGoal: number;
    distanceGoal: number;
    activeMinutesGoal: number;
  };
  doubleGoal: boolean;
}

export default function DashboardSummary({ data, doubleGoal }: Props) {
  const {
    steps,
    calories,
    distance,
    activeMinutes,
    stepsGoal,
    caloriesGoal,
    distanceGoal,
    activeMinutesGoal,
    loading,
  } = data;

  // ✅ Удвоение целей уже выполнено на backend — не удваиваем ещё раз
  return (
    <ActivityRingSVG
      steps={steps}
      stepsGoal={stepsGoal}
      calories={calories}
      caloriesGoal={caloriesGoal}
      distance={distance}
      distanceGoal={distanceGoal}
      activeMinutes={activeMinutes}
      activeMinutesGoal={activeMinutesGoal}
    />
  );
}