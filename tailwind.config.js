const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        fit: {
          primary: '#00FFC6',
          secondary: '#FF3CAC',
          energy: '#FCEE09',
          fire: '#FF5F6D',
          cool: '#00DBDE',
          ringBg: '#222222',
          dark: '#0D0D0D',
          card: '#1F1F1F',
        },
      },
      boxShadow: {
        neon: '0 0 12px #00FFC6',
        glow: '0 0 24px #FF3CAC',
        fire: '0 0 14px #FF5F6D',
        energy: '0 0 16px #FCEE09',
        '3d-light': '0 0 40px rgba(0,255,198,0.3)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, #00FFC6, #0D0D0D)',
        'fit-gradient': 'linear-gradient(135deg, #00DBDE 0%, #FC00FF 100%)',
        'token-glow': 'linear-gradient(90deg, #FCEE09 0%, #FF3CAC 100%)',
        'nft-glow': 'radial-gradient(circle at center, rgba(0,255,198,0.2), transparent)',
      },
      transitionProperty: {
        glow: 'box-shadow, transform, opacity',
        model: 'transform, scale, rotate',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
      },
      keyframes: {
        xpPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
        },
        nftReveal: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        ringWave: {
          '0%': { r: '45' },
          '100%': { r: '60' },
        },
        rotate3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        xpPulse: 'xpPulse 1.5s ease-in-out infinite',
        nftReveal: 'nftReveal 0.5s ease-out forwards',
        ringWave: 'ringWave 1s ease-out',
        spin3d: 'rotate3d 10s linear infinite',
      },
      width: {
        ring: '6.5rem',
        'ring-sm': '5.5rem',
        'ring-lg': '8rem',
        model: '16rem',
      },
      height: {
        ring: '6.5rem',
        'ring-sm': '5.5rem',
        'ring-lg': '8rem',
        model: '16rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
  ],
};
