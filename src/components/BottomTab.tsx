// v1.0.0 — Компонент навигации как на скрине
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Activity, User, ShoppingCart, Sword } from "lucide-react";

const tabs = [
  { icon: <Home size={20} />, label: "Главная", path: "/dashboard" },
  { icon: <Activity size={20} />, label: "XP", path: "/xp" },
  { icon: <Sword size={20} />, label: "PvP", path: "/pvp" },
  { icon: <ShoppingCart size={20} />, label: "Магазин", path: "/shop" },
  { icon: <User size={20} />, label: "Профиль", path: "/profile" },
];

export default function BottomTab() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm border-t border-white/10 flex justify-around items-center h-16 shadow-inner">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center text-xs transition-all ${
            location.pathname === tab.path
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
