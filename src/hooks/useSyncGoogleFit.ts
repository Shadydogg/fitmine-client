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
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (res.data.ok) {
          setData({
            steps: res.data.steps || 0,
            calories: res.data.calories || 0,
            minutes: res.data.minutes || 0,
            distance: res.data.distance || 0,
            date: res.data.date || new Date().toISOString()
          });

          window.needGoogleReauth = false;
        } else {
          setError(res.data.error || 'Ошибка при синхронизации');
          if (res.data.need_reauth) {
            window.needGoogleReauth = true;
          }
        }

      } catch (err: any) {
        setError(err?.message || 'Ошибка подключения');
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleFit();
  }, [accessToken, sessionLoaded]);

  return { data, loading, error };
}
