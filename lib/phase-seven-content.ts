const reviewIntroTr =
  "Cevabı önce hatırlamaya çalış. Sonra kısa yaz ve kontrol et. Amaç hızlı ezber değil; konuşurken kullanacağın cümleyi geri çağırmak.";

const selfCheckItems = [
  "En az 2 cümle kurdum mu?",
  "Hedef cümlelerden veya kelimelerden birini kullandım mı?",
  "İkinci denemede daha net konuştum mu?",
];

type ReviewSeedType = "recall" | "fillBlank" | "shortAnswer";

const phaseSevenDays = [
  {
    day: 15,
    theme: "Planning a focused day",
    speakingGoal: "Explain your plan for a busy day and say what matters most.",
    transcript:
      "Today is full, so I need to choose my priorities. I have two important tasks before lunch, and one short call in the afternoon. If I stay focused, I can finish the main work before six.",
    keyLines: [
      "I need to choose my priorities.",
      "I have two important tasks before lunch.",
      "I have one short call in the afternoon.",
      "If I stay focused, I can finish the main work before six.",
    ],
    miniTaskTr:
      "Plan ve öncelik cümlelerini dinle. Before lunch, in the afternoon ve if yapılarını yakala.",
    outputPrompt: "Write 2 sentences about your plan for a busy day.",
    words: [
      ["priorities", "pry-OR-uh-teez", "öncelikler", "I need to choose my priorities."],
      ["focused", "FOH-kuhst", "odaklı", "If I stay focused, I can finish early."],
      ["main work", "mayn work", "ana iş", "I can finish the main work before six."],
      ["before lunch", "bi-FOR lunch", "öğle yemeğinden önce", "I have two tasks before lunch."],
    ],
    review: [
      ["fillBlank", "I need to choose my ____.", "priorities"],
      ["recall", "Write the sentence about two tasks.", "I have two important tasks before lunch."],
      ["shortAnswer", "Answer in English: What happens if you stay focused?", "I can finish the main work before six."],
    ],
  },
  {
    day: 16,
    theme: "Describing a coworker",
    speakingGoal: "Describe a person with useful details, not just adjectives.",
    transcript:
      "My coworker Selin is calm and very practical. When the team is under pressure, she asks clear questions and helps everyone stay organized. I like working with her because she explains problems in a simple way.",
    keyLines: [
      "My coworker Selin is calm and very practical.",
      "She asks clear questions.",
      "She helps everyone stay organized.",
      "She explains problems in a simple way.",
    ],
    miniTaskTr:
      "Kişiyi anlatan detayları dinle. Sadece sıfatları değil, kişinin ne yaptığını yakala.",
    outputPrompt: "Write 2 sentences about someone you work or study with.",
    words: [
      ["practical", "PRAK-ti-kuhl", "pratik", "She is calm and very practical."],
      ["under pressure", "UN-der PRESH-er", "baskı altında", "The team is under pressure."],
      ["organized", "OR-guh-nyzd", "düzenli", "She helps everyone stay organized."],
      ["simple way", "SIM-puhl way", "basit şekilde", "She explains problems in a simple way."],
    ],
    review: [
      ["fillBlank", "She helps everyone stay ____.", "organized"],
      ["recall", "Write the sentence about clear questions.", "She asks clear questions."],
      ["shortAnswer", "Answer in English: Why do you like working with her?", "She explains problems in a simple way."],
    ],
  },
  {
    day: 17,
    theme: "Comparing two choices",
    speakingGoal: "Compare two everyday options and explain your choice.",
    transcript:
      "I can work at home or go to the office today. Working at home is quieter, but the office is better for quick questions. I think I will go to the office because I need to discuss a few details with my team.",
    keyLines: [
      "Working at home is quieter.",
      "The office is better for quick questions.",
      "I need to discuss a few details with my team.",
      "I think I will go to the office.",
    ],
    miniTaskTr:
      "Karşılaştırma cümlelerini dinle. Quieter, better for ve because yapılarını ayır.",
    outputPrompt: "Write 2 sentences comparing two choices in your day.",
    words: [
      ["quieter", "KWY-uht-er", "daha sessiz", "Working at home is quieter."],
      ["better for", "BET-er for", "için daha iyi", "The office is better for quick questions."],
      ["discuss", "dis-KUS", "tartışmak", "I need to discuss a few details."],
      ["details", "DEE-taylz", "detaylar", "I need to discuss a few details with my team."],
    ],
    review: [
      ["fillBlank", "Working at home is ____.", "quieter"],
      ["recall", "Write the sentence about the office.", "The office is better for quick questions."],
      ["shortAnswer", "Answer in English: Why will you go to the office?", "I need to discuss a few details with my team."],
    ],
  },
  {
    day: 18,
    theme: "Explaining a delay",
    speakingGoal: "Explain why something is late and what you will do next.",
    transcript:
      "I am sorry, but I am running a little late. The bus was full, so I had to wait for the next one. I will arrive in about fifteen minutes, and I can start the meeting as soon as I get there.",
    keyLines: [
      "I am running a little late.",
      "The bus was full.",
      "I had to wait for the next one.",
      "I will arrive in about fifteen minutes.",
    ],
    miniTaskTr:
      "Gecikme sebebini ve çözüm cümlesini dinle. Had to ve will arrive ifadelerini tekrar et.",
    outputPrompt: "Write 2 sentences explaining a small delay.",
    words: [
      ["running late", "RUN-ing layt", "gecikiyorum", "I am running a little late."],
      ["full", "fool", "dolu", "The bus was full."],
      ["had to", "had to", "zorunda kaldı", "I had to wait for the next one."],
      ["arrive", "uh-RYV", "varmak", "I will arrive in about fifteen minutes."],
    ],
    review: [
      ["fillBlank", "I am running a little ____.", "late"],
      ["recall", "Write the sentence about the bus.", "The bus was full."],
      ["shortAnswer", "Answer in English: When will you arrive?", "I will arrive in about fifteen minutes."],
    ],
  },
  {
    day: 19,
    theme: "Giving simple instructions",
    speakingGoal: "Tell someone how to do a small task step by step.",
    transcript:
      "First, open the file and check the first page. Then add your name at the top and save a copy. After that, send it to me before the end of the day so I can review it.",
    keyLines: [
      "First, open the file.",
      "Add your name at the top.",
      "Save a copy.",
      "Send it to me before the end of the day.",
    ],
    miniTaskTr:
      "Talimat sırasını dinle. First, then, after that ve before the end of the day ifadelerini takip et.",
    outputPrompt: "Write 2 short instructions for a simple task.",
    words: [
      ["open", "OH-puhn", "açmak", "First, open the file."],
      ["at the top", "at the top", "en üstte", "Add your name at the top."],
      ["copy", "KOP-ee", "kopya", "Save a copy."],
      ["review", "ri-VYOO", "gözden geçirmek", "I can review it later."],
    ],
    review: [
      ["fillBlank", "Add your name at the ____.", "top"],
      ["recall", "Write the first instruction.", "First, open the file."],
      ["shortAnswer", "Answer in English: When should you send it?", "Send it before the end of the day."],
    ],
  },
  {
    day: 20,
    theme: "Talking about energy",
    speakingGoal: "Explain how you feel and what helps you feel better.",
    transcript:
      "I feel a bit tired today, but I am not in a bad mood. I just need a short break and some fresh air. When I walk for ten minutes, I usually feel clearer and more ready to work.",
    keyLines: [
      "I feel a bit tired today.",
      "I am not in a bad mood.",
      "I need a short break and some fresh air.",
      "I usually feel clearer and more ready to work.",
    ],
    miniTaskTr:
      "Duygu ve çözüm cümlelerini dinle. Tired, mood, break ve fresh air kelimelerini yakala.",
    outputPrompt: "Write 2 sentences about your energy today.",
    words: [
      ["a bit tired", "uh bit TY-erd", "biraz yorgun", "I feel a bit tired today."],
      ["mood", "mood", "ruh hali", "I am not in a bad mood."],
      ["fresh air", "fresh air", "temiz hava", "I need some fresh air."],
      ["clearer", "KLEER-er", "daha net", "I feel clearer after a walk."],
    ],
    review: [
      ["fillBlank", "I feel a bit ____ today.", "tired"],
      ["recall", "Write the sentence about fresh air.", "I need a short break and some fresh air."],
      ["shortAnswer", "Answer in English: What helps you feel clearer?", "Walking for ten minutes helps me feel clearer."],
    ],
  },
  {
    day: 21,
    theme: "Making a small decision",
    speakingGoal: "Say what you decided and why it makes sense.",
    transcript:
      "I decided to study English before dinner instead of late at night. I am more focused at that time, and I do not feel rushed. It is a small change, but it makes practice easier to repeat.",
    keyLines: [
      "I decided to study English before dinner.",
      "I am more focused at that time.",
      "I do not feel rushed.",
      "It makes practice easier to repeat.",
    ],
    miniTaskTr:
      "Karar ve sebep cümlelerini dinle. Decided to, instead of ve makes it easier yapılarını fark et.",
    outputPrompt: "Write 2 sentences about a small decision you made.",
    words: [
      ["decided", "di-SY-did", "karar verdi", "I decided to study before dinner."],
      ["instead of", "in-STED uv", "yerine", "I study before dinner instead of late at night."],
      ["rushed", "rusht", "aceleye gelmiş", "I do not feel rushed."],
      ["repeat", "ri-PEET", "tekrar etmek", "It is easier to repeat."],
    ],
    review: [
      ["fillBlank", "I decided to study English before ____.", "dinner"],
      ["recall", "Write the sentence about feeling rushed.", "I do not feel rushed."],
      ["shortAnswer", "Answer in English: Why is the change useful?", "It makes practice easier to repeat."],
    ],
  },
  {
    day: 22,
    theme: "Describing a useful place",
    speakingGoal: "Describe where a place is and why it is useful.",
    transcript:
      "There is a small library close to my apartment. It is not very modern, but it is quiet and comfortable. I go there when I need to read, study, or work without distractions.",
    keyLines: [
      "There is a small library close to my apartment.",
      "It is quiet and comfortable.",
      "I go there when I need to read.",
      "I can work without distractions.",
    ],
    miniTaskTr:
      "Yer, özellik ve kullanım sebebini dinle. Close to, comfortable ve without distractions ifadelerine odaklan.",
    outputPrompt: "Write 2 sentences about a useful place near you.",
    words: [
      ["library", "LY-brer-ee", "kütüphane", "There is a small library close to my apartment."],
      ["comfortable", "KUMF-ter-buhl", "rahat", "It is quiet and comfortable."],
      ["distractions", "dis-TRAK-shuhnz", "dikkat dağıtan şeyler", "I can work without distractions."],
      ["close to", "klohs to", "yakın", "The library is close to my apartment."],
    ],
    review: [
      ["fillBlank", "There is a small library close to my ____.", "apartment"],
      ["recall", "Write the sentence about comfort.", "It is quiet and comfortable."],
      ["shortAnswer", "Answer in English: Why do you go there?", "I go there when I need to read or study."],
    ],
  },
  {
    day: 23,
    theme: "Explaining a preference with a reason",
    speakingGoal: "Say what you prefer and support it with one clear reason.",
    transcript:
      "I prefer short meetings because people stay more focused. When a meeting is too long, we often repeat the same points. A clear agenda helps everyone use their time better.",
    keyLines: [
      "I prefer short meetings.",
      "People stay more focused.",
      "We often repeat the same points.",
      "A clear agenda helps everyone use their time better.",
    ],
    miniTaskTr:
      "Tercih ve sebep ilişkisini dinle. Because, too long ve agenda ifadelerini ayır.",
    outputPrompt: "Write 2 sentences about something you prefer and why.",
    words: [
      ["agenda", "uh-JEN-duh", "gündem", "A clear agenda helps everyone."],
      ["points", "points", "noktalar", "We repeat the same points."],
      ["too long", "too long", "fazla uzun", "The meeting is too long."],
      ["use their time", "yooz thair time", "zamanlarını kullanmak", "People use their time better."],
    ],
    review: [
      ["fillBlank", "I prefer short ____.", "meetings"],
      ["recall", "Write the sentence about the agenda.", "A clear agenda helps everyone use their time better."],
      ["shortAnswer", "Answer in English: Why do you prefer short meetings?", "People stay more focused."],
    ],
  },
  {
    day: 24,
    theme: "Asking for clarification",
    speakingGoal: "Ask someone to explain something again in a natural way.",
    transcript:
      "Sorry, could you explain that again? I understand the main idea, but I missed the last part. Could you give me one example so I can check if I understood correctly?",
    keyLines: [
      "Could you explain that again?",
      "I understand the main idea.",
      "I missed the last part.",
      "Could you give me one example?",
    ],
    miniTaskTr:
      "Açıklama isteme cümlelerini dinle. Main idea, missed ve example kelimelerine dikkat et.",
    outputPrompt: "Write 2 polite sentences asking for clarification.",
    words: [
      ["explain", "ik-SPLAYN", "açıklamak", "Could you explain that again?"],
      ["main idea", "mayn eye-DEE-uh", "ana fikir", "I understand the main idea."],
      ["missed", "mist", "kaçırdı", "I missed the last part."],
      ["correctly", "kuh-REKT-lee", "doğru şekilde", "I want to understand correctly."],
    ],
    review: [
      ["fillBlank", "I missed the last ____.", "part"],
      ["recall", "Write the question asking for another explanation.", "Could you explain that again?"],
      ["shortAnswer", "Answer in English: What do you understand?", "I understand the main idea."],
    ],
  },
  {
    day: 25,
    theme: "Talking about a recent mistake",
    speakingGoal: "Describe a mistake without sounding dramatic.",
    transcript:
      "I made a small mistake in a report yesterday. I sent the old version instead of the final one. I noticed it quickly, apologized, and sent the correct file five minutes later.",
    keyLines: [
      "I made a small mistake in a report.",
      "I sent the old version instead of the final one.",
      "I noticed it quickly.",
      "I sent the correct file five minutes later.",
    ],
    miniTaskTr:
      "Hata, fark etme ve düzeltme sırasını dinle. Mistake, version, noticed ve correct file ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a small mistake and how you fixed it.",
    words: [
      ["mistake", "mi-STAYK", "hata", "I made a small mistake."],
      ["version", "VER-zhuhn", "versiyon", "I sent the old version."],
      ["noticed", "NOH-tist", "fark etti", "I noticed it quickly."],
      ["correct file", "kuh-REKT file", "doğru dosya", "I sent the correct file."],
    ],
    review: [
      ["fillBlank", "I made a small ____ in a report.", "mistake"],
      ["recall", "Write the sentence about the old version.", "I sent the old version instead of the final one."],
      ["shortAnswer", "Answer in English: What did you send five minutes later?", "I sent the correct file five minutes later."],
    ],
  },
  {
    day: 26,
    theme: "Describing a process",
    speakingGoal: "Explain how you do a repeated task at work or home.",
    transcript:
      "Every Monday, I check my tasks and choose the three most important ones. Then I block time for focused work. At the end of the day, I review what I finished and move the rest to Tuesday.",
    keyLines: [
      "I check my tasks.",
      "I choose the three most important ones.",
      "I block time for focused work.",
      "I move the rest to Tuesday.",
    ],
    miniTaskTr:
      "Süreç adımlarını dinle. Check, choose, block time ve move the rest ifadelerini takip et.",
    outputPrompt: "Write 2 sentences explaining a process you repeat.",
    words: [
      ["tasks", "tasks", "görevler", "I check my tasks every Monday."],
      ["block time", "blok time", "zaman ayırmak", "I block time for focused work."],
      ["the rest", "the rest", "geri kalan", "I move the rest to Tuesday."],
      ["review", "ri-VYOO", "gözden geçirmek", "I review what I finished."],
    ],
    review: [
      ["fillBlank", "I choose the three most important ____.", "ones"],
      ["recall", "Write the sentence with block time.", "I block time for focused work."],
      ["shortAnswer", "Answer in English: What do you do every Monday?", "I check my tasks."],
    ],
  },
  {
    day: 27,
    theme: "Talking about health habits",
    speakingGoal: "Describe a healthy habit and why it helps you.",
    transcript:
      "I try to drink more water during the day. It is a simple habit, but it helps me feel better and stay more awake. I also take short breaks from the screen when my eyes feel tired.",
    keyLines: [
      "I try to drink more water during the day.",
      "It helps me feel better.",
      "I take short breaks from the screen.",
      "My eyes feel tired.",
    ],
    miniTaskTr:
      "Alışkanlık ve fayda cümlelerini dinle. Helps me ve take breaks yapılarını fark et.",
    outputPrompt: "Write 2 sentences about a habit that helps you.",
    words: [
      ["habit", "HAB-it", "alışkanlık", "It is a simple habit."],
      ["awake", "uh-WAYK", "uyanık", "It helps me stay more awake."],
      ["screen", "skreen", "ekran", "I take breaks from the screen."],
      ["tired", "TY-erd", "yorgun", "My eyes feel tired."],
    ],
    review: [
      ["fillBlank", "I try to drink more ____.", "water"],
      ["recall", "Write the sentence about screen breaks.", "I take short breaks from the screen."],
      ["shortAnswer", "Answer in English: How does water help you?", "It helps me feel better and stay more awake."],
    ],
  },
  {
    day: 28,
    theme: "Weekend recap",
    speakingGoal: "Summarize what you did and how it felt.",
    transcript:
      "My weekend was calm. I cleaned the apartment, met a friend for lunch, and spent Sunday evening at home. I did not do anything special, but I feel rested and ready for the week.",
    keyLines: [
      "My weekend was calm.",
      "I met a friend for lunch.",
      "I spent Sunday evening at home.",
      "I feel rested and ready for the week.",
    ],
    miniTaskTr:
      "Hafta sonu özetini dinle. Past simple fiillerini ve feel rested ifadesini yakala.",
    outputPrompt: "Write 2 sentences about your last weekend.",
    words: [
      ["calm", "kahm", "sakin", "My weekend was calm."],
      ["spent", "spent", "geçirdi", "I spent Sunday evening at home."],
      ["rested", "RES-tid", "dinlenmiş", "I feel rested."],
      ["ready for", "RED-ee for", "hazır", "I am ready for the week."],
    ],
    review: [
      ["fillBlank", "My weekend was ____.", "calm"],
      ["recall", "Write the sentence about Sunday evening.", "I spent Sunday evening at home."],
      ["shortAnswer", "Answer in English: How do you feel now?", "I feel rested and ready for the week."],
    ],
  },
  {
    day: 29,
    theme: "Explaining a change",
    speakingGoal: "Talk about a change in your schedule or routine.",
    transcript:
      "My schedule changed this week. I usually start work at nine, but now I start at eight thirty. It is a small change, but I need to sleep earlier and prepare my bag at night.",
    keyLines: [
      "My schedule changed this week.",
      "I usually start work at nine.",
      "Now I start at eight thirty.",
      "I need to sleep earlier.",
    ],
    miniTaskTr:
      "Değişiklik cümlelerini dinle. Usually ve now karşılaştırmasına dikkat et.",
    outputPrompt: "Write 2 sentences about a change in your routine.",
    words: [
      ["schedule", "SKEJ-ool", "program", "My schedule changed this week."],
      ["changed", "chaynjd", "değişti", "My routine changed this week."],
      ["earlier", "ER-lee-er", "daha erken", "I need to sleep earlier."],
      ["prepare", "pri-PAIR", "hazırlamak", "I prepare my bag at night."],
    ],
    review: [
      ["fillBlank", "My schedule ____ this week.", "changed"],
      ["recall", "Write the sentence about starting at eight thirty.", "Now I start at eight thirty."],
      ["shortAnswer", "Answer in English: What do you need to do earlier?", "I need to sleep earlier."],
    ],
  },
  {
    day: 30,
    theme: "Talking about money simply",
    speakingGoal: "Explain a small spending decision without complex finance language.",
    transcript:
      "I am trying to spend less on small things this month. Coffee and snacks do not seem expensive, but they add up. I still want to enjoy my day, so I choose one small treat instead of three.",
    keyLines: [
      "I am trying to spend less.",
      "Small things add up.",
      "I still want to enjoy my day.",
      "I choose one small treat instead of three.",
    ],
    miniTaskTr:
      "Para ve karar cümlelerini dinle. Spend less, add up ve instead of ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a small spending choice.",
    words: [
      ["spend less", "spend less", "daha az harcamak", "I am trying to spend less."],
      ["add up", "ad up", "birikmek", "Small things add up."],
      ["treat", "treet", "küçük ödül", "I choose one small treat."],
      ["instead of three", "in-STED uv three", "üç yerine", "I choose one treat instead of three."],
    ],
    review: [
      ["fillBlank", "Small things add ____.", "up"],
      ["recall", "Write the sentence with spend less.", "I am trying to spend less."],
      ["shortAnswer", "Answer in English: What do you choose?", "I choose one small treat instead of three."],
    ],
  },
  {
    day: 31,
    theme: "Handling a misunderstanding",
    speakingGoal: "Explain a misunderstanding and fix it politely.",
    transcript:
      "There was a small misunderstanding about the meeting time. I thought it started at two, but it started at one thirty. I apologized and asked for a quick summary so I could catch up.",
    keyLines: [
      "There was a small misunderstanding.",
      "I thought it started at two.",
      "It started at one thirty.",
      "I asked for a quick summary.",
    ],
    miniTaskTr:
      "Yanlış anlama ve düzeltme cümlelerini dinle. I thought ve catch up ifadelerini fark et.",
    outputPrompt: "Write 2 sentences about a misunderstanding and how to fix it.",
    words: [
      ["misunderstanding", "mis-un-der-STAN-ding", "yanlış anlama", "There was a small misunderstanding."],
      ["thought", "thawt", "sandım, düşündüm", "I thought it started at two."],
      ["summary", "SUM-uh-ree", "özet", "I asked for a quick summary."],
      ["catch up", "kach up", "yetişmek", "I wanted to catch up."],
    ],
    review: [
      ["fillBlank", "There was a small ____.", "misunderstanding"],
      ["recall", "Write the sentence with I thought.", "I thought it started at two."],
      ["shortAnswer", "Answer in English: What did you ask for?", "I asked for a quick summary."],
    ],
  },
  {
    day: 32,
    theme: "Describing a favorite tool",
    speakingGoal: "Describe something useful and explain why you use it.",
    transcript:
      "One tool I use every day is my notes app. It is simple, but it keeps my ideas in one place. When I think of something important, I write it down before I forget it.",
    keyLines: [
      "One tool I use every day is my notes app.",
      "It keeps my ideas in one place.",
      "I write it down before I forget it.",
      "It is simple, but useful.",
    ],
    miniTaskTr:
      "Araç tanıtımı ve sebep cümlelerini dinle. Keeps, in one place ve write it down ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a tool you use often.",
    words: [
      ["tool", "tool", "araç", "One tool I use every day is my notes app."],
      ["in one place", "in wun plays", "tek yerde", "It keeps my ideas in one place."],
      ["write it down", "ryt it down", "not almak", "I write it down before I forget it."],
      ["useful", "YOOS-fuhl", "faydalı", "It is simple, but useful."],
    ],
    review: [
      ["fillBlank", "It keeps my ideas in one ____.", "place"],
      ["recall", "Write the sentence about the notes app.", "One tool I use every day is my notes app."],
      ["shortAnswer", "Answer in English: What do you do before you forget?", "I write it down."],
    ],
  },
  {
    day: 33,
    theme: "Explaining what you learned",
    speakingGoal: "Say what you learned and how you will use it.",
    transcript:
      "Today I learned a faster way to organize my tasks. I used to write everything in one long list, but now I group tasks by project. It feels cleaner, and I can decide what to do next more quickly.",
    keyLines: [
      "I learned a faster way to organize my tasks.",
      "I used to write everything in one long list.",
      "Now I group tasks by project.",
      "I can decide what to do next more quickly.",
    ],
    miniTaskTr:
      "Öğrenme ve değişim cümlelerini dinle. Used to ve now karşılaştırmasını yakala.",
    outputPrompt: "Write 2 sentences about something you learned recently.",
    words: [
      ["learned", "lernd", "öğrendi", "I learned a faster way."],
      ["used to", "yoost to", "eskiden", "I used to write one long list."],
      ["group", "groop", "gruplamak", "I group tasks by project."],
      ["quickly", "KWIK-lee", "hızlıca", "I decide more quickly."],
    ],
    review: [
      ["fillBlank", "I learned a faster way to organize my ____.", "tasks"],
      ["recall", "Write the sentence with used to.", "I used to write everything in one long list."],
      ["shortAnswer", "Answer in English: How do you group tasks now?", "I group tasks by project."],
    ],
  },
  {
    day: 34,
    theme: "Giving feedback",
    speakingGoal: "Give simple, kind feedback with one suggestion.",
    transcript:
      "Your presentation was clear, and I liked the examples. One thing you could improve is the ending. If you finish with a short summary, people will remember your main point more easily.",
    keyLines: [
      "Your presentation was clear.",
      "I liked the examples.",
      "One thing you could improve is the ending.",
      "Finish with a short summary.",
    ],
    miniTaskTr:
      "Olumlu geri bildirim ve öneri cümlelerini dinle. Could improve ve summary ifadelerine odaklan.",
    outputPrompt: "Write 2 sentences giving kind feedback.",
    words: [
      ["presentation", "prez-en-TAY-shuhn", "sunum", "Your presentation was clear."],
      ["improve", "im-PROOV", "geliştirmek", "One thing you could improve is the ending."],
      ["ending", "EN-ding", "kapanış", "The ending could be stronger."],
      ["summary", "SUM-uh-ree", "özet", "Finish with a short summary."],
    ],
    review: [
      ["fillBlank", "Your presentation was ____.", "clear"],
      ["recall", "Write the sentence about improving the ending.", "One thing you could improve is the ending."],
      ["shortAnswer", "Answer in English: What should they finish with?", "They should finish with a short summary."],
    ],
  },
  {
    day: 35,
    theme: "Talking about a goal",
    speakingGoal: "Describe a goal and the next small step.",
    transcript:
      "My goal is to speak more comfortably in short meetings. I do not need perfect English; I need clear English. This week, I will prepare two useful sentences before each meeting.",
    keyLines: [
      "My goal is to speak more comfortably.",
      "I do not need perfect English.",
      "I need clear English.",
      "I will prepare two useful sentences before each meeting.",
    ],
    miniTaskTr:
      "Hedef ve küçük adım cümlelerini dinle. Goal, perfect, clear ve prepare ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about one English goal and one next step.",
    words: [
      ["goal", "gohl", "hedef", "My goal is to speak more comfortably."],
      ["comfortably", "KUMF-ter-buh-lee", "rahatça", "I want to speak comfortably."],
      ["perfect", "PER-fekt", "mükemmel", "I do not need perfect English."],
      ["prepare", "pri-PAIR", "hazırlamak", "I will prepare two useful sentences."],
    ],
    review: [
      ["fillBlank", "I do not need ____ English.", "perfect"],
      ["recall", "Write the sentence with my goal.", "My goal is to speak more comfortably."],
      ["shortAnswer", "Answer in English: What will you prepare?", "I will prepare two useful sentences."],
    ],
  },
  {
    day: 36,
    theme: "Handling a small complaint",
    speakingGoal: "Explain a problem politely and ask for a solution.",
    transcript:
      "Excuse me, I think there is a problem with my order. I asked for a salad without onions, but this one has onions. Could you please check it and bring the correct one when you have a moment?",
    keyLines: [
      "There is a problem with my order.",
      "I asked for a salad without onions.",
      "This one has onions.",
      "Could you please check it?",
    ],
    miniTaskTr:
      "Kibar şikayet cümlelerini dinle. Problem, asked for, without ve could you please yapılarını yakala.",
    outputPrompt: "Write 2 polite sentences about a small service problem.",
    words: [
      ["order", "OR-der", "sipariş", "There is a problem with my order."],
      ["without", "with-OWT", "olmadan", "I asked for a salad without onions."],
      ["check", "chek", "kontrol etmek", "Could you please check it?"],
      ["correct one", "kuh-REKT wun", "doğru olan", "Please bring the correct one."],
    ],
    review: [
      ["fillBlank", "There is a problem with my ____.", "order"],
      ["recall", "Write the sentence with without onions.", "I asked for a salad without onions."],
      ["shortAnswer", "Answer in English: What should they check?", "They should check the order."],
    ],
  },
  {
    day: 37,
    theme: "Explaining your opinion at work",
    speakingGoal: "Share a workplace opinion and give a practical reason.",
    transcript:
      "I think we should test the new page with a few users before we launch it. The design looks good, but real feedback will show us what is confusing. A short test can save us time later.",
    keyLines: [
      "We should test the new page with a few users.",
      "The design looks good.",
      "Real feedback will show us what is confusing.",
      "A short test can save us time later.",
    ],
    miniTaskTr:
      "Fikir, gerekçe ve sonuç cümlelerini dinle. Should, feedback ve save time ifadelerini tekrar et.",
    outputPrompt: "Write 2 sentences with a work or study opinion and a reason.",
    words: [
      ["launch", "lawnch", "yayına almak, başlatmak", "We should test it before we launch it."],
      ["feedback", "FEED-bak", "geri bildirim", "Real feedback will help us."],
      ["confusing", "kuhn-FYOO-zing", "kafa karıştırıcı", "Feedback shows what is confusing."],
      ["save time", "sayv time", "zaman kazandırmak", "A short test can save us time."],
    ],
    review: [
      ["fillBlank", "A short test can save us ____ later.", "time"],
      ["recall", "Write the sentence about feedback.", "Real feedback will show us what is confusing."],
      ["shortAnswer", "Answer in English: What should you test?", "We should test the new page."],
    ],
  },
  {
    day: 38,
    theme: "Talking about travel plans",
    speakingGoal: "Explain where you want to go and what you need to arrange.",
    transcript:
      "I want to take a short trip next month. I have not chosen the city yet, but I want somewhere quiet and easy to reach. First, I need to check dates, prices, and train times.",
    keyLines: [
      "I want to take a short trip next month.",
      "I have not chosen the city yet.",
      "I want somewhere quiet and easy to reach.",
      "I need to check dates, prices, and train times.",
    ],
    miniTaskTr:
      "Seyahat planı ve hazırlık cümlelerini dinle. Have not chosen yet ve easy to reach ifadelerine dikkat et.",
    outputPrompt: "Write 2 sentences about a trip you want to take.",
    words: [
      ["trip", "trip", "gezi", "I want to take a short trip."],
      ["chosen", "CHOH-zuhn", "seçmiş", "I have not chosen the city yet."],
      ["easy to reach", "EE-zee to reech", "ulaşması kolay", "I want somewhere easy to reach."],
      ["prices", "PRY-siz", "fiyatlar", "I need to check prices."],
    ],
    review: [
      ["fillBlank", "I have not chosen the city ____.", "yet"],
      ["recall", "Write the sentence about the short trip.", "I want to take a short trip next month."],
      ["shortAnswer", "Answer in English: What do you need to check?", "I need to check dates, prices, and train times."],
    ],
  },
  {
    day: 39,
    theme: "Describing progress",
    speakingGoal: "Talk about what is getting better and what still needs work.",
    transcript:
      "My listening is getting better because I practice every day. I can catch more words now, even when I do not understand everything. Speaking is still harder, but I feel more willing to try.",
    keyLines: [
      "My listening is getting better.",
      "I can catch more words now.",
      "I do not understand everything.",
      "I feel more willing to try.",
    ],
    miniTaskTr:
      "Gelişim ve zorluk cümlelerini dinle. Getting better, catch more words ve willing to try ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about your English progress.",
    words: [
      ["getting better", "GET-ing BET-er", "daha iyi oluyor", "My listening is getting better."],
      ["catch", "kach", "yakalamak", "I can catch more words now."],
      ["willing", "WIL-ing", "istekli", "I feel more willing to try."],
      ["harder", "HAR-der", "daha zor", "Speaking is still harder."],
    ],
    review: [
      ["fillBlank", "My listening is getting ____.", "better"],
      ["recall", "Write the sentence about catching words.", "I can catch more words now."],
      ["shortAnswer", "Answer in English: What is still harder?", "Speaking is still harder."],
    ],
  },
  {
    day: 40,
    theme: "Explaining a simple routine change",
    speakingGoal: "Say what you changed and why it helps.",
    transcript:
      "I changed my morning routine this week. I put my phone away for the first twenty minutes and make breakfast without checking messages. It helps me start the day with a calmer mind.",
    keyLines: [
      "I changed my morning routine.",
      "I put my phone away.",
      "I make breakfast without checking messages.",
      "It helps me start the day with a calmer mind.",
    ],
    miniTaskTr:
      "Rutin değişikliği ve fayda cümlelerini dinle. Put away, without checking ve calmer mind ifadelerini tekrar et.",
    outputPrompt: "Write 2 sentences about a routine change that helps you.",
    words: [
      ["put away", "put uh-WAY", "kenara koymak", "I put my phone away."],
      ["without checking", "with-OWT CHEK-ing", "kontrol etmeden", "I make breakfast without checking messages."],
      ["calmer", "KAHM-er", "daha sakin", "I start with a calmer mind."],
      ["mind", "mynd", "zihin", "It helps my mind feel calmer."],
    ],
    review: [
      ["fillBlank", "I put my phone ____.", "away"],
      ["recall", "Write the sentence about breakfast.", "I make breakfast without checking messages."],
      ["shortAnswer", "Answer in English: Why does it help?", "It helps me start the day with a calmer mind."],
    ],
  },
  {
    day: 41,
    theme: "Making a recommendation",
    speakingGoal: "Recommend something and explain who it is good for.",
    transcript:
      "I recommend this podcast if you want short listening practice. The episodes are only ten minutes, and the speakers use clear everyday English. It is good for busy people who want regular practice.",
    keyLines: [
      "I recommend this podcast.",
      "The episodes are only ten minutes.",
      "The speakers use clear everyday English.",
      "It is good for busy people.",
    ],
    miniTaskTr:
      "Tavsiye ve sebep cümlelerini dinle. Recommend, episodes ve good for ifadelerini yakala.",
    outputPrompt: "Write 2 sentences recommending something useful.",
    words: [
      ["recommend", "rek-uh-MEND", "tavsiye etmek", "I recommend this podcast."],
      ["episodes", "EP-i-sohdz", "bölümler", "The episodes are only ten minutes."],
      ["speakers", "SPEE-kerz", "konuşmacılar", "The speakers use clear English."],
      ["regular", "REG-yuh-ler", "düzenli", "Busy people need regular practice."],
    ],
    review: [
      ["fillBlank", "I recommend this ____.", "podcast"],
      ["recall", "Write the sentence about the episodes.", "The episodes are only ten minutes."],
      ["shortAnswer", "Answer in English: Who is it good for?", "It is good for busy people."],
    ],
  },
  {
    day: 42,
    theme: "Six-week speaking check",
    speakingGoal: "Summarize what you can do now and set the next speaking target.",
    transcript:
      "After six weeks, I can speak about my routine, plans, problems, and opinions more clearly. I still pause sometimes, but I do not stop. My next goal is to speak for one full minute about a familiar topic.",
    keyLines: [
      "I can speak about my routine and plans more clearly.",
      "I still pause sometimes, but I do not stop.",
      "My next goal is to speak for one full minute.",
      "I want to talk about a familiar topic.",
    ],
    miniTaskTr:
      "Altı haftalık gelişimi dinle. Can speak, still pause, next goal ve familiar topic ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about your progress and next speaking target.",
    words: [
      ["clearly", "KLEER-lee", "net şekilde", "I can speak more clearly."],
      ["pause", "pawz", "duraklamak", "I still pause sometimes."],
      ["full minute", "fool MIN-it", "tam bir dakika", "I want to speak for one full minute."],
      ["familiar topic", "fuh-MIL-yur TOP-ik", "tanıdık konu", "I can talk about a familiar topic."],
    ],
    review: [
      ["fillBlank", "I still pause sometimes, but I do not ____.", "stop"],
      ["recall", "Write the sentence about the next goal.", "My next goal is to speak for one full minute."],
      ["shortAnswer", "Answer in English: What can you speak about more clearly?", "I can speak about my routine, plans, problems, and opinions more clearly."],
    ],
  },
];

export const phaseSevenDayPlans = phaseSevenDays.map((day) => ({
  day: day.day,
  theme: day.theme,
  speakingGoal: day.speakingGoal,
}));

export const phaseSevenListeningDrills = phaseSevenDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Listening: ${day.theme}`,
  focus: day.speakingGoal,
  transcriptExcerpt: day.transcript,
  keyLines: day.keyLines,
  miniTaskTr: day.miniTaskTr,
  outputPrompt: day.outputPrompt,
}));

export const phaseSevenDayWords = phaseSevenDays.map((day) => ({
  day: day.day,
  title: day.theme,
  words: day.words.map(([word, pronunciation, shortMeaningTr, exampleSentence]) => ({
    word,
    pronunciation,
    shortMeaningTr,
    exampleSentence,
  })),
}));

export const phaseSevenSpeakingPractices = phaseSevenDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Speaking: ${day.theme}`,
  prompt: `${day.speakingGoal} Use your own life if possible.`,
  speakingTipsTr:
    "Önce kısa ve anlaşılır konuş. İkinci denemede aynı fikri daha düzenli, daha net ve daha doğal söyle.",
  targetLines: day.keyLines,
  selfCheckItems: [
    "Konuyu kendi hayatıma bağladım mı?",
    ...selfCheckItems,
  ],
  miniGoalTr: "Mini hedef: 30-45 saniye konuş ve ikinci denemede bir cümleyi iyileştir.",
}));

export const phaseSevenReviewDrills = phaseSevenDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Review: ${day.theme}`,
  shortIntroTr: reviewIntroTr,
  reviewItems: day.review.map(([type, prompt, expectedAnswer]) => ({
    type: type as ReviewSeedType,
    prompt,
    expectedAnswer,
  })),
}));
