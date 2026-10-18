import { motion } from "framer-motion";
import { User, FolderGit2, Award } from "lucide-react";

export type TabType = "bio" | "work" | "certificates";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  workCount?: number;
  certificateCount?: number;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  workCount = 4,
  certificateCount = 5,
}: TabNavigationProps) {
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
    <nav className="relative flex justify-center px-3 sm:px-4 my-4 sm:my-6 z-20 w-full">
      <div className="relative grid grid-cols-3 w-full max-w-[360px] sm:max-w-none sm:w-auto sm:flex sm:items-center p-1 sm:p-1.5 rounded-full border border-emerald-500/30 bg-[#081a13]/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl select-none overflow-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 outline-none select-none cursor-pointer w-full sm:w-auto shrink-0 touch-manipulation"
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
                    className={`ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs font-mono transition-colors duration-200 ${
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
