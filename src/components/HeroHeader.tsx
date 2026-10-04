import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BlurFade } from "@/components/ui/blur-fade";

export function HeroHeader() {
  const letters = ["Y", "a", "b", "l", "1", "c", "h"];

  // 3D Tilt state for Avatar
  const cardRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <header className="relative flex flex-col items-center justify-center pt-12 pb-6 px-4 text-center">
      {/* 3D Tilt Avatar with Rotating Emerald Glow */}
      <BlurFade delay={0.1} inView>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
          className="relative mb-6 cursor-pointer select-none group"
        >
          {/* Rotating gradient background glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-2.5 rounded-full opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100 animate-spin-slow bg-gradient-to-tr from-emerald-600 via-green-400 to-emerald-900"
          />

          {/* Secondary pulsing halo */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md animate-pulse-glow"
          />

          {/* 3D Card Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full p-1 bg-gradient-to-b from-emerald-400/80 via-emerald-600/40 to-emerald-950/90 shadow-[0_0_30px_rgba(34,197,94,0.35)]"
          >
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-emerald-400/60 bg-[#07130e]">
              <img
                src="./avatar.jpg"
                alt="Yabl1ch Avatar"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="eager"
              />
              {/* Glass specular highlight overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Status Indicator Dot */}
            <div
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#07130e] bg-emerald-500 shadow-[0_0_10px_#4ade80] flex items-center justify-center"
              title="Online"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </motion.div>
        </div>
      </BlurFade>

      {/* Interactive Per-Letter Name: "Yabl1ch" */}
      <BlurFade delay={0.2} inView>
        <div className="flex items-center justify-center gap-1 sm:gap-1.5">
          {letters.map((char, index) => (
            <motion.span
              key={index}
              whileHover={{
                y: -8,
                scale: 1.18,
                color: "#4ade80",
                textShadow: "0 0 20px rgba(74, 222, 128, 0.9)",
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 14,
              }}
              className="inline-block text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white cursor-pointer select-none transition-colors duration-200"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </BlurFade>
    </header>
  );
}

export default HeroHeader;
