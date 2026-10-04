import * as React from "react";
import { AnimatePresence, motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { AnimatedGrid } from "@/components/ui/animated-grid";
import { Toast } from "@/components/ui/toast";
import { HeroHeader } from "@/components/HeroHeader";
import { TabNavigation, type TabType } from "@/components/TabNavigation";
import { BioTab } from "@/components/BioTab";
import { WorksTab } from "@/components/WorksTab";
import { ProjectModal } from "@/components/ProjectModal";
import { SplashScreen } from "@/components/SplashScreen";
import type { Project } from "@/data/projects";
import { projects } from "@/data/projects";
import { Code2 } from "lucide-react";

export function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>("bio");
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Microscopic scroll-linked motion blur
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 45,
    stiffness: 350,
  });

  // Maps velocity to an ultra-subtle blur (0px to 1px max)
  const motionBlur = useTransform(
    smoothVelocity,
    [-1800, 0, 1800],
    ["blur(1px)", "blur(0px)", "blur(1px)"]
  );

  const handleShowToast = React.useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const handleCloseToast = React.useCallback(() => {
    setToastMessage(null);
  }, []);

  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#07130e] text-[#f0fdf4] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Apple & Leaf Intro Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

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

      {/* Main Content with Microscopic Motion Blur */}
      <motion.div
        style={{ filter: motionBlur }}
        className="relative z-10 flex min-h-screen flex-col justify-between max-w-6xl mx-auto will-change-[filter]"
      >
        <main className="flex-1 pb-16">
          {/* Hero Header with 3D Tilt Avatar and Per-Letter Interactive Hover */}
          <HeroHeader />

          {/* Segmented Control Tab Navigation (Bio / My Work) */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            workCount={projects.length}
          />

          {/* Animated Tab Content Switcher */}
          <div className="relative mt-4">
            <AnimatePresence mode="wait">
              {activeTab === "bio" ? (
                <motion.div
                  key="bio-tab"
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <BioTab onShowToast={handleShowToast} />
                </motion.div>
              ) : (
                <motion.div
                  key="work-tab"
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <WorksTab onSelectProject={setSelectedProject} />
                </motion.div>
              )}
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
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Copy Feedback Toast Notification */}
      <Toast message={toastMessage} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
