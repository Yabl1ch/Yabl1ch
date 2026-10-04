import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = React.useState(0);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    // Smooth progress simulation over 1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 400);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, 950);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07130e] text-[#f0fdf4] overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            aria-hidden="true"
            className="absolute h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none"
          />

          {/* Animated Apple & Leaf Artwork */}
          <div className="relative flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 210 210"
              className="h-36 w-36 sm:h-44 sm:w-44 overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Neon Emerald Gradient */}
                <linearGradient id="appleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <linearGradient id="appleFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0.25)" />
                  <stop offset="100%" stopColor="rgba(5, 150, 105, 0.05)" />
                </linearGradient>

                <linearGradient id="leafGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. Apple Stem (Черенок яблони) */}
              <motion.path
                d="M 105 52 C 106 34, 118 22, 130 16"
                stroke="#86efac"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeInOut" }}
                filter="url(#glowFilter)"
              />

              {/* 2. Apple Leaf (Изящный лист яблони с анимацией разворачивания) */}
              <motion.g
                initial={{ scale: 0, rotate: -25, opacity: 0, originX: "115px", originY: "30px" }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  delay: 0.45,
                }}
              >
                {/* Leaf Body */}
                <motion.path
                  d="M 115 32 C 138 20, 160 30, 164 48 C 146 56, 124 48, 115 32 Z"
                  fill="url(#leafGlow)"
                  stroke="#4ade80"
                  strokeWidth="2"
                  filter="url(#glowFilter)"
                />
                {/* Leaf Vein */}
                <motion.path
                  d="M 115 32 C 132 38, 148 42, 164 48"
                  stroke="#064e3b"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* 3. Apple Silhouette Fill */}
              <motion.path
                d="M 100 52 C 92 42, 74 44, 58 58 C 38 74, 34 104, 38 132 C 45 166, 68 192, 90 192 C 96 192, 100 188, 105 188 C 110 188, 114 192, 120 192 C 142 192, 165 166, 172 132 C 176 104, 172 74, 152 58 C 136 44, 118 42, 110 52 C 106 57, 104 57, 100 52 Z"
                fill="url(#appleFill)"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              />

              {/* 4. Apple Outline (Neon Line Draw) */}
              <motion.path
                d="M 100 52 C 92 42, 74 44, 58 58 C 38 74, 34 104, 38 132 C 45 166, 68 192, 90 192 C 96 192, 100 188, 105 188 C 110 188, 114 192, 120 192 C 142 192, 165 166, 172 132 C 176 104, 172 74, 152 58 C 136 44, 118 42, 110 52 C 106 57, 104 57, 100 52 Z"
                stroke="url(#appleGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                filter="url(#glowFilter)"
              />
            </svg>

            {/* Glowing Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 flex flex-col items-center gap-3 text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white uppercase font-mono">
                Yabl1ch
              </h1>

              {/* Minimalist Progress Bar */}
              <div className="w-36 sm:w-44 h-1 rounded-full bg-emerald-950/80 border border-emerald-900/60 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 rounded-full shadow-[0_0_10px_#4ade80]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/80">
                <span>Загрузка</span>
                <span className="w-8 text-left">{progress}%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
