// src/pages/Dashboard.tsx — v2.7.0
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import useSyncActivity from "../hooks/useSyncActivity";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import DashboardSummary from "../components/DashboardSummary";
import ConnectGoogleFit from "../components/ConnectGoogleFit";
import RewardModal from "../components/RewardModal";

import { useSession } from "../context/SessionContext";
import { useUserEP } from "../hooks/useUserEP";
import { useDailyReward } from "../hooks/useDailyReward";
import { usePowerBanks } from "../hooks/usePowerBanks";

import EPBatterySVG from "../components/EPBatterySVG";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, sessionLoaded, accessToken, setTokens } = useSession();

  const activity = useSyncActivity();
  const {
    ep,
    goal,
    doubleGoal,
    epClaimed,
    loading: epLoading,
    refetch: refetchEP,
  } = useUserEP();
  const {
    reward,
    showModal,
    setShowModal,
    loading: rewardLoading,
    claim,
  } = useDailyReward();
  const {
    count: powerbankCount,
    refetch: refetchPowerBanks,
  } = usePowerBanks();

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
        refetchEP();
        refetchPowerBanks();
      } else {
        toast.error(`❌ Ошибка: ${data.error}`);
      }
    } catch {
      toast.error("❌ Ошибка соединения");
    }
  };

  const epProgressText =
    ep >= goal
      ? doubleGoal
        ? "✅ Цель 2000 EP выполнена!"
        : "🎉 Цель достигнута! Забери PowerBank"
      : `🧠 Осталось ${goal - ep} EP до цели`;

  const nearComplete = ep >= goal * 0.9 && ep < goal;

  const handleClaim = async () => {
    const result = await claim();

    if (result.ok && result.rewardId) {
      toast.success("🎁 PowerBank получен!");
      await Promise.all([
        refetchEP(),
        refetchPowerBanks(),
        activity.refetch(),
      ]);
    } else if (result.error === "Reward already claimed") {
      toast.info("⚡ PowerBank уже получен сегодня");
    } else if (result.error === "EP goal not reached yet") {
      toast.warning("🧠 Сначала нужно достичь 1000 EP");
    } else {
      toast.error("❌ Не удалось забрать PowerBank");
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

      {/* 🔋 EP Battery */}
      {epLoading ? (
        <div className="text-gray-500 mt-4 animate-pulse">
          {t("dashboard.loading", "Загрузка EP...")}
        </div>
      ) : (
        <motion.div
          className="w-full px-4 max-w-md mt-2 overflow-hidden"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EPBatterySVG ep={ep} goal={goal} />

          <motion.div
            className={`mt-2 text-center text-sm font-medium ${
              nearComplete ? "text-lime-300" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {epProgressText}
          </motion.div>

          {ep >= goal && !epClaimed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col items-center mt-2"
            >
              <button
                onClick={handleClaim}
                disabled={rewardLoading}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow transition mb-2 disabled:opacity-50"
              >
                {rewardLoading ? "⏳ Забираем..." : "🎁 Забрать PowerBank"}
              </button>
              <div className="text-sm text-emerald-400 text-center">
                ⚡ PowerBank: {powerbankCount}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="text-sm text-emerald-400 text-center mt-2 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              ⚡ PowerBank: {powerbankCount}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 📊 Прогресс кольца */}
      {!activity.loading && (
        <motion.div
          className="mt-4"
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
          <motion.button
            onClick={syncGoogleAndUpdate}
            className="px-6 py-2 bg-lime-500 text-white font-medium rounded-full shadow hover:scale-105 active:scale-95 transition-transform"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.05 }}
          >
            🔄 Синхронизировать Google Fit
          </motion.button>
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
