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

const foundationBoosters: WordItem[] = [
  {
    word: "first of all",
    pronunciation: "furst uv awl",
    shortMeaningTr: "öncelikle",
    exampleSentence: "First of all, I check my plan.",
  },
  {
    word: "after that",
    pronunciation: "AF-ter that",
    shortMeaningTr: "ondan sonra",
    exampleSentence: "After that, I leave for work.",
  },
  {
    word: "most days",
    pronunciation: "mohst dayz",
    shortMeaningTr: "çoğu gün",
    exampleSentence: "Most days, I practice for ten minutes.",
  },
  {
    word: "a few minutes",
    pronunciation: "uh fyoo MIN-its",
    shortMeaningTr: "birkaç dakika",
    exampleSentence: "I have a few minutes before my meeting.",
  },
  {
    word: "at work",
    pronunciation: "at wurk",
    shortMeaningTr: "işte",
    exampleSentence: "At work, I try to speak clearly.",
  },
  {
    word: "at home",
    pronunciation: "at hohm",
    shortMeaningTr: "evde",
    exampleSentence: "At home, I listen again.",
  },
  {
    word: "in the morning",
    pronunciation: "in thuh MOR-ning",
    shortMeaningTr: "sabah",
    exampleSentence: "In the morning, I feel more focused.",
  },
  {
    word: "in the evening",
    pronunciation: "in thuh EEV-ning",
    shortMeaningTr: "akşam",
    exampleSentence: "In the evening, I review one answer.",
  },
  {
    word: "on the weekend",
    pronunciation: "on thuh WEEK-end",
    shortMeaningTr: "hafta sonunda",
    exampleSentence: "On the weekend, I have more time.",
  },
  {
    word: "I need to",
    pronunciation: "eye need to",
    shortMeaningTr: "yapmam gerekiyor",
    exampleSentence: "I need to answer one message.",
  },
  {
    word: "I want to",
    pronunciation: "eye want to",
    shortMeaningTr: "yapmak istiyorum",
    exampleSentence: "I want to speak more naturally.",
  },
  {
    word: "I usually",
    pronunciation: "eye YOO-zhoo-uh-lee",
    shortMeaningTr: "genellikle",
    exampleSentence: "I usually start with a short coffee.",
  },
  {
    word: "not very",
    pronunciation: "not VER-ee",
    shortMeaningTr: "çok değil",
    exampleSentence: "I am not very tired today.",
  },
  {
    word: "a bit",
    pronunciation: "uh bit",
    shortMeaningTr: "biraz",
    exampleSentence: "I feel a bit nervous, but I can try.",
  },
  {
    word: "this week",
    pronunciation: "this week",
    shortMeaningTr: "bu hafta",
    exampleSentence: "This week, I want to speak every day.",
  },
  {
    word: "tomorrow morning",
    pronunciation: "tuh-MOR-oh MOR-ning",
    shortMeaningTr: "yarın sabah",
    exampleSentence: "Tomorrow morning, I have a meeting.",
  },
  {
    word: "because",
    pronunciation: "bi-KAWZ",
    shortMeaningTr: "çünkü",
    exampleSentence: "I practice because I want to feel ready.",
  },
  {
    word: "with my team",
    pronunciation: "with my teem",
    shortMeaningTr: "ekibimle",
    exampleSentence: "I share updates with my team.",
  },
  {
    word: "near my home",
    pronunciation: "neer my hohm",
    shortMeaningTr: "evime yakın",
    exampleSentence: "There is a small shop near my home.",
  },
  {
    word: "one thing",
    pronunciation: "wun thing",
    shortMeaningTr: "bir şey",
    exampleSentence: "One thing helps me stay calm.",
  },
  {
    word: "right now",
    pronunciation: "ryt now",
    shortMeaningTr: "şu anda",
    exampleSentence: "Right now, I am focusing on short answers.",
  },
  {
    word: "little by little",
    pronunciation: "LIT-uhl by LIT-uhl",
    shortMeaningTr: "yavaş yavaş",
    exampleSentence: "Little by little, I feel more comfortable.",
  },
  {
    word: "easy to say",
    pronunciation: "EE-zee to say",
    shortMeaningTr: "söylemesi kolay",
    exampleSentence: "This sentence is easy to say.",
  },
  {
    word: "one more time",
    pronunciation: "wun mor tym",
    shortMeaningTr: "bir kez daha",
    exampleSentence: "I want to repeat it one more time.",
  },
];

const a2Boosters: WordItem[] = [
  {
    word: "make a plan",
    pronunciation: "mayk uh plan",
    shortMeaningTr: "plan yapmak",
    exampleSentence: "I need to make a plan before I start.",
  },
  {
    word: "set a time",
    pronunciation: "set uh tym",
    shortMeaningTr: "zaman belirlemek",
    exampleSentence: "Let's set a time for the call.",
  },
  {
    word: "get ready",
    pronunciation: "get RED-ee",
    shortMeaningTr: "hazırlanmak",
    exampleSentence: "I get ready before the meeting.",
  },
  {
    word: "check the details",
    pronunciation: "chek thuh DEE-taylz",
    shortMeaningTr: "detayları kontrol etmek",
    exampleSentence: "I need to check the details first.",
  },
  {
    word: "make a choice",
    pronunciation: "mayk uh choys",
    shortMeaningTr: "seçim yapmak",
    exampleSentence: "I have to make a choice today.",
  },
  {
    word: "one reason is",
    pronunciation: "wun REE-zuhn iz",
    shortMeaningTr: "bir sebep şu",
    exampleSentence: "One reason is that it saves time.",
  },
  {
    word: "compared with",
    pronunciation: "kuhm-PAIRD with",
    shortMeaningTr: "ile karşılaştırıldığında",
    exampleSentence: "Compared with yesterday, today feels easier.",
  },
  {
    word: "ask for help",
    pronunciation: "ask for help",
    shortMeaningTr: "yardım istemek",
    exampleSentence: "I can ask for help if I need it.",
  },
  {
    word: "deal with",
    pronunciation: "deel with",
    shortMeaningTr: "başa çıkmak",
    exampleSentence: "I can deal with a small problem.",
  },
  {
    word: "fix the issue",
    pronunciation: "fiks thee ISH-oo",
    shortMeaningTr: "sorunu çözmek",
    exampleSentence: "We can fix the issue today.",
  },
  {
    word: "send an update",
    pronunciation: "send an UP-dayt",
    shortMeaningTr: "güncelleme göndermek",
    exampleSentence: "I will send an update after lunch.",
  },
  {
    word: "make sure",
    pronunciation: "mayk shur",
    shortMeaningTr: "emin olmak",
    exampleSentence: "I want to make sure I understand.",
  },
  {
    word: "a better option",
    pronunciation: "uh BET-er OP-shuhn",
    shortMeaningTr: "daha iyi seçenek",
    exampleSentence: "This is a better option for me.",
  },
  {
    word: "small mistake",
    pronunciation: "smawl mis-TAYK",
    shortMeaningTr: "küçük hata",
    exampleSentence: "I made a small mistake, but I fixed it.",
  },
  {
    word: "next step",
    pronunciation: "nekst step",
    shortMeaningTr: "sonraki adım",
    exampleSentence: "The next step is to call the client.",
  },
  {
    word: "short break",
    pronunciation: "short brayk",
    shortMeaningTr: "kısa mola",
    exampleSentence: "I need a short break before I continue.",
  },
  {
    word: "be careful with",
    pronunciation: "bee KAIR-fuhl with",
    shortMeaningTr: "dikkatli olmak",
    exampleSentence: "Be careful with the time.",
  },
  {
    word: "on time",
    pronunciation: "on tym",
    shortMeaningTr: "zamanında",
    exampleSentence: "I want to arrive on time.",
  },
  {
    word: "a clear answer",
    pronunciation: "uh kleer AN-ser",
    shortMeaningTr: "net cevap",
    exampleSentence: "I need a clear answer before Friday.",
  },
  {
    word: "in the right order",
    pronunciation: "in thuh ryt OR-der",
    shortMeaningTr: "doğru sırayla",
    exampleSentence: "I explain the steps in the right order.",
  },
  {
    word: "talk it through",
    pronunciation: "tawk it throo",
    shortMeaningTr: "konuşarak netleştirmek",
    exampleSentence: "Let's talk it through before we decide.",
  },
  {
    word: "work better",
    pronunciation: "wurk BET-er",
    shortMeaningTr: "daha iyi çalışmak",
    exampleSentence: "This plan works better for my schedule.",
  },
  {
    word: "take notes",
    pronunciation: "tayk nohts",
    shortMeaningTr: "not almak",
    exampleSentence: "I take notes during important calls.",
  },
  {
    word: "keep it simple",
    pronunciation: "keep it SIM-puhl",
    shortMeaningTr: "basit tutmak",
    exampleSentence: "I try to keep it simple when I speak.",
  },
  {
    word: "follow the plan",
    pronunciation: "FOL-oh thuh plan",
    shortMeaningTr: "planı takip etmek",
    exampleSentence: "If I follow the plan, I finish faster.",
  },
  {
    word: "clear enough",
    pronunciation: "kleer i-NUF",
    shortMeaningTr: "yeterince net",
    exampleSentence: "My answer is clear enough for now.",
  },
  {
    word: "a quick note",
    pronunciation: "uh kwik noht",
    shortMeaningTr: "kısa not",
    exampleSentence: "I sent a quick note to my manager.",
  },
  {
    word: "by the end",
    pronunciation: "by thee end",
    shortMeaningTr: "sonuna kadar",
    exampleSentence: "By the end of the day, I felt ready.",
  },
];

const earlyB1Boosters: WordItem[] = [
  {
    word: "from my point of view",
    pronunciation: "frum my poynt uv vyoo",
    shortMeaningTr: "benim bakış açıma göre",
    exampleSentence: "From my point of view, the plan is realistic.",
  },
  {
    word: "the reason is",
    pronunciation: "thuh REE-zuhn iz",
    shortMeaningTr: "sebebi şu",
    exampleSentence: "The reason is that we need more time.",
  },
  {
    word: "what I noticed",
    pronunciation: "wut eye NOH-tist",
    shortMeaningTr: "fark ettiğim şey",
    exampleSentence: "What I noticed was the timing problem.",
  },
  {
    word: "it depends on",
    pronunciation: "it di-PENDZ on",
    shortMeaningTr: "bağlıdır",
    exampleSentence: "It depends on how busy the week is.",
  },
  {
    word: "in this situation",
    pronunciation: "in this sit-yoo-AY-shuhn",
    shortMeaningTr: "bu durumda",
    exampleSentence: "In this situation, I would ask for help.",
  },
  {
    word: "a practical way",
    pronunciation: "uh PRAK-ti-kuhl way",
    shortMeaningTr: "pratik bir yol",
    exampleSentence: "A practical way is to start with one task.",
  },
  {
    word: "follow up",
    pronunciation: "FOL-oh up",
    shortMeaningTr: "takip etmek",
    exampleSentence: "I will follow up after the meeting.",
  },
  {
    word: "make progress",
    pronunciation: "mayk PROG-res",
    shortMeaningTr: "ilerleme kaydetmek",
    exampleSentence: "I make progress when I practice often.",
  },
  {
    word: "give context",
    pronunciation: "giv KON-tekst",
    shortMeaningTr: "bağlam vermek",
    exampleSentence: "I need to give context before I explain.",
  },
  {
    word: "be specific",
    pronunciation: "bee spi-SIF-ik",
    shortMeaningTr: "spesifik olmak",
    exampleSentence: "Be specific when you describe the problem.",
  },
  {
    word: "a useful example",
    pronunciation: "uh YOOS-fuhl ig-ZAM-puhl",
    shortMeaningTr: "faydalı örnek",
    exampleSentence: "A useful example makes the idea clearer.",
  },
  {
    word: "based on",
    pronunciation: "bayst on",
    shortMeaningTr: "dayanarak",
    exampleSentence: "Based on the feedback, I changed the plan.",
  },
  {
    word: "handle the problem",
    pronunciation: "HAN-duhl thuh PROB-luhm",
    shortMeaningTr: "sorunu halletmek",
    exampleSentence: "We can handle the problem today.",
  },
  {
    word: "avoid confusion",
    pronunciation: "uh-VOYD kuhn-FYOO-zhuhn",
    shortMeaningTr: "karışıklığı önlemek",
    exampleSentence: "I repeat the time to avoid confusion.",
  },
  {
    word: "agree on",
    pronunciation: "uh-GREE on",
    shortMeaningTr: "üzerinde anlaşmak",
    exampleSentence: "We need to agree on the next step.",
  },
  {
    word: "make a decision",
    pronunciation: "mayk uh di-SIZH-uhn",
    shortMeaningTr: "karar vermek",
    exampleSentence: "We should make a decision today.",
  },
  {
    word: "what matters most",
    pronunciation: "wut MAT-erz mohst",
    shortMeaningTr: "en önemli olan şey",
    exampleSentence: "What matters most is clear communication.",
  },
  {
    word: "a realistic plan",
    pronunciation: "uh ree-uh-LIS-tik plan",
    shortMeaningTr: "gerçekçi plan",
    exampleSentence: "We need a realistic plan for this week.",
  },
  {
    word: "it helped me",
    pronunciation: "it helpt mee",
    shortMeaningTr: "bana yardımcı oldu",
    exampleSentence: "It helped me speak with less pressure.",
  },
  {
    word: "I learned that",
    pronunciation: "eye lurnd that",
    shortMeaningTr: "şunu öğrendim",
    exampleSentence: "I learned that preparation matters.",
  },
  {
    word: "the main challenge",
    pronunciation: "thuh mayn CHAL-inj",
    shortMeaningTr: "ana zorluk",
    exampleSentence: "The main challenge is the short deadline.",
  },
  {
    word: "keep people updated",
    pronunciation: "keep PEE-puhl UP-day-tid",
    shortMeaningTr: "insanları bilgilendirmek",
    exampleSentence: "I try to keep people updated.",
  },
  {
    word: "a quick summary",
    pronunciation: "uh kwik SUM-uh-ree",
    shortMeaningTr: "kısa özet",
    exampleSentence: "Here is a quick summary of the issue.",
  },
  {
    word: "short notice",
    pronunciation: "short NOH-tis",
    shortMeaningTr: "kısa süre önce haber",
    exampleSentence: "Sorry for the short notice.",
  },
  {
    word: "worth it",
    pronunciation: "wurth it",
    shortMeaningTr: "değer",
    exampleSentence: "The extra practice is worth it.",
  },
  {
    word: "make it easier",
    pronunciation: "mayk it EE-zee-er",
    shortMeaningTr: "kolaylaştırmak",
    exampleSentence: "A short list makes it easier to start.",
  },
  {
    word: "a small improvement",
    pronunciation: "uh smawl im-PROOV-muhnt",
    shortMeaningTr: "küçük gelişme",
    exampleSentence: "A small improvement can change the whole day.",
  },
  {
    word: "clear from the start",
    pronunciation: "kleer frum thuh start",
    shortMeaningTr: "baştan net",
    exampleSentence: "The goal should be clear from the start.",
  },
];

const confidentSpeakingBoosters: WordItem[] = [
  {
    word: "looking back",
    pronunciation: "LOOK-ing bak",
    shortMeaningTr: "geriye bakınca",
    exampleSentence: "Looking back, I can see real progress.",
  },
  {
    word: "what changed",
    pronunciation: "wut chaynjd",
    shortMeaningTr: "ne değişti",
    exampleSentence: "What changed is my confidence.",
  },
  {
    word: "I realized that",
    pronunciation: "eye REE-uh-lyzd that",
    shortMeaningTr: "fark ettim ki",
    exampleSentence: "I realized that short practice works.",
  },
  {
    word: "one lesson is",
    pronunciation: "wun LES-uhn iz",
    shortMeaningTr: "bir ders şu",
    exampleSentence: "One lesson is that I need to start simple.",
  },
  {
    word: "I would say",
    pronunciation: "eye wood say",
    shortMeaningTr: "şunu söylerdim",
    exampleSentence: "I would say the second option is better.",
  },
  {
    word: "from experience",
    pronunciation: "frum ik-SPEER-ee-uhns",
    shortMeaningTr: "deneyime göre",
    exampleSentence: "From experience, preparation helps a lot.",
  },
  {
    word: "a stronger answer",
    pronunciation: "uh STRONG-er AN-ser",
    shortMeaningTr: "daha güçlü cevap",
    exampleSentence: "A stronger answer includes one example.",
  },
  {
    word: "to be clear",
    pronunciation: "to bee kleer",
    shortMeaningTr: "net olmak gerekirse",
    exampleSentence: "To be clear, I can finish this today.",
  },
  {
    word: "let me explain",
    pronunciation: "let mee ik-SPLAYN",
    shortMeaningTr: "açıklayayım",
    exampleSentence: "Let me explain why I chose this option.",
  },
  {
    word: "the trade-off",
    pronunciation: "thuh TRAYD-awf",
    shortMeaningTr: "ödünleşme",
    exampleSentence: "The trade-off is time versus quality.",
  },
  {
    word: "my recommendation",
    pronunciation: "my rek-uh-men-DAY-shuhn",
    shortMeaningTr: "benim önerim",
    exampleSentence: "My recommendation is to start with the simple version.",
  },
  {
    word: "in the long run",
    pronunciation: "in thuh long run",
    shortMeaningTr: "uzun vadede",
    exampleSentence: "In the long run, consistency matters more.",
  },
  {
    word: "a good balance",
    pronunciation: "uh good BAL-uhns",
    shortMeaningTr: "iyi denge",
    exampleSentence: "We need a good balance between speed and detail.",
  },
  {
    word: "the safest option",
    pronunciation: "thuh SAY-fist OP-shuhn",
    shortMeaningTr: "en güvenli seçenek",
    exampleSentence: "The safest option is to confirm the time.",
  },
  {
    word: "the main risk",
    pronunciation: "thuh mayn risk",
    shortMeaningTr: "ana risk",
    exampleSentence: "The main risk is starting too late.",
  },
  {
    word: "a clear priority",
    pronunciation: "uh kleer pry-OR-uh-tee",
    shortMeaningTr: "net öncelik",
    exampleSentence: "This task is a clear priority today.",
  },
  {
    word: "what I would do",
    pronunciation: "wut eye wood doo",
    shortMeaningTr: "benim yapacağım şey",
    exampleSentence: "What I would do is call first.",
  },
  {
    word: "a realistic goal",
    pronunciation: "uh ree-uh-LIS-tik gohl",
    shortMeaningTr: "gerçekçi hedef",
    exampleSentence: "A realistic goal keeps me moving.",
  },
  {
    word: "keep improving",
    pronunciation: "keep im-PROOV-ing",
    shortMeaningTr: "gelişmeye devam etmek",
    exampleSentence: "I want to keep improving after this program.",
  },
  {
    word: "speak more naturally",
    pronunciation: "speek mor NACH-er-uh-lee",
    shortMeaningTr: "daha doğal konuşmak",
    exampleSentence: "I can speak more naturally when I slow down.",
  },
  {
    word: "handle real conversations",
    pronunciation: "HAN-duhl reel kon-ver-SAY-shuhnz",
    shortMeaningTr: "gerçek konuşmaları halletmek",
    exampleSentence: "I want to handle real conversations with confidence.",
  },
  {
    word: "build confidence",
    pronunciation: "bild KON-fi-duhns",
    shortMeaningTr: "özgüven geliştirmek",
    exampleSentence: "Daily practice helps me build confidence.",
  },
  {
    word: "summarize the point",
    pronunciation: "SUM-uh-ryz thuh poynt",
    shortMeaningTr: "ana fikri özetlemek",
    exampleSentence: "I can summarize the point in one sentence.",
  },
  {
    word: "make a commitment",
    pronunciation: "mayk uh kuh-MIT-muhnt",
    shortMeaningTr: "taahhüt vermek",
    exampleSentence: "I want to make a commitment to practice weekly.",
  },
  {
    word: "ask a follow-up",
    pronunciation: "ask uh FOL-oh up",
    shortMeaningTr: "takip sorusu sormak",
    exampleSentence: "I can ask a follow-up if I need more detail.",
  },
  {
    word: "stay consistent",
    pronunciation: "stay kuhn-SIS-tuhnt",
    shortMeaningTr: "istikrarlı kalmak",
    exampleSentence: "I stay consistent by practicing a little every day.",
  },
  {
    word: "one practical step",
    pronunciation: "wun PRAK-ti-kuhl step",
    shortMeaningTr: "pratik bir adım",
    exampleSentence: "One practical step is to repeat the key line.",
  },
  {
    word: "move forward",
    pronunciation: "moov FOR-werd",
    shortMeaningTr: "ilerlemek",
    exampleSentence: "I can move forward with a clear plan.",
  },
];

const themeBoosterGroups: Array<{
  keywords: string[];
  items: WordItem[];
}> = [
  {
    keywords: ["clarification", "understanding", "conversation"],
    items: [
      {
        word: "Could you clarify that?",
        pronunciation: "kood yoo KLAIR-uh-fy that",
        shortMeaningTr: "Bunu netleştirebilir misin?",
        exampleSentence: "Could you clarify that before I answer?",
      },
      {
        word: "I am not sure I understood",
        pronunciation: "eye am not shur eye un-der-STOOD",
        shortMeaningTr: "Anladığımdan emin değilim",
        exampleSentence: "I am not sure I understood the last point.",
      },
      {
        word: "Let me check one detail",
        pronunciation: "let mee chek wun DEE-tayl",
        shortMeaningTr: "Bir detayı kontrol edeyim",
        exampleSentence: "Let me check one detail before we decide.",
      },
      {
        word: "Can I ask one more question?",
        pronunciation: "kan eye ask wun mor KWES-chuhn",
        shortMeaningTr: "Bir soru daha sorabilir miyim?",
        exampleSentence: "Can I ask one more question about the time?",
      },
    ],
  },
  {
    keywords: ["misunderstanding", "correcting"],
    items: [
      {
        word: "What I meant was",
        pronunciation: "wut eye ment wuz",
        shortMeaningTr: "Demek istediğim şuydu",
        exampleSentence: "What I meant was that I need more time.",
      },
      {
        word: "I mean",
        pronunciation: "eye meen",
        shortMeaningTr: "yani, demek istediğim",
        exampleSentence: "I mean, the first option is easier.",
      },
      {
        word: "Let me say that again",
        pronunciation: "let mee say that uh-GEN",
        shortMeaningTr: "Bunu tekrar söyleyeyim",
        exampleSentence: "Let me say that again more clearly.",
      },
      {
        word: "In other words",
        pronunciation: "in UTH-er wurdz",
        shortMeaningTr: "başka bir deyişle",
        exampleSentence: "In other words, we need a simpler plan.",
      },
    ],
  },
  {
    keywords: ["problem", "issue", "complaint", "mistake", "difficult"],
    items: [
      {
        word: "the main issue is",
        pronunciation: "thuh mayn ISH-oo iz",
        shortMeaningTr: "ana sorun şu",
        exampleSentence: "The main issue is that the file does not open.",
      },
      {
        word: "what happened was",
        pronunciation: "wut HAP-uhnd wuz",
        shortMeaningTr: "olan şey şuydu",
        exampleSentence: "What happened was that I sent the old version.",
      },
      {
        word: "to fix this",
        pronunciation: "to fiks this",
        shortMeaningTr: "bunu düzeltmek için",
        exampleSentence: "To fix this, I will send a new file.",
      },
      {
        word: "next time",
        pronunciation: "nekst tym",
        shortMeaningTr: "bir dahaki sefere",
        exampleSentence: "Next time, I will check the details first.",
      },
    ],
  },
  {
    keywords: [
      "choice",
      "decision",
      "option",
      "comparing",
      "comparison",
      "preference",
      "money",
    ],
    items: [
      {
        word: "the better option is",
        pronunciation: "thuh BET-er OP-shuhn iz",
        shortMeaningTr: "daha iyi seçenek şu",
        exampleSentence: "The better option is to wait until Friday.",
      },
      {
        word: "the reason I chose it",
        pronunciation: "thuh REE-zuhn eye chohz it",
        shortMeaningTr: "bunu seçme sebebim",
        exampleSentence: "The reason I chose it is that it saves time.",
      },
      {
        word: "on the other hand",
        pronunciation: "on thee UTH-er hand",
        shortMeaningTr: "diğer yandan",
        exampleSentence: "On the other hand, the office is better for questions.",
      },
      {
        word: "it depends on the situation",
        pronunciation: "it di-PENDZ on thuh sit-yoo-AY-shuhn",
        shortMeaningTr: "duruma bağlı",
        exampleSentence: "It depends on the situation and the deadline.",
      },
    ],
  },
  {
    keywords: ["message", "reply", "late", "delay"],
    items: [
      {
        word: "sorry for the delay",
        pronunciation: "SOR-ee for thuh di-LAY",
        shortMeaningTr: "gecikme için üzgünüm",
        exampleSentence: "Sorry for the delay; I was in a meeting.",
      },
      {
        word: "thanks for waiting",
        pronunciation: "thanks for WAY-ting",
        shortMeaningTr: "beklediğin için teşekkürler",
        exampleSentence: "Thanks for waiting, I can answer now.",
      },
      {
        word: "I will get back to you",
        pronunciation: "eye wil get bak to yoo",
        shortMeaningTr: "sana geri döneceğim",
        exampleSentence: "I will get back to you after I check.",
      },
      {
        word: "as soon as possible",
        pronunciation: "az soon az POS-uh-buhl",
        shortMeaningTr: "mümkün olan en kısa sürede",
        exampleSentence: "I will send it as soon as possible.",
      },
    ],
  },
  {
    keywords: [
      "summary",
      "summarizing",
      "discussion",
      "update",
      "recap",
      "story",
      "presentation",
      "check-in",
    ],
    items: [
      {
        word: "to summarize",
        pronunciation: "toh SUM-uh-ryz",
        shortMeaningTr: "özetlemek gerekirse",
        exampleSentence: "To summarize, we agreed on the next step.",
      },
      {
        word: "the main point is",
        pronunciation: "thuh mayn poynt iz",
        shortMeaningTr: "ana nokta şu",
        exampleSentence: "The main point is that we need more time.",
      },
      {
        word: "what happens next",
        pronunciation: "wut HAP-uhnz nekst",
        shortMeaningTr: "sonra ne olacak",
        exampleSentence: "What happens next is simple: we test it again.",
      },
      {
        word: "here is the update",
        pronunciation: "heer iz thee UP-dayt",
        shortMeaningTr: "güncelleme şu",
        exampleSentence: "Here is the update: the first part is finished.",
      },
    ],
  },
  {
    keywords: [
      "plan",
      "schedule",
      "appointment",
      "meeting",
      "travel",
      "trip",
      "preparing",
    ],
    items: [
      {
        word: "what time works for you?",
        pronunciation: "wut tym wurks for yoo",
        shortMeaningTr: "sana hangi saat uyar?",
        exampleSentence: "What time works for you tomorrow?",
      },
      {
        word: "if that works",
        pronunciation: "if that wurks",
        shortMeaningTr: "eğer uygunsa",
        exampleSentence: "We can meet at three if that works.",
      },
      {
        word: "my schedule changed",
        pronunciation: "my SKEJ-ool chaynjd",
        shortMeaningTr: "programım değişti",
        exampleSentence: "My schedule changed, so I need a new time.",
      },
      {
        word: "let's confirm the time",
        pronunciation: "lets kuhn-FURM thuh tym",
        shortMeaningTr: "saati netleştirelim",
        exampleSentence: "Let's confirm the time before lunch.",
      },
    ],
  },
  {
    keywords: ["opinion", "recommend", "feedback", "reason", "tool"],
    items: [
      {
        word: "I may be wrong, but",
        pronunciation: "eye may bee rawng but",
        shortMeaningTr: "yanılıyor olabilirim ama",
        exampleSentence: "I may be wrong, but this feels too long.",
      },
      {
        word: "from my point of view",
        pronunciation: "frum my poynt uv vyoo",
        shortMeaningTr: "benim bakış açıma göre",
        exampleSentence: "From my point of view, the plan is realistic.",
      },
      {
        word: "I would suggest",
        pronunciation: "eye wood suh-JEST",
        shortMeaningTr: "öneririm",
        exampleSentence: "I would suggest a shorter meeting.",
      },
      {
        word: "one reason is",
        pronunciation: "wun REE-zuhn iz",
        shortMeaningTr: "bir sebep şu",
        exampleSentence: "One reason is that people stay focused.",
      },
    ],
  },
  {
    keywords: [
      "progress",
      "confidence",
      "goal",
      "habit",
      "learning",
      "energy",
      "change",
      "changed",
      "learned",
      "experience",
      "success",
      "speaking check",
    ],
    items: [
      {
        word: "what improved",
        pronunciation: "wut im-PROOVD",
        shortMeaningTr: "ne gelişti",
        exampleSentence: "What improved is my confidence.",
      },
      {
        word: "I still need to",
        pronunciation: "eye stil need to",
        shortMeaningTr: "hala yapmam gerekiyor",
        exampleSentence: "I still need to practice longer answers.",
      },
      {
        word: "my next step is",
        pronunciation: "my nekst step iz",
        shortMeaningTr: "sonraki adımım şu",
        exampleSentence: "My next step is to speak for one full minute.",
      },
      {
        word: "little by little",
        pronunciation: "LIT-uhl by LIT-uhl",
        shortMeaningTr: "yavaş yavaş",
        exampleSentence: "Little by little, I can speak more clearly.",
      },
    ],
  },
  {
    keywords: ["instructions", "process", "routine"],
    items: [
      {
        word: "the first step is",
        pronunciation: "thuh furst step iz",
        shortMeaningTr: "ilk adım şu",
        exampleSentence: "The first step is to open the file.",
      },
      {
        word: "make sure you",
        pronunciation: "mayk shur yoo",
        shortMeaningTr: "emin ol ki",
        exampleSentence: "Make sure you save a copy.",
      },
      {
        word: "when you have time",
        pronunciation: "wen yoo hav tym",
        shortMeaningTr: "vaktin olduğunda",
        exampleSentence: "When you have time, please check the page.",
      },
      {
        word: "in the right order",
        pronunciation: "in thuh ryt OR-der",
        shortMeaningTr: "doğru sırayla",
        exampleSentence: "Explain the steps in the right order.",
      },
    ],
  },
  {
    keywords: ["place", "person", "coworker", "friend", "restaurant", "trust"],
    items: [
      {
        word: "what I like about it",
        pronunciation: "wut eye lyk uh-BOWT it",
        shortMeaningTr: "onun sevdiğim yanı",
        exampleSentence: "What I like about it is the quiet atmosphere.",
      },
      {
        word: "it feels",
        pronunciation: "it feelz",
        shortMeaningTr: "hissettiriyor",
        exampleSentence: "It feels calm in the early evening.",
      },
      {
        word: "one thing I notice",
        pronunciation: "wun thing eye NOH-tis",
        shortMeaningTr: "fark ettiğim bir şey",
        exampleSentence: "One thing I notice is how clearly she explains.",
      },
      {
        word: "easy to reach",
        pronunciation: "EE-zee to reech",
        shortMeaningTr: "ulaşması kolay",
        exampleSentence: "The place is easy to reach after work.",
      },
    ],
  },
  {
    keywords: ["request", "need"],
    items: [
      {
        word: "Would it be possible to",
        pronunciation: "wood it bee POS-uh-buhl to",
        shortMeaningTr: "mümkün olur mu",
        exampleSentence: "Would it be possible to send it today?",
      },
      {
        word: "could you send me",
        pronunciation: "kood yoo send mee",
        shortMeaningTr: "bana gönderebilir misin",
        exampleSentence: "Could you send me the details?",
      },
      {
        word: "I need it because",
        pronunciation: "eye need it bi-KAWZ",
        shortMeaningTr: "buna ihtiyacım var çünkü",
        exampleSentence: "I need it because the meeting starts soon.",
      },
      {
        word: "thanks for your help",
        pronunciation: "thanks for yor help",
        shortMeaningTr: "yardımın için teşekkürler",
        exampleSentence: "Thanks for your help with this.",
      },
    ],
  },
  {
    keywords: ["priorities", "priority"],
    items: [
      {
        word: "the top priority",
        pronunciation: "thuh top pry-OR-uh-tee",
        shortMeaningTr: "en önemli öncelik",
        exampleSentence: "The top priority is the customer reply.",
      },
      {
        word: "can wait",
        pronunciation: "kan wayt",
        shortMeaningTr: "bekleyebilir",
        exampleSentence: "The notes can wait until tomorrow.",
      },
      {
        word: "needs attention",
        pronunciation: "needz uh-TEN-shuhn",
        shortMeaningTr: "dikkat gerektiriyor",
        exampleSentence: "This message needs attention today.",
      },
      {
        word: "what matters first",
        pronunciation: "wut MAT-erz furst",
        shortMeaningTr: "ilk önemli olan şey",
        exampleSentence: "What matters first is the urgent reply.",
      },
    ],
  },
  {
    keywords: ["good news"],
    items: [
      {
        word: "that is great news",
        pronunciation: "that iz grayt nooz",
        shortMeaningTr: "bu harika haber",
        exampleSentence: "That is great news; congratulations.",
      },
      {
        word: "I am happy to hear that",
        pronunciation: "eye am HAP-ee to heer that",
        shortMeaningTr: "bunu duyduğuma sevindim",
        exampleSentence: "I am happy to hear that it went well.",
      },
      {
        word: "what happens next?",
        pronunciation: "wut HAP-uhnz nekst",
        shortMeaningTr: "sonra ne olacak?",
        exampleSentence: "What happens next after the approval?",
      },
      {
        word: "you must feel proud",
        pronunciation: "yoo must feel proud",
        shortMeaningTr: "gururlu hissediyor olmalısın",
        exampleSentence: "You must feel proud of the result.",
      },
    ],
  },
];

function getRotatedItems<T>(items: T[], day: number, limit: number) {
  if (items.length === 0 || limit <= 0) {
    return [];
  }

  const startIndex = Math.abs(day * 3) % items.length;

  return Array.from({ length: Math.min(limit, items.length) }, (_, offset) => {
    return items[(startIndex + offset) % items.length];
  });
}

function getThemeBoosters(dayContent: DayWords) {
  if (dayContent.day < 15) {
    return [];
  }

  const normalizedTitle = dayContent.title.toLowerCase();
  const matchedItems = themeBoosterGroups.flatMap((group) =>
    group.keywords.some((keyword) => normalizedTitle.includes(keyword))
      ? group.items
      : [],
  );

  return getRotatedItems(matchedItems, dayContent.day, 3);
}

function getSpeakingBoosters(day: number): WordItem[] {
  if (day >= 71) {
    return confidentSpeakingBoosters;
  }

  if (day >= 43) {
    return earlyB1Boosters;
  }

  if (day >= 15) {
    return a2Boosters;
  }

  return foundationBoosters;
}

function expandDailyWords(dayContent: DayWords): DayWords {
  if (dayContent.words.length >= TARGET_DAILY_WORD_COUNT) {
    return dayContent;
  }

  const selectedBoosters: WordItem[] = [];
  const existingWords = new Set(
    dayContent.words.map((item) => item.word.toLowerCase()),
  );
  const speakingBoosters = getRotatedItems(
    getSpeakingBoosters(dayContent.day),
    dayContent.day * 5,
    getSpeakingBoosters(dayContent.day).length,
  );
  const prioritizedBoosters = [
    ...getThemeBoosters(dayContent),
    ...speakingBoosters,
  ];
  let index = 0;

  while (
    dayContent.words.length + selectedBoosters.length < TARGET_DAILY_WORD_COUNT
  ) {
    const booster = prioritizedBoosters[index % prioritizedBoosters.length];
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
