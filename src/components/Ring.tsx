import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

type RingProps = {
  label: string;
  value: number;
  goal: number;
  unit?: string;
};

const Ring: React.FC<RingProps> = ({ label, value, goal, unit = '' }) => {
  const percentage = Math.min((value / goal) * 100, 100);
  const isComplete = percentage >= 100;
  const confettiShown = useRef(false);

  useEffect(() => {
    if (isComplete && !confettiShown.current) {
      confettiShown.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ff', '#0f0', '#ff0'],
      });
    }
  }, [isComplete]);

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const gradientId = `gradient-${label}`;

  return (
    <div className="flex flex-col items-center text-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]"
      >
        <defs>
          <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ff" />
            <stop offset="100%" stopColor="#39f" />
          </linearGradient>
        </defs>
        <circle
          stroke="#222"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={`url(#${gradientId})`}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center mt-[-70px]">
        <div className="text-2xl font-bold text-cyan-400 drop-shadow">{value}{unit}</div>
        <div className="text-xs text-zinc-400">{label}</div>
      </div>
    </div>
  );
};

export default Ring;
