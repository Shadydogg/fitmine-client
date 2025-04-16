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
          steps: number;
          calories: number;
          minutes: number;
          distance: number;
          date: string;
        }>('https://api.fitmine.vip/api/sync/google', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (res.data.ok) {
          setData({
            steps: res.data.steps,
            calories: res.data.calories,
            minutes: res.data.minutes,
            distance: res.data.distance,
            date: res.data.date
          });
        } else {
          setError(res.data.error || 'Ошибка при синхронизации');
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
