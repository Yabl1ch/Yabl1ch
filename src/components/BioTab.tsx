import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check, ChevronDown } from "lucide-react";
import { bioData } from "@/data/bio";
import { socialLinks } from "@/data/socials";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  TelegramBrandAvatar,
  DiscordBrandAvatar,
  GithubBrandAvatar,
} from "@/components/ui/brand-icons";

interface BioTabProps {
  onShowToast: (message: string) => void;
}

export function BioTab({ onShowToast }: BioTabProps) {
  const [isBioExpanded, setIsBioExpanded] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (text: string, label: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(linkId);
      onShowToast(`Скопировано: ${label}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      onShowToast(`Скопировано: ${text}`);
    }
  };

  const renderBrandAvatar = (id: string) => {
    switch (id) {
      case "telegram":
        return <TelegramBrandAvatar className="h-12 w-12" />;
      case "discord":
        return <DiscordBrandAvatar className="h-12 w-12" />;
      case "github":
        return <GithubBrandAvatar className="h-12 w-12" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-4">
      {/* Expandable About Me Card */}
      <BlurFade delay={0.15} inView>
        <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0b1f16]/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-emerald-500/50">
          {/* Decorative ambient corner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
          />

          {/* Header (Clickable Accordion Trigger) */}
          <button
            onClick={() => setIsBioExpanded(!isBioExpanded)}
            className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer select-none group focus:outline-none"
            aria-expanded={isBioExpanded}
          >
            <div className="inline-flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Обо мне
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-emerald-950/70 border border-emerald-800/60 px-3 py-1.5 text-xs font-medium text-emerald-300 group-hover:bg-emerald-900/60 group-hover:border-emerald-500/50 transition-all">
              <span>{isBioExpanded ? "Свернуть" : "Развернуть"}</span>
              <motion.div
                animate={{ rotate: isBioExpanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4 text-emerald-400" />
              </motion.div>
            </div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence initial={false}>
            {isBioExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-emerald-900/50">
                  <div className="space-y-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal pt-4">
                    {bioData.paragraphs.map((paragraph, index) => (
                      <p key={index} className="tracking-wide">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </BlurFade>

      {/* Social Media & Contact Cards with Stylized Official Avatars */}
      <BlurFade delay={0.25} inView>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
              <h3 className="text-xl font-bold tracking-tight text-white">
                Связь и соцсети
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialLinks.map((social) => {
              if (social.isExternal && social.url) {
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between p-5 rounded-2xl border border-emerald-800/40 bg-[#091a12]/70 hover:bg-[#0c2419]/90 hover:border-emerald-400/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        {/* Stylized Official Brand Avatar */}
                        {renderBrandAvatar(social.id)}

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 group-hover:border-emerald-500/50 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                      <div className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                        {social.title}
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-emerald-400/90 mt-0.5">
                        {social.handle}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-emerald-200/60 line-clamp-2">
                      {social.description}
                    </div>
                  </a>
                );
              }

              // Discord Copyable Card
              const isCopied = copiedId === social.id;

              return (
                <button
                  key={social.id}
                  onClick={() =>
                    handleCopy(
                      social.copyValue || social.handle,
                      social.copyLabel || social.handle,
                      social.id
                    )
                  }
                  className="group relative text-left flex flex-col justify-between p-5 rounded-2xl border border-emerald-800/40 bg-[#091a12]/70 hover:bg-[#0c2419]/90 hover:border-emerald-400/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      {/* Stylized Official Brand Avatar */}
                      {renderBrandAvatar(social.id)}

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 group-hover:border-emerald-500/50 transition-colors">
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                    </div>

                    <div className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {social.title}
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-emerald-400/90 mt-0.5">
                      {social.handle}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-emerald-200/60 line-clamp-2">
                    {social.description}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </BlurFade>
    </div>
  );
}

export default BioTab;
