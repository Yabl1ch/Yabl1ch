import * as React from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { useTopLayerDialog } from "@/lib/dialog";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.96,
  }),
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [renderedProject, setRenderedProject] = React.useState<Project | null>(project);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const shouldReduceMotion = useReducedMotion();

  const swipeStartXRef = React.useRef<number | null>(null);
  const swipeTrackRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (project) {
      setRenderedProject(project);
      setActiveImageIndex(0);
      setDirection(0);
    }
  }, [project]);

  const handleDialogClosed = React.useCallback(() => {
    setRenderedProject(null);
    onClose();
  }, [onClose]);

  const { requestClose } = useTopLayerDialog(dialogRef, Boolean(project), handleDialogClosed);

  const activeData = project ?? renderedProject;

  // Arrow key navigation inside the open carousel
  React.useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setDirection(-1);
        setActiveImageIndex((prev) =>
          prev === 0 ? project.images.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setDirection(1);
        setActiveImageIndex((prev) =>
          prev === project.images.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project]);

  const currentImage = activeData
    ? activeData.images[activeImageIndex] || activeData.images[0]
    : null;
  const hasMultipleImages = Boolean(activeData && activeData.images.length > 1);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeData) return;
    setDirection(-1);
    setActiveImageIndex((prev) =>
      prev === 0 ? activeData.images.length - 1 : prev - 1
    );
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeData) return;
    setDirection(1);
    setActiveImageIndex((prev) =>
      prev === activeData.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (idx: number) => {
    if (idx === activeImageIndex) return;
    setDirection(idx > activeImageIndex ? 1 : -1);
    setActiveImageIndex(idx);
  };

  const resetSwipeOffset = () => {
    swipeStartXRef.current = null;
    if (swipeTrackRef.current) {
      swipeTrackRef.current.style.transform = "";
    }
  };

  const handleSwipePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || e.button !== 0) return;
    swipeStartXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleSwipePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartXRef.current === null || shouldReduceMotion || !swipeTrackRef.current) return;
    const delta = Math.max(-90, Math.min(90, (e.clientX - swipeStartXRef.current) * 0.45));
    swipeTrackRef.current.style.transform = `translate3d(${delta}px, 0, 0)`;
  };

  const handleSwipePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartXRef.current === null) return;
    const delta = e.clientX - swipeStartXRef.current;
    resetSwipeOffset();
    if (delta < -50) {
      handleNext();
    } else if (delta > 50) {
      handlePrev();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="project-modal-title"
      data-lenis-prevent
      className="portfolio-dialog m-auto w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] max-w-4xl max-h-[92dvh] sm:max-h-[92vh] overflow-y-auto scroll-smooth rounded-2xl border border-emerald-500/40 bg-[#091811]/95 text-white shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_36px_rgba(34,197,94,0.22)] backdrop-blur-xl open:flex flex-col transform-gpu origin-center p-0"
    >
      {activeData && currentImage && (
        <>
          {/* Header Bar (solid/translucent without nested backdrop-filter) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-900/60 bg-[#091811]/95 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3">
              <h1 id="project-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {activeData.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                autoFocus
                onClick={requestClose}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors cursor-pointer"
                title="Закрыть (Esc)"
                aria-label="Закрыть окно проекта"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
            {/* Interactive Animated Screenshot Carousel */}
            <div className="relative group/carousel rounded-2xl overflow-hidden border border-emerald-800/50 bg-[#050f0b] shadow-inner">
              <div className="relative aspect-video sm:aspect-[16/10] w-full flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <m.div
                    key={activeImageIndex}
                    custom={direction}
                    variants={shouldReduceMotion ? undefined : slideVariants}
                    initial={shouldReduceMotion ? false : "enter"}
                    animate="center"
                    exit={shouldReduceMotion ? undefined : "exit"}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: shouldReduceMotion ? 0 : 0.25 },
                      scale: { duration: shouldReduceMotion ? 0 : 0.25 },
                    }}
                    onPointerDown={handleSwipePointerDown}
                    onPointerMove={handleSwipePointerMove}
                    onPointerUp={handleSwipePointerUp}
                    onPointerCancel={resetSwipeOffset}
                    className={`absolute inset-0 flex items-center justify-center p-2 touch-pan-y ${
                      hasMultipleImages ? "cursor-grab active:cursor-grabbing" : ""
                    }`}
                  >
                    <div
                      ref={swipeTrackRef}
                      className="h-full w-full flex items-center justify-center transition-transform duration-150 ease-out"
                    >
                      <img
                        src={currentImage.url}
                        alt={currentImage.caption}
                        width={960}
                        height={600}
                        loading="eager"
                        decoding="async"
                        className="max-h-full max-w-full object-contain rounded-lg select-none pointer-events-none"
                      />
                    </div>
                  </m.div>
                </AnimatePresence>

                {/* Left Navigation Chevron */}
                {hasMultipleImages && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Предыдущий скриншот"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-2.5 bg-black/75 hover:bg-emerald-500 hover:text-black text-white backdrop-blur-md border border-emerald-500/40 transition-all shadow-lg cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Right Navigation Chevron */}
                {hasMultipleImages && (
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Следующий скриншот"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full p-2.5 bg-black/75 hover:bg-emerald-500 hover:text-black text-white backdrop-blur-md border border-emerald-500/40 transition-all shadow-lg cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                {/* Image Counter Badge */}
                {hasMultipleImages && (
                  <div className="absolute top-3 right-3 z-20 rounded-full bg-black/80 px-3 py-1 text-xs font-mono font-medium text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    {activeImageIndex + 1} / {activeData.images.length}
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
                {activeData.images.map((img, idx) => {
                  const isCurrent = idx === activeImageIndex;
                  return (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => handleThumbnailClick(idx)}
                      className={`relative flex-shrink-0 h-16 w-24 sm:h-20 sm:w-32 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-102"
                          : "border-emerald-900/60 opacity-60 hover:opacity-100 hover:border-emerald-700"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Миниатюра ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        aria-current={isCurrent ? "true" : undefined}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Project Description (ONLY description as requested) */}
            <div className="space-y-3 rounded-2xl border border-emerald-900/40 bg-[#0b1c14]/60 p-5 sm:p-6">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                Описание проекта
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-emerald-100/90 font-normal">
                {activeData.description}
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-emerald-900/60 bg-[#071710]/90 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={requestClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

export default ProjectModal;
