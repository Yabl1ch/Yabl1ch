/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          darkest: "#07130e",
          dark: "#0b1a14",
          surface: "#0e261d",
          border: "#14532d",
          muted: "#86efac",
          accent: "#22c55e",
          neon: "#4ade80",
          bright: "#86efac",
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'aurora-drift': {
          '0%, 100%': { transform: 'translate3d(-6%, -3%, 0) scale(1)' },
          '50%': { transform: 'translate3d(6%, 5%, 0) scale(1.12)' },
        },
        'aurora-drift-reverse': {
          '0%, 100%': { transform: 'translate3d(5%, 4%, 0) scale(1.08)' },
          '50%': { transform: 'translate3d(-7%, -5%, 0) scale(0.94)' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'ring-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fade-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'aurora-drift': 'aurora-drift 18s ease-in-out infinite',
        'aurora-drift-reverse': 'aurora-drift-reverse 23s ease-in-out infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease-in-out infinite',
        'ring-spin': 'ring-spin 9s linear infinite',
        'glow-pulse': 'glow-pulse 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
