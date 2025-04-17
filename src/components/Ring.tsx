import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

interface Props {
  progress: number;
  label: string;
  color?: string;
  onClick?: () => void;
}

export default function Ring({ progress, label, color = "#22c55e", onClick }: Props) {
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progressValue = useMotionValue(0);
  const strokeOffset = useTransform(progressValue, v => circumference - (v / 100) * circumference);
  const display = useTransform(progressValue, v => `${Math.round(v)}%`);

  const hasCelebrated = useRef(false);
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    const controls = animate(progressValue, progress * 100, {
      duration: 1.5,
      ease: "easeOut",
    });

    if (progress >= 1 && !hasCelebrated.current) {
      hasCelebrated.current = true;

      // 🎉 Конфетти
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: [color, "#ffffff"],
      });

      // 🔊 Звук
      const sound = new Audio("/sounds/success.mp3");
      sound.play().catch(console.error);

      // 🟡 Bounce
      setShouldBounce(true);
      setTimeout(() => setShouldBounce(false), 1000);
    }

    // 🔁 Сброс при снижении прогресса
    if (progress < 1 && hasCelebrated.current) {
      hasCelebrated.current = false;
    }

    return controls.stop;
  }, [progress]);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      className="relative w-24 sm:w-28 h-24 sm:h-28 cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: shouldBounce ? [1, 1.2, 0.9, 1] : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.6,
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          onClick();
        }
      }}
      aria-label={`Кольцо ${label} заполнено на ${Math.round(progress * 100)}%`}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="50"
          cy="50"
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="50"
          cy="50"
          style={{
            strokeDashoffset: strokeOffset,
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-lg sm:text-xl font-bold text-white">
          {display}
        </motion.span>
        <span className="text-xs text-gray-300 mt-1">{label}</span>
      </div>
    </motion.div>
  );
}
