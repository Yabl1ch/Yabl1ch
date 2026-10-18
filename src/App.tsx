import * as React from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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
import { Code2 } from "lucide-react";

const TAB_INDICES: Record<TabType, number> = {
  bio: 0,
  work: 1,
  certificates: 2,
};

const tabSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 36 : direction < 0 ? -36 : 0,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 440, damping: 34, mass: 0.7 },
      opacity: { duration: 0.16, ease: "easeOut" },
    },
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 440, damping: 34, mass: 0.7 },
      opacity: { duration: 0.16, ease: "easeOut" },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 28 : -28,
    opacity: 0,
    transition: {
      x: { duration: 0.09, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.08, ease: "linear" },
    },
  }),
};

export function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [isContentVisible, setIsContentVisible] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>("bio");
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = React.useState<Certificate | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const [tabDirection, setTabDirection] = React.useState<number>(0);

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
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#07130e] text-[#f0fdf4] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 0.7s Grid & Glowing Squares Intro Screen */}
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
        opacity={0.65}
        fade={true}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Secondary Ambient Gradient Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[130px] z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[-10%] right-[15%] h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px] z-0"
      />

      {/* Main Content with Timed Smooth Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={
          isContentVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 16 }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex min-h-screen flex-col justify-between max-w-6xl mx-auto will-change-[transform,opacity]"
      >
        <main className="flex-1 pb-16">
          {/* Hero Header with 3D Tilt Avatar and Per-Letter Interactive Hover */}
          <HeroHeader />

          {/* Segmented Control Tab Navigation (Bio / My Work / My certificates) */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            workCount={projects.length}
            certificateCount={certificates.length}
          />

          {/* Animated Directional Tab Content Switcher ("листание" без задержек) */}
          <div className="relative mt-4 overflow-hidden min-h-[480px]">
            <AnimatePresence mode="wait" custom={tabDirection} initial={false}>
              <motion.div
                key={activeTab}
                custom={tabDirection}
                variants={tabSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full will-change-transform"
              >
                {activeTab === "bio" ? (
                  <BioTab onShowToast={handleShowToast} />
                ) : activeTab === "work" ? (
                  <WorksTab onSelectProject={setSelectedProject} />
                ) : (
                  <CertificatesTab onSelectCertificate={setSelectedCertificate} />
                )}
              </motion.div>
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
      </motion.div>

      {/* Project Lightbox & Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Certificate Verification & Cover Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          onShowToast={handleShowToast}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={handleCloseToast} />
      )}
    </div>
  );
}

export default App;
