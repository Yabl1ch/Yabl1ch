import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

interface LeafConfig {
  id: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  rotZStart: number;
  rotZMid: number;
  rotZEnd: number;
  rotX: number;
  rotY: number;
  scale: number;
  delay: number;
  duration: number;
  gradientType: 0 | 1 | 2;
  blur: number;
}

// 54 organically choreographed apple grove leaves (dense storm/flurry)
const LEAVES_DATA: LeafConfig[] = Array.from({ length: 54 }, (_, i) => {
  const angle = (i / 54) * Math.PI * 2;
  const radius = 300 + (i % 6) * 50;
  const side = i % 4;

  let startX = Math.cos(angle) * radius;
  let startY = Math.sin(angle) * radius;
  if (side === 0) {
    startX = -360 - (i % 5) * 40;
    startY = -180 + (i * 12);
  } else if (side === 1) {
    startX = 360 + (i % 5) * 40;
    startY = -150 + (i * 12);
  } else if (side === 2) {
    startX = -200 + (i * 10);
    startY = -360 - (i % 4) * 30;
  } else {
    startX = -150 + (i * 10);
    startY = 360 + (i % 4) * 30;
  }

  const midX = Math.cos(angle + 1.2) * (150 + (i % 5) * 28);
  const midY = Math.sin(angle + 1.2) * (120 + (i % 5) * 22);

  const endAngle = angle * 2 + i * 0.4;
  const endRadius = 36 + (i % 6) * 14;
  const endX = Math.cos(endAngle) * endRadius;
  const endY = Math.sin(endAngle) * endRadius;

  const rotZStart = (i * 47) % 360 - 180;
  const rotZMid = rotZStart + 180 + ((i % 3) * 60);
  const rotZEnd = rotZMid + 180;

  const scale = 0.55 + ((i % 7) * 0.12) + (i % 11 === 0 ? 0.35 : 0);
  const isForegroundFast = i % 8 === 0;

  return {
    id: i + 1,
    startX,
    startY,
    midX,
    midY,
    endX,
    endY,
    rotZStart,
    rotZMid,
    rotZEnd,
    rotX: 30 + ((i * 17) % 50),
    rotY: 25 + ((i * 23) % 55),
    scale: isForegroundFast ? 1.4 : scale,
    delay: (i % 8) * 0.032, // 0.0s to 0.22s organic start
    duration: 0.78 + (i % 6) * 0.045, // 0.78s to 1.0s flight and convergence
    gradientType: (i % 3) as 0 | 1 | 2,
    blur: isForegroundFast ? 1.2 : 0,
  };
});

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

  // Choreographed 1.6s total lifecycle
  React.useEffect(() => {
    // 0 to 100% in ~1000ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const step = Math.floor(Math.random() * 6) + 4;
        return Math.min(prev + step, 100);
      });
    }, 45);

    // Stage 1: Swirling leaves arrive & converge at center (~1000ms)
    const convergeTimer = setTimeout(() => {
      setLeavesConverged(true);
    }, 1000);

    // Stage 2: Smooth exit begins (~1220ms)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1220);

    // Stage 3: Exactly 1.6s (1600ms) complete lifecycle
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(convergeTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(14px)",
          }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040f09] text-[#f0fdf4] overflow-hidden select-none"
        >
          {/* Shared SVG Gradients and Filters */}
          <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
              <linearGradient id="leafGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="45%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>

              <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef264" />
                <stop offset="50%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>

              <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>

              <linearGradient id="appleGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <filter id="splashGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
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

          {/* Wind Stream Lines (Дуновение ветра из яблоневой рощи) */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M -100 200 C 300 100, 700 450, 1200 250 C 1500 150, 1800 300, 2100 200"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.8"
              strokeDasharray="10 18"
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={{ pathOffset: [0, 1], opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M -100 450 C 400 300, 800 650, 1400 400 C 1700 300, 1900 420, 2200 380"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeDasharray="8 14"
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={{ pathOffset: [0, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear", delay: 0.1 }}
            />
          </svg>

          {/* Center Stage: Apple Grove Whirlwind of 54 Leaves & Arrival Point */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Swirling Leaves Stage */}
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
                      x: leaf.startX * 3.5,
                      y: leaf.startY * 2.8,
                      scale: leaf.scale * 0.4,
                      opacity: 0,
                      rotateZ: leaf.rotZStart,
                      rotateX: leaf.rotX,
                      rotateY: leaf.rotY,
                    }}
                    animate={{
                      // Rapid wind gust -> center convergence in ~0.5s
                      x: [leaf.startX * 3.5, leaf.midX, leaf.endX * 2.2],
                      y: [leaf.startY * 2.8, leaf.midY, leaf.endY * 2.2],
                      scale: [leaf.scale * 0.4, leaf.scale * 1.2, leaf.scale * 0.85],
                      opacity: [0, 0.95, 0.85],
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
                      className="w-9 sm:w-11 h-auto"
                    />
                  </motion.div>
                );
              })}

              {/* Radiant Convergence Pulse when leaves arrive */}
              <AnimatePresence>
                {leavesConverged && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.8, 2.4], opacity: [0, 0.85, 0] }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute rounded-full w-48 h-48 bg-radial from-emerald-400/40 via-emerald-500/10 to-transparent pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Central Glowing Apple Emblem */}
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
                    transition={{ duration: 0.5, delay: 0.25, ease: "easeInOut" }}
                    filter="url(#splashGlow)"
                  />

                  {/* Master Apple Grove Leaf */}
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
                      stiffness: 260,
                      damping: 18,
                      delay: 0.4,
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
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  />

                  {/* Apple Neon Outline */}
                  <motion.path
                    d="M 100 52 C 92 42, 74 44, 58 58 C 38 74, 34 104, 38 132 C 45 166, 68 192, 90 192 C 96 192, 100 188, 105 188 C 110 188, 114 192, 120 192 C 142 192, 165 166, 172 132 C 176 104, 172 74, 152 58 C 136 44, 118 42, 110 52 C 106 57, 104 57, 100 52 Z"
                    stroke="url(#appleGlowGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    filter="url(#splashGlow)"
                  />
                </svg>
              </div>
            </div>

            {/* Glowing Brand Title and Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-4 flex flex-col items-center gap-2.5 text-center"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
