import { usePlatform } from '../hooks/usePlatform';
import { useTranslation } from 'react-i18next';

const CLIENT_ID = '913307768705-78gti3vn7gkjrjk1nemvrqopknqm0ieb.apps.googleusercontent.com';
const REDIRECT_URI = 'https://www.fitmine.vip/api/oauth/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.location.read',
  'https://www.googleapis.com/auth/fitness.body.read'
].join(' ');

export default function ConnectGoogleFit() {
  const { t } = useTranslation();
  const { isTelegramIOS } = usePlatform();

  const handleGoogleConnect = () => {
    const initData = localStorage.getItem('initData') || '';
    if (!initData || initData.length < 20) {
      alert(t('connectFit.errorNoInitData'));
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

  const handleIOSShortcut = () => {
    window.location.href = 'shortcuts://run-shortcut?name=FitMineGoogleFit';
  };

  return (
    <div className="text-center">
      <button
        onClick={isTelegramIOS ? handleIOSShortcut : handleGoogleConnect}
        className="bg-green-500 text-white py-2 px-4 rounded"
      >
        {t('connectFit.button')}
      </button>
    </div>
  );
}
