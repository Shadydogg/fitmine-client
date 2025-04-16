import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  progress: number; // 0.0 to 1.0
  label: string;
  color?: string; // hex
  onClick?: () => void;
}

export default function Ring({ progress, label, color = "#22c55e", onClick }: Props) {
  const radius = 45;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progressValue = useMotionValue(0);
  const strokeOffset = useTransform(
    progressValue,
    (v) => circumference - (v / 100) * circumference
  );
  const display = useTransform(progressValue, (v) =>
    v >= 100 ? "✓" : `${Math.round(v)}%`
  );

  useEffect(() => {
    const controls = animate(progressValue, progress * 100, {
      duration: 1.4,
      ease: "easeOut",
    });
    return controls.stop;
  }, [progress]);

  return (
    <motion.div
      className="relative w-24 sm:w-28 h-24 sm:h-28 cursor-pointer select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: progress >= 1 ? [1, 1.15, 1] : 1,
      }}
      transition={{
        delay: 0.2,
        duration: progress >= 1 ? 0.6 : 0.4,
        type: "spring",
      }}
      onClick={onClick}
      aria-label={`Кольцо ${label} заполнено на ${Math.round(progress * 100)}%`}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Базовый круг фона */}
        <circle
          stroke="#2a2a2a"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="50"
          cy="50"
        />

        {/* Градиентный штрих для стиля Apple */}
        <defs>
          <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Прогресс */}
        <motion.circle
          stroke={`url(#grad-${label})`}
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

      {/* Центр: число и лейбл */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.span
          className={`text-lg sm:text-xl font-bold ${
            progress >= 1 ? "text-green-400" : ""
          }`}
        >
          {display}
        </motion.span>
        <span className="text-xs text-gray-400 mt-1">{label}</span>
        {progress >= 1 && (
          <motion.span
            className="text-[10px] text-emerald-400 mt-1 font-medium"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Цель достигнута!
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
