import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';

type Props = {
  onStart: () => void;
  loading: boolean;
};

const Landing: React.FC<Props> = ({ onStart, loading }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white text-center px-6 relative overflow-hidden">
      {/* 🔮 Логотип */}
      <img
        src={logo}
        alt="FitMine Logo"
        className="w-60 md:w-72 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-2xl"
      />

      {/* 💡 Заголовок */}
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-500 to-violet-500 text-transparent bg-clip-text mb-4 drop-shadow-md">
        FitMine
      </h1>

      {/* 💬 Подзаголовок */}
      <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
        {t('landing.description', 'Зарабатывай очки за активность и прокачивай свой NFT-персонаж в реальной жизни')}
      </p>

      {/* 🚀 Кнопка запуска */}
      <button
        type="button"
        onClick={onStart}
        disabled={loading}
        aria-label="Начать"
        className={`px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 ease-in-out focus:outline-none shadow-xl
          ${
            loading
              ? 'bg-gray-500 cursor-not-allowed text-white/70'
              : 'bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-white hover:brightness-110 hover:scale-105'
          }
        `}
      >
        {loading ? t('loading', 'Загрузка...') : t('landing.start', 'Начать')}
      </button>

      {/* 🧾 Подпись */}
      <div className="mt-8 text-xs text-gray-500">@FitMineBot</div>
    </div>
  );
};

export default Landing;
