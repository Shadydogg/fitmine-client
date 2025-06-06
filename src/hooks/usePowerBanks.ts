import { useEffect, useState } from 'react';
import axios from 'axios';

export function usePowerBanks() {
  const [availableCount, setAvailableCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/api/powerbanks');
        const available = data.powerbanks.filter((pb: any) => !pb.used).length;
        setAvailableCount(available);
      } catch {
        setAvailableCount(0);
      }
    };
    load();
  }, []);

  return availableCount;
}
