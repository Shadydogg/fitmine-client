// /src/components/PowerBankInventory.tsx — v1.2.0
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserEP } from "../hooks/useUserEP";
import { usePowerBanks } from "../hooks/usePowerBanks";

type PowerBank = {
  id: string;
  ep_amount: number;
  claimed_at: string;
  used: boolean;
  used_at: string | null;
  powerbank_type: "basic" | "rare" | "epic" | "event";
  source?: string;
};

export const PowerBankInventory: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [usingId, setUsingId] = useState<string | null>(null);

  const { ep, refetch: refetchEP, loading: epLoading } = useUserEP();
  const {
    powerbanks,
    loading: loadingPB,
    refetch: refetchPowerbanks,
  } = usePowerBanks();

  const handleUse = async (id: string) => {
    if (ep >= 1000) {
      alert("⚡ Энергия уже полная. Использовать PowerBank нельзя.");
      return;
    }

    try {
      setUsingId(id);
      setMessage(null);
      const res = await axios.post("/api/powerbanks/use", { id });
      setMessage(res.data.message || "✅ PowerBank активирован");

      await Promise.all([refetchPowerbanks(), refetchEP()]);
    } catch (err: any) {
      const msg = err.response?.data?.error || "❌ Ошибка применения PowerBank";
      alert(msg);
      setMessage(msg);
    } finally {
      setUsingId(null);
    }
  };

  if (loadingPB || epLoading) {
    return <div className="text-white text-center py-4">🔄 Загрузка PowerBank...</div>;
  }

  if (!powerbanks.length) {
    return <div className="text-white text-center py-4">😕 У вас нет PowerBank'ов.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 space-y-4">
      <h2 className="text-xl font-bold text-center text-white mb-2">
        ⚡ Инвентарь PowerBank'ов
      </h2>

      {message && <div className="text-center text-emerald-400 font-medium">{message}</div>}

      {powerbanks.map((pb) => (
        <div
          key={pb.id}
          className="bg-zinc-900 rounded-xl p-4 flex items-center justify-between shadow-md border border-zinc-700"
        >
          <div>
            <p className="text-lg font-semibold text-white capitalize">
              {pb.powerbank_type} PowerBank
            </p>
            <p className="text-sm text-gray-400">
              Получен: {new Date(pb.claimed_at).toLocaleDateString()} • EP: {pb.ep_amount}
            </p>
            {pb.used && pb.used_at && (
              <p className="text-xs text-yellow-400 mt-1">
                ✅ Использован: {new Date(pb.used_at).toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={() => handleUse(pb.id)}
            disabled={pb.used || ep >= 1000 || usingId === pb.id}
            className={`px-4 py-2 rounded-lg text-white font-bold transition-all ${
              pb.used
                ? "bg-gray-500 cursor-not-allowed"
                : ep >= 1000
                ? "bg-yellow-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {pb.used
              ? "Использован"
              : usingId === pb.id
              ? "⚡ Применение..."
              : "Использовать"}
          </button>
        </div>
      ))}
    </div>
  );
};
