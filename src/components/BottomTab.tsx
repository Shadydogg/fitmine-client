import { useNavigate } from "react-router-dom";
import { Home, Activity, User, ShoppingCart, Sword } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  current: string;
}

export default function BottomTab({ current }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tabs = [
    { icon: <Home size={20} />, label: t("tab.home"), path: "/dashboard", key: "dashboard" },
    { icon: <Activity size={20} />, label: t("tab.xp"), path: "/xp", key: "xp" },
    { icon: <Sword size={20} />, label: t("tab.pvp"), path: "/pvp", key: "pvp" },
    { icon: <ShoppingCart size={20} />, label: t("tab.shop"), path: "/shop", key: "shop" },
    { icon: <User size={20} />, label: t("tab.profile"), path: "/profile", key: "profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm border-t border-white/10 flex justify-around items-center h-16 shadow-inner">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center text-xs transition-all ${
            current === tab.key
              ? "text-yellow-300 scale-110"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
