import { phaseEightDayWords } from "./phase-eight-content";
import { phaseSevenDayWords } from "./phase-seven-content";

export type WordItem = {
  word: string;
  pronunciation: string;
  shortMeaningTr: string;
  exampleSentence: string;
};

export type DayWords = {
  day: number;
  title: string;
  words: WordItem[];
};

const TARGET_DAILY_WORD_COUNT = 8;

const speakingBoosters: WordItem[] = [
  {
    word: "in my case",
    pronunciation: "in my kays",
    shortMeaningTr: "benim durumumda",
    exampleSentence: "In my case, short practice works better.",
  },
  {
    word: "for example",
    pronunciation: "for ig-ZAM-puhl",
    shortMeaningTr: "örneğin",
    exampleSentence: "For example, I practice one answer every morning.",
  },
  {
    word: "the main point",
    pronunciation: "thuh mayn poynt",
    shortMeaningTr: "ana nokta",
    exampleSentence: "The main point is that I need more practice.",
  },
  {
    word: "that is why",
    pronunciation: "that iz why",
    shortMeaningTr: "bu yüzden",
    exampleSentence: "That is why I try to speak every day.",
  },
  {
    word: "to be honest",
    pronunciation: "toh bee ON-ist",
    shortMeaningTr: "dürüst olmak gerekirse",
    exampleSentence: "To be honest, I still feel nervous sometimes.",
  },
  {
    word: "at the same time",
    pronunciation: "at thuh saym tym",
    shortMeaningTr: "aynı zamanda",
    exampleSentence: "At the same time, I know I am improving.",
  },
  {
    word: "a little bit",
    pronunciation: "uh LIT-uhl bit",
    shortMeaningTr: "biraz",
    exampleSentence: "I feel a little bit more confident now.",
  },
  {
    word: "right now",
    pronunciation: "ryt now",
    shortMeaningTr: "şu anda",
    exampleSentence: "Right now, I am focusing on simple sentences.",
  },
  {
    word: "the best part",
    pronunciation: "thuh best part",
    shortMeaningTr: "en iyi kısmı",
    exampleSentence: "The best part is that I can keep going.",
  },
  {
    word: "one more thing",
    pronunciation: "wun mor thing",
    shortMeaningTr: "bir şey daha",
    exampleSentence: "One more thing: I need to check the details.",
  },
  {
    word: "as soon as possible",
    pronunciation: "az soon az POS-uh-buhl",
    shortMeaningTr: "mümkün olan en kısa sürede",
    exampleSentence: "I will send the update as soon as possible.",
  },
  {
    word: "if possible",
    pronunciation: "if POS-uh-buhl",
    shortMeaningTr: "mümkünse",
    exampleSentence: "If possible, I want to meet tomorrow.",
  },
  {
    word: "I am not sure",
    pronunciation: "eye am not shur",
    shortMeaningTr: "emin değilim",
    exampleSentence: "I am not sure, but I can check.",
  },
  {
    word: "let me check",
    pronunciation: "let mee chek",
    shortMeaningTr: "kontrol edeyim",
    exampleSentence: "Let me check the time and get back to you.",
  },
  {
    word: "that works for me",
    pronunciation: "that wurks for mee",
    shortMeaningTr: "bu bana uyar",
    exampleSentence: "Friday morning works for me.",
  },
  {
    word: "I agree",
    pronunciation: "eye uh-GREE",
    shortMeaningTr: "katılıyorum",
    exampleSentence: "I agree with the plan.",
  },
  {
    word: "I see your point",
    pronunciation: "eye see yor poynt",
    shortMeaningTr: "ne demek istediğini anlıyorum",
    exampleSentence: "I see your point, but I have one concern.",
  },
  {
    word: "one concern",
    pronunciation: "wun kuhn-SURN",
    shortMeaningTr: "bir endişe",
    exampleSentence: "I have one concern about the timing.",
  },
  {
    word: "in other words",
    pronunciation: "in UTH-er wurdz",
    shortMeaningTr: "başka bir deyişle",
    exampleSentence: "In other words, we need a simpler plan.",
  },
  {
    word: "from my side",
    pronunciation: "frum my syd",
    shortMeaningTr: "benim tarafımdan",
    exampleSentence: "From my side, everything is ready.",
  },
  {
    word: "so far",
    pronunciation: "soh far",
    shortMeaningTr: "şimdiye kadar",
    exampleSentence: "So far, the practice is going well.",
  },
  {
    word: "next time",
    pronunciation: "nekst tym",
    shortMeaningTr: "bir dahaki sefere",
    exampleSentence: "Next time, I will speak more slowly.",
  },
  {
    word: "in a simple way",
    pronunciation: "in uh SIM-puhl way",
    shortMeaningTr: "basit şekilde",
    exampleSentence: "I want to explain it in a simple way.",
  },
  {
    word: "keep it short",
    pronunciation: "keep it short",
    shortMeaningTr: "kısa tutmak",
    exampleSentence: "I will keep it short and clear.",
  },
];

function expandDailyWords(dayContent: DayWords): DayWords {
  if (dayContent.words.length >= TARGET_DAILY_WORD_COUNT) {
    return dayContent;
  }

  const selectedBoosters: WordItem[] = [];
  const existingWords = new Set(
    dayContent.words.map((item) => item.word.toLowerCase()),
  );
  let index = (dayContent.day - 1) * 4;

  while (
    dayContent.words.length + selectedBoosters.length < TARGET_DAILY_WORD_COUNT
  ) {
    const booster = speakingBoosters[index % speakingBoosters.length];
    index += 1;

    if (existingWords.has(booster.word.toLowerCase())) {
      continue;
    }

    selectedBoosters.push(booster);
    existingWords.add(booster.word.toLowerCase());
  }

  return {
    ...dayContent,
    words: [...dayContent.words, ...selectedBoosters],
  };
}

const baseDayWords: DayWords[] = [
  {
    day: 1,
    title: "Morning and Routine",
    words: [
      {
        word: "busy",
        pronunciation: "BIZ-ee",
        shortMeaningTr: "yoğun, meşgul",
        exampleSentence: "I have a busy day, but I feel ready.",
      },
      {
        word: "slowly",
        pronunciation: "SLOH-lee",
        shortMeaningTr: "yavaşça",
        exampleSentence: "I want to start slowly this morning.",
      },
      {
        word: "meeting",
        pronunciation: "MEE-ting",
        shortMeaningTr: "toplantı",
        exampleSentence: "I have a short meeting at nine.",
      },
      {
        word: "after work",
        pronunciation: "AF-ter work",
        shortMeaningTr: "işten sonra",
        exampleSentence: "After work, I want to walk for twenty minutes.",
      },
    ],
  },
  {
    day: 2,
    title: "Introducing Yourself",
    words: [
      {
        word: "improving",
        pronunciation: "im-PROO-ving",
        shortMeaningTr: "geliştiriyor",
        exampleSentence: "I am still improving my English.",
      },
      {
        word: "practice",
        pronunciation: "PRAK-tis",
        shortMeaningTr: "pratik yapmak",
        exampleSentence: "I practice a little every day.",
      },
      {
        word: "free time",
        pronunciation: "FREE time",
        shortMeaningTr: "boş zaman",
        exampleSentence: "In my free time, I listen to podcasts.",
      },
      {
        word: "team",
        pronunciation: "teem",
        shortMeaningTr: "ekip",
        exampleSentence: "I work in a small team.",
      },
    ],
  },
  {
    day: 3,
    title: "Weekday Routine",
    words: [
      {
        word: "usually",
        pronunciation: "YOO-zhoo-uh-lee",
        shortMeaningTr: "genellikle",
        exampleSentence: "I usually wake up around seven.",
      },
      {
        word: "leave",
        pronunciation: "leev",
        shortMeaningTr: "ayrılmak, çıkmak",
        exampleSentence: "I leave home before eight.",
      },
      {
        word: "take the metro",
        pronunciation: "tayk the MET-roh",
        shortMeaningTr: "metroya binmek",
        exampleSentence: "I take the metro to work.",
      },
      {
        word: "simple",
        pronunciation: "SIM-puhl",
        shortMeaningTr: "basit, sade",
        exampleSentence: "I cook something simple in the evening.",
      },
    ],
  },
  {
    day: 4,
    title: "Preferences",
    words: [
      {
        word: "quiet",
        pronunciation: "KWY-uht",
        shortMeaningTr: "sessiz, sakin",
        exampleSentence: "I like quiet mornings.",
      },
      {
        word: "rushing",
        pronunciation: "RUSH-ing",
        shortMeaningTr: "acele etmek",
        exampleSentence: "I do not like rushing.",
      },
      {
        word: "prefer",
        pronunciation: "pri-FER",
        shortMeaningTr: "tercih etmek",
        exampleSentence: "I prefer coffee when I go out.",
      },
      {
        word: "choose",
        pronunciation: "chooz",
        shortMeaningTr: "seçmek",
        exampleSentence: "I choose a simple dinner after work.",
      },
    ],
  },
  {
    day: 5,
    title: "Work and Study",
    words: [
      {
        word: "customers",
        pronunciation: "KUS-tuh-merz",
        shortMeaningTr: "müşteriler",
        exampleSentence: "I work with customers during the day.",
      },
      {
        word: "patient",
        pronunciation: "PAY-shuhnt",
        shortMeaningTr: "sabırlı",
        exampleSentence: "I need to stay clear and patient.",
      },
      {
        word: "problem",
        pronunciation: "PROB-luhm",
        shortMeaningTr: "problem",
        exampleSentence: "I learn from small problems.",
      },
      {
        word: "confidently",
        pronunciation: "KON-fi-duhnt-lee",
        shortMeaningTr: "özgüvenle",
        exampleSentence: "I want to speak more confidently.",
      },
    ],
  },
  {
    day: 6,
    title: "Questions",
    words: [
      {
        word: "meet",
        pronunciation: "meet",
        shortMeaningTr: "tanışmak, buluşmak",
        exampleSentence: "I meet new people at work.",
      },
      {
        word: "carefully",
        pronunciation: "KAIR-fuh-lee",
        shortMeaningTr: "dikkatlice",
        exampleSentence: "I listen carefully.",
      },
      {
        word: "answer",
        pronunciation: "AN-ser",
        shortMeaningTr: "cevap",
        exampleSentence: "I ask one more question about their answer.",
      },
      {
        word: "how is",
        pronunciation: "how iz",
        shortMeaningTr: "nasıl gidiyor",
        exampleSentence: "How is your day going?",
      },
    ],
  },
  {
    day: 7,
    title: "Plans",
    words: [
      {
        word: "weekend",
        pronunciation: "WEEK-end",
        shortMeaningTr: "hafta sonu",
        exampleSentence: "This weekend, I am going to visit my parents.",
      },
      {
        word: "early",
        pronunciation: "ER-lee",
        shortMeaningTr: "erken",
        exampleSentence: "I want to leave early.",
      },
      {
        word: "gift",
        pronunciation: "gift",
        shortMeaningTr: "hediye",
        exampleSentence: "I need to buy a small gift.",
      },
      {
        word: "if I have time",
        pronunciation: "if eye hav time",
        shortMeaningTr: "vaktim olursa",
        exampleSentence: "If I have time, I will meet a friend.",
      },
    ],
  },
  {
    day: 8,
    title: "Past Experience",
    words: [
      {
        word: "yesterday",
        pronunciation: "YES-ter-day",
        shortMeaningTr: "dün",
        exampleSentence: "Yesterday was simple but nice.",
      },
      {
        word: "finished",
        pronunciation: "FIN-isht",
        shortMeaningTr: "bitirdi",
        exampleSentence: "I finished work a little late.",
      },
      {
        word: "ordered",
        pronunciation: "OR-derd",
        shortMeaningTr: "sipariş etti",
        exampleSentence: "I ordered dinner at home.",
      },
      {
        word: "felt good",
        pronunciation: "felt good",
        shortMeaningTr: "iyi hissettirdi",
        exampleSentence: "It was not exciting, but it felt good.",
      },
    ],
  },
  {
    day: 9,
    title: "Problem and Solution",
    words: [
      {
        word: "battery",
        pronunciation: "BAT-uh-ree",
        shortMeaningTr: "batarya, pil",
        exampleSentence: "My phone battery was almost dead.",
      },
      {
        word: "charger",
        pronunciation: "CHAR-jer",
        shortMeaningTr: "şarj cihazı",
        exampleSentence: "I could not find my charger.",
      },
      {
        word: "coworker",
        pronunciation: "KOH-wur-ker",
        shortMeaningTr: "iş arkadaşı",
        exampleSentence: "I asked my coworker for help.",
      },
      {
        word: "solved",
        pronunciation: "solvd",
        shortMeaningTr: "çözüldü",
        exampleSentence: "The problem was solved quickly.",
      },
    ],
  },
  {
    day: 10,
    title: "Asking for Help",
    words: [
      {
        word: "excuse me",
        pronunciation: "ik-SKYOOZ mee",
        shortMeaningTr: "pardon, affedersiniz",
        exampleSentence: "Excuse me, could you help me?",
      },
      {
        word: "trying to",
        pronunciation: "TRY-ing to",
        shortMeaningTr: "yapmaya çalışıyor",
        exampleSentence: "I am trying to find the meeting room.",
      },
      {
        word: "not sure",
        pronunciation: "not shoor",
        shortMeaningTr: "emin değil",
        exampleSentence: "I am not sure where it is.",
      },
      {
        word: "show me",
        pronunciation: "shoh mee",
        shortMeaningTr: "bana göster",
        exampleSentence: "Could you show me the way?",
      },
    ],
  },
  {
    day: 11,
    title: "Opinions",
    words: [
      {
        word: "I think",
        pronunciation: "eye think",
        shortMeaningTr: "bence",
        exampleSentence: "I think short practice is better for me.",
      },
      {
        word: "pressure",
        pronunciation: "PRESH-er",
        shortMeaningTr: "baskı",
        exampleSentence: "I feel less pressure.",
      },
      {
        word: "focused",
        pronunciation: "FOH-kuhst",
        shortMeaningTr: "odaklı",
        exampleSentence: "I prefer ten focused minutes.",
      },
      {
        word: "instead of",
        pronunciation: "in-STED uv",
        shortMeaningTr: "yerine",
        exampleSentence: "I practice for ten minutes instead of one long hour.",
      },
    ],
  },
  {
    day: 12,
    title: "Places",
    words: [
      {
        word: "near",
        pronunciation: "neer",
        shortMeaningTr: "yakınında",
        exampleSentence: "There is a small cafe near my office.",
      },
      {
        word: "staff",
        pronunciation: "staf",
        shortMeaningTr: "personel",
        exampleSentence: "The staff are friendly.",
      },
      {
        word: "by the window",
        pronunciation: "by the WIN-doh",
        shortMeaningTr: "pencerenin yanında",
        exampleSentence: "I usually sit by the window.",
      },
      {
        word: "light",
        pronunciation: "lite",
        shortMeaningTr: "ışık",
        exampleSentence: "There is more light there.",
      },
    ],
  },
  {
    day: 13,
    title: "Short Messages",
    words: [
      {
        word: "calling about",
        pronunciation: "KAW-ling uh-BOWT",
        shortMeaningTr: "hakkında arıyorum",
        exampleSentence: "I am calling about our meeting tomorrow.",
      },
      {
        word: "late",
        pronunciation: "layt",
        shortMeaningTr: "geç",
        exampleSentence: "I may be ten minutes late.",
      },
      {
        word: "if needed",
        pronunciation: "if NEE-did",
        shortMeaningTr: "gerekirse",
        exampleSentence: "Please start without me if needed.",
      },
      {
        word: "as soon as I can",
        pronunciation: "az soon az eye kan",
        shortMeaningTr: "olabildiğince çabuk",
        exampleSentence: "I will join as soon as I can.",
      },
    ],
  },
  {
    day: 14,
    title: "Confidence Check",
    words: [
      {
        word: "felt difficult",
        pronunciation: "felt DIF-i-kuhlt",
        shortMeaningTr: "zor hissettirdi",
        exampleSentence: "Speaking English felt difficult for me.",
      },
      {
        word: "introduce myself",
        pronunciation: "in-truh-DOOS my-self",
        shortMeaningTr: "kendimi tanıtmak",
        exampleSentence: "Now I can introduce myself.",
      },
      {
        word: "keep going",
        pronunciation: "keep GOH-ing",
        shortMeaningTr: "devam etmek",
        exampleSentence: "I still make mistakes, but I can keep going.",
      },
      {
        word: "a little longer",
        pronunciation: "uh LIT-uhl LONG-er",
        shortMeaningTr: "biraz daha uzun",
        exampleSentence: "Next week, I want to speak a little longer.",
      },
    ],
  },
  ...phaseSevenDayWords,
  ...phaseEightDayWords,
];

export const dayWords = baseDayWords.map(expandDailyWords);

export const dayOneWords = dayWords[0].words;
