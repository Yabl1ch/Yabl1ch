import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isLightbox, setIsLightbox] = React.useState(false);

  // Reset active image whenever modal opens or project changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    setIsLightbox(false);
  }, [project]);

  // Handle keyboard navigation & escape key
  React.useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightbox) {
          setIsLightbox(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev === 0 ? project.images.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev === project.images.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, isLightbox, onClose]);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const currentImage = project.images[activeImageIndex] || project.images[0];
  const hasMultipleImages = project.images.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={`relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#091811]/95 text-white shadow-[0_0_50px_rgba(34,197,94,0.25)] backdrop-blur-2xl flex flex-col ${
            isLightbox ? "max-w-6xl max-h-[96vh]" : ""
          }`}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-900/60 bg-[#091811]/90 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-7 items-center justify-center rounded-md bg-emerald-500/20 px-2.5 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                #{project.orderNumber}
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {project.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLightbox(!isLightbox)}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors interactive-cursor"
                title={isLightbox ? "Свернуть просмотр" : "Развернуть на весь экран"}
              >
                {isLightbox ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors interactive-cursor"
                title="Закрыть (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Interactive Screenshot Viewer */}
            <div className="relative group/carousel rounded-xl overflow-hidden border border-emerald-800/50 bg-[#050f0b] shadow-inner">
              <div className="relative aspect-video sm:aspect-[16/10] w-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage.url}
                    src={currentImage.url}
                    alt={currentImage.caption}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full object-contain"
                  />
                </AnimatePresence>

                {/* Left Navigation Chevron */}
                {hasMultipleImages && (
                  <button
                    onClick={handlePrev}
                    aria-label="Previous screenshot"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/70 hover:bg-emerald-600/80 text-white backdrop-blur-md border border-emerald-500/30 transition-all opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 interactive-cursor"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Right Navigation Chevron */}
                {hasMultipleImages && (
                  <button
                    onClick={handleNext}
                    aria-label="Next screenshot"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 bg-black/70 hover:bg-emerald-600/80 text-white backdrop-blur-md border border-emerald-500/30 transition-all opacity-80 sm:opacity-0 group-hover/carousel:opacity-100 interactive-cursor"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                {/* Image Counter Badge */}
                {hasMultipleImages && (
                  <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-mono font-medium text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                    {activeImageIndex + 1} / {project.images.length}
                  </div>
                )}
              </div>

              {/* Screenshot Caption */}
              <div className="border-t border-emerald-950/80 bg-[#07130e]/90 px-4 py-2.5 text-xs sm:text-sm text-emerald-300/90 font-medium text-center">
                {currentImage.caption}
              </div>
            </div>

            {/* Thumbnail Filmstrip */}
            {hasMultipleImages && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {project.images.map((img, idx) => {
                  const isCurrent = idx === activeImageIndex;
                  return (
                    <button
                      key={img.url}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 h-16 w-24 sm:h-20 sm:w-32 rounded-lg overflow-hidden border-2 transition-all duration-200 interactive-cursor ${
                        isCurrent
                          ? "border-emerald-400 ring-2 ring-emerald-500/30 scale-102"
                          : "border-emerald-900/60 opacity-60 hover:opacity-100 hover:border-emerald-700"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Миниатюра ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Project Details Description */}
            <div className="space-y-4 rounded-xl border border-emerald-900/40 bg-[#0b1c14]/50 p-5 backdrop-blur-sm">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Описание проекта
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-emerald-100/90 font-normal">
                {project.description}
              </p>
            </div>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Ключевые особенности
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-lg border border-emerald-900/30 bg-[#071911]/60 p-2.5 text-xs sm:text-sm text-emerald-200/90"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Tags */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80 font-mono flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                Стек технологий & Архитектура
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-emerald-800/50 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-emerald-900/60 bg-[#071710]/80 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all interactive-cursor"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProjectModal;
