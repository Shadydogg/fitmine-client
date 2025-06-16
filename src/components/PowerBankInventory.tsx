import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUserEP } from "../hooks/useUserEP";
import { usePowerBanks } from "../hooks/usePowerBanks";
import { useSession } from "../context/SessionContext";
import { PowerBank } from "../types/PowerBank";

export const PowerBankInventory: React.FC = () => {
  const [usingId, setUsingId] = useState<string | null>(null);

  const { accessToken } = useSession();
  const { ep, doubleGoal, refetch: refetchEP, loading: epLoading } = useUserEP();
  const {
    powerbanks,
    loading: loadingPB,
    refetch: refetchPowerbanks,
  } = usePowerBanks();

  const handleUse = async (id: string) => {
    if (ep >= 1000) {
      toast.info("⚡ Энергия уже полная. Использовать PowerBank нельзя.");
      return;
    }

    if (doubleGoal) {
      toast.warning("⚠️ PowerBank уже активен сегодня");
      return;
    }

    try {
      setUsingId(id);

      const res = await axios.post(
        "/api/powerbanks/use",
        { id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(res.data.message || "✅ PowerBank активирован");

      await Promise.all([refetchPowerbanks(), refetchEP()]);
    } catch (err: any) {
      const msg = err.response?.data?.error || "❌ Ошибка применения PowerBank";
      toast.error(msg);
    } finally {
      setUsingId(null);
    }
  };

  const isToday = (isoDate?: string | null) => {
    if (!isoDate) return false;
    const today = new Date().toISOString().slice(0, 10);
    return isoDate.slice(0, 10) === today;
  };

  if (loadingPB || epLoading) {
    return (
      <div className="text-white text-center py-4">
        🔄 Загрузка PowerBank...
      </div>
    );
  }

  if (!powerbanks.length) {
    return (
      <div className="text-white text-center py-4">
        😕 У вас нет PowerBank'ов.
      </div>
    );
  }

  const sortedPowerbanks = [...powerbanks].sort((a, b) => {
    const dateA = new Date(a.claimed_at || "").getTime();
    const dateB = new Date(b.claimed_at || "").getTime();
    return dateB - dateA;
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 space-y-4">
      <h2 className="text-xl font-bold text-center text-white mb-2">
        ⚡ Инвентарь PowerBank'ов
      </h2>

      {sortedPowerbanks.map((pb) => {
        const usedToday = pb.used && isToday(pb.used_at);
        const isDisabled =
          pb.used || usedToday || ep >= 1000 || doubleGoal || usingId === pb.id;

        return (
          <div
            key={pb.id}
            className={`rounded-xl p-4 flex items-center justify-between shadow-md border border-zinc-700 ${
              pb.used
                ? "bg-zinc-800"
                : "bg-zinc-900 hover:shadow-lg transition-shadow"
            }`}
          >
            <div>
              <p className="text-lg font-semibold text-white capitalize">
                {pb.powerbank_type} PowerBank
              </p>
              <p className="text-sm text-gray-400">
                Получен:{" "}
                {pb.claimed_at
                  ? new Date(pb.claimed_at).toLocaleDateString()
                  : "—"}{" "}
                • EP: {pb.ep_amount}
              </p>
              {pb.used && pb.used_at && (
                <p className="text-xs text-yellow-400 mt-1">
                  ✅ Использован: {new Date(pb.used_at).toLocaleString()}
                </p>
              )}
            </div>

            <button
              onClick={() => handleUse(pb.id)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg text-white font-bold transition-all ${
                pb.used || usedToday
                  ? "bg-gray-500 cursor-not-allowed"
                  : ep >= 1000
                  ? "bg-yellow-500 cursor-not-allowed"
                  : doubleGoal
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {pb.used
                ? "Использован"
                : doubleGoal
                ? "Активен другой"
                : usingId === pb.id
                ? "⚡ Применение..."
                : "Использовать"}
            </button>
          </div>
        );
      })}
    </div>
  );
};