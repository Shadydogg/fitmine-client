// /src/components/ConnectGoogleFit.tsx — v2.6.0
import { usePlatform } from '../hooks/usePlatform';
import { useSession } from '../context/SessionContext';
import { useEffect, useState } from 'react';

const CLIENT_ID = '913307768705-78gti3vn7gkjrjk1nemvrqopknqm0ieb.apps.googleusercontent.com';
const REDIRECT_URI = 'https://www.fitmine.vip/api/oauth/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.body.read'
].join(' ');

export default function ConnectGoogleFit() {
  const { isTelegramIOS } = usePlatform();
  const { refreshUser } = useSession();
  const [connecting, setConnecting] = useState(false);
  const [needReconnect, setNeedReconnect] = useState(false);

  useEffect(() => {
    const need = window.needGoogleReauth || localStorage.getItem('needGoogleReauth') === 'true';
    setNeedReconnect(need);
  }, []);

  const handleGoogleConnect = () => {
    const initData = localStorage.getItem('initData') || '';
    if (!initData || initData.length < 20) {
      alert('❌ Ошибка: Telegram initData не найден.');
      return;
    }

    const state = btoa(initData);
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('scope', SCOPES);
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('state', state);

    setConnecting(true);

    const authWindow = window.open(url.toString(), '_blank');

    const interval = setInterval(() => {
      if (authWindow?.closed) {
        clearInterval(interval);
        console.log('🔄 Окно авторизации закрыто, обновляем пользователя...');
        refreshUser();
        setConnecting(false);
        window.needGoogleReauth = false;
        localStorage.setItem('needGoogleReauth', 'false');
        setNeedReconnect(false);
      }
    }, 1000);
  };

  const handleIOSShortcut = () => {
    window.location.href = 'shortcuts://run-shortcut?name=FitMineGoogleFit';
  };

  return (
    <div className="mt-6 text-center">
      {isTelegramIOS ? (
        <button
          onClick={handleIOSShortcut}
          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-full shadow hover:scale-105 transition-transform"
        >
          🔗 Открыть ярлык Google Fit (iOS)
        </button>
      ) : (
        <button
          onClick={handleGoogleConnect}
          disabled={connecting}
          className={`px-6 py-2 text-white font-bold rounded-full shadow transition-transform ${
            connecting
              ? 'bg-gray-500 cursor-not-allowed'
              : needReconnect
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:scale-105'
          }`}
        >
          {connecting
            ? '⏳ Подключение...'
            : needReconnect
            ? '🔁 Повторно подключить Google Fit'
            : '🔓 Подключить Google Fit'}
        </button>
      )}
    </div>
  );
}