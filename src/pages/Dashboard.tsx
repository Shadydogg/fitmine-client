import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import useSyncActivity from "../hooks/useSyncActivity";
import DashboardSummary from "../components/DashboardSummary";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import { useSession } from "../context/SessionContext";
import ConnectGoogleFit from "../components/ConnectGoogleFit";

import Ring from "../components/Ring";
import { useUserEP } from "../hooks/useUserEP";
import { useDailyReward } from "../hooks/useDailyReward"; // ✅
import RewardModal from "../components/RewardModal"; // ✅

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
    error: rewardError,
  } = useDailyReward(); // ✅

  if (!sessionLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 text-center">
        {t("dashboard.loading", "Загрузка активности...")}
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-center">
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
        alert("📊 Активность синхронизирована!");

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
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      {/* 👤 Профиль */}
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

      <motion.h1
        className="text-3xl font-extrabold mt-20 mb-4 text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("dashboard.title", "Твоя активность сегодня")}
      </motion.h1>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
        }}
        className="z-10"
      >
        {/* 🔘 EP кольцо */}
        {epLoading ? (
          <div className="flex justify-center items-center mt-6 text-gray-500 animate-pulse">
            {t("dashboard.loading", "Загрузка EP...")}
          </div>
        ) : (
          <motion.div
            className="flex justify-center items-center mt-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Ring ep={ep} dailyGoal={1000} />
          </motion.div>
        )}

        {/* 📊 Сводка активности */}
        {activity.loading ? (
          <div className="text-gray-500 mt-6 animate-pulse">
            {t("dashboard.loading", "Загрузка активности...")}
          </div>
        ) : (
          <>
            <DashboardSummary data={activity} />
            <motion.div
              className="mt-8 text-center text-sm text-amber-300 max-w-sm font-medium"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              🎁 {t("dashboard.motivation", "Открой все кольца и получи бонус!")}
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ⚙️ Google Fit */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="mt-8 text-center"
      >
        {user.google_connected ? (
          <button
            onClick={syncGoogleAndUpdate}
            className="mt-2 px-5 py-2 bg-lime-500 text-white font-medium rounded-full shadow hover:scale-105 transition-transform"
          >
            🔄 Синхронизировать Google Fit
          </button>
        ) : (
          <div className="mt-4 max-w-xs mx-auto">
            <div className="text-sm text-yellow-300 mb-2">
              🔓 Google Fit не подключён
            </div>
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
