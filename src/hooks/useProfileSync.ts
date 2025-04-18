// /hooks/useProfileSync.ts — v1.0.0
import { useEffect } from 'react';
import { useSession } from '../context/SessionContext';

export default function useProfileSync() {
  const { sessionLoaded, accessToken, setTokens } = useSession();

  useEffect(() => {
    if (!sessionLoaded || !accessToken) return;

    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (localUser?.telegram_id) return; // ⚠️ Уже сохранено, не обновляем повторно

    fetch('https://api.fitmine.vip/api/profile', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          setTokens(accessToken, localStorage.getItem('refresh_token') || '', res.user);
          console.log('✅ useProfileSync: Профиль обновлён из Supabase');
        }
      })
      .catch(err => {
        console.warn('⚠️ useProfileSync: Ошибка загрузки профиля:', err.message);
      });
  }, [sessionLoaded, accessToken, setTokens]);
}
