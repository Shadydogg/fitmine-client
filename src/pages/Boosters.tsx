import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AnimatedBackground from "../components/AnimatedBackground";
import BoostersPanel from "../components/BoostersPanel";
import BottomTab from "../components/BottomTab";

export default function Boosters() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-zinc-900 to-black text-white pb-24">
      <AnimatedBackground />

      {/* Заголовок */}
      <motion.h1
        className="text-3xl font-extrabold mt-20 mb-6 text-center tracking-wide z-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("boosters.title", "Бустеры и Энергия")}
      </motion.h1>

      {/* Панель с бустерами */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md px-4"
      >
        <BoostersPanel />
      </motion.div>

      <BottomTab current="boosters" />
    </div>
  );
}
