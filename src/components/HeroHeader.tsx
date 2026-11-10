import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

function HeroHeaderComponent() {
  const letters = ["Y", "a", "b", "l", "1", "c", "h"];
  const shouldReduceMotion = useReducedMotion();

  // 3D Tilt state for Avatar
  const cardRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const cardRectRef = React.useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width || 1,
        height: rect.height || 1,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!cardRectRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      cardRectRef.current = { left: rect.left, top: rect.top, width: rect.width || 1, height: rect.height || 1 };
    }
    const rect = cardRectRef.current;
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    cardRectRef.current = null;
    x.set(0);
    y.set(0);
  };

  React.useEffect(() => {
    if (shouldReduceMotion) {
      x.set(0);
      y.set(0);
    }
  }, [shouldReduceMotion, x, y]);

  return (
    <header className="relative flex flex-col items-center justify-center pt-8 sm:pt-12 pb-3 sm:pb-6 px-4 text-center">
      {/* 3D Tilt Avatar with Rotating Emerald Glow */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          ref={cardRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
          className="relative mb-4 sm:mb-6 cursor-pointer select-none group touch-manipulation"
        >
          {/* Rotating gradient background glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-2.5 rounded-full opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100 animate-ring-spin bg-gradient-to-tr from-emerald-600 via-green-400 to-emerald-900"
          />

          {/* Secondary pulsing halo with glow animation */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md transition-opacity duration-500 group-hover:opacity-80"
          />

          {/* 3D Card Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full p-1 bg-gradient-to-b from-emerald-400/80 via-emerald-600/40 to-emerald-950/90 shadow-[0_0_30px_rgba(34,197,94,0.35)]"
          >
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-emerald-400/60 bg-[#07130e]">
              <img
                src="./avatar.avif"
                alt="Yabl1ch Avatar"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="eager"
                fetchPriority="high"
                width={128}
                height={128}
                decoding="async"
              />
              {/* Glass specular highlight overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Status Indicator Dot */}
            <div
              className="status-breathe absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#07130e] bg-emerald-500 flex items-center justify-center"
              title="Online"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Interactive Per-Letter Name: "Yabl1ch" */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
        {letters.map((char, index) => (
          <motion.span
            key={index}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.08 + index * 0.045,
              duration: shouldReduceMotion ? 0 : 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative inline-block py-2 -my-2 group/char cursor-pointer select-none"
          >
            <span className="inline-block text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white transition-[transform,color,filter] duration-200 ease-out will-change-[transform,color,filter] group-hover/char:-translate-y-2 group-hover/char:scale-110 group-hover/char:text-emerald-400 group-hover/char:drop-shadow-[0_0_16px_rgba(74,222,128,0.85)]">
              {char}
            </span>
          </motion.span>
        ))}
      </div>
    </header>
  );
}

export const HeroHeader = React.memo(HeroHeaderComponent);
export default HeroHeader;
