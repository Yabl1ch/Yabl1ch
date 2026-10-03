import { motion } from "framer-motion";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-900/50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
              Мои работы
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/70 mt-1">
              Проекты, разработанные с фокусом на функциональность, скорость и автономность
            </p>
          </div>
          <span className="text-xs text-emerald-400/60 uppercase tracking-widest font-mono">
            {projects.length} Projects Total
          </span>
        </div>
      </BlurFade>

      {/* Projects Grid: strictly in requested order 1..4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <BlurFade key={project.id} delay={0.15 + index * 0.08} inView>
            <motion.article
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              onClick={() => onSelectProject(project)}
              className="group relative flex flex-col h-full rounded-2xl border border-emerald-800/40 bg-[#091a13]/70 overflow-hidden backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] cursor-pointer interactive-cursor"
            >
              {/* Cover Image Container with Zoom & Badge */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#050f0b]">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Ambient dark gradient vignette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091a13] via-[#091a13]/20 to-transparent"
                />

                {/* Top Badge: Order Index */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                  <span>#{project.orderNumber}</span>
                </div>

                {/* Top Right: Screenshot Count */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{project.images.length}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black transition-all">
                      <ArrowUpRight className="h-4 w-4 text-emerald-400 group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-emerald-300/80 font-medium">
                    {project.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-emerald-100/70 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-emerald-950/80">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-emerald-900/60 bg-[#06160e]/90 px-2 py-0.5 text-[11px] font-medium text-emerald-300/90"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="rounded-md border border-emerald-900/60 bg-[#06160e]/90 px-2 py-0.5 text-[11px] font-mono text-emerald-400/60">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default WorksTab;
