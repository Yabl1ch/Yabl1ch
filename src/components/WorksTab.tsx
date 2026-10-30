import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";

interface WorksTabProps {
  onSelectProject: (project: Project) => void;
}

export function WorksTab({ onSelectProject }: WorksTabProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
      {/* Tab Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Мои работы
          </h2>
        </div>
      </div>

      {/* Projects Grid: strictly in requested order 1..4 with instant rendering */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      >
        {projects.map((project) => (
          <motion.article
            variants={{
              hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.012 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectProject(project)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectProject(project);
              }
            }}
            onPointerMove={(event) => {
              if (shouldReduceMotion || event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
            }}
            className="group relative flex flex-col rounded-2xl border border-emerald-800/40 bg-[#091a13]/70 overflow-hidden backdrop-blur-xl shadow-lg transition-[transform,box-shadow,border-color,background-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-emerald-400/80 hover:bg-[#0b2118]/90 hover:shadow-[0_20px_45px_rgba(16,185,129,0.22),0_0_24px_rgba(52,211,153,0.18)] active:scale-[0.99] cursor-pointer touch-manipulation"
          >
            {/* Cursor-following spotlight adds local focus without changing layout. */}
            <div
              aria-hidden="true"
              className="spotlight-layer pointer-events-none absolute -inset-0.5 rounded-2xl bg-[radial-gradient(circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),rgba(74,222,128,0.2),transparent_42%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0"
            />

            {/* Specular glass reflection layer */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
            />

            {/* Cover Image Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#050f0b] z-10 image-sheen">
              <img
                src={project.coverImage}
                alt={project.title}
                width={960}
                height={540}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />

              {/* Subtle dark gradient overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091a13] via-transparent to-transparent opacity-80"
              />
            </div>

            {/* Minimal Card Footer: strictly Title + Action Button */}
            <div className="relative z-10 flex items-center justify-between p-5 bg-[#091a13]/90 border-t border-emerald-900/40">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                {project.title}
              </h3>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProject(project);
                }}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-800/60 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black transition-all shadow-sm"
                aria-label={`Открыть проект ${project.title}`}
              >
                <ArrowUpRight className="h-4 w-4 text-emerald-400 group-hover:text-black transition-colors" />
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

export default React.memo(WorksTab);
