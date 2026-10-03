You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
animated-grid.tsx
"use client";

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
}

/**
 * AnimatedGrid — a layered, CSS-only animated grid backdrop.
 *
 * Depth comes from two grids (a fine base + a 4× major grid whose lines pick up
 * the accent) plus a slow, drifting radial accent glow. Everything is drawn with
 * gradients and two `background-position` / `transform` keyframes — no canvas,
 * no WebGL, no JS animation loop, so it costs nothing on the main thread. The
 * layer fills its positioned parent and is `aria-hidden` (decorative). A scoped
 * `@media (prefers-reduced-motion: reduce)` rule stops all motion. Density,
 * opacity, scale, and accent are configurable. Clean-room original.
 */
export function AnimatedGrid({
  size = 36,
  color = "var(--color-border,#e5e7eb)",
  accent = "var(--color-accent,#22c55e)",
  opacity = 0.7,
  fade = true,
  className,
  style,
  ...props
}: AnimatedGridProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-grid-${uid}`;
  const major = size * 4;

  const css = `
.${cls}::before,
.${cls}::after { content: ""; position: absolute; inset: -${major}px; }
.${cls}::before {
  background-image:
    linear-gradient(to right, ${color} 1px, transparent 1px),
    linear-gradient(to bottom, ${color} 1px, transparent 1px);
  background-size: ${size}px ${size}px;
  opacity: ${opacity * 0.6};
  animation: ${cls}-drift 26s linear infinite;
  will-change: background-position;
}
.${cls}::after {
  background-image:
    linear-gradient(to right, color-mix(in oklab, ${accent} 55%, ${color}) 1.2px, transparent 1.2px),
    linear-gradient(to bottom, color-mix(in oklab, ${accent} 55%, ${color}) 1.2px, transparent 1.2px);
  background-size: ${major}px ${major}px;
  opacity: ${opacity * 0.5};
  animation: ${cls}-drift 26s linear infinite;
  will-change: background-position;
}
.${cls} > .${cls}-glow {
  position: absolute; inset: 0;
  background: radial-gradient(45% 45% at 50% 42%, color-mix(in oklab, ${accent} 26%, transparent), transparent 70%);
  animation: ${cls}-pulse 9s ease-in-out infinite;
  will-change: transform, opacity;
}
@keyframes ${cls}-drift {
  from { background-position: 0 0, 0 0; }
  to   { background-position: ${major}px ${major}px, ${major}px ${major}px; }
}
@keyframes ${cls}-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.12); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .${cls}::before, .${cls}::after, .${cls} > .${cls}-glow { animation: none; }
}
/* Forced-colors (Windows High Contrast) drops gradients/masks/box-shadows, which
   would erase the whole component. Swap in a static, legible system-color grid on
   a narrowly-scoped forced-color-adjust:none layer so structure stays visible and
   foreground text stays readable. No motion here — works with reduced motion too. */
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
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        cls,
        className,
      )}
      style={{
        ...(fade
          ? {
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 38%, transparent 80%)",
              maskImage:
                "radial-gradient(ellipse at center, #000 38%, transparent 80%)",
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

export default AnimatedGrid;


demo.tsx
import { AnimatedGrid } from "@/components/ui/animated-grid";

export default function AnimatedGridDemo() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <AnimatedGrid/>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Build faster.
        </h1>
        <p className="max-w-md text-muted-foreground">
          A CSS-only animated grid backdrop for heroes and section backgrounds.
        </p>
      </div>
    </div>
  );
}
```

Extend existing Tailwind 4 index.css with this code (or if project uses Tailwind 3, extend tailwind.config.js or globals.css):
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --color-border: #dcfce7;
  --color-accent: #16a34a;
}

.dark {
  --color-border: #14532d;
  --color-accent: #4ade80;
}
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them