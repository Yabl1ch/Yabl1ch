import type { TabType } from "@/components/TabNavigation";
import type { Certificate } from "@/data/certificates";
import type { Project } from "@/data/projects";
import { certificates } from "@/data/certificates";
import { projects } from "@/data/projects";

const prewarmedUrls = new Set<string>();

export function prewarmImage(url?: string): void {
  if (!url || typeof window === "undefined" || prewarmedUrls.has(url)) return;
  prewarmedUrls.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

export function prewarmTabImages(tab: TabType): void {
  if (tab === "work") {
    projects.forEach((p) => prewarmImage(p.thumbImage || p.coverImage));
  } else if (tab === "certificates") {
    certificates.forEach((c) => prewarmImage(c.thumbImage || c.imageUrl));
  }
}

export function prewarmProjectGallery(project: Project): void {
  prewarmImage(project.coverImage);
  project.images.forEach((img) => prewarmImage(img.url));
}

export function prewarmCertificateFull(certificate: Certificate): void {
  prewarmImage(certificate.imageUrl);
}
