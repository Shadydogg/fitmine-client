// Dashboard.tsx — v2.9.1 (оптимизация, финальная сборка с EPBatteryLottie)
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import useSyncActivity from "../hooks/useSyncActivity";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import DashboardSummary from "../components/DashboardSummary";
import ConnectGoogleFit from "../components/ConnectGoogleFit";
import RewardModal from "../components/RewardModal";

import { useSession } from "../context/SessionContext";
import { useUserEP } from "../hooks/useUserEP";
import { useDailyReward } from "../hooks/useDailyReward";

import EPBatteryLottie from "../components/EPBatteryLottie";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, sessionLoaded, accessToken, setTokens } = useSession();
  const activity = useSyncActivity();
  const { ep, loading: epLoading } = useUserEP();
  const {
    reward,
    showModal,
    setShowModal,
    alreadyClaimed,
    loading: rewardLoading,
  } = useDailyReward();

  if (!sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        {t("dashboard.loading", "Загрузка активности...")}
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {t("dashboard.error", "Авторизация не удалась")}
      </div>
    );
  }

  const syncGoogleAndUpdate = async () => {
    try {
      const res = await fetch("https://api.fitmine.vip/api/sync/google", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json();
      if (data.ok) {
        const profileRes = await fetch("https://api.fitmine.vip/api/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const profileData = await profileRes.json();
        if (profileData.ok) {
          localStorage.setItem("user", JSON.stringify(profileData.user));
          setTokens(
            accessToken,
            localStorage.getItem("refresh_token") || "",
            profileData.user
          );
        }

        activity.refetch();
      } else {
        alert(`❌ Ошибка: ${data.error}`);
      }
    } catch {
      alert("❌ Ошибка соединения");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-zinc-900 to-black text-white overflow-x-hidden pb-24">
      <AnimatedBackground />

      {/* 👤 Аватар */}
      <button
        onClick={() => navigate("/profile")}
        className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform z-20"
      >
        <img
          src={user?.photo_url || "/default-avatar.png"}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </button>

      {/* 🎯 XP */}
      <motion.button
        onClick={() => navigate("/xp")}
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm bg-fit-gradient shadow-glow hover:scale-105 transition-glow z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        🎯 XP и Уровень
      </motion.button>

      {/* 🏷️ Заголовок */}
      <motion.h1
        className="text-3xl font-extrabold mt-20 mb-4 text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("dashboard.title", "Твоя активность сегодня")}
      </motion.h1>

      {/* 🔋 EPBattery */}
      {epLoading ? (
        <div className="text-gray-500 mt-6 animate-pulse">
          {t("dashboard.loading", "Загрузка EP...")}
        </div>
      ) : (
        <motion.div
          className="w-full px-4 max-w-md mt-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EPBatteryLottie ep={ep} dailyGoal={1000} />
          <div className="mt-2 text-center text-sm font-medium">
            {ep >= 1000
              ? "🎉 Цель достигнута! Забери награду"
              : `🧠 Осталось ${1000 - ep} EP до награды`}
          </div>
        </motion.div>
      )}

      {/* 📊 Метрики */}
      {!activity.loading && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <DashboardSummary data={activity} />
        </motion.div>
      )}

      {/* 🟩 Google Fit */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        className="mt-6"
      >
        {user.google_connected ? (
          <button
            onClick={syncGoogleAndUpdate}
            className="px-6 py-2 bg-lime-500 text-white font-medium rounded-full shadow hover:scale-105 transition-transform"
          >
            🔄 Синхронизировать Google Fit
          </button>
        ) : (
          <div className="mt-4 text-yellow-300">
            🔓 Google Fit не подключён
            <ConnectGoogleFit />
          </div>
        )}
      </motion.div>

      {/* 🎁 Reward Modal */}
      {showModal && reward && (
        <RewardModal rewardId={reward} onClose={() => setShowModal(false)} />
      )}

      <BottomTab current="dashboard" />
    </div>
  );
}
