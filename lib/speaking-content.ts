import { phaseEightSpeakingPractices } from "./phase-eight-content";
import { phaseSevenSpeakingPractices } from "./phase-seven-content";

export type SpeakingPractice = {
  day: number;
  title: string;
  prompt: string;
  speakingTipsTr: string;
  targetLines: string[];
  selfCheckItems: string[];
  miniGoalTr: string;
};

const defaultSelfCheckItems = [
  "En az 2 cümle kurdum mu?",
  "Hedef cümlelerden veya kelimelerden birini kullandım mı?",
  "İkinci denemede daha net konuştum mu?",
];

export const speakingPractices: SpeakingPractice[] = [
  {
    day: 1,
    title: "Day 1 Speaking: Talk About Your Morning",
    prompt:
      "Tell me about your morning. Say what you need first, what you have later, and one thing you want to do after work.",
    speakingTipsTr:
      "Önce kısa konuş. Mükemmel cümle arama. İlk denemede fikrini çıkar, ikinci denemede daha net ve daha doğal söyle.",
    targetLines: [
      "I have a busy day.",
      "First, I need a coffee.",
      "Then I have a short meeting.",
      "After work, I want to walk for twenty minutes.",
    ],
    selfCheckItems: [
      "Kendimi veya sabahımı anlattım mı?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: 20-30 saniye konuş. İkinci denemede aynı fikri daha düzenli söyle.",
  },
  {
    day: 2,
    title: "Day 2 Speaking: Introduce Yourself",
    prompt:
      "Introduce yourself in a natural way. Say your name, where you live, what you do, and one thing you enjoy.",
    speakingTipsTr:
      "Kendini robot gibi değil, sohbet eder gibi tanıt. Kısa ve gerçek bilgi ver.",
    targetLines: [
      "My name is Deniz.",
      "I live in Istanbul.",
      "I work in a small team.",
      "In my free time, I like walking.",
    ],
    selfCheckItems: [
      "Adımı veya yaşadığım yeri söyledim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: 3-4 doğal cümleyle kendini tanıt.",
  },
  {
    day: 3,
    title: "Day 3 Speaking: Explain Your Routine",
    prompt:
      "Talk about a normal weekday. Say when you start, how you go to work or study, and what you do in the evening.",
    speakingTipsTr:
      "Sırayı net tut: morning, work or study, evening. Uzun cümle kurmak zorunda değilsin.",
    targetLines: [
      "I usually wake up around seven.",
      "I leave home before eight.",
      "I take the metro to work.",
      "In the evening, I study English.",
    ],
    selfCheckItems: [
      "Günümün sırasını anlattım mı?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Gününü 20-30 saniyede sırayla anlat.",
  },
  {
    day: 4,
    title: "Day 4 Speaking: Talk About Preferences",
    prompt:
      "Say two things you like, one thing you do not like, and one thing you prefer during the day.",
    speakingTipsTr:
      "Like, do not like ve prefer yapılarını kısa örneklerle kullan. Gerçek tercihlerinden bahset.",
    targetLines: [
      "I like quiet mornings.",
      "I do not like rushing.",
      "I prefer coffee when I go out.",
      "After a long day, I choose a simple dinner.",
    ],
    selfCheckItems: [
      "En az bir tercih söyledim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: 3 kısa tercih cümlesi söyle.",
  },
  {
    day: 5,
    title: "Day 5 Speaking: Work, Study, or Responsibility",
    prompt:
      "Describe your work, study, or daily responsibility. Say what you do, what is difficult, and why English helps you.",
    speakingTipsTr:
      "Görevini basit anlat. Sonra bir zorluk ve küçük bir hedef ekle.",
    targetLines: [
      "I work with customers during the day.",
      "I need to stay clear and patient.",
      "Some days are busy.",
      "I want to speak more confidently.",
    ],
    selfCheckItems: [
      "İşim, okulum veya sorumluluğum hakkında konuştum mu?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: İş veya günlük sorumluluğunu 4 kısa cümleyle anlat.",
  },
  {
    day: 6,
    title: "Day 6 Speaking: Ask and Answer Questions",
    prompt:
      "Ask three simple questions to a new person. Then answer one of those questions about yourself.",
    speakingTipsTr:
      "Sorular kısa olsun. Cevap verirken tek kelimeyle kalma; bir küçük detay ekle.",
    targetLines: [
      "Where do you live?",
      "What do you do?",
      "How is your day going?",
      "I live in Istanbul, and my day is busy.",
    ],
    selfCheckItems: [
      "En az iki soru sordum mu?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: 3 soru ve 1 kısa cevap üret.",
  },
  {
    day: 7,
    title: "Day 7 Speaking: Share Your Plans",
    prompt:
      "Talk about one plan for this week or weekend. Say what you are going to do, why, and what you need.",
    speakingTipsTr:
      "Planı net kur: I am going to, I want to, I need to. Tek konu yeterli.",
    targetLines: [
      "I am going to visit my parents.",
      "I want to leave early.",
      "I need to buy a small gift.",
      "If I have time, I will meet a friend.",
    ],
    selfCheckItems: [
      "Gelecek planımdan bahsettim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Bir planı 3-4 cümleyle anlat.",
  },
  {
    day: 8,
    title: "Day 8 Speaking: Talk About Yesterday",
    prompt:
      "Talk about something you did yesterday. Say what happened, how it felt, and one small detail.",
    speakingTipsTr:
      "Geçmiş zamanı basit tut. Yesterday, finished, ordered, watched gibi net fiiller kullan.",
    targetLines: [
      "Yesterday was simple but nice.",
      "I finished work a little late.",
      "I ordered dinner at home.",
      "It felt good.",
    ],
    selfCheckItems: [
      "Dün yaptığım bir şeyi anlattım mı?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Geçmişte olan bir olayı 3 kısa cümleyle anlat.",
  },
  {
    day: 9,
    title: "Day 9 Speaking: Explain a Small Problem",
    prompt:
      "Describe a small problem. Say what happened, who helped, and how it was solved.",
    speakingTipsTr:
      "Problem ve çözümü ayır. Cümlelerini kısa tut; önce sorun, sonra aksiyon.",
    targetLines: [
      "My phone battery was almost dead.",
      "I could not find my charger.",
      "I asked my coworker for help.",
      "The problem was solved quickly.",
    ],
    selfCheckItems: [
      "Problem ve çözümü ayrı anlattım mı?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Bir sorunu ve çözümü 4 kısa cümleyle anlat.",
  },
  {
    day: 10,
    title: "Day 10 Speaking: Ask for Help Politely",
    prompt:
      "Ask someone for help in a polite way. Explain what you need and thank them.",
    speakingTipsTr:
      "Could you ile başla. Sonra durumunu açıkla ve kısa teşekkür et.",
    targetLines: [
      "Could you help me for a minute?",
      "I am trying to find the meeting room.",
      "I am not sure where it is.",
      "Thank you, that helps a lot.",
    ],
    selfCheckItems: [
      "Kibar bir yardım isteği kurdum mu?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Yardım isteme cümlesini doğal ve kibar söyle.",
  },
  {
    day: 11,
    title: "Day 11 Speaking: Give an Opinion",
    prompt:
      "Give your opinion about short daily practice. Say what you think and give one reason.",
    speakingTipsTr:
      "I think ile başla. Sonra sebep ver. That is why ifadesini dene.",
    targetLines: [
      "I think short practice is better for me.",
      "I can do it every day.",
      "I feel less pressure.",
      "That is why I prefer ten focused minutes.",
    ],
    selfCheckItems: [
      "Fikrimi ve bir sebep söyledim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Bir fikir ve bir sebep söyle.",
  },
  {
    day: 12,
    title: "Day 12 Speaking: Describe a Place",
    prompt:
      "Describe a place you know. Say where it is, what it is like, and why you like or use it.",
    speakingTipsTr:
      "There is ve It is yapılarını kullan. Bir küçük detay konuşmanı daha gerçek yapar.",
    targetLines: [
      "There is a small cafe near my office.",
      "It is quiet in the morning.",
      "The staff are friendly.",
      "I usually sit by the window.",
    ],
    selfCheckItems: [
      "Bir yerin konumunu veya özelliğini söyledim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: Bir yeri 3-4 doğal cümleyle tarif et.",
  },
  {
    day: 13,
    title: "Day 13 Speaking: Leave a Short Message",
    prompt:
      "Leave a short message about a meeting or plan. Say why you are calling, what changed, and what the other person can do.",
    speakingTipsTr:
      "Mesajı üç parça düşün: konu, durum, rica. Uzun açıklama yapma.",
    targetLines: [
      "I am calling about our meeting tomorrow.",
      "I may be ten minutes late.",
      "Please start without me if needed.",
      "I will join as soon as I can.",
    ],
    selfCheckItems: [
      "Mesajın konusunu ve ricamı söyledim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: 20 saniyelik kısa ve net bir mesaj bırak.",
  },
  {
    day: 14,
    title: "Day 14 Speaking: Confidence Check",
    prompt:
      "Talk about your English progress. Say what felt difficult before, what you can do now, and what you want to do next.",
    speakingTipsTr:
      "Geçmiş, şimdi ve gelecek hedefini bağla. Hata yapsan bile devam etmeyi vurgula.",
    targetLines: [
      "Speaking English felt difficult for me.",
      "Now I can introduce myself.",
      "I still make mistakes, but I can keep going.",
      "Next week, I want to speak a little longer.",
    ],
    selfCheckItems: [
      "Gelişimimden ve yeni hedefimden bahsettim mi?",
      ...defaultSelfCheckItems,
    ],
    miniGoalTr:
      "Mini hedef: İki haftalık gelişimini 4 kısa cümleyle anlat.",
  },
  ...phaseSevenSpeakingPractices,
  ...phaseEightSpeakingPractices,
];

export const dayOneSpeaking = speakingPractices[0];
