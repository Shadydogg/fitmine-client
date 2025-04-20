// src/components/ActivityRingLottie.tsx — v1.3.0 (анимация + key + minFrame + адаптация)
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

  const avgPercent = (stepsPercent + caloriesPercent + distancePercent) / 3;

  useEffect(() => {
    if (lottieRef.current) {
      let frame = Math.floor(avgPercent * 100);
      if (frame < 5) frame = 5; // минимальный кадр
      lottieRef.current.goToAndStop(frame, true);
    }
  }, [avgPercent]);

  return (
    <div className="relative w-72 h-72 max-w-xs flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95">
      <Lottie
        key={avgPercent} // 🔁 форсирует обновление WebView
        lottieRef={lottieRef}
        animationData={ringAllAnimation}
        autoplay={false}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />

      {/* 📊 Подписи */}
      <div className="absolute bottom-0 w-full text-sm text-center text-white leading-tight mt-2 px-2 pointer-events-none">
        <div>👟 {Math.round(steps)} / {stepsGoal} шагов</div>
        <div>🔥 {Math.round(calories)} / {caloriesGoal} ккал</div>
        <div>📏 {distance.toFixed(2)} / {distanceGoal} км</div>
      </div>
    </div>
  );
}
