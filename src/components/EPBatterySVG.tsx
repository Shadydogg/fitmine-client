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
    <div className="flex flex-col items-center justify-center text-white text-sm w-full max-w-xs px-4">
      <svg
        viewBox="0 0 220 80"
        className="w-full h-auto"
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
          width="195"
          height="52"
          rx="10"
          ry="10"
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />
        {/* Носик */}
        <rect x="202" y="28" width="10" height="24" rx="2" fill="#444" />

        {/* Анимированные сегменты */}
        {Array.from({ length: totalSegments }).map((_, i) => {
          const x = 8 + i * 38;
          const isFilled = i < filledSegments;
          return (
            <motion.rect
              key={i}
              x={x}
              y={18}
              width={30}
              height={44}
              rx={4}
              fill={isFilled ? "#00FFC6" : "#1f1f1f"}
              filter={isFilled ? "url(#glow)" : "none"}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformOrigin: "center bottom" }} // 👈 добавлено
              transition={{
                delay: 0.1 * i,
                duration: 0.4,
                type: "spring",
                stiffness: 180,
                damping: 18,
              }}
            />
          );
        })}
      </svg>

      <div className="mt-2 text-sm font-semibold text-center">
        {Math.round(ep)} / {dailyGoal} <span className="text-zinc-400">EP</span>
      </div>
    </div>
  );
}
