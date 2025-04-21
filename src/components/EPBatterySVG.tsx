// src/components/EPBatterySVG.tsx — v2.2.0 (поэтапная заливка сегментов с glow)
import { motion } from "framer-motion";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatterySVG({ ep, dailyGoal = 1000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const totalSegments = 5;
  const filledSegments = Math.floor(percentage * totalSegments);

  return (
    <div className="flex flex-col items-center justify-center text-white text-sm w-full px-4 max-w-md">
      <svg
        viewBox="0 0 240 80"
        className="w-full max-w-xs sm:max-w-sm h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00FFC6" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00FFC6" />
          </filter>
        </defs>

        {/* Контур батареи */}
        <rect
          x="4"
          y="14"
          width="205"
          height="52"
          rx="10"
          ry="10"
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />
        {/* Носик */}
        <rect x="212" y="28" width="10" height="24" rx="2" fill="#444" />

        {/* Анимированные сегменты */}
        {Array.from({ length: totalSegments }).map((_, i) => {
          const x = 8 + i * 40;
          const isFilled = i < filledSegments;
          return (
            <motion.rect
              key={i}
              x={x}
              y={18}
              width={32}
              height={44}
              rx={4}
              fill={isFilled ? "#00FFC6" : "#1f1f1f"}
              filter={isFilled ? "url(#glow)" : "none"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transformOrigin="center bottom"
              transition={{
                delay: 0.1 * i,
                type: "spring",
                stiffness: 160,
                damping: 20,
              }}
              transform={`translate(0, 18)`}
            />
          );
        })}
      </svg>

      {/* Подпись EP */}
      <div className="mt-2 text-sm font-semibold text-center">
        {Math.round(ep)} / {dailyGoal} <span className="text-zinc-400">EP</span>
      </div>
    </div>
  );
}
