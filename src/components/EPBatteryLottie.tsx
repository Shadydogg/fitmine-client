import Lottie from "lottie-react";
import batteryAnimation from "../assets/lottie/ep-battery.json";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatteryLottie({ ep, dailyGoal = 1000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const batteryScale = 0.95 + percentage * 0.05;

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-md">
      <div className="w-full max-w-xs sm:max-w-sm">
        <Lottie
          animationData={batteryAnimation}
          loop
          autoplay
          style={{
            width: "100%",
            height: "auto",
            transform: `scale(${batteryScale})`,
          }}
        />
      </div>
      <div className="mt-2 text-sm text-white font-semibold leading-snug">
        {Math.round(ep)} / {dailyGoal}{" "}
        <span className="font-normal text-zinc-300">EP</span>
      </div>
    </div>
  );
}
