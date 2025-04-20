// src/components/ActivityRingLottie.tsx — v1.1.0 (3 кольца + подписи)
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import ringAllAnimation from "../assets/lottie/ring-all.json";
import { useEffect, useRef } from "react";

interface Props {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  distance: number;
  distanceGoal: number;
}

export default function ActivityRingLottie({
  steps,
  stepsGoal,
  calories,
  caloriesGoal,
  distance,
  distanceGoal,
}: Props) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const stepsPercent = Math.min(steps / stepsGoal, 1);
  const caloriesPercent = Math.min(calories / caloriesGoal, 1);
  const distancePercent = Math.min(distance / distanceGoal, 1);

  // Среднее значение для покадровой остановки
  const avgPercent = (stepsPercent + caloriesPercent + distancePercent) / 3;

  useEffect(() => {
    if (lottieRef.current) {
      const frame = Math.floor(avgPercent * 100); // предположительно 100 кадров
      lottieRef.current.goToAndStop(frame, true);
    }
  }, [avgPercent]);

  return (
    <div className="relative w-72 h-72 flex flex-col items-center justify-center">
      <Lottie
        lottieRef={lottieRef}
        animationData={ringAllAnimation}
        autoplay={false}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />

      <div className="absolute bottom-0 text-sm text-center text-white leading-tight mt-2">
        <div>👟 {steps} / {stepsGoal}</div>
        <div>🔥 {Math.round(calories)} / {caloriesGoal} ккал</div>
        <div>📏 {Math.round(distance * 10) / 10} / {distanceGoal} км</div>
      </div>
    </div>
  );
}
