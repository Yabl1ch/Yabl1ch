import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  FileDown,
  Calendar,
  Award,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { Certificate } from "@/data/certificates";
import { GoogleCloudLogo, IbmLogo, KaggleLogo } from "@/components/ui/brand-icons";

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export function CertificateModal({
  certificate,
  onClose,
  onShowToast,
}: CertificateModalProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Reset copied indicators when modal opens or certificate changes
  React.useEffect(() => {
    setCopiedLink(false);
    setCopiedId(false);
    setIsExpanded(false);
  }, [certificate]);

  // Handle escape key and disable background scroll
  React.useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [certificate, isExpanded, onClose]);

  if (!certificate) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificate.verifyUrl);
      setCopiedLink(true);
      onShowToast("Ссылка для проверки подлинности скопирована");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      onShowToast(`Ссылка: ${certificate.verifyUrl}`);
    }
  };

  const handleCopyId = async () => {
    if (!certificate.credentialId) return;
    try {
      await navigator.clipboard.writeText(certificate.credentialId);
      setCopiedId(true);
      onShowToast(`ID скопирован: ${certificate.credentialId}`);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      onShowToast(`ID: ${certificate.credentialId}`);
    }
  };

  const renderIssuerLogo = (logo: Certificate["issuerLogo"]) => {
    switch (logo) {
      case "google":
        return <GoogleCloudLogo className="h-5 w-5" />;
      case "ibm":
        return <IbmLogo className="h-3.5 w-8 text-[#0062ff]" />;
      case "kaggle":
        return <KaggleLogo className="h-5 w-5 text-[#20beff]" />;
      default:
        return <Award className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={`relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#091811]/95 text-white shadow-[0_0_50px_rgba(34,197,94,0.25)] backdrop-blur-2xl flex flex-col ${
            isExpanded ? "max-w-6xl max-h-[96vh]" : ""
          }`}
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-900/60 bg-[#091811]/90 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-800/60">
                {renderIssuerLogo(certificate.issuerLogo)}
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                  {certificate.title}
                </h2>
                <p className="text-xs font-mono text-emerald-400/80 truncate">
                  {certificate.issuer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors"
                title={isExpanded ? "Свернуть просмотр" : "Развернуть просмотр"}
                aria-label="Переключить размер окна"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors"
                title="Закрыть (Esc)"
                aria-label="Закрыть окно"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Modal Body */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Certificate Cover Display */}
            <div className="relative group rounded-2xl overflow-hidden border border-emerald-800/50 bg-[#050f0b] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center p-4 sm:p-8">
              {/* Decorative radial lighting */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-60"
              />

              <div className="relative max-h-[380px] sm:max-h-[460px] w-full flex items-center justify-center">
                <img
                  src={certificate.imageUrl}
                  alt={`Обложка сертификата ${certificate.title}`}
                  className="max-h-[360px] sm:max-h-[440px] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="eager"
                />
              </div>

              {/* Verified Ribbon Badge */}
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 shadow-[0_0_15px_rgba(34,197,94,0.35)] backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Verification Action Bar */}
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-[#0b2419]/80 to-emerald-950/70 p-5 shadow-[0_0_30px_rgba(34,197,94,0.15)] backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-base">
                      Проверка подлинности сертификата
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/70">
                    Официальная запись в государственном или корпоративном реестре аккредитации
                  </p>
                </div>

                {/* Primary Verification Link */}
                <a
                  href={certificate.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_28px_rgba(74,222,128,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0"
                >
                  <span>Проверить подлинность</span>
                  <ExternalLink className="h-4 w-4 stroke-[2.5]" />
                </a>
              </div>

              {/* Secondary Actions & Direct Link Copying */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-900/60 text-xs">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                  <span>{copiedLink ? "Ссылка скопирована!" : "Скопировать ссылку для проверки"}</span>
                </button>

                {/* Optional PDF Download Link */}
                {certificate.pdfUrl && (
                  <a
                    href={certificate.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                  >
                    <FileDown className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Оригинал документа (PDF)</span>
                  </a>
                )}

                {/* Secondary Portal Link (e.g. IBM Skills Portal) */}
                {certificate.secondaryVerifyUrl && (
                  <a
                    href={certificate.secondaryVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{certificate.secondaryVerifyLabel || "Внутренний реестр"}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Certificate Details & Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metadata Card */}
              <div className="rounded-2xl border border-emerald-900/40 bg-[#0b1c14]/60 p-5 space-y-3.5 backdrop-blur-sm text-xs sm:text-sm">
                <div className="font-semibold text-white flex items-center gap-2 pb-1 border-b border-emerald-900/50">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Сведения о выдаче</span>
                </div>

                <div className="space-y-2 text-emerald-100/90">
                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Кому выдан:</span>
                    <span className="font-mono font-medium text-white">
                      {certificate.recipient}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Организация:</span>
                    <span className="font-medium text-white">{certificate.issuer}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Дата получения:</span>
                    <span className="flex items-center gap-1 font-mono text-white">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                      {certificate.issueDate}
                    </span>
                  </div>

                  {certificate.credentialId && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-emerald-400/70">ID документа:</span>
                      <button
                        onClick={handleCopyId}
                        className="inline-flex items-center gap-1 font-mono text-xs text-emerald-300 hover:text-white bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60 hover:border-emerald-500/50 transition-colors"
                        title="Нажмите, чтобы скопировать ID"
                      >
                        {certificate.credentialId}
                        {copiedId ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-emerald-400/70" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills and Competencies */}
              <div className="rounded-2xl border border-emerald-900/40 bg-[#0b1c14]/60 p-5 space-y-3.5 backdrop-blur-sm">
                <div className="font-semibold text-white flex items-center gap-2 pb-1 border-b border-emerald-900/50 text-xs sm:text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Подтвержденные навыки</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-xs text-emerald-200/80 leading-relaxed font-normal">
                  {certificate.description}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-emerald-900/60 bg-[#071710]/80 px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400/60">
              {certificate.orderNumber} / 05 • {certificate.title}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CertificateModal;
