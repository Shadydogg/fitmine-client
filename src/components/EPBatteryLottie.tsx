// src/components/EPBatteryLottie.tsx — v2.0.0 (управление кадрами прогресса)
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import batteryAnimation from "../assets/lottie/ep-battery.json";
import { useEffect, useRef } from "react";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatteryLottie({ ep, dailyGoal = 1000 }: Props) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const percent = Math.min(ep / dailyGoal, 1);

  useEffect(() => {
    if (lottieRef.current) {
      const frame = Math.floor(percent * 100); // ⚠️ зависит от структуры анимации
      lottieRef.current.goToAndStop(frame, true);
    }
  }, [percent]);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
      <div className="w-full max-w-xs sm:max-w-sm">
        <Lottie
          lottieRef={lottieRef}
          animationData={batteryAnimation}
          autoplay={false}
          loop={false}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold leading-snug">
        {Math.round(ep)} / {dailyGoal}{" "}
        <span className="font-normal text-zinc-300">EP</span>
      </div>
    </div>
  );
}
