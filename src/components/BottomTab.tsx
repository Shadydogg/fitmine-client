import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Flame, User, Trophy, Boxes } from 'lucide-react';

const tabs = [
  { label: 'Home', icon: <Home size={22} />, path: '/dashboard' },
  { label: 'Energy', icon: <Flame size={22} />, path: '/activity' },
  { label: 'NFT', icon: <Boxes size={22} />, path: '/nft' },
  { label: 'Profile', icon: <User size={22} />, path: '/profile' },
  { label: 'Rank', icon: <Trophy size={22} />, path: '/leaderboard' },
];

const BottomTab: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-800 to-zinc-900 backdrop-blur-md border-t border-zinc-700 flex justify-around items-center py-3 z-50 shadow-inner">
      {tabs.map(({ label, icon, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center transition-all ${
              active
                ? 'text-cyan-400 drop-shadow-md'
                : 'text-zinc-400 hover:text-cyan-300'
            }`}
          >
            <div
              className={`rounded-full p-2 ${
                active ? 'bg-zinc-800 ring-2 ring-cyan-500' : ''
              }`}
            >
              {icon}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomTab;
