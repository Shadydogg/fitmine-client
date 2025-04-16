// App.tsx — v3.3.2 (обновление initData при каждом запуске)
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/setup';

import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand?.();

      // 📦 Всегда обновляем initData (иначе может устареть)
      const initDataRaw = tg.initData;
      if (initDataRaw && initDataRaw.length > 10) {
        localStorage.setItem('initData', initDataRaw);
        console.log('📦 initData обновлён в localStorage');
      }

      const lang = tg.initDataUnsafe?.user?.language_code || 'en';
      i18n.changeLanguage(['ru', 'en', 'zh', 'es'].includes(lang) ? lang : 'en');
    }
  }, [i18n]);

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

      if (data.ok && data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ Авторизация успешна, access_token сохранён');
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

  return (
    <Routes>
      <Route path="/" element={<Landing onStart={handleStart} loading={loading} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
