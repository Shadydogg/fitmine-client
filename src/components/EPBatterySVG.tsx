import { motion } from "framer-motion";

interface Props {
  ep: number;
  goal?: number;
}

export default function EPBatterySVG({ ep, goal = 1000 }: Props) {
  const percentage = Math.min(ep / goal, 1);
  const filledSegments = Math.round(percentage * 5);

  return (
    <div className="flex flex-col items-center justify-center text-white text-sm w-full px-4 max-w-xs sm:max-w-sm">
      <svg
        viewBox="0 0 260 100"
        className="w-full h-auto"
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
          x="5"
          y="20"
          width="230"
          height="60"
          rx="12"
          ry="12"
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />

        {/* Носик батареи */}
        <rect x="240" y="35" width="12" height="30" rx="3" fill="#444" />

        {/* Сегменты */}
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < filledSegments;
          return (
            <motion.rect
              key={i}
              x={10 + i * 45}
              y={25}
              width={35}
              height={50}
              rx={6}
              fill={isFilled ? "#00FFC6" : "#1f1f1f"}
              filter={isFilled ? "url(#glow)" : "none"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.05 * i,
                type: "spring",
                stiffness: 180,
                damping: 16,
              }}
            />
          );
        })}
      </svg>

      {/* Подпись с данными */}
      <div className="mt-2 text-sm font-semibold text-center">
        {Math.round(ep)} / {goal} <span className="text-zinc-400">EP</span>
      </div>
    </div>
  );
}
