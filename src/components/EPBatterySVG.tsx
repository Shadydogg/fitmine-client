import { motion } from "framer-motion";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatterySVG({ ep, dailyGoal = 1000 }: Props) {
  const percentage = Math.min(ep / dailyGoal, 1);
  const totalSegments = 5;
  const filledSegments = Math.floor(percentage * totalSegments);

  // Градиентные цвета прогресса от красного к бирюзовому
  const colors = ["#FF4E50", "#FFA95D", "#FFE981", "#9EFFA5", "#00FFC6"];

  return (
    <div className="flex flex-col items-center justify-center text-white text-sm w-full max-w-[260px] px-2">
      <svg
        viewBox="0 0 240 80"
        className="w-full h-[64px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00FFC6" />
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

        {/* Сегменты */}
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
              fill={isFilled ? colors[i] : "#1f1f1f"}
              filter={isFilled ? "url(#glow)" : "none"}
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{
                delay: 0.08 * i,
                type: "spring",
                stiffness: 180,
                damping: 16,
              }}
            />
          );
        })}
      </svg>

      {/* Подпись */}
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold">
          {Math.round(ep)} / {dailyGoal} <span className="text-zinc-400">EP</span>
        </div>
        <div className="text-xs text-pink-300">
          Осталось {dailyGoal - Math.round(ep)} EP до награды
        </div>
      </div>
    </div>
  );
}
