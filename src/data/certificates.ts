export interface Certificate {
  id: string;
  orderNumber: string;
  title: string;
  subtitle: string;
  issuer: string;
  issuerLogo: "google" | "ibm" | "kaggle";
  issueDate: string;
  credentialId?: string;
  verifyUrl: string;
  secondaryVerifyUrl?: string;
  secondaryVerifyLabel?: string;
  imageUrl: string;
  pdfUrl?: string;
  skills: string[];
  description: string;
  recipient: string;
}

export const certificates: Certificate[] = [
  {
    id: "google-intro-genai",
    orderNumber: "01",
    title: "Introduction to Generative AI",
    subtitle: "Официальный сертификационный бейдж Google Cloud",
    issuer: "Google Cloud Skills Boost",
    issuerLogo: "google",
    issueDate: "17 октября 2026 г.",
    credentialId: "28934995",
    verifyUrl:
      "https://www.skills.google/public_profiles/ff0cb930-aafd-45ad-ba31-a8d58aa189a2/badges/28934995",
    imageUrl: "./certificates/google-intro-genai.png",
    pdfUrl: "./certificates/google-intro-genai.pdf",
    skills: ["Generative AI", "Deep Learning", "Google Cloud", "AI Ethics"],
    description:
      "Курс знакомит с основами генеративного искусственного интеллекта, объясняет концепции GenAI, сценарии практического применения и ключевые различия с классическим машинным обучением, а также принципы ответственного ИИ Google.",
    recipient: "Yabl1ch GOOGLEUSER",
  },
  {
    id: "google-intro-llm",
    orderNumber: "02",
    title: "Introduction to Large Language Models",
    subtitle: "Основы больших языковых моделей и промпт-инжиниринга",
    issuer: "Google Cloud Skills Boost",
    issuerLogo: "google",
    issueDate: "18 октября 2026 г.",
    credentialId: "28935144",
    verifyUrl:
      "https://www.skills.google/public_profiles/ff0cb930-aafd-45ad-ba31-a8d58aa189a2/badges/28935144",
    imageUrl: "./certificates/google-intro-llm.png",
    pdfUrl: "./certificates/google-intro-llm.pdf",
    skills: ["Large Language Models", "NLP", "Prompt Tuning", "Transformers"],
    description:
      "Фундаментальный курс по архитектуре больших языковых моделей (LLM), сценариям их использования и методам настройки промптов (Prompt Tuning) для решения прикладных инженерных задач.",
    recipient: "Yabl1ch GOOGLEUSER",
  },
  {
    id: "google-responsible-ai",
    orderNumber: "03",
    title: "Responsible AI: Applying AI Principles",
    subtitle: "Принципы этичного, безопасного и прозрачного ИИ",
    issuer: "Google Cloud Skills Boost",
    issuerLogo: "google",
    issueDate: "18 октября 2026 г.",
    credentialId: "28935156",
    verifyUrl:
      "https://www.skills.google/public_profiles/ff0cb930-aafd-45ad-ba31-a8d58aa189a2/badges/28935156",
    imageUrl: "./certificates/google-responsible-ai.png",
    pdfUrl: "./certificates/google-responsible-ai.pdf",
    skills: ["Responsible AI", "AI Ethics", "Bias Mitigation", "Safety & Fairness"],
    description:
      "Практический курс по внедрению 7 этических принципов Google в реальные проекты искусственного интеллекта, защите персональных данных, снижению предвзятости и обеспечению надежности моделей.",
    recipient: "Yabl1ch GOOGLEUSER",
  },
  {
    id: "ibm-ai-fundamentals",
    orderNumber: "04",
    title: "Artificial Intelligence Fundamentals",
    subtitle: "Профессиональная квалификация IBM SkillsBuild & Credly",
    issuer: "IBM SkillsBuild & Credly",
    issuerLogo: "ibm",
    issueDate: "18 октября 2026 г.",
    credentialId: "PLAN-7913EE1DB030",
    verifyUrl:
      "https://www.credly.com/org/ibm-skillsbuild/badge/artificial-intelligence-fundamentals",
    secondaryVerifyUrl:
      "https://skills.yourlearning.ibm.com/credential/CREDLY-29bdaec3-af04-458e-a70e-2e6fa78c5dd5",
    secondaryVerifyLabel: "IBM Skills Portal",
    imageUrl: "./certificates/ibm-ai-fundamentals.png",
    pdfUrl: "./certificates/ibm-ai-fundamentals.pdf",
    skills: ["AI Fundamentals", "Machine Learning", "Neural Networks", "NLP", "Cognitive Systems"],
    description:
      "Квалификационная программа IBM SkillsBuild, подтвержденная бейджем Credly. Охватывает 6 ключевых модулей: история развития ИИ, машинное обучение, глубокие нейросети, обработка естественного языка и этика автономных систем.",
    recipient: "Yabl1ch (Максим)",
  },
  {
    id: "kaggle-ai-ethics",
    orderNumber: "05",
    title: "Intro to AI Ethics",
    subtitle: "Сертификат о прохождении курса по этике и справедливости ИИ",
    issuer: "Kaggle Learn",
    issuerLogo: "kaggle",
    issueDate: "18 октября 2026 г.",
    credentialId: "yabl1ch/intro-to-ai-ethics",
    verifyUrl: "https://www.kaggle.com/learn/certification/yabl1ch/intro-to-ai-ethics",
    imageUrl: "./certificates/kaggle-ai-ethics.png",
    pdfUrl: "./certificates/kaggle-ai-ethics.pdf",
    skills: ["AI Fairness", "Model Card Toolkit", "Mitigating Bias", "Data Ethics"],
    description:
      "Сертификация от Kaggle Learn по оценке и устранению предвзятости в моделях машинного обучения, документированию архитектуры через Model Cards и принципам ответственной работы с обучающими данными.",
    recipient: "Yabl1ch",
  },
];
