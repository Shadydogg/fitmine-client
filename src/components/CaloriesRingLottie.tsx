// CaloriesRingLottie.tsx — v1.0.0 (кольцо калорий через Lottie)
import Lottie from "lottie-react";
import ringAnimation from "../assets/lottie/ring-calories.json"; // 👈 🔁 добавим позже

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function CaloriesRingLottie({ ep, dailyGoal = 2000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-32 h-32">
        <Lottie
          animationData={ringAnimation}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${0.8 + percentage * 0.2})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold">
        {Math.round(ep)} / {dailyGoal} ккал
      </div>
    </div>
  );
}
