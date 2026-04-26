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
  { label: "Today", href: "/today" },
  { label: "Listen", href: "/listen" },
  { label: "Words", href: "/words" },
  { label: "Speak", href: "/speak" },
  { label: "Review", href: "/review" },
  { label: "Stats", href: "/stats" },
  { label: "Settings", href: "/settings" },
];
