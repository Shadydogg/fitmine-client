import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import useSyncActivity from "../hooks/useSyncActivity";
import DashboardSummary from "../components/DashboardSummary";
import AnimatedBackground from "../components/AnimatedBackground";
import BottomTab from "../components/BottomTab";
import { useSession } from "../context/SessionContext";
import ConnectGoogleFit from "../components/ConnectGoogleFit";

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, sessionLoaded, accessToken, setTokens } = useSession();
  const activity = useSyncActivity();

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
        alert(t("dashboard.syncSuccess"));
      } else {
        console.warn("Sync error:", data);
      }
    } catch (err) {
      console.error("Google Fit sync failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <AnimatedBackground />

      <main className="relative z-10 px-4">
        <DashboardSummary data={activity} />

        <div className="mt-6 flex justify-center">
          <ConnectGoogleFit />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={syncGoogleAndUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {t("dashboard.syncButton", "🔄 Обновить активность")}
          </button>
        </div>
      </main>

      <BottomTab current="dashboard" />
    </div>
  );
}
