export interface ProjectImage {
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  orderNumber: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  images: ProjectImage[];
  tags: string[];
  features?: string[];
}

export const projects: Project[] = [
  {
    id: "mudro-hub",
    orderNumber: "01",
    title: "MudroHub",
    subtitle: "Локальный защищенный мессенджер с медиатекой и мини-играми",
    description:
      "MudroHub — локальный мессенджер, рассчитанный на 6 человек и разработанный всего за 2 дня мною. В нём предусмотрены как общий чат для всех участников, так и личные диалоги. В сервис также встроены общая медиатека, аудиоплеер и подборка мини-игр. Все сообщения защищены сквозным шифрованием (E2EE), а сам проект написан на TypeScript.",
    coverImage: "./projects/mudro-hub/General_chat.png",
    images: [
      {
        url: "./projects/mudro-hub/General_chat.png",
        caption: "Общий чат для всех участников с поддержкой E2EE шифрования",
      },
      {
        url: "./projects/mudro-hub/Private_chats.png",
        caption: "Личные конфиденциальные диалоги между пользователями",
      },
      {
        url: "./projects/mudro-hub/Media_Library.png",
        caption: "Общая медиатека для загрузки и просмотра файлов и изображений",
      },
      {
        url: "./projects/mudro-hub/Audio_player.png",
        caption: "Встроенный аудиоплеер с совместным воспроизведением треков",
      },
      {
        url: "./projects/mudro-hub/Mini_games.png",
        caption: "Подборка интерактивных мини-игр для компании",
      },
    ],
    tags: [
      "TypeScript",
      "E2EE Encryption",
      "WebSockets",
      "Local Messenger",
      "Audio Player",
      "Mini Games",
    ],
    features: [
      "Разработан всего за 2 дня",
      "Сквозное шифрование сообщений (E2EE)",
      "Общий групповой чат и приватные диалоги",
      "Встроенная общая медиатека",
      "Аудиоплеер для совместного прослушивания",
      "Коллекция мини-игр прямо в клиенте",
    ],
  },
  {
    id: "glyph-master",
    orderNumber: "02",
    title: "Glyph Master",
    subtitle: "Векторный редактор и компилятор шрифтов",
    description:
      "Glyph Master — разработанное мной приложение для создания шрифтов с поддержкой русской и английской раскладок, работающее локально. Оно оснащено богатой палитрой векторных инструментов, а также поддерживает автоматическую компиляцию в форматы TTF, OTF и WOFF2 с возможностью выгрузки в общий ZIP-архив.",
    coverImage: "./projects/glyph-master/Landing.png",
    images: [
      {
        url: "./projects/glyph-master/Landing.png",
        caption: "Главная рабочая область и полотно векторного редактирования глифов",
      },
      {
        url: "./projects/glyph-master/Backend.png",
        caption: "Конвейер сборки и генерации шрифтовых файлов TTF, OTF и WOFF2",
      },
    ],
    tags: [
      "Font Editor",
      "Vector Tools",
      "TTF / OTF / WOFF2",
      "ZIP Export",
      "Cyrillic & Latin",
    ],
    features: [
      "Полная поддержка русской и английской раскладок",
      "Локальная обработка и векторный редактор контуров",
      "Автоматическая компиляция в TTF, OTF, WOFF2",
      "Экспорт готового пакета шрифтов в ZIP-архив",
    ],
  },
  {
    id: "yabl1ch-voice",
    orderNumber: "03",
    title: "Yabl1chVoice",
    subtitle: "Аналог Clownfish Voice Changer на PyQt6 и DSP",
    description:
      "Yabl1chVoice — это разработаный мною аналог Clownfish Voice Changer. Оно было написано на базе PyQt6 и низколатентного аудиодвижка DSP.",
    coverImage: "./projects/yabl1ch-voice/main.png",
    images: [
      {
        url: "./projects/yabl1ch-voice/main.png",
        caption: "Интерфейс изменения голоса в реальном времени с выбором DSP пресетов",
      },
    ],
    tags: [
      "Python",
      "PyQt6",
      "DSP Engine",
      "Low-Latency Audio",
      "Voice Changer",
    ],
    features: [
      "Аналог популярного решения Clownfish",
      "Низколатентный аудиодвижок (DSP)",
      "Интуитивный графический интерфейс на PyQt6",
      "Обработка аудиопотока в реальном времени",
    ],
  },
  {
    id: "ai-vibe-designer",
    orderNumber: "04",
    title: "AI Vibe Designer (Aura Studio)",
    subtitle: "Генератор дизайн-систем и промптов на базе LLM",
    description:
      "AI Vibe Designer (Aura Studio) — разработанное мной веб-приложение, позволяющее с помощью API любой LLM-модели составить полноценный профиль дизайна со всеми цветами и шрифтами, а затем скопировать готовый промпт.",
    coverImage: "./projects/ai-vibe-designer/main.png",
    images: [
      {
        url: "./projects/ai-vibe-designer/main.png",
        caption: "Генерация дизайн-профиля с гармоничными цветами, типографикой и экспортом промпта",
      },
    ],
    tags: [
      "AI / LLM API",
      "Design Systems",
      "Color Palettes",
      "Typography",
      "Prompt Export",
    ],
    features: [
      "Интеграция с API любой LLM модели",
      "Составление целостного визуального профиля",
      "Подбор гармоничных шрифтовых пар и цветов",
      "Быстрое копирование готового промпта для разработки",
    ],
  },
];
