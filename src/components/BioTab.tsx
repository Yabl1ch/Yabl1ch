import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Copy, Check, ChevronDown } from "lucide-react";
import { bioData } from "@/data/bio";
import { socialLinks } from "@/data/socials";
import {
  TelegramBrandAvatar,
  DiscordBrandAvatar,
  GithubBrandAvatar,
} from "@/components/ui/brand-icons";

interface BioTabProps {
  onShowToast: (message: string) => void;
}

function BioTabComponent({ onShowToast }: BioTabProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isBioExpanded, setIsBioExpanded] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (text: string, label: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(linkId);
      onShowToast(`Скопировано: ${label}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.warn("Clipboard copy failed", { label, linkId, error });
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
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4">
      {/* Expandable About Me Card */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#0b1f16]/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-emerald-500/50">
          {/* Decorative ambient corner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
          />

          {/* Header (Clickable Accordion Trigger) */}
          <button
            onClick={() => setIsBioExpanded(!isBioExpanded)}
            className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1f16] touch-manipulation"
            aria-expanded={isBioExpanded}
            aria-controls="bio-content"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Обо мне
              </h2>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-emerald-950/70 border border-emerald-800/60 px-3 py-1.5 text-xs font-medium text-emerald-300 group-hover:bg-emerald-900/60 group-hover:border-emerald-500/50 transition-all">
              <span>{isBioExpanded ? "Свернуть" : "Развернуть"}</span>
              <div className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isBioExpanded ? "rotate-180" : ""}`}>
                <ChevronDown className="h-4 w-4 text-emerald-400" />
              </div>
            </div>
          </button>

          {/* Collapsible Content with CSS Grid transition (100% zero layout thrashing & zero font-weight snap) */}
          <div
            id="bio-content"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isBioExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-emerald-900/50">
                <div className="space-y-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal pt-4 font-bio">
                  {bioData.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="tracking-wide"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Social Media & Contact Cards with Stylized Official Avatars */}
      <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
              <h3 className="text-xl font-bold tracking-tight text-white">
                Связь и соцсети
              </h3>
            </div>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {socialLinks.map((social) => {
              if (social.isExternal && social.url) {
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-emerald-800/40 bg-[#081a12]/60 backdrop-blur-md overflow-hidden transition-[transform,box-shadow,border-color,background-color,backdrop-filter] duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] touch-manipulation hover:border-emerald-400/80 hover:bg-[#062417]/80 hover:backdrop-blur-3xl hover:shadow-[0_16px_40px_rgba(16,185,129,0.35),0_0_24px_rgba(52,211,153,0.22),inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-1px_3px_rgba(16,185,129,0.45),inset_0_0_24px_rgba(16,185,129,0.18)] cursor-pointer text-left hover:will-change-transform"
                    onPointerDown={(event) => event.currentTarget.classList.add("is-pressed")}
                    onPointerUp={(event) => event.currentTarget.classList.remove("is-pressed")}
                    onPointerCancel={(event) => event.currentTarget.classList.remove("is-pressed")}
                    onPointerLeave={(event) => event.currentTarget.classList.remove("is-pressed")}
                  >
                    {/* Green Liquid Glass: Ambient caustic radial glow */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-[100%] bg-[radial-gradient(circle_at_35%_25%,_rgba(52,211,153,0.32),_rgba(16,185,129,0.12)_40%,_transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"
                    />

                    {/* Green Liquid Glass: Specular top-light prism refraction */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.12] via-emerald-400/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"
                    />

                    {/* Green Liquid Glass: Diagonal refractive sheen ray */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-300/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0"
                    />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          {/* Stylized Official Brand Avatar */}
                          {renderBrandAvatar(social.id)}

                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 group-hover:border-emerald-400/70 group-hover:bg-emerald-900/50 transition-colors">
                            <ExternalLink className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>

                        <div className="font-bold text-white text-base group-hover:text-emerald-200 transition-colors">
                          {social.title}
                        </div>
                        <div className="text-xs sm:text-sm font-mono text-emerald-400/90 mt-0.5">
                          {social.handle}
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-emerald-200/60 group-hover:text-emerald-100/75 transition-colors line-clamp-2">
                        {social.description}
                      </div>
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
                  className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-emerald-800/40 bg-[#081a12]/60 backdrop-blur-md overflow-hidden transition-[transform,box-shadow,border-color,background-color,backdrop-filter] duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.015] active:scale-[0.98] touch-manipulation hover:border-emerald-400/80 hover:bg-[#062417]/80 hover:backdrop-blur-3xl hover:shadow-[0_16px_40px_rgba(16,185,129,0.35),0_0_24px_rgba(52,211,153,0.22),inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-1px_3px_rgba(16,185,129,0.45),inset_0_0_24px_rgba(16,185,129,0.18)] cursor-pointer text-left hover:will-change-transform"
                  onPointerDown={(event) => event.currentTarget.classList.add("is-pressed")}
                  onPointerUp={(event) => event.currentTarget.classList.remove("is-pressed")}
                  onPointerCancel={(event) => event.currentTarget.classList.remove("is-pressed")}
                  onPointerLeave={(event) => event.currentTarget.classList.remove("is-pressed")}
                  onLostPointerCapture={(event) => event.currentTarget.classList.remove("is-pressed")}
                >
                  {/* Green Liquid Glass: Ambient caustic radial glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-[100%] bg-[radial-gradient(circle_at_35%_25%,_rgba(52,211,153,0.32),_rgba(16,185,129,0.12)_40%,_transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"
                  />

                  {/* Green Liquid Glass: Specular top-light prism refraction */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.12] via-emerald-400/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"
                  />

                  {/* Green Liquid Glass: Diagonal refractive sheen ray */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-300/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0"
                  />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        {/* Stylized Official Brand Avatar */}
                        {renderBrandAvatar(social.id)}

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 group-hover:border-emerald-400/70 group-hover:bg-emerald-900/50 transition-colors">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={isCopied ? "copied" : "copy"}
                              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: 3 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: -3 }}
                              transition={{ duration: shouldReduceMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
                              className="flex"
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-300" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="font-bold text-white text-base group-hover:text-emerald-200 transition-colors">
                        {social.title}
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-emerald-400/90 mt-0.5">
                        {social.handle}
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-emerald-200/60 group-hover:text-emerald-100/75 transition-colors line-clamp-2">
                      {social.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
    </div>
  );
}

export const BioTab = React.memo(BioTabComponent);
export default BioTab;
