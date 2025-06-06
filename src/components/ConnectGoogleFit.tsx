import { usePlatform } from '../hooks/usePlatform';
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
  const [needReauth, setNeedReauth] = useState(false);

  const openAuthWindow = () => {
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

    window.open(url.toString(), '_blank');
  };

  const handleGoogleConnect = () => openAuthWindow();
  const handleIOSShortcut = () => {
    window.location.href = 'shortcuts://run-shortcut?name=FitMineGoogleFit';
  };

  useEffect(() => {
    if (window?.needGoogleReauth === true) {
      setNeedReauth(true);
      // ⏱ Автоподключение через 2 сек
      setTimeout(() => {
        if (!isTelegramIOS) {
          openAuthWindow();
        } else {
          handleIOSShortcut();
        }
      }, 2000);
    }
  }, [isTelegramIOS]);

  return (
    <div className="mt-4 text-center space-y-2">
      {needReauth && (
        <div className="text-yellow-300 text-sm font-medium animate-pulse">
          ⚠️ Требуется повторная авторизация Google Fit...
        </div>
      )}

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
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-full shadow hover:scale-105 transition-transform"
        >
          🔓 Подключить Google Fit
        </button>
      )}
    </div>
  );
}
