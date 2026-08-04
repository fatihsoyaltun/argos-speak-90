const reviewIntroTr =
  "Cevabı önce hatırlamaya çalış. Sonra kısa yaz ve kontrol et. Amaç konuşurken kullanabileceğin cümleyi geri çağırmak.";

const selfCheckItems = [
  "En az 4 cümle kurdum mu?",
  "Bir sebep, detay veya örnek ekledim mi?",
  "İkinci denemede daha akıcı konuştum mu?",
];

type ReviewSeedType = "recall" | "fillBlank" | "shortAnswer";

const phaseEightDays = [
  {
    day: 43,
    theme: "Explaining a better morning routine",
    speakingGoal: "Explain what helps your morning work better and give one reason.",
    transcript:
      "My mornings work better when I prepare one small thing the night before. I put my bag near the door and choose my clothes early. It saves time, and I feel less rushed when the day starts.",
    keyLines: [
      "My mornings work better when I prepare one small thing.",
      "I put my bag near the door.",
      "It saves time.",
      "I feel less rushed when the day starts.",
    ],
    miniTaskTr:
      "Daha iyi rutin anlatımını dinle. When, saves time ve less rushed ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about one thing that improves your morning.",
    words: [
      ["prepare", "pri-PAIR", "hazırlamak", "I prepare one small thing the night before."],
      ["near the door", "neer thuh dor", "kapının yanında", "I put my bag near the door."],
      ["saves time", "sayvz tym", "zaman kazandırır", "It saves time."],
      ["less rushed", "les rusht", "daha az aceleci", "I feel less rushed."],
    ],
    review: [
      ["fillBlank", "It saves ____.", "time"],
      ["recall", "Write the sentence about the bag.", "I put my bag near the door."],
      ["shortAnswer", "Answer in English: Why does preparation help?", "It saves time, and I feel less rushed."],
    ],
  },
  {
    day: 44,
    theme: "Giving a clear reason",
    speakingGoal: "Give an opinion and support it with a simple reason.",
    transcript:
      "I prefer short meetings because people stay focused. When a meeting is too long, everyone gets tired and the main point becomes unclear. For me, thirty minutes is usually enough.",
    keyLines: [
      "I prefer short meetings.",
      "People stay focused.",
      "The main point becomes unclear.",
      "Thirty minutes is usually enough.",
    ],
    miniTaskTr:
      "Fikir ve sebep bağlantısını dinle. Prefer, because ve enough yapılarına dikkat et.",
    outputPrompt: "Write 2 sentences with one opinion and one clear reason.",
    words: [
      ["prefer", "pri-FER", "tercih etmek", "I prefer short meetings."],
      ["stay focused", "stay FOH-kuhst", "odaklı kalmak", "People stay focused."],
      ["main point", "mayn poynt", "ana nokta", "The main point becomes unclear."],
      ["enough", "i-NUF", "yeterli", "Thirty minutes is usually enough."],
    ],
    review: [
      ["fillBlank", "I prefer short meetings because people stay ____.", "focused"],
      ["recall", "Write the sentence about thirty minutes.", "Thirty minutes is usually enough."],
      ["shortAnswer", "Answer in English: What happens when a meeting is too long?", "The main point becomes unclear."],
    ],
  },
  {
    day: 45,
    theme: "Describing a useful experience",
    speakingGoal: "Describe an experience and say what you learned from it.",
    transcript:
      "Last month, I gave a short update in English at work. I was nervous at first, but I prepared three clear points. The update went well, and I learned that simple language can still sound professional.",
    keyLines: [
      "I gave a short update in English.",
      "I was nervous at first.",
      "I prepared three clear points.",
      "Simple language can still sound professional.",
    ],
    miniTaskTr:
      "Geçmiş deneyim ve öğrenilen dersi dinle. Nervous, prepared ve learned ifadelerini ayır.",
    outputPrompt: "Write 2 sentences about an experience that taught you something.",
    words: [
      ["update", "UP-dayt", "kısa bilgilendirme", "I gave a short update in English."],
      ["nervous", "NER-vuhs", "gergin", "I was nervous at first."],
      ["clear points", "kleer poynts", "net noktalar", "I prepared three clear points."],
      ["professional", "pruh-FESH-uh-nuhl", "profesyonel", "Simple language can sound professional."],
    ],
    review: [
      ["fillBlank", "I was nervous at ____.", "first"],
      ["recall", "Write the sentence about clear points.", "I prepared three clear points."],
      ["shortAnswer", "Answer in English: What did you learn?", "Simple language can still sound professional."],
    ],
  },
  {
    day: 46,
    theme: "Short work check-in",
    speakingGoal: "Give a short work or study update with progress and next steps.",
    transcript:
      "Here is a quick update. I finished the first part of the task, and I am checking the details now. If everything looks fine, I will send the final version this afternoon.",
    keyLines: [
      "Here is a quick update.",
      "I finished the first part of the task.",
      "I am checking the details now.",
      "I will send the final version this afternoon.",
    ],
    miniTaskTr:
      "Kısa güncelleme dilini dinle. Finished, checking ve final version ifadelerini yakala.",
    outputPrompt: "Write 2 sentences giving a short update on a task.",
    words: [
      ["quick update", "kwik UP-dayt", "kısa güncelleme", "Here is a quick update."],
      ["first part", "furst part", "ilk bölüm", "I finished the first part."],
      ["checking", "CHEK-ing", "kontrol ediyorum", "I am checking the details now."],
      ["final version", "FY-nuhl VER-zhuhn", "son versiyon", "I will send the final version."],
    ],
    review: [
      ["fillBlank", "Here is a quick ____.", "update"],
      ["recall", "Write the sentence about checking details.", "I am checking the details now."],
      ["shortAnswer", "Answer in English: When will you send the final version?", "I will send the final version this afternoon."],
    ],
  },
  {
    day: 47,
    theme: "Explaining a small problem clearly",
    speakingGoal: "Explain a problem without panic and say what you need.",
    transcript:
      "I am having trouble opening the file. The link works, but the document does not load on my laptop. Could you send it again or share it in another format?",
    keyLines: [
      "I am having trouble opening the file.",
      "The document does not load on my laptop.",
      "Could you send it again?",
      "Could you share it in another format?",
    ],
    miniTaskTr:
      "Problem ve rica cümlelerini dinle. Having trouble, does not load ve another format ifadelerini tekrar et.",
    outputPrompt: "Write 2 sentences explaining a small technical problem.",
    words: [
      ["having trouble", "HAV-ing TRUB-uhl", "zorlanıyorum", "I am having trouble opening the file."],
      ["load", "lohd", "yüklenmek", "The document does not load."],
      ["again", "uh-GEN", "tekrar", "Could you send it again?"],
      ["another format", "uh-NUTH-er FOR-mat", "başka format", "Share it in another format."],
    ],
    review: [
      ["fillBlank", "The document does not ____ on my laptop.", "load"],
      ["recall", "Write the sentence with: having trouble.", "I am having trouble opening the file."],
      ["shortAnswer", "Answer in English: What can the other person do?", "They can send it again or share it in another format."],
    ],
  },
  {
    day: 48,
    theme: "Clarifying a device setting",
    speakingGoal:
      "Ask for clarification about a selected light or filter without sounding too direct.",
    transcript:
      "Before we capture the image, could you check the selected light group? I understood the general idea, but I am not sure which motorized filter we need. Could you confirm the selected filter?",
    keyLines: [
      "Could you check the selected light group?",
      "I understood the general idea.",
      "I am not sure which motorized filter we need.",
      "Could you confirm the selected filter?",
    ],
    miniTaskTr:
      "Cihaz ayarı hakkında açıklama isteme dilini dinle. Selected light group, motorized filter ve selected filter ifadelerini yakala.",
    outputPrompt: "Write 2 polite sentences asking for clarification.",
    words: [
      ["light group", "lyt groop", "ışık grubu", "Could you check the selected light group?"],
      ["general idea", "JEN-er-uhl eye-DEE-uh", "genel fikir", "I understood the general idea."],
      ["motorized filter", "MOH-ter-yzd FIL-ter", "motorlu filtre", "Which motorized filter do we need?"],
      ["selected filter", "suh-LEK-tid FIL-ter", "seçili filtre", "Could you confirm the selected filter?"],
    ],
    review: [
      ["fillBlank", "Could you check the selected light ____?", "group"],
      ["recall", "Write the sentence about the general idea.", "I understood the general idea."],
      ["shortAnswer", "Ask one polite question about the selected filter.", "Could you confirm the selected filter?"],
    ],
  },
  {
    day: 49,
    theme: "Planning a meeting time",
    speakingGoal: "Suggest a time and offer a simple alternative.",
    transcript:
      "Can we meet at three tomorrow? I have a call before lunch, so the morning is difficult for me. If three does not work, I can also do four thirty.",
    keyLines: [
      "Can we meet at three tomorrow?",
      "I have a call before lunch.",
      "The morning is difficult for me.",
      "I can also do four thirty.",
    ],
    miniTaskTr:
      "Planlama ve alternatif sunma cümlelerini dinle. Can we, difficult for me ve I can also do yapılarını fark et.",
    outputPrompt: "Write 2 sentences suggesting a meeting time.",
    words: [
      ["meet", "meet", "buluşmak/toplanmak", "Can we meet at three tomorrow?"],
      ["before lunch", "bi-FOR lunch", "öğle yemeğinden önce", "I have a call before lunch."],
      ["difficult for me", "DIF-i-kuhlt for mee", "benim için zor", "The morning is difficult for me."],
      ["also", "AWL-soh", "ayrıca", "I can also do four thirty."],
    ],
    review: [
      ["fillBlank", "Can we meet at three ____?", "tomorrow"],
      ["recall", "Write the sentence about the morning.", "The morning is difficult for me."],
      ["shortAnswer", "Answer in English: What alternative time can you do?", "I can also do four thirty."],
    ],
  },
  {
    day: 50,
    theme: "Describing a favorite place",
    speakingGoal: "Describe a place and explain why it feels good to be there.",
    transcript:
      "My favorite place in the city is a small park near the water. It is not fancy, but it is peaceful in the early evening. I go there when I need space to think.",
    keyLines: [
      "My favorite place is a small park.",
      "It is peaceful in the early evening.",
      "I go there when I need space to think.",
      "It is not fancy, but it feels good.",
    ],
    miniTaskTr:
      "Yer tarifini ve his açıklamasını dinle. Favorite place, peaceful ve space to think ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a place that feels good to you.",
    words: [
      ["favorite place", "FAY-vuh-rit plays", "favori yer", "My favorite place is a small park."],
      ["peaceful", "PEES-fuhl", "huzurlu", "It is peaceful in the early evening."],
      ["fancy", "FAN-see", "lüks/gösterişli", "It is not fancy."],
      ["space to think", "spays to think", "düşünmek için alan", "I need space to think."],
    ],
    review: [
      ["fillBlank", "It is peaceful in the early ____.", "evening"],
      ["recall", "Write the sentence about space to think.", "I go there when I need space to think."],
      ["shortAnswer", "Answer in English: What is your favorite place?", "My favorite place is a small park near the water."],
    ],
  },
  {
    day: 51,
    theme: "Describing someone you trust",
    speakingGoal: "Describe a person and explain why you trust them.",
    transcript:
      "I trust my friend Ali because he listens carefully and gives honest advice. He does not pretend to know everything. When I have a problem, he asks good questions before he gives an opinion.",
    keyLines: [
      "I trust my friend Ali.",
      "He listens carefully.",
      "He gives honest advice.",
      "He asks good questions before he gives an opinion.",
    ],
    miniTaskTr:
      "Güven anlatımını dinle. Trust, honest advice ve before he gives an opinion ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about someone you trust.",
    words: [
      ["trust", "trust", "güvenmek", "I trust my friend Ali."],
      ["carefully", "KAIR-fuh-lee", "dikkatlice", "He listens carefully."],
      ["honest advice", "ON-ist ad-VYS", "dürüst tavsiye", "He gives honest advice."],
      ["pretend", "pri-TEND", "gibi yapmak", "He does not pretend to know everything."],
    ],
    review: [
      ["fillBlank", "He gives honest ____.", "advice"],
      ["recall", "Write the sentence about listening.", "He listens carefully."],
      ["shortAnswer", "Answer in English: Why do you trust him?", "He listens carefully and gives honest advice."],
    ],
  },
  {
    day: 52,
    theme: "Making a polite request",
    speakingGoal: "Make a request and explain why you need it.",
    transcript:
      "Could you give me two more days for the report? I want to check the numbers carefully before I send it. I can share a short update today and send the full report on Friday.",
    keyLines: [
      "Could you give me two more days?",
      "I want to check the numbers carefully.",
      "I can share a short update today.",
      "I can send the full report on Friday.",
    ],
    miniTaskTr:
      "Kibar rica ve gerekçe cümlelerini dinle. Two more days, check carefully ve full report ifadelerini yakala.",
    outputPrompt: "Write 2 sentences making a polite request.",
    words: [
      ["two more days", "too mor dayz", "iki gün daha", "Could you give me two more days?"],
      ["numbers", "NUM-berz", "rakamlar", "I want to check the numbers carefully."],
      ["short update", "short UP-dayt", "kısa güncelleme", "I can share a short update today."],
      ["full report", "fool ri-PORT", "tam rapor", "I can send the full report on Friday."],
    ],
    review: [
      ["fillBlank", "Could you give me two more ____?", "days"],
      ["recall", "Write the sentence about checking numbers.", "I want to check the numbers carefully."],
      ["shortAnswer", "Answer in English: When can you send the full report?", "I can send the full report on Friday."],
    ],
  },
  {
    day: 53,
    theme: "Handling an everyday conversation",
    speakingGoal: "Keep a short conversation going with a follow-up question.",
    transcript:
      "I met a new neighbor yesterday. She said she moved here last week, so I asked how she liked the area. We talked for a few minutes, and I recommended a bakery nearby.",
    keyLines: [
      "I met a new neighbor yesterday.",
      "She moved here last week.",
      "I asked how she liked the area.",
      "I recommended a bakery nearby.",
    ],
    miniTaskTr:
      "Kısa sohbet akışını dinle. Met, moved, asked ve recommended ifadelerini takip et.",
    outputPrompt: "Write 2 sentences about a short conversation you had.",
    words: [
      ["neighbor", "NAY-ber", "komşu", "I met a new neighbor yesterday."],
      ["moved here", "moovd heer", "buraya taşındı", "She moved here last week."],
      ["area", "AIR-ee-uh", "bölge", "I asked how she liked the area."],
      ["nearby", "NEER-by", "yakında", "I recommended a bakery nearby."],
    ],
    review: [
      ["fillBlank", "I met a new ____ yesterday.", "neighbor"],
      ["recall", "Write the sentence about the area.", "I asked how she liked the area."],
      ["shortAnswer", "Answer in English: What did you recommend?", "I recommended a bakery nearby."],
    ],
  },
  {
    day: 54,
    theme: "Summarizing a busy day",
    speakingGoal: "Summarize what happened and say what went well.",
    transcript:
      "Today was busy, but it went better than I expected. I answered most of my messages, finished one important task, and had a helpful call with my team. The best part was that I stayed calm.",
    keyLines: [
      "Today was busy, but it went better than I expected.",
      "I answered most of my messages.",
      "I had a helpful call with my team.",
      "The best part was that I stayed calm.",
    ],
    miniTaskTr:
      "Gün özeti ve olumlu sonuç cümlelerini dinle. Better than expected, helpful call ve best part ifadelerini yakala.",
    outputPrompt: "Write 2 sentences summarizing a busy day.",
    words: [
      ["expected", "ik-SPEK-tid", "bekledi", "It went better than I expected."],
      ["most of", "mohst uv", "çoğu", "I answered most of my messages."],
      ["helpful", "HELP-fuhl", "yardımcı", "I had a helpful call."],
      ["stayed calm", "stayd kahm", "sakin kaldı", "I stayed calm."],
    ],
    review: [
      ["fillBlank", "It went better than I ____.", "expected"],
      ["recall", "Write the sentence about the helpful call.", "I had a helpful call with my team."],
      ["shortAnswer", "Answer in English: What was the best part?", "The best part was that I stayed calm."],
    ],
  },
  {
    day: 55,
    theme: "Explaining a preference with comparison",
    speakingGoal: "Compare two options and explain which one works better for you.",
    transcript:
      "I like studying with videos, but speaking practice works better for me. Videos help me understand new phrases, but speaking helps me remember them. That is why I try to say new sentences out loud.",
    keyLines: [
      "Speaking practice works better for me.",
      "Videos help me understand new phrases.",
      "Speaking helps me remember them.",
      "I try to say new sentences out loud.",
    ],
    miniTaskTr:
      "Karşılaştırma ve tercih cümlelerini dinle. Works better, helps me remember ve out loud ifadelerini yakala.",
    outputPrompt: "Write 2 sentences comparing two ways to learn.",
    words: [
      ["works better", "wurks BET-er", "daha iyi işe yarar", "Speaking practice works better for me."],
      ["phrases", "FRAY-ziz", "ifadeler", "Videos help me understand new phrases."],
      ["remember", "ri-MEM-ber", "hatırlamak", "Speaking helps me remember them."],
      ["out loud", "owt lowd", "sesli şekilde", "I say new sentences out loud."],
    ],
    review: [
      ["fillBlank", "Speaking practice works ____ for me.", "better"],
      ["recall", "Write the sentence about videos.", "Videos help me understand new phrases."],
      ["shortAnswer", "Answer in English: Why do you speak out loud?", "Speaking helps me remember new phrases."],
    ],
  },
  {
    day: 56,
    theme: "Talking about a recent mistake",
    speakingGoal: "Describe a mistake and explain what you will do differently.",
    transcript:
      "I made a small mistake in an email yesterday. I forgot to attach the file, so the client had to ask for it again. Next time, I will check the attachment before I press send.",
    keyLines: [
      "I made a small mistake in an email.",
      "I forgot to attach the file.",
      "The client had to ask for it again.",
      "I will check the attachment before I press send.",
    ],
    miniTaskTr:
      "Hata ve gelecek çözüm dilini dinle. Forgot, attach ve next time ifadelerine odaklan.",
    outputPrompt: "Write 2 sentences about a small mistake and your next step.",
    words: [
      ["mistake", "mi-STAYK", "hata", "I made a small mistake."],
      ["attach", "uh-TACH", "eklemek", "I forgot to attach the file."],
      ["client", "KLY-uhnt", "müşteri", "The client had to ask again."],
      ["attachment", "uh-TACH-muhnt", "ek dosya", "I will check the attachment."],
    ],
    review: [
      ["fillBlank", "I forgot to attach the ____.", "file"],
      ["recall", "Write the sentence about next time.", "Next time, I will check the attachment before I press send."],
      ["shortAnswer", "Answer in English: What mistake did you make?", "I forgot to attach the file."],
    ],
  },
  {
    day: 57,
    theme: "Giving feedback about an export-format request",
    speakingGoal:
      "Give calm feedback about an example export-format request without presenting it as a universal device rule.",
    transcript:
      "The image looks ready, but this case request asks for WSQ today, not TIFF. That is the requested format for this example, not a general device rule. Could you export it again in the requested format?",
    keyLines: [
      "The image looks ready.",
      "This case request asks for WSQ today, not TIFF.",
      "This is an example request, not a general device rule.",
      "Could you export it again in the requested format?",
    ],
    miniTaskTr:
      "Sakin geri bildirim dilini dinle. Case request, WSQ, TIFF ve requested format ifadelerini yakala. Bunun genel bir cihaz kuralı olmadığını fark et.",
    outputPrompt: "Write 2 sentences asking for feedback.",
    words: [
      ["export format", "EK-sport FOR-mat", "dışa aktarma formatı", "Please use the requested export format."],
      ["WSQ", "dub-uhl-yoo es kyoo", "WSQ formatı", "This case request asks for WSQ today."],
      ["TIFF", "tif", "TIFF formatı", "This example does not request TIFF today."],
      ["case request", "kays ri-KWEST", "vaka talebi", "Please check the case request first."],
    ],
    review: [
      ["fillBlank", "This case request asks for ____ today.", "WSQ"],
      ["recall", "Write the sentence about the example request.", "This is an example request, not a general device rule."],
      ["shortAnswer", "Ask politely for the requested export format.", "Could you export it again in the requested format?"],
    ],
  },
  {
    day: 58,
    theme: "Making plans with a friend",
    speakingGoal: "Suggest a plan and adjust it naturally.",
    transcript:
      "Do you want to get coffee after work on Friday? I can meet around six, but I may need to leave by seven thirty. If that is too short, we can choose Saturday instead.",
    keyLines: [
      "Do you want to get coffee after work?",
      "I can meet around six.",
      "I may need to leave by seven thirty.",
      "We can choose Saturday instead.",
    ],
    miniTaskTr:
      "Arkadaşla plan yapma dilini dinle. Around, may need ve instead ifadelerini yakala.",
    outputPrompt: "Write 2 sentences suggesting a simple plan with a friend.",
    words: [
      ["get coffee", "get KAW-fee", "kahve içmek", "Do you want to get coffee?"],
      ["around six", "uh-ROWND siks", "altı civarı", "I can meet around six."],
      ["leave by", "leev by", "en geç ayrılmak", "I need to leave by seven thirty."],
      ["instead", "in-STED", "onun yerine", "We can choose Saturday instead."],
    ],
    review: [
      ["fillBlank", "I can meet around ____.", "six"],
      ["recall", "Write the sentence about Saturday.", "We can choose Saturday instead."],
      ["shortAnswer", "Answer in English: When may you need to leave?", "I may need to leave by seven thirty."],
    ],
  },
  {
    day: 59,
    theme: "Describing a learning habit",
    speakingGoal: "Describe a habit and say how it helps you improve.",
    transcript:
      "I keep a short list of phrases I want to use. I do not write too many words because I want the list to stay useful. At night, I choose one phrase and make two new sentences with it.",
    keyLines: [
      "I keep a short list of phrases.",
      "I want the list to stay useful.",
      "I choose one phrase at night.",
      "I make two new sentences with it.",
    ],
    miniTaskTr:
      "Öğrenme alışkanlığını dinle. Keep a list, stay useful ve make sentences ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about one learning habit you have.",
    words: [
      ["keep a list", "keep uh list", "liste tutmak", "I keep a short list of phrases."],
      ["useful", "YOOS-fuhl", "faydalı", "I want the list to stay useful."],
      ["choose", "chooz", "seçmek", "I choose one phrase at night."],
      ["sentence", "SEN-tuhns", "cümle", "I make two new sentences."],
    ],
    review: [
      ["fillBlank", "I keep a short list of ____.", "phrases"],
      ["recall", "Write the sentence about two new sentences.", "I make two new sentences with it."],
      ["shortAnswer", "Answer in English: Why do you avoid too many words?", "I want the list to stay useful."],
    ],
  },
  {
    day: 60,
    theme: "Explaining what changed",
    speakingGoal: "Explain a change in your routine or work and how you feel about it.",
    transcript:
      "My schedule changed this week, so I start work one hour earlier. At first, it felt uncomfortable, but now I like finishing earlier in the afternoon. I have more energy for exercise after work.",
    keyLines: [
      "My schedule changed this week.",
      "I start work one hour earlier.",
      "At first, it felt uncomfortable.",
      "I have more energy for exercise after work.",
    ],
    miniTaskTr:
      "Değişim anlatımını dinle. Schedule changed, at first ve more energy ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about something that changed in your week.",
    words: [
      ["schedule", "SKEJ-ool", "program", "My schedule changed this week."],
      ["earlier", "ER-lee-er", "daha erken", "I start work one hour earlier."],
      ["uncomfortable", "un-KUHM-fer-tuh-buhl", "rahatsız", "It felt uncomfortable."],
      ["energy", "EN-er-jee", "enerji", "I have more energy after work."],
    ],
    review: [
      ["fillBlank", "My schedule changed this ____.", "week"],
      ["recall", "Write the sentence about exercise.", "I have more energy for exercise after work."],
      ["shortAnswer", "Answer in English: How did it feel at first?", "At first, it felt uncomfortable."],
    ],
  },
  {
    day: 61,
    theme: "Giving a short explanation",
    speakingGoal: "Explain why you made a decision in simple, clear English.",
    transcript:
      "I decided to take the train instead of driving. Parking is expensive downtown, and traffic is stressful in the evening. The train takes a little longer, but I can read and relax.",
    keyLines: [
      "I decided to take the train.",
      "Parking is expensive downtown.",
      "Traffic is stressful in the evening.",
      "I can read and relax.",
    ],
    miniTaskTr:
      "Karar ve açıklama cümlelerini dinle. Decided, instead of ve takes longer ifadelerine dikkat et.",
    outputPrompt: "Write 2 sentences explaining a simple decision.",
    words: [
      ["decided", "di-SY-did", "karar verdi", "I decided to take the train."],
      ["instead of", "in-STED uv", "yerine", "I took the train instead of driving."],
      ["downtown", "DOWN-town", "şehir merkezi", "Parking is expensive downtown."],
      ["stressful", "STRES-fuhl", "stresli", "Traffic is stressful."],
    ],
    review: [
      ["fillBlank", "I decided to take the ____.", "train"],
      ["recall", "Write the sentence about parking.", "Parking is expensive downtown."],
      ["shortAnswer", "Answer in English: Why is the train better?", "I can read and relax."],
    ],
  },
  {
    day: 62,
    theme: "Talking about a past trip",
    speakingGoal: "Describe a short trip and mention one memorable detail.",
    transcript:
      "I took a short trip to Izmir last spring. We walked by the sea, tried a small restaurant, and visited an old market. The most memorable part was the sunset near the water.",
    keyLines: [
      "I took a short trip to Izmir.",
      "We walked by the sea.",
      "We visited an old market.",
      "The most memorable part was the sunset.",
    ],
    miniTaskTr:
      "Geçmiş gezi anlatımını dinle. Took a trip, visited ve memorable part ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a short trip or visit.",
    words: [
      ["trip", "trip", "gezi", "I took a short trip to Izmir."],
      ["by the sea", "by thuh see", "deniz kenarında", "We walked by the sea."],
      ["market", "MAR-kit", "pazar", "We visited an old market."],
      ["memorable", "MEM-er-uh-buhl", "unutulmaz", "The sunset was memorable."],
    ],
    review: [
      ["fillBlank", "We walked by the ____.", "sea"],
      ["recall", "Write the sentence about the old market.", "We visited an old market."],
      ["shortAnswer", "Answer in English: What was the most memorable part?", "The most memorable part was the sunset."],
    ],
  },
  {
    day: 63,
    theme: "Checking understanding",
    speakingGoal: "Check that you understood someone correctly.",
    transcript:
      "Let me check if I understood you correctly. You want the first draft today, and the final version next Monday. Is that right, or did I miss something?",
    keyLines: [
      "Let me check if I understood you correctly.",
      "You want the first draft today.",
      "The final version is next Monday.",
      "Did I miss something?",
    ],
    miniTaskTr:
      "Anladığını kontrol etme dilini dinle. Understood correctly, first draft ve did I miss something ifadelerini tekrar et.",
    outputPrompt: "Write 2 sentences checking that you understood a plan.",
    words: [
      ["correctly", "kuh-REKT-lee", "doğru şekilde", "I understood you correctly."],
      ["first draft", "furst draft", "ilk taslak", "You want the first draft today."],
      ["final version", "FY-nuhl VER-zhuhn", "son versiyon", "The final version is next Monday."],
      ["miss something", "mis SUM-thing", "bir şeyi kaçırmak", "Did I miss something?"],
    ],
    review: [
      ["fillBlank", "Let me check if I understood you ____.", "correctly"],
      ["recall", "Write the sentence about the first draft.", "You want the first draft today."],
      ["shortAnswer", "Answer in English: When is the final version?", "The final version is next Monday."],
    ],
  },
  {
    day: 64,
    theme: "Describing an example contactless workflow",
    speakingGoal:
      "Describe a simple example with source-listed contactless, archive, and reporting language without presenting a full operating procedure.",
    transcript:
      "The source describes the workflow as contactless and lists an image archive and reporting features. We can describe a simple example with capture, archive, and report language. This is communication practice, not a full operating procedure.",
    keyLines: [
      "The source describes the workflow as contactless.",
      "The source lists an image archive.",
      "It also lists reporting features.",
      "This is not a full operating procedure.",
    ],
    miniTaskTr:
      "Kaynak kontrollü örnek workflow dilini dinle. Source describes, image archive, reporting features ve not a full operating procedure ifadelerini takip et.",
    outputPrompt: "Write 2 sentences explaining a simple process you do.",
    words: [
      ["contactless workflow", "KON-takt-les WURK-flow", "temassız iş akışı", "The source describes the workflow as contactless."],
      ["image archive", "IM-ij AR-kyv", "görüntü arşivi", "The source lists an image archive."],
      ["reporting feature", "ri-POR-ting FEE-cher", "raporlama özelliği", "The source lists reporting features."],
      ["operating procedure", "OP-uh-ray-ting proh-SEE-jer", "işletim prosedürü", "This is not a full operating procedure."],
    ],
    review: [
      ["fillBlank", "The source lists an image ____.", "archive"],
      ["recall", "Write the sentence about the procedure limit.", "This is not a full operating procedure."],
      ["shortAnswer", "Describe the source-listed workflow cautiously.", "The source describes the workflow as contactless and lists reporting features."],
    ],
  },
  {
    day: 65,
    theme: "Giving a balanced opinion",
    speakingGoal: "Say both sides of an opinion and then give your choice.",
    transcript:
      "Working from home has good and bad sides. It is quiet, and I can focus, but I miss quick conversations with my team. For deep work, I prefer home. For planning, I prefer the office.",
    keyLines: [
      "Working from home has good and bad sides.",
      "I can focus.",
      "I miss quick conversations with my team.",
      "For deep work, I prefer home.",
    ],
    miniTaskTr:
      "Dengeli fikir anlatımını dinle. Good and bad sides, but ve for deep work ifadelerini yakala.",
    outputPrompt: "Write 2 sentences giving a balanced opinion.",
    words: [
      ["good and bad sides", "good and bad sydz", "iyi ve kötü yanlar", "It has good and bad sides."],
      ["focus", "FOH-kuhs", "odaklanmak", "I can focus."],
      ["miss", "mis", "özlemek/eksikliğini hissetmek", "I miss quick conversations."],
      ["deep work", "deep wurk", "derin odak işi", "For deep work, I prefer home."],
    ],
    review: [
      ["fillBlank", "Working from home has good and bad ____.", "sides"],
      ["recall", "Write the sentence about quick conversations.", "I miss quick conversations with my team."],
      ["shortAnswer", "Answer in English: Where do you prefer deep work?", "For deep work, I prefer home."],
    ],
  },
  {
    day: 66,
    theme: "Talking about a difficult moment",
    speakingGoal: "Describe a difficult moment and how you handled it.",
    transcript:
      "During the presentation, I forgot one word and paused for a second. I did not stop. I used a simpler word, continued my sentence, and finished the explanation.",
    keyLines: [
      "I forgot one word and paused for a second.",
      "I did not stop.",
      "I used a simpler word.",
      "I finished the explanation.",
    ],
    miniTaskTr:
      "Zor an ve devam etme dilini dinle. Paused, did not stop ve simpler word ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a difficult moment you handled.",
    words: [
      ["paused", "pawzd", "durakladı", "I paused for a second."],
      ["simpler", "SIM-pler", "daha basit", "I used a simpler word."],
      ["continued", "kuhn-TIN-yood", "devam etti", "I continued my sentence."],
      ["explanation", "ek-spluh-NAY-shuhn", "açıklama", "I finished the explanation."],
    ],
    review: [
      ["fillBlank", "I paused for a ____.", "second"],
      ["recall", "Write the sentence about the simpler word.", "I used a simpler word."],
      ["shortAnswer", "Answer in English: What did you do when you forgot a word?", "I used a simpler word and continued."],
    ],
  },
  {
    day: 67,
    theme: "Making an appointment",
    speakingGoal: "Ask for an appointment and give your availability.",
    transcript:
      "I would like to make an appointment for next week. I am available on Tuesday morning or Thursday afternoon. If both times are full, please let me know what else is open.",
    keyLines: [
      "I would like to make an appointment.",
      "I am available on Tuesday morning.",
      "I am available on Thursday afternoon.",
      "Please let me know what else is open.",
    ],
    miniTaskTr:
      "Randevu alma dilini dinle. Would like, available ve what else is open ifadelerini yakala.",
    outputPrompt: "Write 2 sentences asking for an appointment.",
    words: [
      ["appointment", "uh-POINT-muhnt", "randevu", "I would like to make an appointment."],
      ["available", "uh-VAY-luh-buhl", "müsait", "I am available on Tuesday."],
      ["both", "bohth", "ikisi de", "If both times are full..."],
      ["open", "OH-puhn", "boş/müsait", "What else is open?"],
    ],
    review: [
      ["fillBlank", "I am available on Tuesday ____.", "morning"],
      ["recall", "Write the sentence about making an appointment.", "I would like to make an appointment."],
      ["shortAnswer", "Answer in English: What should they do if both times are full?", "They should let me know what else is open."],
    ],
  },
  {
    day: 68,
    theme: "Explaining what you need",
    speakingGoal: "Say what you need and why it matters.",
    transcript:
      "I need a quiet hour to finish this task. There are many small details, and I do not want to miss anything important. After I finish, I can answer messages again.",
    keyLines: [
      "I need a quiet hour.",
      "There are many small details.",
      "I do not want to miss anything important.",
      "After I finish, I can answer messages again.",
    ],
    miniTaskTr:
      "İhtiyaç açıklamasını dinle. Quiet hour, many details ve miss anything important ifadelerini yakala.",
    outputPrompt: "Write 2 sentences explaining what you need today.",
    words: [
      ["quiet hour", "KWY-uht OW-er", "sessiz bir saat", "I need a quiet hour."],
      ["small details", "smawl DEE-taylz", "küçük detaylar", "There are many small details."],
      ["miss", "mis", "kaçırmak", "I do not want to miss anything."],
      ["important", "im-POR-tuhnt", "önemli", "I do not want to miss anything important."],
    ],
    review: [
      ["fillBlank", "I need a quiet ____.", "hour"],
      ["recall", "Write the sentence about important details.", "I do not want to miss anything important."],
      ["shortAnswer", "Answer in English: What can you do after you finish?", "I can answer messages again."],
    ],
  },
  {
    day: 69,
    theme: "Describing progress",
    speakingGoal: "Talk about progress with before, now, and next.",
    transcript:
      "Before, I needed a long time to answer simple questions in English. Now I can answer faster, even if my sentences are not perfect. Next, I want to speak with fewer pauses.",
    keyLines: [
      "Before, I needed a long time.",
      "Now I can answer faster.",
      "My sentences are not perfect.",
      "I want to speak with fewer pauses.",
    ],
    miniTaskTr:
      "Gelişim anlatımını dinle. Before, now ve next sırasını takip et.",
    outputPrompt: "Write 2 sentences about your speaking progress.",
    words: [
      ["before", "bi-FOR", "önceden", "Before, I needed a long time."],
      ["faster", "FAS-ter", "daha hızlı", "Now I can answer faster."],
      ["perfect", "PER-fekt", "mükemmel", "My sentences are not perfect."],
      ["fewer pauses", "FYOO-er paw-ziz", "daha az duraklama", "I want fewer pauses."],
    ],
    review: [
      ["fillBlank", "Now I can answer ____.", "faster"],
      ["recall", "Write the sentence about fewer pauses.", "I want to speak with fewer pauses."],
      ["shortAnswer", "Answer in English: Were your sentences perfect?", "No, my sentences were not perfect."],
    ],
  },
  {
    day: 70,
    theme: "Giving a source-backed UVC warning",
    speakingGoal:
      "State the two-part UVC source warning clearly without presenting complete safety training.",
    transcript:
      "According to the source, UVC can be harmful to the human body. Use UVC with the supplied darkroom. This is the source warning, not complete safety training.",
    keyLines: [
      "According to the source, UVC can be harmful to the human body.",
      "Use UVC with the supplied darkroom.",
      "Follow the source warning.",
      "This is not complete safety training.",
    ],
    miniTaskTr:
      "Kaynak uyarısını dinle. Harmful to the human body, supplied darkroom ve source warning ifadelerini yakala. Bunun tam güvenlik eğitimi olmadığını unutma.",
    outputPrompt: "Write 2 polite instructions for a simple task.",
    words: [
      ["harmful", "HARM-fuhl", "zararlı", "According to the source, UVC can be harmful to the human body."],
      ["supplied darkroom", "suh-PLYD DARK-room", "ürünle birlikte verilen karanlık oda", "Use UVC with the supplied darkroom."],
      ["source warning", "sors WOR-ning", "kaynak uyarısı", "Follow the source warning."],
      ["safety training", "SAYF-tee TRAY-ning", "güvenlik eğitimi", "This is not complete safety training."],
    ],
    review: [
      ["fillBlank", "Use UVC with the supplied ____.", "darkroom"],
      ["recall", "Write the sentence about the UVC risk.", "According to the source, UVC can be harmful to the human body."],
      ["shortAnswer", "Write the two-part UVC source warning.", "According to the source, UVC can be harmful to the human body. Use UVC with the supplied darkroom."],
    ],
  },
  {
    day: 71,
    theme: "Choosing a customer demo priority",
    speakingGoal:
      "Choose one source-backed customer demo priority and give a short reason with appropriate attribution.",
    transcript:
      "For this customer demo, I would start with the source-described workflow. The source describes it as contactless and states that it does not require powder or chemicals. The source also lists a 45.9MP 8K camera.",
    keyLines: [
      "The source describes the workflow as contactless.",
      "The source states that the workflow does not require powder or chemicals.",
      "The source lists a 45.9MP 8K camera.",
      "I would use these source-backed points in the demo.",
    ],
    miniTaskTr:
      "Müşteri demosunda kaynak atfını dinle. Source describes, does not require powder or chemicals ve 45.9MP 8K camera ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about your priorities today.",
    words: [
      ["45.9MP 8K camera", "for-tee fyv poynt nyn em-pee ayt-kay KAM-ruh", "45.9MP 8K kamera", "The source lists a 45.9MP 8K camera."],
      ["contactless", "KON-takt-les", "temassız", "The source describes the workflow as contactless."],
      ["powder or chemicals", "POW-der or KEM-i-kuhlz", "toz veya kimyasallar", "The source states that the workflow does not require powder or chemicals."],
      ["source-backed", "sors bakt", "kaynak destekli", "I would use these source-backed points in the demo."],
    ],
    review: [
      ["fillBlank", "The source describes the workflow as ____.", "contactless"],
      ["recall", "Write the sentence about powder or chemicals.", "The source states that the workflow does not require powder or chemicals."],
      ["shortAnswer", "Choose one source-backed customer demo point.", "I would mention that the source lists a 45.9MP 8K camera."],
    ],
  },
  {
    day: 72,
    theme: "Sharing a small success",
    speakingGoal: "Talk about a success and explain why it mattered.",
    transcript:
      "I had a small success today. I answered a question in English without switching to Turkish. It was only one minute, but it mattered because I stayed calm and kept speaking.",
    keyLines: [
      "I had a small success today.",
      "I answered a question in English.",
      "I did not switch to Turkish.",
      "I stayed calm and kept speaking.",
    ],
    miniTaskTr:
      "Başarı ve önem anlatımını dinle. Small success, without switching ve kept speaking ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a small success.",
    words: [
      ["success", "suhk-SES", "başarı", "I had a small success today."],
      ["switching", "SWICH-ing", "geçiş yapmak", "I did not switch to Turkish."],
      ["mattered", "MAT-erd", "önemliydi", "It mattered."],
      ["kept speaking", "kept SPEE-king", "konuşmaya devam etti", "I kept speaking."],
    ],
    review: [
      ["fillBlank", "I stayed calm and kept ____.", "speaking"],
      ["recall", "Write the sentence about switching.", "I did not switch to Turkish."],
      ["shortAnswer", "Answer in English: Why did it matter?", "I stayed calm and kept speaking."],
    ],
  },
  {
    day: 73,
    theme: "Explaining a choice at a restaurant",
    speakingGoal: "Explain what you want and ask a simple question politely.",
    transcript:
      "I would like the chicken salad, please. Could you make it without onions? Also, is the soup spicy, or is it mild? I am trying to choose something light.",
    keyLines: [
      "I would like the chicken salad.",
      "Could you make it without onions?",
      "Is the soup spicy or mild?",
      "I am trying to choose something light.",
    ],
    miniTaskTr:
      "Restoran konuşmasını dinle. Would like, without onions ve spicy or mild ifadelerini yakala.",
    outputPrompt: "Write 2 sentences ordering food politely.",
    words: [
      ["would like", "wood lyk", "isterim", "I would like the chicken salad."],
      ["without onions", "with-OWT UN-yuhnz", "soğansız", "Could you make it without onions?"],
      ["spicy", "SPY-see", "acı/baharatlı", "Is the soup spicy?"],
      ["mild", "myld", "hafif", "Is it mild?"],
    ],
    review: [
      ["fillBlank", "Could you make it without ____?", "onions"],
      ["recall", "Write the sentence about the soup.", "Is the soup spicy, or is it mild?"],
      ["shortAnswer", "Answer in English: What are you trying to choose?", "I am trying to choose something light."],
    ],
  },
  {
    day: 74,
    theme: "Handling a misunderstanding",
    speakingGoal: "Clarify what you meant and keep the tone calm.",
    transcript:
      "Sorry, I think I explained that badly. I did not mean the report is wrong. I meant we need one more detail before we send it. Let me say it again more clearly.",
    keyLines: [
      "I think I explained that badly.",
      "I did not mean the report is wrong.",
      "We need one more detail.",
      "Let me say it again more clearly.",
    ],
    miniTaskTr:
      "Yanlış anlaşılmayı düzeltme dilini dinle. I did not mean, I meant ve more clearly ifadelerini yakala.",
    outputPrompt: "Write 2 sentences clarifying what you meant.",
    words: [
      ["explained badly", "ik-SPLAYND BAD-lee", "kötü açıkladı", "I explained that badly."],
      ["mean", "meen", "kastetmek", "I did not mean the report is wrong."],
      ["one more detail", "wun mor DEE-tayl", "bir detay daha", "We need one more detail."],
      ["clearly", "KLEER-lee", "net şekilde", "Let me say it more clearly."],
    ],
    review: [
      ["fillBlank", "Let me say it again more ____.", "clearly"],
      ["recall", "Write the sentence with: I did not mean...", "I did not mean the report is wrong."],
      ["shortAnswer", "Answer in English: What do you need?", "We need one more detail before we send it."],
    ],
  },
  {
    day: 75,
    theme: "Describing a habit you want to build",
    speakingGoal: "Talk about a habit goal and the first small step.",
    transcript:
      "I want to build a habit of speaking English for five minutes every morning. I will start small because I want it to feel easy. My first step is recording one short answer after breakfast.",
    keyLines: [
      "I want to build a habit.",
      "I will start small.",
      "I want it to feel easy.",
      "My first step is recording one short answer.",
    ],
    miniTaskTr:
      "Alışkanlık hedefini dinle. Build a habit, start small ve first step ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a habit you want to build.",
    words: [
      ["build a habit", "bild uh HAB-it", "alışkanlık oluşturmak", "I want to build a habit."],
      ["start small", "start smawl", "küçük başlamak", "I will start small."],
      ["feel easy", "feel EE-zee", "kolay hissettirmek", "I want it to feel easy."],
      ["recording", "ri-KOR-ding", "kayıt almak", "My first step is recording one answer."],
    ],
    review: [
      ["fillBlank", "I will start ____.", "small"],
      ["recall", "Write the sentence about the first step.", "My first step is recording one short answer after breakfast."],
      ["shortAnswer", "Answer in English: What habit do you want to build?", "I want to speak English for five minutes every morning."],
    ],
  },
  {
    day: 76,
    theme: "Giving a mini presentation",
    speakingGoal: "Introduce a topic, give two points, and close clearly.",
    transcript:
      "Today I want to talk about why short practice works. First, it is easy to repeat every day. Second, it gives you small wins. That is why I think ten focused minutes can be powerful.",
    keyLines: [
      "Today I want to talk about short practice.",
      "It is easy to repeat every day.",
      "It gives you small wins.",
      "Ten focused minutes can be powerful.",
    ],
    miniTaskTr:
      "Mini sunum yapısını dinle. Today I want to talk about, first, second ve that is why ifadelerini yakala.",
    outputPrompt: "Write 2 sentences for a mini presentation topic.",
    words: [
      ["talk about", "tawk uh-BOWT", "hakkında konuşmak", "I want to talk about short practice."],
      ["repeat", "ri-PEET", "tekrar etmek", "It is easy to repeat every day."],
      ["small wins", "smawl winz", "küçük kazanımlar", "It gives you small wins."],
      ["powerful", "POW-er-fuhl", "güçlü", "Ten minutes can be powerful."],
    ],
    review: [
      ["fillBlank", "It gives you small ____.", "wins"],
      ["recall", "Write the sentence about repeating.", "It is easy to repeat every day."],
      ["shortAnswer", "Answer in English: What do you want to talk about?", "I want to talk about why short practice works."],
    ],
  },
  {
    day: 77,
    theme: "Explaining a schedule conflict",
    speakingGoal: "Explain a conflict and suggest a realistic alternative.",
    transcript:
      "I have a schedule conflict on Wednesday morning. I already promised to join another call at the same time. Could we move our meeting to the afternoon or choose Thursday instead?",
    keyLines: [
      "I have a schedule conflict.",
      "I promised to join another call.",
      "Could we move our meeting to the afternoon?",
      "Could we choose Thursday instead?",
    ],
    miniTaskTr:
      "Çakışma ve alternatif dilini dinle. Schedule conflict, promised ve move our meeting ifadelerini yakala.",
    outputPrompt: "Write 2 sentences explaining a schedule conflict.",
    words: [
      ["schedule conflict", "SKEJ-ool KON-flikt", "program çakışması", "I have a schedule conflict."],
      ["promised", "PROM-ist", "söz verdi", "I promised to join another call."],
      ["same time", "saym tym", "aynı zaman", "The call is at the same time."],
      ["move our meeting", "moov ow-er MEE-ting", "toplantımızı taşımak", "Could we move our meeting?"],
    ],
    review: [
      ["fillBlank", "I have a schedule ____.", "conflict"],
      ["recall", "Write the sentence about another call.", "I promised to join another call."],
      ["shortAnswer", "Answer in English: What alternatives do you suggest?", "We can move the meeting to the afternoon or choose Thursday instead."],
    ],
  },
  {
    day: 78,
    theme: "Talking about something you recommend",
    speakingGoal: "Recommend a tool, habit, place, or resource and explain who it helps.",
    transcript:
      "I recommend keeping a small speaking notebook. It is useful for people who forget phrases after listening. You can write one natural line, repeat it twice, and use it later in your own sentence.",
    keyLines: [
      "I recommend keeping a small speaking notebook.",
      "It is useful for people who forget phrases.",
      "Write one natural line.",
      "Use it later in your own sentence.",
    ],
    miniTaskTr:
      "Tavsiye ve kullanım anlatımını dinle. Recommend, useful for ve use it later ifadelerini yakala.",
    outputPrompt: "Write 2 sentences recommending something useful.",
    words: [
      ["recommend", "rek-uh-MEND", "tavsiye etmek", "I recommend a speaking notebook."],
      ["notebook", "NOHT-book", "defter", "Keep a small notebook."],
      ["natural line", "NACH-er-uhl lyn", "doğal cümle", "Write one natural line."],
      ["later", "LAY-ter", "daha sonra", "Use it later in your own sentence."],
    ],
    review: [
      ["fillBlank", "I recommend keeping a small speaking ____.", "notebook"],
      ["recall", "Write the sentence about one natural line.", "Write one natural line."],
      ["shortAnswer", "Answer in English: Who is it useful for?", "It is useful for people who forget phrases after listening."],
    ],
  },
  {
    day: 79,
    theme: "Describing a place in more detail",
    speakingGoal: "Describe a place using location, atmosphere, and one personal reason.",
    transcript:
      "There is a quiet library on the second floor of my building. It has large windows, comfortable chairs, and a calm atmosphere. I like going there because it helps me focus without feeling isolated.",
    keyLines: [
      "There is a quiet library on the second floor.",
      "It has large windows.",
      "It has a calm atmosphere.",
      "It helps me focus without feeling isolated.",
    ],
    miniTaskTr:
      "Detaylı yer anlatımını dinle. Second floor, atmosphere ve without feeling isolated ifadelerini yakala.",
    outputPrompt: "Write 2 sentences describing a place in more detail.",
    words: [
      ["second floor", "SEK-uhnd flor", "ikinci kat", "The library is on the second floor."],
      ["comfortable", "KUHM-fer-tuh-buhl", "rahat", "It has comfortable chairs."],
      ["atmosphere", "AT-muhs-feer", "atmosfer", "It has a calm atmosphere."],
      ["isolated", "EYE-suh-lay-tid", "izole", "I do not feel isolated."],
    ],
    review: [
      ["fillBlank", "It has a calm ____.", "atmosphere"],
      ["recall", "Write the sentence about large windows.", "It has large windows."],
      ["shortAnswer", "Answer in English: Why do you like going there?", "It helps me focus without feeling isolated."],
    ],
  },
  {
    day: 80,
    theme: "Explaining an AFIS preparation decision",
    speakingGoal:
      "Explain an AFIS preparation decision for a manual submission workflow without implying direct integration or an undocumented export requirement.",
    transcript:
      "Before we prepare the image, we need to confirm the requested export format. The presentation describes a manual AFIS submission workflow, but direct AFIS integration is not documented in the available source. We should check the case request before exporting.",
    keyLines: [
      "Confirm the requested export format.",
      "The presentation describes a manual AFIS submission workflow.",
      "Direct AFIS integration is not documented in the available source.",
      "Check the case request before exporting.",
    ],
    miniTaskTr:
      "Kaynak kontrollü AFIS hazırlık dilini dinle. Manual AFIS submission workflow, requested export format ve not documented ifadelerini yakala.",
    outputPrompt: "Write 2 sentences explaining a small decision.",
    words: [
      ["AFIS preparation", "AY-fis prep-uh-RAY-shuhn", "AFIS hazırlığı", "The image is being prepared for manual AFIS submission."],
      ["manual AFIS submission workflow", "MAN-yoo-uhl AY-fis sub-MISH-uhn WURK-flow", "manuel AFIS gönderim iş akışı", "The presentation describes a manual AFIS submission workflow."],
      ["requested export format", "ri-KWES-tid EK-sport FOR-mat", "talep edilen dışa aktarma formatı", "Confirm the requested export format."],
      ["not documented", "not DOK-yuh-men-tid", "belgelenmemiş", "Direct AFIS integration is not documented in the available source."],
    ],
    review: [
      ["fillBlank", "The presentation describes a manual AFIS submission ____.", "workflow"],
      ["recall", "Write the sentence about direct integration.", "Direct AFIS integration is not documented in the available source."],
      ["shortAnswer", "State one cautious AFIS preparation step.", "We should confirm the requested export format before preparing the image for manual AFIS submission."],
    ],
  },
  {
    day: 81,
    theme: "Responding to good news",
    speakingGoal: "React naturally to good news and ask a follow-up question.",
    transcript:
      "That is great news. Congratulations on the new job. You worked hard for it, so I am really happy for you. When do you start, and what will your first project be?",
    keyLines: [
      "That is great news.",
      "Congratulations on the new job.",
      "I am really happy for you.",
      "What will your first project be?",
    ],
    miniTaskTr:
      "İyi habere tepki dilini dinle. Congratulations, happy for you ve follow-up question ifadelerini yakala.",
    outputPrompt: "Write 2 sentences responding to good news.",
    words: [
      ["great news", "grayt nooz", "harika haber", "That is great news."],
      ["congratulations", "kuhn-grach-uh-LAY-shuhnz", "tebrikler", "Congratulations on the new job."],
      ["happy for you", "HAP-ee for yoo", "senin adına mutluyum", "I am really happy for you."],
      ["first project", "furst PRAH-jekt", "ilk proje", "What will your first project be?"],
    ],
    review: [
      ["fillBlank", "I am really happy ____ you.", "for"],
      ["recall", "Write the sentence with congratulations.", "Congratulations on the new job."],
      ["shortAnswer", "Answer in English: What question do you ask?", "What will your first project be?"],
    ],
  },
  {
    day: 82,
    theme: "Explaining a personal goal",
    speakingGoal: "Describe a goal, why it matters, and how you will start.",
    transcript:
      "My personal goal is to speak English more comfortably in real conversations. It matters because I want to join discussions instead of staying quiet. I will start by practicing one short answer every day.",
    keyLines: [
      "My personal goal is to speak English more comfortably.",
      "I want to join discussions.",
      "I do not want to stay quiet.",
      "I will practice one short answer every day.",
    ],
    miniTaskTr:
      "Hedef anlatımını dinle. Personal goal, matters because ve start by practicing ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about a personal speaking goal.",
    words: [
      ["comfortably", "KUHMF-ter-buh-lee", "rahatça", "I want to speak comfortably."],
      ["discussions", "di-SKUH-shuhnz", "tartışmalar", "I want to join discussions."],
      ["staying quiet", "STAY-ing KWY-uht", "sessiz kalmak", "I do not want to stay quiet."],
      ["start by", "start by", "ile başlamak", "I will start by practicing."],
    ],
    review: [
      ["fillBlank", "I want to join ____.", "discussions"],
      ["recall", "Write the sentence about staying quiet.", "I do not want to stay quiet."],
      ["shortAnswer", "Answer in English: How will you start?", "I will practice one short answer every day."],
    ],
  },
  {
    day: 83,
    theme: "Handling a late reply",
    speakingGoal: "Apologize for a late reply and answer clearly.",
    transcript:
      "Sorry for the late reply. I was in meetings most of the morning. Yes, Friday works for me, and I can send the document before noon. Thanks for checking.",
    keyLines: [
      "Sorry for the late reply.",
      "I was in meetings most of the morning.",
      "Friday works for me.",
      "I can send the document before noon.",
    ],
    miniTaskTr:
      "Geç cevap mesajını dinle. Late reply, works for me ve before noon ifadelerini yakala.",
    outputPrompt: "Write 2 sentences answering after a delay.",
    words: [
      ["late reply", "layt ri-PLY", "geç cevap", "Sorry for the late reply."],
      ["most of", "mohst uv", "çoğu", "I was in meetings most of the morning."],
      ["works for me", "wurks for mee", "bana uygun", "Friday works for me."],
      ["before noon", "bi-FOR noon", "öğleden önce", "I can send it before noon."],
    ],
    review: [
      ["fillBlank", "Friday works ____ me.", "for"],
      ["recall", "Write the sentence about meetings.", "I was in meetings most of the morning."],
      ["shortAnswer", "Answer in English: When can you send the document?", "I can send the document before noon."],
    ],
  },
  {
    day: 84,
    theme: "Giving a short story",
    speakingGoal: "Tell a short story with beginning, problem, and result.",
    transcript:
      "On Monday, I left home early because I had an important meeting. Halfway there, I realized I forgot my notes. I used the notes on my phone instead, and the meeting still went well.",
    keyLines: [
      "I left home early.",
      "I had an important meeting.",
      "I realized I forgot my notes.",
      "The meeting still went well.",
    ],
    miniTaskTr:
      "Kısa hikaye yapısını dinle. Left early, realized ve still went well ifadelerini yakala.",
    outputPrompt: "Write 2 sentences telling a short everyday story.",
    words: [
      ["left home", "left hohm", "evden çıktı", "I left home early."],
      ["halfway", "HAF-way", "yolun yarısında", "Halfway there, I realized it."],
      ["realized", "REE-uh-lyzd", "fark etti", "I realized I forgot my notes."],
      ["still", "stil", "yine de", "The meeting still went well."],
    ],
    review: [
      ["fillBlank", "I realized I forgot my ____.", "notes"],
      ["recall", "Write the sentence about leaving home.", "I left home early."],
      ["shortAnswer", "Answer in English: How did the meeting go?", "The meeting still went well."],
    ],
  },
  {
    day: 85,
    theme: "Clarifying an unclear fingerprint image",
    speakingGoal:
      "Use clarification language for an unclear fingerprint image without inventing troubleshooting settings.",
    transcript:
      "The fingerprint detail is not clear yet. The source lists UV, VIS, and IR imaging and image enhancement features, but it does not give exact settings for this case. We should confirm the selected mode and check the operator procedure.",
    keyLines: [
      "The fingerprint detail is not clear yet.",
      "The source lists UV, VIS, and IR imaging.",
      "The source lists image enhancement features.",
      "Confirm the selected mode and check the operator procedure.",
    ],
    miniTaskTr:
      "Kaynak kontrollü clarification dilini dinle. Fingerprint detail, source lists, selected mode ve operator procedure ifadelerini yakala. Exact setting uydurulmadığına dikkat et.",
    outputPrompt: "Write 2 sentences giving two options for a problem.",
    words: [
      ["UV/VIS/IR", "yoo-vee viz eye-ar", "UV/görünür/IR", "The source lists UV, VIS, and IR imaging."],
      ["image enhancement", "IM-ij in-HANS-muhnt", "görüntü iyileştirme", "The source lists image enhancement features."],
      ["fingerprint detail", "FING-ger-print DEE-tayl", "parmak izi detayı", "The fingerprint detail is not clear yet."],
      ["operator procedure", "OP-uh-ray-ter proh-SEE-jer", "operatör prosedürü", "Check the operator procedure for exact settings."],
    ],
    review: [
      ["fillBlank", "Confirm the selected ____.", "mode"],
      ["recall", "Write the sentence about exact settings.", "The source does not give exact settings for this case."],
      ["shortAnswer", "Ask for clarification without recommending a setting.", "Please confirm the selected mode and check the operator procedure."],
    ],
  },
  {
    day: 86,
    theme: "Talking about an opinion with a soft tone",
    speakingGoal: "Share an opinion without sounding too strong.",
    transcript:
      "I may be wrong, but I think we should keep the first version simple. If we add too many features now, it may become confusing. We can improve it after we get feedback.",
    keyLines: [
      "I may be wrong, but I think...",
      "We should keep the first version simple.",
      "It may become confusing.",
      "We can improve it after we get feedback.",
    ],
    miniTaskTr:
      "Yumuşak fikir belirtme dilini dinle. I may be wrong, should keep ve after feedback ifadelerini yakala.",
    outputPrompt: "Write 2 sentences giving a soft opinion.",
    words: [
      ["may be wrong", "may bee rawng", "yanılıyor olabilirim", "I may be wrong."],
      ["version", "VER-zhuhn", "versiyon", "Keep the first version simple."],
      ["confusing", "kuhn-FYOO-zing", "kafa karıştırıcı", "It may become confusing."],
      ["improve", "im-PROOV", "geliştirmek", "We can improve it later."],
    ],
    review: [
      ["fillBlank", "It may become ____.", "confusing"],
      ["recall", "Write the sentence about the first version.", "We should keep the first version simple."],
      ["shortAnswer", "Answer in English: When can you improve it?", "We can improve it after we get feedback."],
    ],
  },
  {
    day: 87,
    theme: "Preparing for a conversation",
    speakingGoal: "Explain how you prepare for a conversation and what you practice.",
    transcript:
      "Before an English conversation, I prepare three useful phrases. I do not memorize a full script because real conversations change quickly. I just practice the first sentence so I can start with confidence.",
    keyLines: [
      "I prepare three useful phrases.",
      "I do not memorize a full script.",
      "Real conversations change quickly.",
      "I practice the first sentence.",
    ],
    miniTaskTr:
      "Konuşmaya hazırlık dilini dinle. Prepare phrases, full script ve start with confidence ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about how you prepare to speak.",
    words: [
      ["useful phrases", "YOOS-fuhl FRAY-ziz", "faydalı ifadeler", "I prepare useful phrases."],
      ["memorize", "MEM-uh-ryz", "ezberlemek", "I do not memorize a full script."],
      ["script", "skript", "metin/senaryo", "I do not need a full script."],
      ["confidence", "KON-fi-duhns", "güven", "I can start with confidence."],
    ],
    review: [
      ["fillBlank", "I prepare three useful ____.", "phrases"],
      ["recall", "Write the sentence about real conversations.", "Real conversations change quickly."],
      ["shortAnswer", "Answer in English: What do you practice first?", "I practice the first sentence."],
    ],
  },
  {
    day: 88,
    theme: "Using cautious technical reporting language",
    speakingGoal:
      "Summarize a technical observation without claiming that metadata exists unless it was recorded or enabled.",
    transcript:
      "The fingerprint was observed on the surface. The software lists date-stamp and geotag features, but a report should mention them when they were recorded or enabled. We should review the actual image record before reporting the next step.",
    keyLines: [
      "The fingerprint was observed on the surface.",
      "The software lists date-stamp and geotag features.",
      "Mention metadata when it was recorded or enabled.",
      "Review the actual image record before reporting the next step.",
    ],
    miniTaskTr:
      "Dikkatli teknik raporlama dilini dinle. Observed, software lists, if recorded ve where enabled anlamlarını takip et.",
    outputPrompt: "Write 2 sentences summarizing a simple discussion.",
    words: [
      ["observed", "uhb-ZURVD", "gözlemlendi", "The fingerprint was observed on the surface."],
      ["metadata features", "MET-uh-day-tuh FEE-chers", "meta veri özellikleri", "The software lists date-stamp and geotag features."],
      ["if recorded", "if ri-KOR-did", "kaydedildiyse", "Mention the metadata if it was recorded."],
      ["where enabled", "wair en-AY-buhld", "etkinleştirildiği yerde", "Report the feature where enabled."],
    ],
    review: [
      ["fillBlank", "Mention the metadata if it was ____.", "recorded"],
      ["recall", "Write the sentence about the software features.", "The software lists date-stamp and geotag features."],
      ["shortAnswer", "Write one cautious technical reporting sentence.", "The fingerprint was observed on the surface; metadata should be reported when recorded or enabled."],
    ],
  },
  {
    day: 89,
    theme: "Talking about confidence honestly",
    speakingGoal: "Talk honestly about confidence, mistakes, and continuing.",
    transcript:
      "I feel more confident than before, but I still make mistakes when I speak fast. That is normal. My goal is not perfect English; my goal is clear English and the courage to continue.",
    keyLines: [
      "I feel more confident than before.",
      "I still make mistakes when I speak fast.",
      "That is normal.",
      "My goal is clear English and the courage to continue.",
    ],
    miniTaskTr:
      "Güven ve gerçekçi hedef dilini dinle. More confident, still make mistakes ve courage to continue ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about your speaking confidence.",
    words: [
      ["confident", "KON-fi-duhnt", "özgüvenli", "I feel more confident than before."],
      ["normal", "NOR-muhl", "normal", "That is normal."],
      ["clear English", "kleer ING-glish", "net İngilizce", "My goal is clear English."],
      ["courage", "KUR-ij", "cesaret", "I need the courage to continue."],
    ],
    review: [
      ["fillBlank", "I feel more confident than ____.", "before"],
      ["recall", "Write the sentence about the goal.", "My goal is clear English and the courage to continue."],
      ["shortAnswer", "Answer in English: What happens when you speak fast?", "I still make mistakes when I speak fast."],
    ],
  },
  {
    day: 90,
    theme: "Ninety-day speaking check",
    speakingGoal: "Summarize your speaking progress and set the next real-world goal.",
    transcript:
      "After ninety days, I can speak about my daily life, work, plans, problems, opinions, and experiences more clearly. I still need practice, but I know how to continue. My next goal is to have one real conversation in English every week.",
    keyLines: [
      "I can speak about my daily life and work more clearly.",
      "I can talk about plans, problems, opinions, and experiences.",
      "I still need practice, but I know how to continue.",
      "My next goal is one real conversation every week.",
    ],
    miniTaskTr:
      "90 günlük özet ve yeni hedefi dinle. Can speak, still need practice ve next goal ifadelerini yakala.",
    outputPrompt: "Write 2 sentences about your progress and your next real-world goal.",
    words: [
      ["ninety days", "NYN-tee dayz", "doksan gün", "After ninety days, I can speak more clearly."],
      ["experiences", "ik-SPEER-ee-uhn-siz", "deneyimler", "I can talk about experiences."],
      ["continue", "kuhn-TIN-yoo", "devam etmek", "I know how to continue."],
      ["real conversation", "reel kon-ver-SAY-shuhn", "gerçek konuşma", "I want one real conversation every week."],
    ],
    review: [
      ["fillBlank", "My next goal is one real conversation every ____.", "week"],
      ["recall", "Write the sentence about continuing.", "I still need practice, but I know how to continue."],
      ["shortAnswer", "Answer in English: What can you talk about now?", "I can talk about daily life, work, plans, problems, opinions, and experiences."],
    ],
  },
];

const deviceSpeakingPromptByDay: Record<number, string> = {
  48: "Clarification task: ask about a device setting in 4-5 sentences. Mention the selected light group or selected filter, then ask one polite follow-up question.",
  57: "Feedback task: explain an example export-format request calmly in 4-5 sentences. Mention WSQ or TIFF, make clear that it is not a general device rule, then ask for the requested format.",
  64: "Process-language task: describe a simple example with source-listed contactless, image archive, and reporting language in 4-5 sentences. State that it is not a full operating procedure.",
  70: "Milestone check: speak in 4-5 sentences. State that UVC can be harmful to the human body according to the source, say to use UVC with the supplied darkroom, and note that this is not complete safety training.",
  71: "Customer demo task: choose one source-backed 8K demo point in 4-6 sentences. Use source attribution for the contactless or powder-and-chemical-free workflow, or mention the 45.9MP 8K camera without adding a performance claim.",
  80: "Work-language task: explain an AFIS preparation decision for a manual submission workflow in 4-6 sentences. Confirm the requested export format and state that direct AFIS integration is not documented in the available source.",
  85: "Clarification task: describe unclear fingerprint detail in 4-6 sentences. Confirm the selected mode, state that exact settings are not documented in the available source, and refer to the operator procedure without recommending a setting.",
  88: "Reporting-language task: summarize a technical observation in 4-6 sentences. Mention software-listed metadata features when recorded or where enabled, then add one cautious next step.",
};

const deviceListeningOutputByDay: Record<number, string> = {
  48: "Write 2 sentences: identify what needs clarification, then ask a polite question about the selected filter.",
  57: "Write 2 sentences: describe the example export-format request, then ask for the requested format without presenting it as a general device rule.",
  64: "Write 2 sentences: name two source-listed workflow features, then state that the example is not a full operating procedure.",
  70: "Write 3 short notes: the source-stated UVC risk, the supplied-darkroom instruction, and the limit that this is not complete safety training.",
  71: "Write 2 sentences: choose one source-backed customer demo point, then give one short reason with source attribution.",
  80: "Write 2 sentences: describe the manual AFIS submission workflow context, then state the direct-integration limitation.",
  85: "Write 2 sentences: describe the unclear fingerprint detail, then ask for confirmation without recommending a light or setting.",
  88: "Write 2 sentences: summarize the technical observation, then add an if-recorded or where-enabled reporting condition.",
};

const deviceMiniGoalByDay: Record<number, string> = {
  48: "Mini hedef: 4-5 cümlede ayarı netleştir; ikinci denemede daha kibar bir clarification question ekle.",
  57: "Mini hedef: 4-5 cümlede örnek format talebini sakin anlat; bunun genel cihaz kuralı olmadığını söyle ve ikinci denemeyi daha kibar yap.",
  64: "Mini hedef: 4-5 cümlede source-listed özelliklerle basit bir örnek anlat; bunun full operating procedure olmadığını açıkça söyle.",
  70: "Mini hedef: 4-5 cümlede UVC'nin kaynağa göre insan vücuduna zararlı olabileceğini ve supplied darkroom ile kullanılması gerektiğini söyle; bunun tam safety training olmadığını ekle.",
  71: "Mini hedef: 60 saniyede source-backed bir demo noktası seç; contactless veya powder/chemical-free workflow için kaynak atfı kullan.",
  80: "Mini hedef: 60 saniyede AFIS preparation ve manual AFIS submission workflow bağlamını açıkla; direct integration'ın available source içinde documented olmadığını söyle.",
  85: "Mini hedef: 60 saniyede clarification yap; exact setting önermeden selected mode ve operator procedure kontrolünü iste.",
  88: "Mini hedef: 60 saniyede teknik gözlemi özetle; metadata için if recorded veya where enabled koşulunu kullan.",
};

export const phaseEightDayPlans = phaseEightDays.map((day) => ({
  day: day.day,
  theme: day.theme,
  speakingGoal: day.speakingGoal,
}));

export const phaseEightListeningDrills = phaseEightDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Listening: ${day.theme}`,
  focus: day.speakingGoal,
  transcriptExcerpt: day.transcript,
  keyLines: day.keyLines,
  miniTaskTr: day.miniTaskTr,
  outputPrompt: buildPhaseEightListeningOutput(day),
}));

export const phaseEightDayWords = phaseEightDays.map((day) => ({
  day: day.day,
  title: day.theme,
  words: day.words.map(([word, pronunciation, shortMeaningTr, exampleSentence]) => ({
    word,
    pronunciation,
    shortMeaningTr,
    exampleSentence,
  })),
}));

function buildPhaseEightPrompt(day: (typeof phaseEightDays)[number]) {
  if (deviceSpeakingPromptByDay[day.day]) {
    return deviceSpeakingPromptByDay[day.day];
  }

  if (day.day === 70) {
    return "Milestone check: speak in 4-5 sentences. Explain a small problem or decision, include one reason or example, then improve one sentence in your second try.";
  }

  if (day.day === 90) {
    return "Final speaking check: speak in 4-6 sentences or 60-75 seconds. Summarize a familiar daily/work situation, give an opinion with a reason, add a next step, and mention one weak point to keep improving.";
  }

  if (day.day >= 71) {
    const promptModes = [
      `Mini role-play: someone asks about "${day.theme.toLowerCase()}". Answer in 4-6 sentences, then ask one follow-up question.`,
      `Short message reply: respond in 4-6 sentences. Be clear, polite, and finish with a realistic next step.`,
      `Soft opinion task: give your point, add one reason, and use a phrase like "I may be wrong, but..." or "from my point of view."`,
      `Problem-solving task: explain the issue, give two options, and recommend one practical next step.`,
      `Summary task: summarize the decision or story in 4-6 sentences. Use "to summarize" or "in other words" naturally.`,
      `Clarification task: explain what you understood, then ask one question with "Could you clarify that?" or "Let me check one detail."`,
      `Real-life answer: connect "${day.theme.toLowerCase()}" to your own work, study, or daily life with one example.`,
    ];

    return promptModes[(day.day - 71) % promptModes.length];
  }

  const promptModes = [
    `${day.speakingGoal} Speak in 4-5 sentences and include one reason from your own life.`,
    `Clarify the situation in 4-5 sentences. Use "To be more specific..." if your first answer is too general.`,
    `Short work/life reply: answer naturally in 4-5 sentences and finish with one next step.`,
    `Compare or explain: give the context, add one useful detail, and say why it matters.`,
    `Repair practice: explain the idea once, then improve one sentence with "What I meant was..." in your second try.`,
    `Follow-up practice: answer the prompt and add one natural follow-up question at the end.`,
  ];

  return promptModes[(day.day - 43) % promptModes.length];
}

function buildPhaseEightListeningOutput(day: (typeof phaseEightDays)[number]) {
  if (deviceListeningOutputByDay[day.day]) {
    return deviceListeningOutputByDay[day.day];
  }

  if (day.day === 70) {
    return "Write 3 short notes: the main instruction, one polite phrase, and one step you should check again.";
  }

  if (day.day === 90) {
    return "Write 3 short notes: the main progress point, one weak point, and one real-world speaking goal.";
  }

  if (day.day >= 71) {
    return "Write 2 sentences: summarize the main point, then add one short reaction or next step for your own life/work.";
  }

  return "Write 2 sentences: identify the main point, then apply one useful phrase to your own life/work.";
}

function buildPhaseEightMiniGoal(day: (typeof phaseEightDays)[number]) {
  if (deviceMiniGoalByDay[day.day]) {
    return deviceMiniGoalByDay[day.day];
  }

  if (day.day === 70) {
    return "Mini hedef: 4-5 cümleyle küçük bir problem veya kararı açıkla, reason/example ekle ve ikinci denemeyi belirgin şekilde iyileştir.";
  }

  if (day.day === 90) {
    return "Mini hedef: 4-6 cümle veya 60-75 saniye konuş; summary, opinion/reason, next step ve bir weak point ekle.";
  }

  if (day.day >= 71) {
    return "Mini hedef: 60-75 saniye konuş ve ikinci denemede cevabına daha net bir sonuç cümlesi ekle.";
  }

  return "Mini hedef: 45-60 saniye konuş ve ikinci denemede bir sebep, örnek veya bağlaç ekle.";
}

export const phaseEightSpeakingPractices = phaseEightDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Speaking: ${day.theme}`,
  prompt: buildPhaseEightPrompt(day),
  speakingTipsTr:
    "İlk denemede fikri tamamla. İkinci denemede bir sebep, örnek veya doğal repair language ekle: What I meant was, To be more specific veya Let me check one detail.",
  targetLines: day.keyLines,
  selfCheckItems: [
    ...(day.day === 70
      ? [
          "4-5 cümle kurdum mu?",
          "UVC'nin kaynağa göre insan vücuduna zararlı olabileceğini söyledim mi?",
          "UVC için supplied darkroom talimatını söyledim mi?",
          "Bunun complete safety training olmadığını belirttim mi?",
          "İkinci denemem belirgin şekilde daha iyi mi?",
        ]
      : day.day === 90
        ? [
            "4-6 cümle veya 60-75 saniye konuştum mu?",
            "Bir situation summary yaptım mı?",
            "Opinion ve reason ekledim mi?",
            "Next step ve bir weak point söyledim mi?",
          ]
        : ["Konuşmamın ana fikri net miydi?"]),
    ...selfCheckItems,
  ],
  miniGoalTr: buildPhaseEightMiniGoal(day),
}));

export const phaseEightReviewDrills = phaseEightDays.map((day) => ({
  day: day.day,
  title: `Day ${day.day} Review: ${day.theme}`,
  shortIntroTr: reviewIntroTr,
  reviewItems: day.review.map(([type, prompt, expectedAnswer]) => ({
    type: type as ReviewSeedType,
    prompt,
    expectedAnswer,
  })),
}));
