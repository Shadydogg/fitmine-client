import { usePlatform } from '../hooks/usePlatform';

export default function ConnectGoogleFit() {
  const { isTelegramIOS } = usePlatform();

  const handleGoogleConnect = () => {
    const initData = localStorage.getItem('initData') || '';
    if (!initData || initData.length < 20) {
      alert("Ошибка: Telegram initData не найден.");
      return;
    }

    const url = new URL("https://fitmine.vip/api/oauth/google");
    window.open(url.toString(), "_blank");
  };

  const handleIOSShortcut = () => {
    // Открывает ярлык FitMine в iOS через Shortcuts
    window.location.href = "shortcuts://run-shortcut?name=FitMineGoogleFit";
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
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-full shadow hover:scale-105 transition-transform"
        >
          🔓 Подключить Google Fit
        </button>
      )}
    </div>
  );
}
