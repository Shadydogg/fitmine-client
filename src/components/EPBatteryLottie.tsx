// EPBatteryLottie.tsx — v1.0.0 (анимированная батарейка через Lottie)
import Lottie from "lottie-react";
import batteryAnimation from "../assets/lottie/ep-battery.json"; // ⚠️ создадим далее

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatteryLottie({ ep, dailyGoal = 1000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-72 h-24">
        <Lottie
          animationData={batteryAnimation}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${0.95 + percentage * 0.05})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-medium">
        {Math.round(ep)} / {dailyGoal} EP
      </div>
    </div>
  );
}
