import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { BlurFade } from "@/components/ui/blur-fade";

interface WorksTabProps {
  onSelectProject: (project: Project) => void;
}

export function WorksTab({ onSelectProject }: WorksTabProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
      {/* Tab Section Header */}
      <BlurFade delay={0.1} inView>
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
          <div className="inline-flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Мои работы
            </h2>
          </div>
        </div>
      </BlurFade>

      {/* Projects Grid: strictly in requested order 1..4 with clean previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <BlurFade key={project.id} delay={0.15 + index * 0.08} inView>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              onClick={() => onSelectProject(project)}
              className="group relative flex flex-col rounded-2xl border border-emerald-800/40 bg-[#091a13]/70 overflow-hidden backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(34,197,94,0.25)] cursor-pointer"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#050f0b]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091a13] via-transparent to-transparent opacity-80"
                />
              </div>

              {/* Minimal Card Footer: strictly Title + Action Button */}
              <div className="flex items-center justify-between p-5 bg-[#091a13]/90 border-t border-emerald-900/40">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {project.title}
                </h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject(project);
                  }}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-950/80 border border-emerald-800/60 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black transition-all shadow-sm"
                  aria-label={`Открыть проект ${project.title}`}
                >
                  <ArrowUpRight className="h-4 w-4 text-emerald-400 group-hover:text-black transition-colors" />
                </button>
              </div>
            </motion.article>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default WorksTab;
