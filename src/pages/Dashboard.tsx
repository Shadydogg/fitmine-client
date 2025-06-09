// src/pages/Dashboard.tsx — v2.8.0
...
const epProgressText =
  doubleGoal
    ? "⚡ PowerBank активен до конца дня"
    : ep >= goal
      ? "🎉 Цель достигнута! Забери PowerBank"
      : `🧠 Осталось ${goal - ep} EP до цели`;
...

{ep >= goal && !epClaimed && !doubleGoal ? (
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
...
