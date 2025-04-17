export function usePlatform() {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isTelegram = /telegram/.test(ua);

  return {
    isIOS,
    isAndroid,
    isTelegram,
    isTelegramIOS: isIOS && isTelegram,
    isMobile: isIOS || isAndroid
  };
}
