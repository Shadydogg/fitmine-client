// components/LanguageSwitcher.tsx — v1.0.0
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const flags = {
  en: "🇺🇸",
  ru: "🇷🇺",
  es: "🇪🇸",
  zh: "🇨🇳"
};

const languages = ["en", "ru", "es", "zh"];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const currentLang = i18n.language;

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl bg-white/10 hover:bg-white/20 backdrop-blur-lg p-2 rounded-full shadow-xl border border-white/20 transition"
        >
          {flags[currentLang as keyof typeof flags] || "🌐"}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, rotateX: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateX: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: 90, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute right-0 mt-2 bg-zinc-900 border border-white/20 rounded-xl shadow-xl backdrop-blur-md p-2 grid grid-cols-2 gap-2"
            >
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleChange(lang)}
                  className={`text-2xl hover:scale-125 transition transform ${
                    currentLang === lang ? "opacity-100" : "opacity-60"
                  }`}
                >
                  {flags[lang as keyof typeof flags]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
