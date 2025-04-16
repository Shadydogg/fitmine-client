import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import BottomTab from '../components/BottomTab';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accessToken, isAuthenticated, sessionLoaded } = useSession();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoaded) return;

    if (!isAuthenticated || !accessToken) {
      console.warn('❌ accessToken отсутствует или пользователь не авторизован');
      setLoading(false);
      return;
    }

    fetch('https://api.fitmine.vip/api/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setUser(res.user);
        } else {
          console.warn('⚠️ Ошибка загрузки профиля:', res.error);
        }
      })
      .catch((err) => {
        console.error('❌ Ошибка профиля:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken, isAuthenticated, sessionLoaded]);

  if (loading || !sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-center">
        {t('profile.loading', 'Загрузка профиля...')}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-center">
        {t('profile.notFound', 'Профиль не найден')}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pb-24 bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* 🔙 Назад */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 text-sm text-gray-400 hover:text-white"
      >
        ← {t('profile.back', 'Назад')}
      </button>

      {/* 🧩 Заголовок */}
      <h1 className="text-3xl font-extrabold mt-20 mb-6 tracking-wide drop-shadow text-center">
        {t('profile.title')} • FitMine
      </h1>

      {/* 🧊 Карточка */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
      >
        <img
          src={user.photo_url || '/default-avatar.png'}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md border border-white/20"
        />
        <h2 className="text-xl font-semibold text-white">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-sm text-gray-400">@{user.username}</p>

        {user.is_premium && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-xs bg-purple-600/80 text-white rounded-full shadow shadow-purple-500/50">
            💎 {t('profile.premium', 'Премиум-пользователь')}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div>🆔 {t('profile.id')}: {user.telegram_id}</div>
          <div>🌐 Язык: {user.language_code}</div>
          <div>💬 ЛС: {user.allows_write_to_pm ? '✅ Да' : '❌ Нет'}</div>
        </div>

        {/* 🚀 Кнопка перехода */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 px-4 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-white rounded-full shadow hover:scale-105 transition-transform font-semibold"
        >
          {t('profile.goDashboard', 'Назад к активности')}
        </button>
      </motion.div>

      {/* 🔻 BottomTab */}
      <BottomTab current="profile" />
    </div>
  );
}
