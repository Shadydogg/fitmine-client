import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserEP } from '../hooks/useUserEP';

type PowerBank = {
  id: string;
  ep_amount: number;
  claimed_at: string;
  used: boolean;
  used_at: string | null;
  powerbank_type: 'basic' | 'rare' | 'epic' | 'event';
};

export const PowerBankInventory: React.FC = () => {
  const [powerbanks, setPowerbanks] = useState<PowerBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingId, setUsingId] = useState<string | null>(null);

  const { ep, refetch: refetchEP, loading: epLoading } = useUserEP();

  useEffect(() => {
    const fetchPowerbanks = async () => {
      try {
        const { data } = await axios.get('/api/powerbanks');
        setPowerbanks(data.powerbanks || []);
      } catch (err) {
        console.error('❌ Ошибка загрузки PowerBank:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPowerbanks();
  }, []);

  const handleUse = async (id: string) => {
    if (ep >= 1000) {
      alert("⚡ Вы уже полностью заряжены! PowerBank доступен только при EP < 1000.");
      return;
    }

    try {
      setUsingId(id);
      const res = await axios.post('/api/powerbanks/use', { id });
      alert(res.data.message || '✅ PowerBank использован!');
      setPowerbanks(prev =>
        prev.map(pb =>
          pb.id === id ? { ...pb, used: true, used_at: new Date().toISOString() } : pb
        )
      );
      refetchEP();
    } catch (err: any) {
      alert(err.response?.data?.error || '❌ Ошибка использования PowerBank');
    } finally {
      setUsingId(null);
    }
  };

  if (loading || epLoading) return <div className="text-white">🔄 Загрузка PowerBank...</div>;

  if (powerbanks.length === 0) return <div className="text-white">😕 У вас пока нет PowerBank.</div>;

  return (
    <div className="space-y-4">
      {powerbanks.map(pb => (
        <div
          key={pb.id}
          className="bg-zinc-900 rounded-xl p-4 flex items-center justify-between shadow-md border border-zinc-700"
        >
          <div>
            <p className="text-lg font-semibold text-white">
              {pb.powerbank_type.toUpperCase()} PowerBank
            </p>
            <p className="text-sm text-gray-400">
              Получен: {new Date(pb.claimed_at).toLocaleDateString()} • EP: {pb.ep_amount}
            </p>
          </div>
          <button
            onClick={() => handleUse(pb.id)}
            disabled={pb.used || ep >= 1000 || usingId === pb.id}
            className={`px-4 py-2 rounded-lg text-white font-bold transition-all ${
              pb.used
                ? 'bg-gray-500 cursor-not-allowed'
                : ep >= 1000
                ? 'bg-yellow-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {pb.used
              ? 'Использован'
              : usingId === pb.id
              ? '⚡ Применение...'
              : 'Использовать'}
          </button>
        </div>
      ))}
    </div>
  );
};
