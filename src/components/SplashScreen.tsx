import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playIntroChime } from "@/lib/sound";

interface SplashScreenProps {
  onStartReveal?: () => void;
  onComplete: () => void;
}

/**
 * Fast 0.7-second intro screen:
 * - 0.0s - 0.5s: Background grid squares gradually manifest from the center, subtly glowing with emerald light.
 * - 0.5s: Celestial sound chime plays, triggering text & content reveal.
 * - 0.5s - 0.7s: Smooth cross-fade into live site content and persistent background grid.
 */
export function SplashScreen({ onStartReveal, onComplete }: SplashScreenProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    let hasTriggeredReveal = false;
    let hasCompleted = false;

    const cellSize = 42; // Exactly matches AnimatedGrid size in App.tsx

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      if (startTime === null) {
        startTime = now;
      }

      const elapsed = now - startTime;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Phase 1 (0ms - 500ms): Manifesting grid squares
      const progress = Math.min(1, elapsed / 500);

      // Trigger pleasant chime and content reveal at 500ms (0.5s)
      if (elapsed >= 500 && !hasTriggeredReveal) {
        hasTriggeredReveal = true;
        playIntroChime();
        if (onStartReveal) {
          onStartReveal();
        }
      }

      // Complete intro lifecycle at 700ms (0.7s)
      if (elapsed >= 700 && !hasCompleted) {
        hasCompleted = true;
        setIsDone(true);
        onComplete();
        return;
      }

      // Cross-fade opacity between 500ms and 700ms (0.2s transition)
      let overlayAlpha = 1;
      if (elapsed > 500) {
        overlayAlpha = Math.max(0, 1 - (elapsed - 500) / 200);
      }

      ctx.clearRect(0, 0, width, height);

      // Deep emerald backdrop fill matching #07130e
      ctx.globalAlpha = overlayAlpha;
      ctx.fillStyle = "#07130e";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.38; // Originates around hero avatar
      const maxDist = Math.hypot(
        Math.max(centerX, width - centerX),
        Math.max(centerY, height - centerY)
      );

      // Radial ambient lighting aura expanding outward
      const ambientGlowRadius = Math.max(width, height) * 0.45 * progress;
      if (ambientGlowRadius > 0) {
        const radialGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          ambientGlowRadius
        );
        radialGrad.addColorStop(0, "rgba(34, 197, 94, 0.22)");
        radialGrad.addColorStop(0.5, "rgba(20, 83, 45, 0.12)");
        radialGrad.addColorStop(1, "transparent");
        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Grid line wireframe
      const lineAlpha = Math.min(0.65, progress * 0.85);
      ctx.strokeStyle = `rgba(20, 83, 45, ${lineAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;

      for (let c = 0; c <= cols; c++) {
        const x = c * cellSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * cellSize;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Glowing squares revealing in a wave outward from center
      const wave = progress * 1.35; // Front covers screen within ~420ms

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const cellX = c * cellSize;
          const cellY = r * cellSize;
          const dist = Math.hypot(
            cellX + cellSize / 2 - centerX,
            cellY + cellSize / 2 - centerY
          );
          const normDist = dist / maxDist;

          if (wave >= normDist) {
            const cellAge = Math.min(1, (wave - normDist) / 0.3);

            // Deterministic distribution for glowing accent squares
            const hash = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
            const rand = hash - Math.floor(hash);
            const isAccent = rand > 0.68;
            const isBright = rand > 0.91;

            if (isAccent) {
              const fillAlpha = (isBright ? 0.24 : 0.12) * cellAge;
              const borderAlpha = (isBright ? 0.85 : 0.5) * cellAge;

              ctx.fillStyle = `rgba(34, 197, 94, ${fillAlpha})`;
              ctx.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);

              ctx.strokeStyle = isBright
                ? `rgba(74, 222, 128, ${borderAlpha})`
                : `rgba(34, 197, 94, ${borderAlpha})`;
              ctx.lineWidth = isBright ? 1.5 : 1;

              if (isBright) {
                ctx.save();
                ctx.shadowColor = "#4ade80";
                ctx.shadowBlur = 10 * cellAge;
                ctx.strokeRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
                ctx.restore();
              } else {
                ctx.strokeRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
              }
            } else {
              // Subtle square fill for non-accent cells
              const fillAlpha = 0.04 * cellAge;
              ctx.fillStyle = `rgba(20, 83, 45, ${fillAlpha})`;
              ctx.fillRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2);
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onStartReveal, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full block pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
