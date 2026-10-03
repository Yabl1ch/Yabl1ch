import * as React from "react";
import { ExternalLink, Copy, Check, Send, Github, MessageSquare } from "lucide-react";
import { bioData } from "@/data/bio";
import { socialLinks, type SocialLink } from "@/data/socials";
import { BlurFade } from "@/components/ui/blur-fade";

interface BioTabProps {
  onShowToast: (message: string) => void;
}

export function BioTab({ onShowToast }: BioTabProps) {
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

  const getSocialIcon = (id: SocialLink["id"]) => {
    switch (id) {
      case "telegram":
        return <Send className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case "github":
        return <Github className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case "discord":
        return <MessageSquare className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 px-4">
      {/* About Me Exact Bio Card */}
      <BlurFade delay={0.15} inView>
        <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-[#0b1f16]/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Subtle decorative corner accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div className="relative space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
              Обо мне
            </h2>

            {/* EXACT TEXT PARAGRAPHS FROM ABOUTME.md */}
            <div className="space-y-4 text-emerald-100/90 text-base sm:text-lg leading-relaxed font-normal">
              {bioData.paragraphs.map((paragraph, index) => (
                <p key={index} className="tracking-wide">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      </BlurFade>

      {/* Social Media & Contact Cards */}
      <BlurFade delay={0.25} inView>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
              Связь и соцсети
            </h3>
            <span className="text-xs text-emerald-400/60 uppercase tracking-widest font-mono">
              Links & Contacts
            </span>
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
                    className="group relative flex flex-col justify-between p-5 rounded-xl border border-emerald-800/40 bg-[#091a12]/60 hover:bg-[#0c2419]/80 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] interactive-cursor"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-800/50">
                          {getSocialIcon(social.id)}
                        </div>
                        <ExternalLink className="h-4 w-4 text-emerald-500/50 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {social.title}
                      </div>
                      <div className="text-sm font-mono text-emerald-400/80 mt-0.5">
                        {social.handle}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-emerald-200/50 line-clamp-2">
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
                  className="group relative text-left flex flex-col justify-between p-5 rounded-xl border border-emerald-800/40 bg-[#091a12]/60 hover:bg-[#0c2419]/80 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] interactive-cursor"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-800/50">
                        {getSocialIcon(social.id)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400/80 group-hover:text-emerald-300 font-mono">
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-emerald-500/60 group-hover:text-emerald-300 transition-colors" />
                        )}
                      </div>
                    </div>
                    <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {social.title}
                    </div>
                    <div className="text-sm font-mono text-emerald-400/80 mt-0.5">
                      {social.handle}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-emerald-200/50 line-clamp-2">
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
