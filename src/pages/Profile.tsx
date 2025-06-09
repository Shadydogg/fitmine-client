import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { useSession } from "../context/SessionContext";
import BottomTab from "../components/BottomTab";
import ConnectGoogleFit from "../components/ConnectGoogleFit";
import { usePowerbankStats } from "../hooks/usePowerbankStats";
import { PowerBankInventory } from "../components/PowerBankInventory";
import EPBatterySVG from "../components/EPBatterySVG";
import { useUserEP } from "../hooks/useUserEP";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { accessToken, isAuthenticated, sessionLoaded, user } = useSession();
  const { usedCount, lastUsedAt, usedToday, loading: powerbankLoading } = usePowerbankStats();
  const { ep, goal, loading: epLoading } = useUserEP();

  if (powerbankLoading || epLoading || !sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-center">
        {t("profile.loading", "Загрузка профиля...")}
      </div>
    );
  }

  if (!user || !isAuthenticated || !accessToken) {
    toast.error("❌ Ошибка авторизации профиля");
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-center">
        {t("profile.notFound", "Профиль не найден")}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 pb-24 bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* 🔙 Назад */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 text-sm text-gray-400 hover:text-white"
      >
        ← {t("profile.back", "Назад")}
      </button>

      {/* 🦩 Заголовок */}
      <h1 className="text-3xl font-extrabold mt-20 mb-6 tracking-wide drop-shadow text-center">
        {t("profile.title", "Профиль")} • FitMine
      </h1>

      {/* 🧊 Карточка */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"
      >
        <img
          src={user.photo_url || "/default-avatar.png"}
          alt="avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md border border-white/20"
        />
        <h2 className="text-xl font-semibold text-white">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-sm text-gray-400">@{user.username}</p>

        {user.is_premium && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 text-xs bg-purple-600/80 text-white rounded-full shadow shadow-purple-500/50">
            💫 {t("profile.premium", "Премиум-пользователь")}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div>🆔 ID: {user.telegram_id}</div>
          <div>🌐 Язык: {user.language_code}</div>
          <div>💬 ЛС: {user.allows_write_to_pm ? "✅ Да" : "❌ Нет"}</div>
        </div>

        {/* ⚡ PowerBank статистика */}
        {typeof usedCount === "number" && (
          <div className="mt-4 text-sm text-emerald-300">
            ⚡ Использовано PowerBank: {usedCount}
            <br />
            {usedToday
              ? "Сегодня уже использован"
              : `Последнее использование: ${
                  lastUsedAt ? new Date(lastUsedAt).toLocaleString() : "—"
                }`}
          </div>
        )}
      </motion.div>

      {/* 🔋 EP Battery без текста цели */}
      <div className="mt-6 max-w-md w-full px-4">
        <EPBatterySVG ep={ep} goal={goal} />
      </div>

      {/* ⚡ Инвентарь PowerBank */}
      <AnimatePresence>
        <motion.div
          className="w-full mt-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <PowerBankInventory />
        </motion.div>
      </AnimatePresence>

      {/* ⚙️ Google Fit статус */}
      <div className="mt-6 max-w-sm w-full text-center">
        {user.google_connected ? (
          <div className="text-sm text-green-400 mb-2">
            ✅ Google Fit подключён
          </div>
        ) : (
          <>
            <div className="text-sm text-yellow-300 mb-2">
              🔓 Google Fit не подключён
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <ConnectGoogleFit />
              </div>
            </div>
          </>
        )}
      </div>

      <BottomTab current="profile" />
    </div>
  );
}
