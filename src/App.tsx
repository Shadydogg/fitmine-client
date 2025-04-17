import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/setup';

import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import useTokenRefresher from './hooks/useTokenRefresher';
import { SessionProvider, useSession } from './context/SessionContext';
import LanguageSwitcher from './components/LanguageSwitcher';

function AppRoutes() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    setTokens,
    sessionLoaded,
    accessToken
  } = useSession();

  useTokenRefresher();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand?.();

      const initDataRaw = tg.initData;
      if (initDataRaw && initDataRaw.length > 10) {
        localStorage.setItem('initData', initDataRaw);
        console.log(t('app.initDataUpdated'));
      }

      const lang = tg.initDataUnsafe?.user?.language_code || 'en';
      i18n.changeLanguage(['ru', 'en', 'zh', 'es'].includes(lang) ? lang : 'en');
    }
  }, [i18n, t]);

  useEffect(() => {
    if (sessionLoaded && accessToken) {
      fetch('https://api.fitmine.vip/api/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(console.error);
    }
  }, [sessionLoaded, accessToken]);

  return (
    <Routes>
      <Route path="/" element={<Landing onStart={() => navigate('/dashboard')} loading={loading} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <LanguageSwitcher />
      <AppRoutes />
    </SessionProvider>
  );
}
