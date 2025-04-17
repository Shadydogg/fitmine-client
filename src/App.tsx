import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/setup';

import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import useTokenRefresher from './hooks/useTokenRefresher';
import { SessionProvider, useSession } from './context/SessionContext';

// 👉 Внутренние маршруты сессии
function AppRoutes() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setTokens, sessionLoaded, accessToken } = useSession();

  // 🔁 Фоновое обновление access/refresh токенов
  useTokenRefresher();

  // 📦 Telegram initData
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand?.();

      const initDataRaw = tg.initData;
      if (initDataRaw && initDataRaw.length > 10) {
        localStorage.setItem('initData', initDataRaw);
        console.log('📦 initData обновлён в localStorage');
      }

      const lang = tg.initDataUnsafe?.user?.language_code || 'en';
      i18n.changeLanguage(['ru', 'en', 'zh', 'es'].includes(lang) ? lang : 'en');
    }
  }, [i18n]);

  // ✅ Автоматическая синхронизация профиля
  useEffect(() => {
    if (sessionLoaded && accessToken) {
      fetch('https://api.fitmine.vip/api/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.ok && res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
            console.log('🔁 Профиль обновлён из Supabase');
          }
        })
        .catch(err => {
          console.warn('⚠️ Ошибка загрузки профиля:', err.message);
        });
    }
  }, [sessionLoaded, accessToken]);

  // 🚀 Telegram авторизация
  const handleStart = async () => {
    const initDataRaw = localStorage.getItem('initData') || '';

    if (!initDataRaw || initDataRaw.length < 20) {
      alert('❌ Ошибка: подпись Telegram недоступна.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.fitmine.vip/api/verifyTelegram", {
        method: "POST",
        headers: {
          Authorization: `tma ${initDataRaw}`
        }
      });

      const data = await res.json();

      if (data.ok && data.access_token && data.refresh_token) {
        setTokens(data.access_token, data.refresh_token, data.user);
        console.log('✅ Авторизация успешна, токены сохранены');
        navigate('/profile');
      } else {
        alert(`❌ Ошибка авторизации: ${data.error || 'Неизвестная'}`);
      }
    } catch (err) {
      console.error('❌ Ошибка запроса:', err);
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Пока сессия не загружена
  if (!sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Загрузка сессии...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing onStart={handleStart} loading={loading} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

// 🎯 Сессия обёрнута глобальным провайдером
export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
}