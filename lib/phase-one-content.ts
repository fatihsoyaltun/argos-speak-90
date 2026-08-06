export type FlowStep = {
  order: string;
  label: string;
  href: string;
  time: string;
  description: string;
};

export const dailyFlow: FlowStep[] = [
  {
    order: "01",
    label: "Listen",
    href: "/listen",
    time: "3 min",
    description: "Hear natural English before trying to produce it.",
  },
  {
    order: "02",
    label: "Repeat",
    href: "/listen",
    time: "3 min",
    description: "Say the key lines out loud until they feel familiar.",
  },
  {
    order: "03",
    label: "Words",
    href: "/words",
    time: "2 min",
    description: "Use a small set of practical words in context.",
  },
  {
    order: "04",
    label: "Speak",
    href: "/speak",
    time: "3 min",
    description: "Answer simple prompts with your own voice.",
  },
  {
    order: "05",
    label: "Review",
    href: "/review",
    time: "1 min",
    description: "Close the session by repeating the useful parts.",
  },
];

export const navigationItems = [
  { label: "Bugün", href: "/today" },
  { label: "Pratik", href: "/practice" },
  { label: "Device Lab", href: "/device-lab" },
  { label: "İlerleme", href: "/stats" },
  { label: "Ayarlar", href: "/settings" },
];

export const practiceAreas = [
  {
    label: "Listen",
    href: "/listen",
    description: "Günün İngilizce metnini dinle ve kısa cevabını yaz.",
  },
  {
    label: "Words",
    href: "/words",
    description: "Günün kelimelerini örnekleriyle çalış.",
  },
  {
    label: "Speak",
    href: "/speak",
    description: "Hedef soruya iki kısa denemeyle cevap ver.",
  },
  {
    label: "Review",
    href: "/review",
    description: "Kısa kontrollerle günün içeriğini tekrar et.",
  },
  {
    label: "Journal",
    href: "/journal",
    description: "Kaydettiğin cevapları ve günlük notlarını gör.",
  },
] as const;
