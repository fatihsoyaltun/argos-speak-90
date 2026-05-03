import { phaseEightReviewDrills } from "./phase-eight-content";
import { phaseSevenReviewDrills } from "./phase-seven-content";

export type ReviewItemType = "recall" | "fillBlank" | "shortAnswer";

export type ReviewItem = {
  prompt: string;
  expectedAnswer: string;
  type: ReviewItemType;
};

export type ReviewDrill = {
  day: number;
  title: string;
  shortIntroTr: string;
  reviewItems: ReviewItem[];
};

function buildProductionReviewItem(day: number, title: string): ReviewItem {
  const lowerTitle = title.toLowerCase();

  if ([14, 42, 70, 90].includes(day)) {
    return {
      type: "shortAnswer",
      prompt:
        "Write 1 personal milestone sentence: mention one weak point and one next speaking goal.",
      expectedAnswer:
        "I still pause sometimes, but my next goal is to speak more clearly.",
    };
  }

  if (lowerTitle.includes("clarification")) {
    return {
      type: "shortAnswer",
      prompt: "Ask one natural clarification question in your own words.",
      expectedAnswer: "Could you clarify that?",
    };
  }

  if (lowerTitle.includes("misunderstanding")) {
    return {
      type: "shortAnswer",
      prompt: "Correct a misunderstanding with: What I meant was...",
      expectedAnswer: "What I meant was that I need one more detail.",
    };
  }

  if (
    lowerTitle.includes("problem") ||
    lowerTitle.includes("complaint") ||
    lowerTitle.includes("mistake") ||
    lowerTitle.includes("issue")
  ) {
    return {
      type: "shortAnswer",
      prompt: "Write one sentence explaining the main issue in your own words.",
      expectedAnswer: "The main issue is that I need more time.",
    };
  }

  if (
    lowerTitle.includes("opinion") ||
    lowerTitle.includes("recommend") ||
    lowerTitle.includes("feedback")
  ) {
    return {
      type: "shortAnswer",
      prompt: "Give one soft opinion and add a short reason.",
      expectedAnswer: "I may be wrong, but I think this is a good option.",
    };
  }

  if (
    lowerTitle.includes("plan") ||
    lowerTitle.includes("schedule") ||
    lowerTitle.includes("appointment") ||
    lowerTitle.includes("meeting")
  ) {
    return {
      type: "shortAnswer",
      prompt: "Write one sentence suggesting a clear next step.",
      expectedAnswer: "The next step is to set a time for the meeting.",
    };
  }

  if (day >= 71) {
    return {
      type: "shortAnswer",
      prompt:
        "Summarize the idea in your own words and add one realistic next step.",
      expectedAnswer:
        "In other words, I need a clear plan and one practical next step.",
    };
  }

  if (day >= 43) {
    return {
      type: "shortAnswer",
      prompt: "Rewrite the idea in your own words and add one reason.",
      expectedAnswer: "To be more specific, this helps me stay focused.",
    };
  }

  if (day >= 15) {
    return {
      type: "shortAnswer",
      prompt: "Write one personal sentence using a phrase from today's lesson.",
      expectedAnswer: "I need to make a plan before I start.",
    };
  }

  return {
    type: "shortAnswer",
    prompt: "Write one personal sentence with today's target language.",
    expectedAnswer: "I want to practice a little every day.",
  };
}

function withProductionReviewItem(drill: ReviewDrill): ReviewDrill {
  const productionItem = buildProductionReviewItem(drill.day, drill.title);
  const reviewItems =
    drill.reviewItems.length >= 4
      ? [...drill.reviewItems.slice(0, 3), productionItem]
      : [...drill.reviewItems, productionItem];

  return {
    ...drill,
    reviewItems,
  };
}

const baseReviewDrills: ReviewDrill[] = [
  {
    day: 1,
    title: "Day 1 Review: Morning and Routine",
    shortIntroTr:
      "Cevabı önce hatırlamaya çalış. Sonra kısa yaz ve kontrol et. Amaç ezber değil; bugün kullandığın İngilizceyi geri çağırmak.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "First, I need a ____.",
        expectedAnswer: "coffee",
      },
      {
        type: "recall",
        prompt: "Write the line that starts with: I have a busy day...",
        expectedAnswer: "I have a busy day, but I want to start slowly.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you have at nine?",
        expectedAnswer: "I have a short meeting at nine.",
      },
      {
        type: "fillBlank",
        prompt: "After work, I want to ____ for twenty minutes.",
        expectedAnswer: "walk",
      },
    ],
  },
  {
    day: 2,
    title: "Day 2 Review: Introduction",
    shortIntroTr:
      "Kendini tanıtma cümlelerini hatırla. Kısa ve doğal cevap yeterli.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "My name ____ Deniz.",
        expectedAnswer: "is",
      },
      {
        type: "recall",
        prompt: "Write a sentence with: I live in...",
        expectedAnswer: "I live in Istanbul.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you do every day for English?",
        expectedAnswer: "I practice a little every day.",
      },
    ],
  },
  {
    day: 3,
    title: "Day 3 Review: Weekday Routine",
    shortIntroTr:
      "Rutin cümlelerinde sırayı koru. Sabah, yol ve akşamı hatırla.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I usually wake up ____ seven.",
        expectedAnswer: "around",
      },
      {
        type: "recall",
        prompt: "Write the sentence about the metro.",
        expectedAnswer: "I take the metro to work.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you do in the evening?",
        expectedAnswer: "I study English for ten minutes.",
      },
    ],
  },
  {
    day: 4,
    title: "Day 4 Review: Preferences",
    shortIntroTr:
      "Tercih cümlelerini geri çağır. Like, prefer ve choose yapılarını kullan.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I do not like ____.",
        expectedAnswer: "rushing",
      },
      {
        type: "recall",
        prompt: "Write a sentence with: I prefer...",
        expectedAnswer: "I prefer tea when I work at home.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you like?",
        expectedAnswer: "I like quiet mornings.",
      },
    ],
  },
  {
    day: 5,
    title: "Day 5 Review: Work and Study",
    shortIntroTr:
      "İş, sorumluluk ve güven cümlelerini hatırla. Cevapların kısa olabilir.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I need to stay clear and ____.",
        expectedAnswer: "patient",
      },
      {
        type: "recall",
        prompt: "Write the sentence about customers.",
        expectedAnswer: "I work with customers during the day.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: Why do you study English?",
        expectedAnswer: "I want to speak more confidently in meetings.",
      },
    ],
  },
  {
    day: 6,
    title: "Day 6 Review: Questions",
    shortIntroTr:
      "Basit soruları hatırla. Konuşmayı devam ettirecek kısa cevaplar yaz.",
    reviewItems: [
      {
        type: "recall",
        prompt: "Write the question about where someone lives.",
        expectedAnswer: "Where do you live?",
      },
      {
        type: "recall",
        prompt: "Write the question about someone's work.",
        expectedAnswer: "What do you do?",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: How is your day going?",
        expectedAnswer: "My day is busy, but it is fine.",
      },
    ],
  },
  {
    day: 7,
    title: "Day 7 Review: Plans",
    shortIntroTr:
      "Plan cümlelerinde going to, want to ve need to yapılarını hatırla.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I am going to ____ my parents.",
        expectedAnswer: "visit",
      },
      {
        type: "recall",
        prompt: "Write the sentence with: I want to leave...",
        expectedAnswer: "I want to leave early.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you need to buy?",
        expectedAnswer: "I need to buy a small gift.",
      },
    ],
  },
  {
    day: 8,
    title: "Day 8 Review: Past Experience",
    shortIntroTr:
      "Geçmiş zaman cümlelerini hatırla. Dün olan bir şeyi sade anlat.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "Yesterday was simple but ____.",
        expectedAnswer: "nice",
      },
      {
        type: "recall",
        prompt: "Write the sentence about finishing work.",
        expectedAnswer: "I finished work a little late.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What did you order?",
        expectedAnswer: "I ordered dinner at home.",
      },
    ],
  },
  {
    day: 9,
    title: "Day 9 Review: Problem and Solution",
    shortIntroTr:
      "Problem, yardım ve çözüm cümlelerini kısa şekilde geri çağır.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "My phone battery was almost ____.",
        expectedAnswer: "dead",
      },
      {
        type: "recall",
        prompt: "Write the sentence about asking for help.",
        expectedAnswer: "I asked my coworker for help.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What could you not find?",
        expectedAnswer: "I could not find my charger.",
      },
    ],
  },
  {
    day: 10,
    title: "Day 10 Review: Asking for Help",
    shortIntroTr:
      "Kibar yardım isteme cümlelerini hatırla. Could you yapısını kullan.",
    reviewItems: [
      {
        type: "recall",
        prompt: "Write the polite question with: help me for a minute.",
        expectedAnswer: "Could you help me for a minute?",
      },
      {
        type: "fillBlank",
        prompt: "I am not ____ where it is.",
        expectedAnswer: "sure",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What are you trying to find?",
        expectedAnswer: "I am trying to find the meeting room.",
      },
    ],
  },
  {
    day: 11,
    title: "Day 11 Review: Opinions",
    shortIntroTr:
      "Fikir ve sebep cümlelerini hatırla. Kısa bir reason ekle.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I think short practice is ____ for me.",
        expectedAnswer: "better",
      },
      {
        type: "recall",
        prompt: "Write the sentence about pressure.",
        expectedAnswer: "I feel less pressure.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: Why do you prefer short practice?",
        expectedAnswer: "I can do it every day.",
      },
    ],
  },
  {
    day: 12,
    title: "Day 12 Review: Places",
    shortIntroTr:
      "Bir yeri anlatan cümleleri hatırla. There is ve it is yapılarını kullan.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "There is a small cafe ____ my office.",
        expectedAnswer: "near",
      },
      {
        type: "recall",
        prompt: "Write the sentence about the staff.",
        expectedAnswer: "The staff are friendly.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: Where do you usually sit?",
        expectedAnswer: "I usually sit by the window.",
      },
    ],
  },
  {
    day: 13,
    title: "Day 13 Review: Short Messages",
    shortIntroTr:
      "Kısa mesaj dilini hatırla. Konu, gecikme ve rica cümlelerini kullan.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "I may be ten minutes ____.",
        expectedAnswer: "late",
      },
      {
        type: "recall",
        prompt: "Write the sentence with: Please start...",
        expectedAnswer: "Please start without me if needed.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What are you calling about?",
        expectedAnswer: "I am calling about our meeting tomorrow.",
      },
    ],
  },
  {
    day: 14,
    title: "Day 14 Review: Confidence Check",
    shortIntroTr:
      "İki haftalık gelişimi hatırla. Before, now ve next week fikrini bağla.",
    reviewItems: [
      {
        type: "fillBlank",
        prompt: "Now I can introduce ____.",
        expectedAnswer: "myself",
      },
      {
        type: "recall",
        prompt: "Write the sentence about mistakes and continuing.",
        expectedAnswer: "I still make mistakes, but I can keep going.",
      },
      {
        type: "shortAnswer",
        prompt: "Answer in English: What do you want to do next week?",
        expectedAnswer: "Next week, I want to speak a little longer.",
      },
    ],
  },
  ...phaseSevenReviewDrills,
  ...phaseEightReviewDrills,
];

export const reviewDrills: ReviewDrill[] =
  baseReviewDrills.map(withProductionReviewItem);

export const dayOneReview = reviewDrills[0];
