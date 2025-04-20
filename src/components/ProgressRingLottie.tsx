// src/components/ProgressRingLottie.tsx — v1.1.0 (Lottie с управлением прогрессом)
import { useRef } from "react";
import Lottie from "lottie-react";
import useLottieControlledProgress from "../hooks/useLottieControlledProgress";

interface Props {
  value: number;
  goal: number;
  label: string;
  unit?: string;
  color?: string;
  animationData: object;
  totalFrames?: number;
}

export default function ProgressRingLottie({
  value,
  goal,
  label,
  unit = "",
  color = "#00FFC6",
  animationData,
  totalFrames = 120, // по умолчанию 120 кадров
}: Props) {
  const percentage = Math.min(value / goal, 1);
  const lottieRef = useRef<any>(null);

  useLottieControlledProgress(lottieRef, percentage, totalFrames);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${0.8 + percentage * 0.2})`,
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold text-center">
        {Math.round(value * 10) / 10} / {goal} {unit}
      </div>
      <div className="text-xs text-gray-300 font-medium uppercase tracking-wide mt-0.5">
        {label}
      </div>
    </div>
  );
}
