import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/setup';

import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import useTokenRefresher from './hooks/useTokenRefresher';
import { SessionProvider, useSession } from './context/SessionContext';

// 👉 Обособленные маршруты внутри контекста
function AppRoutes() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setTokens, sessionLoaded } = useSession();

  // 🔁 Фоновая проверка refresh_token (если есть)
  useTokenRefresher();

  // 📦 initData от Telegram
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

  // ⏳ Пока контекст не загружен — рендерим ожидание
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
      {/* 🔮 Готов к будущим страницам */}
      {/* <Route path="/xp" element={<XP />} />
      <Route path="/shop" element={<Shop />} /> */}
    </Routes>
  );
}

// 🎯 Оборачиваем глобальным SessionProvider
export default function App() {
  return (
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  );
}
