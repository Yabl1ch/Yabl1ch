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
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
