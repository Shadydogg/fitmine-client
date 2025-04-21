// src/components/EPBatterySVG.tsx — v1.0.0 (батарейка через SVG + деления)
import { motion } from "framer-motion";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatterySVG({ ep, dailyGoal = 1000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const filledSegments = Math.round(percentage * 5);

  return (
    <div className="flex flex-col items-center justify-center text-white text-sm w-full max-w-xs sm:max-w-sm">
      <svg
        viewBox="0 0 260 100"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Контур батареи */}
        <rect
          x="5"
          y="20"
          width="230"
          height="60"
          rx="12"
          ry="12"
          fill="none"
          stroke="#ccc"
          strokeWidth="3"
        />

        {/* "Носик" батареи */}
        <rect x="240" y="35" width="12" height="30" rx="3" fill="#ccc" />

        {/* Деления */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.rect
            key={i}
            x={10 + i * 45}
            y={25}
            width={35}
            height={50}
            rx={6}
            fill={i < filledSegments ? "#00FFC6" : "#333"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * i }}
          />
        ))}
      </svg>

      <div className="mt-2 font-semibold">
        {Math.round(ep)} / {dailyGoal} <span className="text-zinc-400">EP</span>
      </div>
    </div>
  );
}
