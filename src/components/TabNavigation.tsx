import { motion } from "framer-motion";
import { User, FolderGit2 } from "lucide-react";

export type TabType = "about" | "work";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  workCount?: number;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  workCount = 4,
}: TabNavigationProps) {
  const tabs = [
    {
      id: "about" as const,
      label: "About Me",
      icon: User,
    },
    {
      id: "work" as const,
      label: "My Work",
      icon: FolderGit2,
      badge: workCount,
    },
  ];

  return (
    <nav className="relative flex justify-center px-4 my-6 z-20">
      <div className="relative flex items-center p-1.5 rounded-full glass-pill border border-emerald-500/30 bg-[#081a13]/85 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 outline-none select-none interactive-cursor"
            >
              {/* Active animated pill sliding under the selected tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-emerald-500/25 border border-emerald-400/50 shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 32,
                  }}
                />
              )}

              {/* Tab Icon and Label */}
              <span
                className={`relative z-10 flex items-center gap-2 transition-colors duration-200 ${
                  isActive
                    ? "text-white font-bold"
                    : "text-emerald-300/70 hover:text-emerald-100"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors duration-200 ${
                    isActive ? "text-emerald-400" : "text-emerald-500/70"
                  }`}
                />
                <span>{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-xs font-mono transition-colors duration-200 ${
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

export default TabNavigation;
