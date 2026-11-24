import * as React from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useIsPresent,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { Toast } from "@/components/ui/toast";
import { HeroHeader } from "@/components/HeroHeader";
import { TabNavigation, type TabType } from "@/components/TabNavigation";
import BioTab from "@/components/BioTab";
import WorksTab from "@/components/WorksTab";
import CertificatesTab from "@/components/CertificatesTab";
import { ProjectModal } from "@/components/ProjectModal";
import { CertificateModal } from "@/components/CertificateModal";
import { SplashScreen } from "@/components/SplashScreen";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import type { Certificate } from "@/data/certificates";
import { certificates } from "@/data/certificates";
import { prewarmTabImages } from "@/lib/prewarm";
import { Code2 } from "lucide-react";
import Lenis from "lenis";

const INTRO_SESSION_KEY = "yabl1ch_intro_seen";

const TAB_INDICES: Record<TabType, number> = {
  bio: 0,
  work: 1,
  certificates: 2,
};

const tabSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 96 : direction < 0 ? -96 : 0,
    opacity: 0,
    scale: 0.975,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.2, ease: "easeOut" },
      scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 96 : -96,
    opacity: 0,
    scale: 0.975,
    transition: {
      x: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.16, ease: "easeIn" },
      scale: { duration: 0.22, ease: [0.32, 0, 0.67, 0] },
    },
  }),
};

interface TabSlidePaneProps {
  id: string;
  labelledBy: string;
  direction: number;
  reduceMotion: boolean | null;
  children: React.ReactNode;
}

function TabSlidePane({
  id,
  labelledBy,
  direction,
  reduceMotion,
  children,
}: TabSlidePaneProps) {
  const isPresent = useIsPresent();

  return (
    <m.div
      id={id}
      role="tabpanel"
      aria-labelledby={labelledBy}
      custom={direction}
      variants={reduceMotion ? undefined : tabSlideVariants}
      initial={reduceMotion ? false : "enter"}
      animate="center"
      exit={reduceMotion ? undefined : "exit"}
      className={`w-full transform-gpu ${
        isPresent ? "relative z-10" : "absolute inset-x-0 top-0 z-0 pointer-events-none"
      }`}
    >
      {children}
    </m.div>
  );
}

function hasSeenIntroInSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch (error) {
    console.warn("sessionStorage read failed", error);
    return false;
  }
}

export function App() {
  const shouldReduceMotion = useReducedMotion();
  const [showSplash, setShowSplash] = React.useState(() => !hasSeenIntroInSession());
  const [isContentVisible, setIsContentVisible] = React.useState(() => hasSeenIntroInSession());
  const [activeTab, setActiveTab] = React.useState<TabType>("bio");
  const [isBioExpanded, setIsBioExpanded] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = React.useState<Certificate | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isTabHidden, setIsTabHidden] = React.useState(false);
  const [tabDirection, setTabDirection] = React.useState<number>(0);

  const lenisRef = React.useRef<Lenis | null>(null);
  const flowRef = React.useRef<HTMLElement>(null);

  const isModalOpen = Boolean(selectedProject || selectedCertificate);
  const isBackgroundPaused = isModalOpen || isTabHidden;

  const handleTabChange = React.useCallback(
    (newTab: TabType) => {
      if (newTab === activeTab) return;
      const currentIdx = TAB_INDICES[activeTab];
      const nextIdx = TAB_INDICES[newTab];
      setTabDirection(nextIdx > currentIdx ? 1 : -1);
      setActiveTab(newTab);
    },
    [activeTab]
  );

  const handleToggleBio = React.useCallback(() => {
    setIsBioExpanded((prev) => !prev);
  }, []);

  const handleShowToast = React.useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleCloseToast = React.useCallback(() => {
    setToastMessage(null);
  }, []);

  const handleStartReveal = React.useCallback(() => {
    setIsContentVisible(true);
  }, []);

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
    setIsContentVisible(true);
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch (error) {
      console.warn("sessionStorage write failed", error);
    }
  }, []);

  const handleCloseProject = React.useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleCloseCertificate = React.useCallback(() => {
    setSelectedCertificate(null);
  }, []);

  // Track tab visibility to pause decorative work when off-screen
  React.useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Single Lenis instance & unified rAF loop (zero idle GPU/CPU wakeups, zero full-main filter blur)
  React.useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    let currentStretch = 0;
    let targetStretch = 0;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    const unsubscribeScroll = lenis.on("scroll", ({ velocity }) => {
      if (isCoarsePointer) return;
      const speed = Math.abs(velocity);
      targetStretch = speed > 1.2 ? Math.min(0.007, (speed - 1.2) * 0.00045) : 0;
    });

    const tick = (time: number) => {
      if (document.hidden) {
        rafId = 0;
        return;
      }

      lenis.raf(time);

      const flowEl = flowRef.current;
      if (flowEl && !isCoarsePointer) {
        currentStretch += (targetStretch - currentStretch) * 0.2;
        if (Math.abs(lenis.velocity) < 0.2) {
          targetStretch *= 0.8;
        }
        if (currentStretch > 0.0003) {
          flowEl.style.transform = `scaleY(${(1 + currentStretch).toFixed(4)})`;
        } else if (flowEl.style.transform) {
          currentStretch = 0;
          targetStretch = 0;
          flowEl.style.transform = "";
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    if (!document.hidden) {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafId) cancelAnimationFrame(rafId);
      unsubscribeScroll();
      if (flowRef.current) {
        flowRef.current.style.transform = "";
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldReduceMotion]);

  // Pause/resume Lenis when modals open or close without destroying the instance
  React.useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (isModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isModalOpen]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        data-bg-paused={isBackgroundPaused ? "true" : undefined}
        className="relative min-h-[100dvh] w-full bg-[#07130e] text-[#f0fdf4] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200"
      >
        {/* 0.7s Grid & Glowing Squares Intro Screen (skipped on repeat visits in same session) */}
        {showSplash && (
          <SplashScreen
            onStartReveal={handleStartReveal}
            onComplete={handleSplashComplete}
          />
        )}

        {/* Floating AnimatedGrid Backdrop */}
        <AnimatedGrid
          size={42}
          color="#14532d"
          accent="#22c55e"
          opacity={0.38}
          fade={true}
          paused={isBackgroundPaused}
          className="fixed inset-0 z-0 pointer-events-none"
        />

        {/* Secondary Ambient Gradient Blobs rendered via pure radial-gradient (zero CSS blur pass) */}
        <div
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(closest-side, rgba(5, 150, 105, 0.14), rgba(16, 185, 129, 0.05) 55%, transparent 100%)",
          }}
          className="pointer-events-none fixed top-[-14%] left-[12%] h-[420px] w-[420px] sm:h-[680px] sm:w-[680px] rounded-full z-0 animate-aurora-drift"
        />
        <div
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(closest-side, rgba(74, 222, 128, 0.085), rgba(34, 197, 94, 0.03) 55%, transparent 100%)",
          }}
          className="pointer-events-none fixed right-[-20%] top-[28%] h-[360px] w-[360px] sm:h-[580px] sm:w-[580px] rounded-full z-0 animate-aurora-drift-reverse"
        />

        {/* Main Content with Timed Smooth Reveal (opacity-only so TabNavigation coordinates stay rock-solid) */}
        <m.div
          initial={showSplash && !shouldReduceMotion ? { opacity: 0 } : false}
          animate={
            isContentVisible
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex min-h-[100dvh] flex-col justify-between max-w-6xl mx-auto px-2 sm:px-4 pt-[env(safe-area-inset-top)]"
        >
          <main ref={flowRef} id="main-content-flow" className="motion-blur-stream flex-1 pb-10 sm:pb-16">
            {/* Hero Header with 3D Tilt Avatar and Per-Letter Interactive Hover */}
            <HeroHeader skipIntro={!showSplash} />

            {/* Segmented Control Tab Navigation (Bio / My Work / Certificates) */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTabIntent={prewarmTabImages}
              workCount={projects.length}
              certificateCount={certificates.length}
            />

            {/* Animated Directional Tab Content Switcher (simultaneous GPU slide) */}
            <div className="relative mt-2 sm:mt-4 overflow-hidden min-h-[420px] sm:min-h-[480px]">
              <AnimatePresence mode="sync" custom={tabDirection} initial={false}>
                <TabSlidePane
                  key={activeTab}
                  id={`${activeTab}-panel`}
                  labelledBy={`${activeTab}-tab`}
                  direction={tabDirection}
                  reduceMotion={shouldReduceMotion}
                >
                  {activeTab === "bio" ? (
                    <BioTab
                      onShowToast={handleShowToast}
                      isExpanded={isBioExpanded}
                      onToggleExpanded={handleToggleBio}
                    />
                  ) : activeTab === "work" ? (
                    <WorksTab onSelectProject={setSelectedProject} />
                  ) : (
                    <CertificatesTab onSelectCertificate={setSelectedCertificate} />
                  )}
                </TabSlidePane>
              </AnimatePresence>
            </div>
          </main>

          {/* Minimal Footer */}
          <footer className="relative z-10 border-t border-emerald-950/70 py-6 px-4 text-center text-xs text-emerald-400/50">
            <div className="flex items-center justify-center gap-1.5 font-medium text-emerald-300/70">
              <Code2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Yabl1ch Portfolio</span>
            </div>
          </footer>
        </m.div>

        {/* Native Top-Layer Project Lightbox & Details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseProject}
        />

        {/* Native Top-Layer Certificate Verification & Cover Modal */}
        <CertificateModal
          certificate={selectedCertificate}
          onClose={handleCloseCertificate}
          onShowToast={handleShowToast}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <Toast message={toastMessage} onClose={handleCloseToast} />
        )}
      </div>
    </LazyMotion>
  );
}

export default App;
