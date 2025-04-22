import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  ep: number;
  dailyGoal?: number;
}

export default function EPBatterySVG({ ep, dailyGoal = 1000 }: Props) {
  const [animatedEP, setAnimatedEP] = useState(0);
  const percentage = Math.min(animatedEP / dailyGoal, 1);
  const totalSegments = 5;
  const filledSegments = Math.floor(percentage * totalSegments);
  const isFull = animatedEP >= dailyGoal;
  const isEmpty = animatedEP <= 0;

  useEffect(() => {
    let frameId: number;
    const duration = 1000;
    const start = performance.now();
    const initial = animatedEP;
    const delta = ep - initial;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedEP(Math.round(initial + delta * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [ep]);

  return (
    <div className="flex flex-col items-center justify-center text-white text-sm w-full px-4 max-w-[260px] mx-auto relative">
      <div className="relative w-full aspect-[4/1]">
        <svg
          viewBox="0 0 220 80"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00FFC6" />
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00FFC6" />
            </filter>
          </defs>

          {/* Контур */}
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
          <rect x="202" y="28" width="10" height="24" rx="2" fill="#444" />

          {/* Сегменты */}
          {Array.from({ length: totalSegments }).map((_, i) => {
            const x = 8 + i * 38;
            const isFilled = i < filledSegments;
            const isCharging = i === filledSegments && percentage < 1;

            if (isCharging) {
              return (
                <motion.rect
                  key={i}
                  x={x}
                  y={18}
                  width={30}
                  height={44}
                  rx={4}
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  fill="#00FFC6"
                  filter="url(#glow)"
                />
              );
            }

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
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                style={{ transformOrigin: "center bottom" }}
                transition={{
                  delay: 0.1 * i,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              />
            );
          })}
        </svg>

        {/* ⚡ Пусто */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-2xl text-zinc-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              ⚡
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎉 Полная зарядка */}
        <AnimatePresence>
          {isFull && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-[#00FFC6] pointer-events-none"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0.2, 0.6, 0],
                scale: [1, 1.05, 1.1],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Подпись */}
      <div className="mt-2 text-sm font-semibold text-center">
        {Math.round(animatedEP)} / {dailyGoal} <span className="text-zinc-400">EP</span>
      </div>
    </div>
  );
}
