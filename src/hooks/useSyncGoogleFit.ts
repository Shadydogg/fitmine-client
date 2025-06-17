import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from '../context/SessionContext';

interface GoogleActivityData {
  steps: number;
  calories: number;
  minutes: number;
  distance: number;
  date: string;
}

export default function useSyncGoogleFit() {
  const { accessToken, sessionLoaded } = useSession();

  const [data, setData] = useState<GoogleActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoaded || !accessToken) return;

    const fetchGoogleFit = async () => {
      setLoading(true);
      try {
        const res = await axios.post<{
          ok: boolean;
          steps?: number;
          calories?: number;
          minutes?: number;
          distance?: number;
          date?: string;
          error?: string;
          need_reauth?: boolean;
        }>('https://api.fitmine.vip/api/sync/google', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data.ok) {
          const {
            steps = 0,
            calories = 0,
            minutes = 0,
            distance = 0,
            date = new Date().toISOString(),
          } = res.data;

          setData({ steps, calories, minutes, distance, date });
          window.needGoogleReauth = false;
        } else {
          console.warn('⚠️ Google Fit sync error:', res.data.error);
          setError(res.data.error || 'Ошибка при синхронизации');

          if (res.data.need_reauth) {
            window.needGoogleReauth = true;
          }
        }

      } catch (err: any) {
        console.error('❌ Ошибка подключения к Google Fit:', err);
        setError(err?.message || 'Ошибка подключения');
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleFit();
  }, [accessToken, sessionLoaded]);

  return { data, loading, error };
}