import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useSession } from '../context/SessionContext';
import BottomTab from '../components/BottomTab';
import ConnectGoogleFit from '../components/ConnectGoogleFit';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accessToken, isAuthenticated, sessionLoaded, user } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoaded) {
      setLoading(false);
    }
  }, [sessionLoaded]);

  if (loading || !sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-center">
        {t('profile.loading', 'Загрузка профиля...')}
      </div>
    );
  }

  if (!user || !isAuthenticated || !accessToken) {
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

      <div className="mt-20 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">{user?.name || 'User'}</h2>
        <p className="text-sm text-gray-400 mb-4">{user?.email || 'No email available'}</p>

        <ConnectGoogleFit />
      </div>

      <BottomTab current="profile" />
    </div>
  );
}
