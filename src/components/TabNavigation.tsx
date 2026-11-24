import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { User, FolderGit2, Award } from "lucide-react";

export type TabType = "bio" | "work" | "certificates";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onTabIntent?: (tab: TabType) => void;
  workCount?: number;
  certificateCount?: number;
}

function TabNavigationComponent({
  activeTab,
  onTabChange,
  onTabIntent,
  workCount = 5,
  certificateCount = 5,
}: TabNavigationProps) {
  const shouldReduceMotion = useReducedMotion();
  const tablistRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<Record<TabType, HTMLButtonElement | null>>({
    bio: null,
    work: null,
    certificates: null,
  });
  const [pillStyle, setPillStyle] = React.useState<{
    left: number;
    width: number;
    ready: boolean;
    animate: boolean;
  }>({ left: 0, width: 0, ready: false, animate: false });
  const hasMeasuredRef = React.useRef(false);

  const measureActivePill = React.useCallback((shouldAnimate: boolean) => {
    const activeEl = tabRefs.current[activeTab];
    if (!activeEl) return;
    setPillStyle({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
      ready: true,
      animate: shouldAnimate,
    });
  }, [activeTab]);

  React.useLayoutEffect(() => {
    if (!hasMeasuredRef.current) {
      hasMeasuredRef.current = true;
      measureActivePill(false);
      if (!shouldReduceMotion) {
        const raf = requestAnimationFrame(() => {
          setPillStyle((prev) => (prev.ready ? { ...prev, animate: true } : prev));
        });
        return () => cancelAnimationFrame(raf);
      }
      return;
    }
    measureActivePill(!shouldReduceMotion);
  }, [measureActivePill, shouldReduceMotion]);

  React.useEffect(() => {
    const container = tablistRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    let lastWidth = container.clientWidth;
    const observer = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      // Ignore 1-2px font-weight jitter on tab switch so the pill glide animation is never cancelled
      if (Math.abs(nextWidth - lastWidth) < 8) return;
      lastWidth = nextWidth;
      measureActivePill(false);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [measureActivePill]);

  const tabs = [
    {
      id: "bio" as const,
      label: "Bio",
      mobileLabel: "Bio",
      icon: User,
    },
    {
      id: "work" as const,
      label: "My Work",
      mobileLabel: "Work",
      icon: FolderGit2,
      badge: workCount,
    },
    {
      id: "certificates" as const,
      label: "Certificates",
      mobileLabel: "Certs",
      icon: Award,
      badge: certificateCount,
    },
  ];

  return (
    <nav aria-label="Основная навигация портфолио" className="relative flex justify-center px-3 sm:px-4 my-4 sm:my-6 z-20 w-full">
      <div
        ref={tablistRef}
        role="tablist"
        className="relative grid grid-cols-3 w-full max-w-[360px] sm:max-w-none sm:w-auto sm:flex sm:items-center p-1 sm:p-1.5 rounded-full border border-emerald-500/30 bg-[#081a13]/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl select-none overflow-hidden"
      >
        {/* Active animated pill sliding under the selected tab via GPU transform */}
        {pillStyle.ready && (
          <div
            aria-hidden="true"
            style={{
              width: pillStyle.width,
              transform: `translate3d(${pillStyle.left}px, 0, 0)`,
            }}
            className={`active-tab-signal pointer-events-none absolute top-1 bottom-1 sm:top-1.5 sm:bottom-1.5 left-0 rounded-full bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-500/25 border border-emerald-400/50 shadow-[0_0_20px_rgba(34,197,94,0.35)] ${
              pillStyle.animate
                ? "transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "transition-none"
            }`}
          />
        )}

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              key={tab.id}
              id={`${tab.id}-tab`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onPointerEnter={() => {
                if (!onTabIntent) return;
                requestAnimationFrame(() => onTabIntent(tab.id));
              }}
              onFocus={() => {
                if (!onTabIntent) return;
                requestAnimationFrame(() => onTabIntent(tab.id));
              }}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const offset = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex = (tabs.findIndex((item) => item.id === tab.id) + offset + tabs.length) % tabs.length;
                const nextTab = tabs[nextIndex];
                onTabChange(nextTab.id);
                requestAnimationFrame(() => document.getElementById(`${nextTab.id}-tab`)?.focus());
              }}
              className="relative flex min-h-11 items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-[color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#081a13] select-none cursor-pointer w-full sm:w-auto shrink-0 touch-manipulation active:scale-[0.97]"
            >
              {/* Tab Icon and Label */}
              <span
                className={`relative z-10 flex items-center justify-center gap-1 sm:gap-2 transition-colors duration-200 ${
                  isActive
                    ? "text-white font-bold"
                    : "text-emerald-300/70 hover:text-emerald-100"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 transition-colors duration-200 ${
                    isActive ? "text-emerald-400" : "text-emerald-500/70"
                  }`}
                />
                <span className="hidden min-[380px]:inline sm:hidden">{tab.label}</span>
                <span className="min-[380px]:hidden sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`ml-0.5 sm:ml-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono transition-colors duration-200 ${
                      isActive
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-400/40"
                        : "bg-emerald-950/60 text-emerald-400/70 border border-emerald-900/50"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export const TabNavigation = React.memo(TabNavigationComponent);
export default TabNavigation;
