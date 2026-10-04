import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

interface LeafConfig {
  id: number;
  // Starting position outside or near edge of screen
  startX: number;
  startY: number;
  // Waypoint during wind gust
  midX: number;
  midY: number;
  // Arrival destination (around center)
  endX: number;
  endY: number;
  // 3D rotation dynamics
  rotZStart: number;
  rotZMid: number;
  rotZEnd: number;
  rotX: number;
  rotY: number;
  // Size & timing
  scale: number;
  delay: number;
  duration: number;
  gradientType: 0 | 1 | 2; // Variations of apple leaf greens
  blur: number;
}

// 26 organically choreographed leaves fluttering from the apple grove
const LEAVES_DATA: LeafConfig[] = [
  // Fast foreground gust from top-left
  { id: 1, startX: -120, startY: -60, midX: 280, midY: 180, endX: -35, endY: -45, rotZStart: -60, rotZMid: 180, rotZEnd: 340, rotX: 45, rotY: 60, scale: 1.25, delay: 0.05, duration: 2.1, gradientType: 0, blur: 0 },
  { id: 2, startX: -180, startY: 120, midX: 200, midY: -90, endX: 42, endY: -30, rotZStart: 45, rotZMid: 220, rotZEnd: 410, rotX: 60, rotY: 30, scale: 0.95, delay: 0.12, duration: 2.2, gradientType: 1, blur: 0 },
  { id: 3, startX: -90, startY: -150, midX: 350, midY: 260, endX: -55, endY: 20, rotZStart: 120, rotZMid: 300, rotZEnd: 480, rotX: 30, rotY: 70, scale: 1.4, delay: 0.0, duration: 2.0, gradientType: 2, blur: 1 },
  // Gust sweeping from top-right
  { id: 4, startX: 180, startY: -140, midX: -220, midY: 140, endX: 28, endY: 48, rotZStart: -120, rotZMid: 60, rotZEnd: 240, rotX: 50, rotY: 45, scale: 1.1, delay: 0.18, duration: 2.15, gradientType: 0, blur: 0 },
  { id: 5, startX: 240, startY: -40, midX: -150, midY: -120, endX: -18, endY: -60, rotZStart: 30, rotZMid: 210, rotZEnd: 380, rotX: 70, rotY: 20, scale: 0.85, delay: 0.25, duration: 2.25, gradientType: 1, blur: 0 },
  // High-altitude swirling background leaves
  { id: 6, startX: -250, startY: 40, midX: 180, midY: 80, endX: 60, endY: 15, rotZStart: 80, rotZMid: 260, rotZEnd: 440, rotX: 40, rotY: 50, scale: 0.75, delay: 0.15, duration: 2.3, gradientType: 2, blur: 0 },
  { id: 7, startX: 160, startY: 160, midX: -180, midY: -60, endX: -45, endY: -20, rotZStart: -90, rotZMid: 90, rotZEnd: 270, rotX: 65, rotY: 35, scale: 0.8, delay: 0.3, duration: 2.2, gradientType: 0, blur: 0 },
  // Low swooping leaves from bottom-left
  { id: 8, startX: -140, startY: 220, midX: 240, midY: -160, endX: 15, endY: -55, rotZStart: 15, rotZMid: 195, rotZEnd: 375, rotX: 35, rotY: 60, scale: 1.15, delay: 0.22, duration: 2.1, gradientType: 1, blur: 0 },
  { id: 9, startX: -210, startY: -100, midX: 120, midY: 220, endX: -25, endY: 50, rotZStart: 140, rotZMid: 320, rotZEnd: 500, rotX: 55, rotY: 45, scale: 1.05, delay: 0.08, duration: 2.25, gradientType: 0, blur: 0 },
  // Center orbital leaves
  { id: 10, startX: 200, startY: 80, midX: -260, midY: 200, endX: 50, endY: -40, rotZStart: -45, rotZMid: 135, rotZEnd: 315, rotX: 45, rotY: 55, scale: 0.9, delay: 0.28, duration: 2.15, gradientType: 2, blur: 0 },
  { id: 11, startX: -160, startY: 280, midX: 90, midY: -140, endX: -60, endY: -10, rotZStart: 70, rotZMid: 250, rotZEnd: 430, rotX: 60, rotY: 30, scale: 1.2, delay: 0.1, duration: 2.3, gradientType: 0, blur: 0 },
  { id: 12, startX: 260, startY: -180, midX: -120, midY: 100, endX: 35, endY: 35, rotZStart: -150, rotZMid: 30, rotZEnd: 210, rotX: 30, rotY: 65, scale: 0.7, delay: 0.35, duration: 2.05, gradientType: 1, blur: 0 },
  // Large foreground cinematic sweepers
  { id: 13, startX: -320, startY: -120, midX: 220, midY: 180, endX: -10, endY: -70, rotZStart: 20, rotZMid: 200, rotZEnd: 380, rotX: 50, rotY: 50, scale: 1.5, delay: 0.04, duration: 2.0, gradientType: 0, blur: 1.5 },
  { id: 14, startX: 320, startY: 200, midX: -200, midY: -180, endX: 10, endY: 65, rotZStart: -110, rotZMid: 70, rotZEnd: 250, rotX: 40, rotY: 60, scale: 1.35, delay: 0.16, duration: 2.1, gradientType: 2, blur: 1 },
  // Delicate trailing leaves
  { id: 15, startX: -100, startY: -220, midX: 150, midY: 120, endX: -40, endY: 35, rotZStart: 95, rotZMid: 275, rotZEnd: 455, rotX: 70, rotY: 25, scale: 0.85, delay: 0.2, duration: 2.35, gradientType: 1, blur: 0 },
  { id: 16, startX: 120, startY: -250, midX: -90, midY: 160, endX: 22, endY: -65, rotZStart: -80, rotZMid: 100, rotZEnd: 280, rotX: 35, rotY: 55, scale: 0.9, delay: 0.32, duration: 2.2, gradientType: 0, blur: 0 },
  { id: 17, startX: -280, startY: 180, midX: 160, midY: -80, endX: -30, endY: -35, rotZStart: 40, rotZMid: 220, rotZEnd: 400, rotX: 55, rotY: 45, scale: 1.0, delay: 0.14, duration: 2.25, gradientType: 2, blur: 0 },
  { id: 18, startX: 220, startY: 260, midX: -140, midY: -100, endX: 45, endY: -15, rotZStart: -130, rotZMid: 50, rotZEnd: 230, rotX: 65, rotY: 35, scale: 0.95, delay: 0.24, duration: 2.15, gradientType: 1, blur: 0 },
  // Central ring accents
  { id: 19, startX: -150, startY: -80, midX: 110, midY: 90, endX: 5, endY: -48, rotZStart: 60, rotZMid: 240, rotZEnd: 420, rotX: 45, rotY: 45, scale: 1.1, delay: 0.18, duration: 2.2, gradientType: 0, blur: 0 },
  { id: 20, startX: 140, startY: -60, midX: -120, midY: 70, endX: -5, endY: 52, rotZStart: -70, rotZMid: 110, rotZEnd: 290, rotX: 50, rotY: 50, scale: 1.05, delay: 0.22, duration: 2.2, gradientType: 2, blur: 0 },
  { id: 21, startX: -80, startY: 160, midX: 130, midY: -110, endX: -50, endY: 2, rotZStart: 110, rotZMid: 290, rotZEnd: 470, rotX: 40, rotY: 60, scale: 0.8, delay: 0.26, duration: 2.3, gradientType: 1, blur: 0 },
  { id: 22, startX: 90, startY: 180, midX: -110, midY: -90, endX: 52, endY: 0, rotZStart: -100, rotZMid: 80, rotZEnd: 260, rotX: 60, rotY: 40, scale: 0.85, delay: 0.29, duration: 2.25, gradientType: 0, blur: 0 },
];

/** Stylized Apple Leaf SVG with realistic contours and delicate veins */
function AppleLeafShape({
  gradientId,
  className = "",
}: {
  gradientId: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={`overflow-visible drop-shadow-[0_2px_8px_rgba(34,197,94,0.35)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Delicate leaf stem */}
      <path
        d="M 6 22 C 2 25 -3 30 -6 35"
        stroke="#15803d"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Main leaf blade */}
      <path
        d="M 6 22 C 14 6 42 4 56 18 C 44 34 16 36 6 22 Z"
        fill={`url(#${gradientId})`}
        stroke="#4ade80"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Central main vein */}
      <path
        d="M 6 22 C 22 20 40 18 56 18"
        stroke="#064e3b"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Lateral branch veins */}
      <path
        d="M 18 21 C 23 15 28 13 32 12"
        stroke="#064e3b"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M 30 19 C 36 15 42 14 46 13"
        stroke="#064e3b"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M 22 21 C 26 27 31 29 36 29"
        stroke="#064e3b"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M 34 19 C 39 24 43 25 48 24"
        stroke="#064e3b"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const [leavesConverged, setLeavesConverged] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Smooth progress bar and staged transitions
  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const step = Math.floor(Math.random() * 7) + 5;
        return Math.min(prev + step, 100);
      });
    }, 65);

    // Stage 1: Leaves swirl in from apple grove and converge after ~1.7s
    const convergeTimer = setTimeout(() => {
      setLeavesConverged(true);
    }, 1700);

    // Stage 2: Smooth exit begins after leaves arrive and reveal emblem
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2550);

    // Stage 3: Complete splash and reveal main website
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(convergeTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(16px)",
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040f09] text-[#f0fdf4] overflow-hidden select-none"
        >
          {/* Shared SVG Gradients and Filters */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              {/* Vibrant Emerald Leaf Gradient */}
              <linearGradient id="leafGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="45%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              {/* Lime Spring Leaf Gradient */}
              <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>

              {/* Deep Jade Leaf Gradient */}
              <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>

              {/* Luminous Apple Glow */}
              <linearGradient id="appleGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <filter id="splashGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </svg>

          {/* Ambient Grove Lighting Atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-emerald-500/15 blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-32 h-[450px] w-[450px] rounded-full bg-emerald-700/10 blur-[120px]"
          />

          {/* Subtle Wind Stream Lines (Дуновение ветра из яблоневой рощи) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M -100 200 C 300 100, 700 450, 1200 250 C 1500 150, 1800 300, 2100 200"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
              strokeDasharray="8 14"
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={{ pathOffset: [0, 1], opacity: [0, 0.45, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M -100 450 C 400 300, 800 650, 1400 400 C 1700 300, 1900 420, 2200 380"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.2"
              strokeDasharray="6 12"
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={{ pathOffset: [0, 1], opacity: [0, 0.35, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay: 0.3 }}
            />
          </svg>

          {/* Center Stage: The Apple Grove Whirlwind & Arrival Point */}
          <div className="relative flex flex-col items-center justify-center">
            {/* The Swirling Leaves Canvas */}
            <div className="relative h-64 w-64 sm:h-80 sm:w-80 flex items-center justify-center perspective-[900px]">
              {LEAVES_DATA.map((leaf) => {
                const gradId = `leafGrad${leaf.gradientType}`;
                return (
                  <motion.div
                    key={leaf.id}
                    className="absolute pointer-events-none will-change-transform"
                    style={{
                      filter: leaf.blur ? `blur(${leaf.blur}px)` : undefined,
                    }}
                    initial={{
                      x: leaf.startX * 4,
                      y: leaf.startY * 3,
                      scale: leaf.scale * 0.4,
                      opacity: 0,
                      rotateZ: leaf.rotZStart,
                      rotateX: leaf.rotX,
                      rotateY: leaf.rotY,
                    }}
                    animate={{
                      // Flight trajectory: from far orchard -> sweeping curve -> converging in center
                      x: [leaf.startX * 4, leaf.midX, leaf.endX * 2.2],
                      y: [leaf.startY * 3, leaf.midY, leaf.endY * 2.2],
                      scale: [leaf.scale * 0.4, leaf.scale * 1.15, leaf.scale * 0.85],
                      opacity: [0, 0.95, 0.8],
                      rotateZ: [leaf.rotZStart, leaf.rotZMid, leaf.rotZEnd],
                      rotateX: [leaf.rotX, leaf.rotX * 2, 0],
                      rotateY: [leaf.rotY, leaf.rotY * 2, 0],
                    }}
                    transition={{
                      duration: leaf.duration,
                      delay: leaf.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <AppleLeafShape
                      gradientId={gradId}
                      className="w-10 sm:w-12 h-auto"
                    />
                  </motion.div>
                );
              })}

              {/* Radiant Convergence Pulse when leaves arrive */}
              <AnimatePresence>
                {leavesConverged && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.6, 2.2], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute rounded-full w-48 h-48 bg-radial from-emerald-400/40 via-emerald-500/10 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Central Glowing Apple Emblem (Manifested by the gathered leaves) */}
              <div className="relative z-10 flex items-center justify-center">
                <svg
                  viewBox="0 0 210 210"
                  className="h-36 w-36 sm:h-44 sm:w-44 overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Apple Stem */}
                  <motion.path
                    d="M 105 52 C 106 34, 118 22, 130 16"
                    stroke="#86efac"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.8, ease: "easeInOut" }}
                    filter="url(#splashGlow)"
                  />

                  {/* Master Apple Grove Leaf crowning the Apple */}
                  <motion.g
                    initial={{
                      scale: 0,
                      rotate: -35,
                      opacity: 0,
                      originX: "115px",
                      originY: "30px",
                    }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 18,
                      delay: 1.2,
                    }}
                  >
                    <motion.path
                      d="M 115 32 C 138 20, 160 30, 164 48 C 146 56, 124 48, 115 32 Z"
                      fill="url(#leafGrad0)"
                      stroke="#4ade80"
                      strokeWidth="2"
                      filter="url(#splashGlow)"
                    />
                    <motion.path
                      d="M 115 32 C 132 38, 148 42, 164 48"
                      stroke="#064e3b"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </motion.g>

                  {/* Apple Silhouette Fill */}
                  <motion.path
                    d="M 100 52 C 92 42, 74 44, 58 58 C 38 74, 34 104, 38 132 C 45 166, 68 192, 90 192 C 96 192, 100 188, 105 188 C 110 188, 114 192, 120 192 C 142 192, 165 166, 172 132 C 176 104, 172 74, 152 58 C 136 44, 118 42, 110 52 C 106 57, 104 57, 100 52 Z"
                    fill="rgba(34, 197, 94, 0.18)"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
                  />

                  {/* Apple Neon Outline drawn as leaves assemble */}
                  <motion.path
                    d="M 100 52 C 92 42, 74 44, 58 58 C 38 74, 34 104, 38 132 C 45 166, 68 192, 90 192 C 96 192, 100 188, 105 188 C 110 188, 114 192, 120 192 C 142 192, 165 166, 172 132 C 176 104, 172 74, 152 58 C 136 44, 118 42, 110 52 C 106 57, 104 57, 100 52 Z"
                    stroke="url(#appleGlowGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    filter="url(#splashGlow)"
                  />
                </svg>
              </div>
            </div>

            {/* Glowing Brand Title and Progress */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-4 flex flex-col items-center gap-3 text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-white uppercase font-mono drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]">
                Yabl1ch
              </h1>

              {/* Progress Indicator */}
              <div className="w-40 sm:w-48 h-1.5 rounded-full bg-emerald-950/90 border border-emerald-900/60 overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 rounded-full shadow-[0_0_12px_#4ade80]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/90">
                <span className="tracking-widest">ЗАГРУЗКА</span>
                <span className="w-9 text-left font-semibold">{progress}%</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Skip Button (Subtle pill in bottom corner) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="absolute bottom-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-xs font-mono text-emerald-300/80 hover:text-emerald-200 hover:border-emerald-500/60 transition-all cursor-pointer backdrop-blur-md"
          >
            <span>Пропустить</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
