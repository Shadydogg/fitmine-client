// src/components/EPBatteryLottie.tsx — v1.1.0 (управление прогрессом через Lottie)
import { useRef } from "react";
import Lottie from "lottie-react";
import batteryAnimation from "../assets/lottie/ep-battery.json";
import useLottieControlledProgress from "../hooks/useLottieControlledProgress";

interface Props {
  ep: number;
  dailyGoal?: number;
  totalFrames?: number;
}

export default function EPBatteryLottie({ ep, dailyGoal = 1000, totalFrames = 100 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const batteryScale = 0.95 + percentage * 0.05;
  const lottieRef = useRef<any>(null);

  useLottieControlledProgress(lottieRef, percentage, totalFrames);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
      <div className="w-full max-w-xs sm:max-w-sm">
        <Lottie
          lottieRef={lottieRef}
          animationData={batteryAnimation}
          loop={false}
          autoplay={false}
          style={{
            width: "100%",
            height: "auto",
            transform: `scale(${batteryScale})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold leading-snug">
        {Math.round(ep)} / {dailyGoal} <span className="font-normal text-zinc-300">EP</span>
      </div>
    </div>
  );
}