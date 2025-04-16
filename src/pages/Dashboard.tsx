// Dashboard.tsx — v1.4.0 (SessionContext + UI polish + a11y)
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import useSyncActivity from "../hooks/useSyncActivity";
import DashboardSummary from "../components/DashboardSummary";
import AnimatedBackground from "../components/AnimatedBackground";
import { useSession } from "../context/SessionContext";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading } = useSyncActivity();
  const { user } = useSession();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white">

      <AnimatedBackground />

      {/* 👤 Аватар-переход в профиль */}
      <button
        onClick={() => navigate("/profile")}
        aria-label="Профиль"
        className="absolute top-4 right-4 w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform z-20"
      >
        <img
          src={user?.photo_url || "/default-avatar.png"}
          alt="Аватар пользователя"
          className="w-full h-full object-cover"
        />
      </button>

      {/* 🎯 Кнопка XP */}
      <motion.button
        onClick={() => navigate("/xp")}
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm bg-fit-gradient shadow-glow hover:scale-105 transition-glow z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        🎯 XP и Уровень
      </motion.button>

      {/* 🧩 Заголовок */}
      <motion.h1
        className="text-3xl font-extrabold mt-12 mb-4 text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("dashboard.title", "Твоя активность сегодня")}
      </motion.h1>

      {/* 🔁 Контент: кольца или загрузка */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.5,
            },
          },
        }}
        className="z-10"
      >
        {loading ? (
          <div className="text-gray-500 mt-6 animate-pulse">
            {t("dashboard.loading", "Загрузка активности...")}
          </div>
        ) : (
          <>
            <DashboardSummary />
            <motion.div
              className="mt-8 text-center text-sm text-gray-400 max-w-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              {t("dashboard.motivation", "Открой все кольца и получи бонус!")}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
