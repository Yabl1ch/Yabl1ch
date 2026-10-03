import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isPointer, setIsPointer] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for high-end fluid movement
  const springX = useSpring(mouseX, { damping: 28, stiffness: 350 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 350 });

  React.useEffect(() => {
    // Check if the current device is touch-first
    const hasTouch = window.matchMedia("(pointer: coarse)").matches;
    if (hasTouch) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.getAttribute("role") === "button" ||
          target.closest("button") !== null ||
          target.closest("a") !== null ||
          target.classList.contains("interactive-cursor") ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsPointer(isInteractive);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Outer soft glowing ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-emerald-400/50 bg-emerald-500/10 backdrop-blur-[1px]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: isPointer
            ? "0 0 25px rgba(74, 222, 128, 0.55), inset 0 0 10px rgba(74, 222, 128, 0.3)"
            : "0 0 15px rgba(34, 197, 94, 0.35)",
        }}
        animate={{
          width: isPointer ? 44 : 26,
          height: isPointer ? 44 : 26,
          opacity: 1,
          scale: isPointer ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      />

      {/* Tiny pinpoint center dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 h-1.5 w-1.5 rounded-full bg-emerald-400"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 8px #4ade80",
        }}
      />
    </>
  );
}

export default CustomCursor;
