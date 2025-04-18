import { useNavigate } from "react-router-dom";
import { Home, Activity, User, ShoppingCart, Sword, Boxes } from "lucide-react";

interface Props {
  current: string;
}

const tabs = [
  { icon: <Home size={20} />, label: "Главная", path: "/dashboard", key: "dashboard" },
  { icon: <Activity size={20} />, label: "XP", path: "/xp", key: "xp" },
  { icon: <Sword size={20} />, label: "PvP", path: "/pvp", key: "pvp" },
  { icon: <Boxes size={20} />, label: "NFT", path: "/nft", key: "nft" },
  { icon: <ShoppingCart size={20} />, label: "Магазин", path: "/shop", key: "shop" },
  { icon: <User size={20} />, label: "Профиль", path: "/profile", key: "profile" },
];

export default function BottomTab({ current }: Props) {
  const navigate = useNavigate();

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
