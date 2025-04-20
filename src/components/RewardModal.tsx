import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Props {
  rewardId: string;
  onClose: () => void;
}

const rewardMap: Record<string, { title: string; icon: string; description: string }> = {
  xp_box_1: {
    title: "💠 XP Бонус!",
    icon: "/rewards/xp_box.png",
    description: "Ты получаешь опыт для прокачки!",
  },
  nft_basic_1: {
    title: "🎴 NFT Предмет!",
    icon: "/rewards/nft_card.png",
    description: "Новый NFT добавлен в твою коллекцию.",
  },
  fit_token_5: {
    title: "🪙 5 FIT токенов!",
    icon: "/rewards/fit_coin.png",
    description: "Баланс пополнен на 5 FIT.",
  },
  energy_boost: {
    title: "⚡ Бустер энергии!",
    icon: "/rewards/energy_boost.png",
    description: "Ускоряет майнинг и прогресс.",
  },
  loot_chest_1: {
    title: "🎁 Сундук удачи!",
    icon: "/rewards/chest_glow.png",
    description: "Содержит случайную награду.",
  },
};

export default function RewardModal({ rewardId, onClose }: Props) {
  const reward = rewardMap[rewardId] || rewardMap["loot_chest_1"];

  // Конфетти на открытие
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 } });
  }, 300);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 rounded-2xl shadow-2xl p-6 text-center max-w-xs border border-lime-500"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <img
            src={reward.icon}
            alt="reward"
            className="w-24 h-24 mx-auto mb-4 drop-shadow-xl animate-pulse"
          />
          <h2 className="text-xl font-bold text-lime-400 mb-2">{reward.title}</h2>
          <p className="text-sm text-gray-300 mb-4">{reward.description}</p>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 bg-lime-500 text-white font-semibold rounded-full shadow hover:scale-105 transition-transform"
          >
            🔓 Забрать награду
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
