import { phaseEightListeningDrills } from "./phase-eight-content";
import { phaseSevenListeningDrills } from "./phase-seven-content";

export type ListeningDrill = {
  day: number;
  title: string;
  focus: string;
  transcriptExcerpt: string;
  keyLines: string[];
  miniTaskTr: string;
  outputPrompt: string;
};

export const listeningDrills: ListeningDrill[] = [
  {
    day: 1,
    title: "Day 1 Listening: A Simple Morning Check-in",
    focus: "Daily routine, short answers, and natural follow-up questions.",
    transcriptExcerpt:
      "Hi, good morning. I have a busy day, but I want to start slowly. First, I need a coffee. Then I have a short meeting at nine. After work, I want to walk for twenty minutes and call my brother.",
    keyLines: [
      "I have a busy day, but I want to start slowly.",
      "First, I need a coffee.",
      "Then I have a short meeting at nine.",
      "After work, I want to walk for twenty minutes.",
    ],
    miniTaskTr:
      "Metni iki kez dinle. İlk dinlemede genel anlamı yakala. İkinci dinlemede sırayı takip et: first, then, after work.",
    outputPrompt:
      "Write 2 short sentences about your morning. Use one line from the listening drill if it helps.",
  },
  {
    day: 2,
    title: "Day 2 Listening: Introducing Yourself Naturally",
    focus: "Name, city, work or study, and one personal detail.",
    transcriptExcerpt:
      "My name is Deniz. I live in Istanbul, and I work in a small design team. I am still improving my English, so I try to practice a little every day. In my free time, I like walking by the sea and listening to podcasts.",
    keyLines: [
      "My name is Deniz.",
      "I live in Istanbul.",
      "I work in a small design team.",
      "I try to practice a little every day.",
    ],
    miniTaskTr:
      "Kişinin kendini nasıl doğal tanıttığını dinle. Şehir, iş ve boş zaman bilgisini yakala.",
    outputPrompt:
      "Write 2 short sentences to introduce yourself naturally.",
  },
  {
    day: 3,
    title: "Day 3 Listening: A Real Daily Routine",
    focus: "Routine verbs, time words, and simple sequence.",
    transcriptExcerpt:
      "On weekdays, I usually wake up around seven. I check my messages, make breakfast, and leave home before eight. I take the metro to work. In the evening, I cook something simple and study English for ten minutes.",
    keyLines: [
      "I usually wake up around seven.",
      "I leave home before eight.",
      "I take the metro to work.",
      "I study English for ten minutes.",
    ],
    miniTaskTr:
      "Rutin sırasını takip et. Sabah, iş yolu ve akşam bölümünü ayrı ayrı yakala.",
    outputPrompt:
      "Write 2 sentences about your weekday routine.",
  },
  {
    day: 4,
    title: "Day 4 Listening: Simple Preferences",
    focus: "Saying what you like, prefer, and avoid.",
    transcriptExcerpt:
      "I like quiet mornings, but I do not like rushing. I prefer tea when I work at home, and I prefer coffee when I go out. After a long day, I usually choose a simple dinner and an early night.",
    keyLines: [
      "I like quiet mornings.",
      "I do not like rushing.",
      "I prefer tea when I work at home.",
      "I usually choose a simple dinner.",
    ],
    miniTaskTr:
      "Like, do not like, prefer ve choose ifadelerini dinle. Tercihleri kısa not al.",
    outputPrompt:
      "Write 2 sentences about something you like and something you prefer.",
  },
  {
    day: 5,
    title: "Day 5 Listening: Work and Study Life",
    focus: "Describing responsibilities without sounding robotic.",
    transcriptExcerpt:
      "I work with customers during the day, so I need to stay clear and patient. Some days are busy, but I learn a lot from small problems. After work, I study English because I want to speak more confidently in meetings.",
    keyLines: [
      "I work with customers during the day.",
      "I need to stay clear and patient.",
      "Some days are busy.",
      "I want to speak more confidently in meetings.",
    ],
    miniTaskTr:
      "İş veya çalışma hayatını anlatan doğal cümleleri yakala. Özellikle need to ve want to yapılarına dikkat et.",
    outputPrompt:
      "Write 2 sentences about your work, study, or daily responsibility.",
  },
  {
    day: 6,
    title: "Day 6 Listening: Asking Basic Questions",
    focus: "Short questions that keep a conversation moving.",
    transcriptExcerpt:
      "When I meet someone new, I ask simple questions first. Where do you live? What do you do? How is your day going? I listen carefully, and then I ask one more question about their answer.",
    keyLines: [
      "Where do you live?",
      "What do you do?",
      "How is your day going?",
      "I ask one more question about their answer.",
    ],
    miniTaskTr:
      "Soruların kısa ve doğal olduğuna dikkat et. Her sorudan sonra konuşmayı devam ettiren fikri yakala.",
    outputPrompt:
      "Write 2 questions you can ask someone in a simple conversation.",
  },
  {
    day: 7,
    title: "Day 7 Listening: Talking About Plans",
    focus: "Future plans with going to, want to, and need to.",
    transcriptExcerpt:
      "This weekend, I am going to visit my parents. I want to leave early because traffic gets heavy after ten. I also need to buy a small gift. If I have time, I am going to meet a friend for coffee.",
    keyLines: [
      "I am going to visit my parents.",
      "I want to leave early.",
      "I need to buy a small gift.",
      "I am going to meet a friend for coffee.",
    ],
    miniTaskTr:
      "Plan, istek ve ihtiyaç cümlelerini ayır. Going to, want to ve need to yapılarını dinle.",
    outputPrompt:
      "Write 2 sentences about your plan for this week or weekend.",
  },
  {
    day: 8,
    title: "Day 8 Listening: A Simple Past Experience",
    focus: "Talking about yesterday or last weekend in a natural way.",
    transcriptExcerpt:
      "Yesterday was simple but nice. I finished work a little late, so I ordered dinner at home. After dinner, I watched one episode of a series and cleaned the kitchen. It was not exciting, but it felt good.",
    keyLines: [
      "Yesterday was simple but nice.",
      "I finished work a little late.",
      "I ordered dinner at home.",
      "It was not exciting, but it felt good.",
    ],
    miniTaskTr:
      "Geçmiş zaman fiillerini dinle: finished, ordered, watched, cleaned. Cümlenin doğal akışına dikkat et.",
    outputPrompt:
      "Write 2 sentences about something you did yesterday.",
  },
  {
    day: 9,
    title: "Day 9 Listening: Problem and Solution",
    focus: "Explaining a small problem and what you did.",
    transcriptExcerpt:
      "This morning, my phone battery was almost dead, and I could not find my charger. I had a meeting in ten minutes, so I asked my coworker for help. She lent me a charger, and the problem was solved quickly.",
    keyLines: [
      "My phone battery was almost dead.",
      "I could not find my charger.",
      "I asked my coworker for help.",
      "The problem was solved quickly.",
    ],
    miniTaskTr:
      "Problem ve çözümü ayır. Could not, asked for help ve solved ifadelerini yakala.",
    outputPrompt:
      "Write 2 sentences about a small problem and what you did.",
  },
  {
    day: 10,
    title: "Day 10 Listening: Asking for Help",
    focus: "Polite requests and simple clarification.",
    transcriptExcerpt:
      "Excuse me, could you help me for a minute? I am trying to find the meeting room, but I am not sure where it is. Could you show me the way? Thank you, that helps a lot.",
    keyLines: [
      "Could you help me for a minute?",
      "I am trying to find the meeting room.",
      "I am not sure where it is.",
      "That helps a lot.",
    ],
    miniTaskTr:
      "Kibar yardım isteme cümlelerini dinle. Could you ve I am not sure ifadelerini tekrar et.",
    outputPrompt:
      "Write 2 polite sentences to ask for help.",
  },
  {
    day: 11,
    title: "Day 11 Listening: Giving a Simple Opinion",
    focus: "Saying what you think and giving one reason.",
    transcriptExcerpt:
      "I think short practice is better than long practice for me. When a session is short, I can do it every day. I also feel less pressure. That is why I prefer ten focused minutes instead of one long hour.",
    keyLines: [
      "I think short practice is better for me.",
      "I can do it every day.",
      "I feel less pressure.",
      "That is why I prefer ten focused minutes.",
    ],
    miniTaskTr:
      "Fikir ve sebep ilişkisini dinle. I think, because yerine that is why yapısını fark et.",
    outputPrompt:
      "Write 2 sentences with your opinion and one reason.",
  },
  {
    day: 12,
    title: "Day 12 Listening: Describing a Place",
    focus: "Simple place description and useful details.",
    transcriptExcerpt:
      "There is a small cafe near my office. It is quiet in the morning, and the staff are friendly. I usually sit by the window because there is more light there. It is a good place to read or answer emails.",
    keyLines: [
      "There is a small cafe near my office.",
      "It is quiet in the morning.",
      "I usually sit by the window.",
      "It is a good place to read.",
    ],
    miniTaskTr:
      "Yer tarifi ve detayları dinle. There is, near, by the window ifadelerine odaklan.",
    outputPrompt:
      "Write 2 sentences about a place you know.",
  },
  {
    day: 13,
    title: "Day 13 Listening: Leaving a Short Message",
    focus: "Phone or voice message language.",
    transcriptExcerpt:
      "Hi, this is Emre. I am calling about our meeting tomorrow. I may be ten minutes late because I have another call before it. Please start without me if needed. I will join as soon as I can.",
    keyLines: [
      "I am calling about our meeting tomorrow.",
      "I may be ten minutes late.",
      "Please start without me if needed.",
      "I will join as soon as I can.",
    ],
    miniTaskTr:
      "Kısa mesaj yapısını dinle: konu, durum, rica, kapanış. May be ve as soon as I can ifadelerini yakala.",
    outputPrompt:
      "Write 2 sentences for a short work or life message.",
  },
  {
    day: 14,
    title: "Day 14 Listening: Two-Week Confidence Check",
    focus: "Combining routine, plans, past, and confidence.",
    transcriptExcerpt:
      "Two weeks ago, speaking English felt difficult for me. Now I can introduce myself, talk about my day, and ask simple questions. I still make mistakes, but I can keep going. Next week, I want to speak a little longer.",
    keyLines: [
      "Speaking English felt difficult for me.",
      "Now I can introduce myself.",
      "I still make mistakes, but I can keep going.",
      "Next week, I want to speak a little longer.",
    ],
    miniTaskTr:
      "Gelişim cümlelerini dinle. Geçmiş, şimdi ve gelecek hedefini ayır.",
    outputPrompt:
      "Write 2 sentences about your English progress and your next goal.",
  },
  ...phaseSevenListeningDrills,
  ...phaseEightListeningDrills,
];

export const dayOneListening = listeningDrills[0];
