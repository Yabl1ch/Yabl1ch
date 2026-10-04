export interface SocialLink {
  id: "telegram" | "github" | "discord";
  title: string;
  handle: string;
  description: string;
  avatarUrl: string;
  url?: string;
  copyValue?: string;
  copyLabel?: string;
  isExternal?: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    id: "telegram",
    title: "Telegram",
    handle: "@Yabl1ch",
    description: "Личные сообщения и связь для сотрудничества",
    avatarUrl: "./socials/telegram_avatar.jpg",
    url: "https://t.me/Yabl1ch",
    isExternal: true,
  },
  {
    id: "github",
    title: "GitHub",
    handle: "Yabl1ch",
    description: "Репозитории, исходный код и открытые проекты",
    avatarUrl: "./socials/github_avatar.png",
    url: "https://github.com/Yabl1ch",
    isExternal: true,
  },
  {
    id: "discord",
    title: "Discord",
    handle: "yabl1ch",
    description: "ID: 800254982641025056 (нажмите, чтобы скопировать)",
    avatarUrl: "./socials/discord_avatar.png",
    copyValue: "yabl1ch",
    copyLabel: "Discord ник yabl1ch",
    isExternal: false,
  },
];
