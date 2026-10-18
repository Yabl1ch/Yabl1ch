import { motion } from "framer-motion";
import {
  ExternalLink,
  ShieldCheck,
  Calendar,
  Eye,
  Award,
} from "lucide-react";
import { certificates, type Certificate } from "@/data/certificates";
import { GoogleCloudLogo, IbmLogo, KaggleLogo } from "@/components/ui/brand-icons";

interface CertificatesTabProps {
  onSelectCertificate: (cert: Certificate) => void;
}

export function CertificatesTab({ onSelectCertificate }: CertificatesTabProps) {
  const renderIssuerLogo = (logo: Certificate["issuerLogo"]) => {
    switch (logo) {
      case "google":
        return <GoogleCloudLogo className="h-4 w-4" />;
      case "ibm":
        return <IbmLogo className="h-3 w-6 text-[#0062ff]" />;
      case "kaggle":
        return <KaggleLogo className="h-4 w-4 text-[#20beff]" />;
      default:
        return <Award className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
      {/* Section Header & Google Public Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-emerald-900/50 gap-3"
      >
        <div className="inline-flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80] shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Сертификаты и бейджи
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
            {certificates.length} подтверждено
          </span>
        </div>

        {/* Master Google Skills Profile Quick Link */}
        <a
          href="https://www.skills.google/public_profiles/ff0cb930-aafd-45ad-ba31-a8d58aa189a2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-all shadow-sm group"
        >
          <GoogleCloudLogo className="h-3.5 w-3.5" />
          <span>Google Skills Профиль</span>
          <ExternalLink className="h-3 w-3 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </motion.div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.article
            key={cert.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.28,
              delay: index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -6 }}
            onClick={() => onSelectCertificate(cert)}
            className="group relative flex flex-col justify-between rounded-2xl border border-emerald-800/40 bg-[#091a13]/70 overflow-hidden backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_35px_rgba(34,197,94,0.25)] cursor-pointer h-full"
          >
            {/* Cover Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050f0b] flex items-center justify-center p-6 border-b border-emerald-900/40">
              <img
                src={cert.imageUrl}
                alt={cert.title}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                loading="lazy"
              />

              {/* Subtle dark gradient overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091a13] via-transparent to-transparent opacity-60"
              />

              {/* Verified Badge */}
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono font-semibold text-emerald-300 shadow-sm backdrop-blur-md">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>VERIFIED</span>
              </div>

              {/* Order Index */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 border border-emerald-900/60 text-[10px] font-mono text-emerald-400/80 backdrop-blur-sm">
                {cert.orderNumber}
              </div>
            </div>

            {/* Card Body */}
            <div className="flex flex-col flex-1 justify-between p-5 space-y-4">
              <div className="space-y-2">
                {/* Organization & Issuer */}
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/80">
                  <span className="p-1 rounded-md bg-emerald-950/60 border border-emerald-900/50">
                    {renderIssuerLogo(cert.issuerLogo)}
                  </span>
                  <span className="truncate">{cert.issuer}</span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {cert.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs text-emerald-200/60 line-clamp-2">
                  {cert.subtitle}
                </p>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cert.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-950/80 border border-emerald-900/60 text-emerald-400/90"
                  >
                    {skill}
                  </span>
                ))}
                {cert.skills.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-emerald-400/60">
                    +{cert.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Card Footer: Date & Quick Actions */}
              <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-emerald-400/70 font-mono text-[11px]">
                  <Calendar className="h-3 w-3 text-emerald-400/60" />
                  <span>{cert.issueDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Direct External Verification Button */}
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                    title="Проверить подлинность в официальном реестре"
                    aria-label="Проверить подлинность"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {/* Open Modal Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCertificate(cert);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black text-emerald-300 font-semibold text-[11px] transition-all shadow-sm cursor-pointer"
                    aria-label={`Открыть сертификат ${cert.title}`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Обложка</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default CertificatesTab;
