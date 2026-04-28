import { phaseEightDayPlans } from "./phase-eight-content";
import { phaseSevenDayPlans } from "./phase-seven-content";

export type DayPlan = {
  day: number;
  theme: string;
  speakingGoal: string;
};

export const learningTrackPlan: DayPlan[] = [
  {
    day: 1,
    theme: "Morning check-in and daily flow",
    speakingGoal: "Talk about the start of your day with first, then, and after work.",
  },
  {
    day: 2,
    theme: "Natural self-introduction",
    speakingGoal: "Introduce yourself with city, work or study, and one personal detail.",
  },
  {
    day: 3,
    theme: "Weekday routine",
    speakingGoal: "Describe a normal day in a clear order.",
  },
  {
    day: 4,
    theme: "Simple preferences",
    speakingGoal: "Say what you like, do not like, and prefer.",
  },
  {
    day: 5,
    theme: "Work, study, and responsibility",
    speakingGoal: "Explain what you do and why English matters to you.",
  },
  {
    day: 6,
    theme: "Basic questions and answers",
    speakingGoal: "Ask short questions and answer with one useful detail.",
  },
  {
    day: 7,
    theme: "Plans and intentions",
    speakingGoal: "Talk about a plan with going to, want to, and need to.",
  },
  {
    day: 8,
    theme: "Simple past experiences",
    speakingGoal: "Describe something that happened yesterday or recently.",
  },
  {
    day: 9,
    theme: "Problem and solution",
    speakingGoal: "Explain a small problem and how it was solved.",
  },
  {
    day: 10,
    theme: "Polite help requests",
    speakingGoal: "Ask for help clearly and politely.",
  },
  {
    day: 11,
    theme: "Simple opinions",
    speakingGoal: "Give an opinion and one reason.",
  },
  {
    day: 12,
    theme: "Describing places",
    speakingGoal: "Describe a place with location and details.",
  },
  {
    day: 13,
    theme: "Short messages",
    speakingGoal: "Leave a clear message about a meeting or plan.",
  },
  {
    day: 14,
    theme: "Two-week confidence check",
    speakingGoal: "Talk about progress, mistakes, and the next speaking goal.",
  },
  ...phaseSevenDayPlans,
  ...phaseEightDayPlans,
];

export const firstFourteenDayPlan = learningTrackPlan;
