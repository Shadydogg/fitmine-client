// 📄 /src/pages/Landing.tsx v2.1.0

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingProps {
  onStart: () => void;
  loading: boolean;
}

const Landing: React.FC<LandingProps> = ({ onStart, loading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-950 text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* 💫 Анимированный фон */}
      <div className="absolute inset-0 opacity-20 pointer-events-none animate-pulse z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>

      {/* 🔥 Лого и заголовок */}
      <div className="z-10 text-center mb-10">
        <img
          src="/logo.png"
          alt="FitMine Logo"
          className="h-20 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,255,255,0.6)]"
        />
        <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide drop-shadow-lg">
          Welcome to FitMine
        </h1>
        <p className="text-md mt-3 text-zinc-300 max-w-md mx-auto leading-relaxed">
          Gamify your health. Sync your steps, earn rewards, challenge friends, level up.
        </p>
      </div>

      {/* 🚀 Кнопка запуска */}
      <button
        onClick={onStart}
        disabled={loading}
        className="z-10 mt-4 bg-cyan-500 text-black font-semibold text-lg px-8 py-4 rounded-2xl ring-4 ring-cyan-700 shadow-[0_0_20px_rgba(0,255,255,0.7)] hover:scale-105 hover:bg-cyan-400 transition-all animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Loading...' : '🚀 Start Now'}
      </button>

      {/* 🔗 Подключение платформ */}
      <div className="z-10 mt-10 text-sm text-zinc-400">
        Connect with:
        <div className="flex gap-6 justify-center mt-3">
          <img
            src="/telegram.svg"
            className="h-6 hover:scale-110 transition"
            alt="Telegram"
          />
          <img
            src="/google-fit.svg"
            className="h-6 hover:scale-110 transition"
            alt="Google Fit"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
