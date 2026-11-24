import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base grid cell size in pixels. */
  size?: number;
  /** Line color (any CSS color). */
  color?: string;
  /** Accent color for the ambient glow (any CSS color). */
  accent?: string;
  /** Overall opacity of the grid lines (0–1). */
  opacity?: number;
  /** Radial mask so the grid fades toward the edges. */
  fade?: boolean;
  /** Pause decorative background motion (e.g. when a modal covers the page). */
  paused?: boolean;
}

/**
 * AnimatedGrid — a layered, CSS-only animated grid backdrop.
 * Shifts grid layers using GPU-only `transform: translate3d(...)` so zero paint is triggered per frame.
 */
function AnimatedGridComponent({
  size = 40,
  color = "var(--color-border, #14532d)",
  accent = "var(--color-accent, #22c55e)",
  opacity = 0.55,
  fade = true,
  paused = false,
  className,
  style,
  ...props
}: AnimatedGridProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-grid-${uid}`;
  const major = size * 4;

  const css = `
.${cls}::before,
.${cls}::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: -${major}px;
  bottom: -${major}px;
  will-change: transform;
}
.${cls}::before {
  background-image:
    linear-gradient(to right, ${color} 1px, transparent 1px),
    linear-gradient(to bottom, ${color} 1px, transparent 1px);
  background-size: ${size}px ${size}px;
  opacity: ${opacity * 0.6};
  animation: ${cls}-drift 38s linear infinite;
}
.${cls}::after {
  background-image:
    linear-gradient(to right, color-mix(in oklab, ${accent} 50%, ${color}) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, color-mix(in oklab, ${accent} 50%, ${color}) 1.2px, transparent 1.2px);
  background-size: ${major}px ${major}px;
  opacity: ${opacity * 0.5};
  animation: ${cls}-drift 38s linear infinite;
}
.${cls} > .${cls}-glow {
  position: absolute; inset: 0;
  background: radial-gradient(50% 50% at 50% 35%, color-mix(in oklab, ${accent} 22%, transparent), transparent 75%);
  animation: ${cls}-pulse 10s ease-in-out infinite;
  will-change: transform, opacity;
}
.${cls}[data-paused="true"]::before,
.${cls}[data-paused="true"]::after,
.${cls}[data-paused="true"] > .${cls}-glow {
  animation-play-state: paused;
}
@keyframes ${cls}-drift {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-${major}px, -${major}px, 0); }
}
@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.15); opacity: 0.95; }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}::before, .${cls}::after, .${cls} > .${cls}-glow {
    animation: none;
    will-change: auto;
  }
}
@media (max-width: 640px) {
  .${cls}::before, .${cls}::after {
    animation: none;
    will-change: auto;
  }
}
.${cls} > .${cls}-fc { display: none; }
@media (forced-colors: active) {
  .${cls}::before, .${cls}::after, .${cls} > .${cls}-glow { display: none; }
  .${cls} > .${cls}-fc {
    display: block; position: absolute; inset: 0;
    forced-color-adjust: none;
    background-image:
      linear-gradient(to right, CanvasText 1px, transparent 1px),
      linear-gradient(to bottom, CanvasText 1px, transparent 1px);
    background-size: ${major}px ${major}px;
    opacity: 0.3;
  }
}`.trim();

  return (
    <div
      aria-hidden="true"
      data-paused={paused ? "true" : undefined}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        cls,
        className
      )}
      style={{
        ...(fade
          ? {
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 45%, transparent 85%)",
              maskImage:
                "radial-gradient(ellipse at center, #000 45%, transparent 85%)",
            }
          : null),
        ...style,
      }}
      {...props}
    >
      <span className={`${cls}-glow`} />
      <span className={`${cls}-fc`} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  );
}

export const AnimatedGrid = React.memo(AnimatedGridComponent);
export default AnimatedGrid;
