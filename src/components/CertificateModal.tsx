import * as React from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  FileDown,
  Calendar,
  Award,
} from "lucide-react";
import type { Certificate } from "@/data/certificates";
import { GoogleCloudLogo, IbmLogo, KaggleLogo } from "@/components/ui/brand-icons";
import { useTopLayerDialog } from "@/lib/dialog";

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
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [renderedCert, setRenderedCert] = React.useState<Certificate | null>(certificate);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState(false);

  React.useEffect(() => {
    if (certificate) {
      setRenderedCert(certificate);
      setCopiedLink(false);
      setCopiedId(false);
    }
  }, [certificate]);

  const handleDialogClosed = React.useCallback(() => {
    setRenderedCert(null);
    onClose();
  }, [onClose]);

  const { requestClose } = useTopLayerDialog(
    dialogRef,
    Boolean(certificate),
    handleDialogClosed
  );

  const activeData = certificate ?? renderedCert;

  const handleCopyLink = async () => {
    if (!activeData) return;
    try {
      await navigator.clipboard.writeText(activeData.verifyUrl);
      setCopiedLink(true);
      onShowToast("Ссылка для проверки подлинности скопирована");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.warn("Verification link copy failed", { certificateId: activeData.id, error });
      onShowToast(`Ссылка: ${activeData.verifyUrl}`);
    }
  };

  const handleCopyId = async () => {
    if (!activeData?.credentialId) return;
    try {
      await navigator.clipboard.writeText(activeData.credentialId);
      setCopiedId(true);
      onShowToast(`ID скопирован: ${activeData.credentialId}`);
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      console.warn("Credential ID copy failed", { certificateId: activeData.id, error });
      onShowToast(`ID: ${activeData.credentialId}`);
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
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="certificate-modal-title"
      data-lenis-prevent
      className="portfolio-dialog m-auto w-[calc(100%-1rem)] sm:w-[calc(100%-3rem)] max-w-4xl max-h-[92dvh] sm:max-h-[92vh] overflow-y-auto scroll-smooth rounded-2xl border border-emerald-500/40 bg-[#091811]/95 text-white shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_36px_rgba(34,197,94,0.22)] backdrop-blur-xl open:flex flex-col transform-gpu origin-center p-0"
    >
      {activeData && (
        <>
          {/* Header Bar (solid/translucent without nested backdrop-filter) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-900/60 bg-[#091811]/95 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950/80 border border-emerald-800/60">
                {renderIssuerLogo(activeData.issuerLogo)}
              </div>
              <div className="min-w-0">
                <h1 id="certificate-modal-title" className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                  {activeData.title}
                </h1>
                <p className="text-xs font-mono text-emerald-400/80 truncate">
                  {activeData.issuer}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                autoFocus
                onClick={requestClose}
                className="rounded-lg p-2 text-emerald-300/70 hover:bg-emerald-900/40 hover:text-emerald-200 transition-colors cursor-pointer"
                title="Закрыть (Esc)"
                aria-label="Закрыть окно"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Modal Body */}
          <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
            {/* Certificate Cover Display */}
            <div className="relative group rounded-2xl overflow-hidden border border-emerald-800/50 bg-[#050f0b] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center p-4 sm:p-8">
              {/* Decorative radial lighting */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14),transparent_70%)] opacity-80"
              />

              <div className="relative max-h-[380px] sm:max-h-[460px] w-full flex items-center justify-center">
                <img
                  src={activeData.imageUrl}
                  alt={`Обложка сертификата ${activeData.title}`}
                  width={640}
                  height={480}
                  className="max-h-[360px] sm:max-h-[440px] max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="eager"
                  decoding="async"
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
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-[#0b2419]/80 to-emerald-950/70 p-5 shadow-[0_0_30px_rgba(34,197,94,0.15)] space-y-4">
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
                  href={activeData.verifyUrl}
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
                  type="button"
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
                {activeData.pdfUrl && (
                  <a
                    href={activeData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                  >
                    <FileDown className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Оригинал документа (PDF)</span>
                  </a>
                )}

                {/* Secondary Portal Link (e.g. IBM Skills Portal) */}
                {activeData.secondaryVerifyUrl && (
                  <a
                    href={activeData.secondaryVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900/60 hover:border-emerald-500/50 text-emerald-300 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{activeData.secondaryVerifyLabel || "Внутренний реестр"}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Certificate Details & Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metadata Card */}
              <div className="rounded-2xl border border-emerald-900/40 bg-[#0b1c14]/60 p-5 space-y-3.5 text-xs sm:text-sm">
                <div className="font-semibold text-white flex items-center gap-2 pb-1 border-b border-emerald-900/50">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>Сведения о выдаче</span>
                </div>

                <div className="space-y-2 text-emerald-100/90">
                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Кому выдан:</span>
                    <span className="font-mono font-medium text-white">
                      {activeData.recipient}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Организация:</span>
                    <span className="font-medium text-white">{activeData.issuer}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-emerald-950/70">
                    <span className="text-emerald-400/70">Дата получения:</span>
                    <span className="flex items-center gap-1 font-mono text-white">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                      {activeData.issueDate}
                    </span>
                  </div>

                  {activeData.credentialId && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-emerald-400/70">ID документа:</span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="inline-flex items-center gap-1 font-mono text-xs text-emerald-300 hover:text-white bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60 hover:border-emerald-500/50 transition-colors cursor-pointer"
                        title="Нажмите, чтобы скопировать ID"
                      >
                        {activeData.credentialId}
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
              <div className="rounded-2xl border border-emerald-900/40 bg-[#0b1c14]/60 p-5 space-y-3.5">
                <div className="font-semibold text-white flex items-center gap-2 pb-1 border-b border-emerald-900/50 text-xs sm:text-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Подтвержденные навыки</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {activeData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-2 text-xs text-emerald-200/80 leading-relaxed font-normal">
                  {activeData.description}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-emerald-900/60 bg-[#071710]/90 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400/60">
              {activeData.orderNumber} / 05 • {activeData.title}
            </span>
            <button
              type="button"
              onClick={requestClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

export default CertificateModal;
