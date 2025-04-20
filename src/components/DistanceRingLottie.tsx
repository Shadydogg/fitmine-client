import Lottie from "lottie-react";
import ringAnimation from "../assets/lottie/ring-distance.json";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function DistanceRingLottie({ ep, dailyGoal = 5 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const ringScale = 0.85 + percentage * 0.15;

  return (
    <div className="flex flex-col items-center justify-center text-center w-36 h-36 md:w-40 md:h-40">
      <div className="w-full h-full">
        <Lottie
          animationData={ringAnimation}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${ringScale})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold leading-snug">
        {Math.round(ep * 10) / 10} / {dailyGoal}{" "}
        <span className="font-normal text-zinc-300">км</span>
      </div>
    </div>
  );
}
