# Device-5E: Existing 8K Curriculum Micro-Context Claim Audit

## Kapsam ve Karar Standardı

Bu belge, 90 günlük curriculum içinde daha önce eklenmiş sekiz 8K mikro bağlamını güncel Device Source Index, Device Lab mimari kuralları, 8K presentation extraction ve reconciled sourcebook ile karşılaştırır. Bu faz yalnız audittir; curriculum, uygulama kodu, UI, sourcebook, extraction, route, Device Lab verisi veya Supabase/Auth/Admin/cloud sync mantığı değiştirilmemiştir.

Bu auditte kullanılan sınıflar:

- **Safe:** Mevcut 8K kaynağında açık destek vardır ve learner-facing ifade bu desteği genişletmez.
- **Cautious:** Kaynak desteği vardır ancak üretici atfı, koşullu dil, demonstration framing veya kapsam sınırı gerektirir.
- **Blocked:** Mevcut kaynakla learner-facing fact veya instruction olarak kullanılamaz.
- **Not enough source data:** Kavramın bir bölümü belgelenmiştir ancak mevcut cümledeki prosedür, ilişki, seçim veya vaka sonucu belgelenmemiştir.
- **Conflict / follow-up needed:** Kaynaklar birbiriyle çelişir veya model/ürün/sayım atfı çözülmemiştir.

“Safe”, bağımsız laboratuvar doğrulaması veya operator manual yeterliliği anlamına gelmez. Presentation kaynakları performans validation, tam safety guide, SOP veya certification record değildir.

## 1. Executive Summary

Sekiz mikro bağlamın hiçbirinde “world’s first/only”, “no image distortion”, “third-level identification”, üç metrelik guaranteed remote scanning, adsız crime-gun accreditation, success-rate veya açık bir direct AFIS integration cümlesi bulunmamıştır. Bu önemli bir olumlu sonuçtur.

Ancak içeriklerin tamamı güncel claim-control standardına göre güvenli değildir:

- **Day 48**, descriptive light/filter clarification dili olarak **safe as-is** kabul edilebilir. Bir filter count, named filter, surface setting veya performans sonucu iddia etmez.
- **Day 57**, WSQ ve TIFF export vocabulary açısından desteklidir; fakat “The report needs WSQ today, not TIFF” cümlesi source-backed bir format kuralı değildir. Bu yalnız fictional/request-specific durum olarak açıklaştırılmalıdır.
- **Day 64**, contactless, image archive ve reporting kavramlarını doğru kaynak alanlarından alır; fakat bunları kesin bir end-to-end operating sequence gibi sunar. Operator manual olmadığı için exact sequence **Cautious / Not enough source data** durumundadır.
- **Day 70**, supplied darkroom yönünü kısmen taşır fakat zorunlu “UVC can be harmful to the human body” uyarısını ve “supplied darkroom” niteliğini learner-facing paketin tamamında açıkça taşımaz. Güncel sourcebook kuralına göre **pilot öncesi onarım gerekir**.
- **Day 71**, 45.9MP “8K” camera açısından desteklidir. Contactless ve chemical/powder-free ifadeleri source-stated capability'dir; mevcut plain-fact “It is chemical-free” cümlesi üretici/kaynak atfı ve workflow kapsamı olmadan fazla geniştir.
- **Day 80**, direct AFIS integration söylemez; buna rağmen WSQ'nun AFIS için “right export format” olabileceğini source-backed gibi bağlar. Mevcut deck WSQ export ile manual AFIS preparation adımlarını ayrı listeler ve bu ilişkiyi doğrulamaz. Bu bağlantı **Not enough source data** durumundadır ve pilot öncesi düzeltilmelidir.
- **Day 85**, UV/VIS/IR ve image enhancement vocabulary açısından desteklidir; fakat “try another mode” ve “change the light first” bir troubleshooting/operating recommendation'a dönüşür. Exact settings ve güvenlik prosedürü eksik olduğu için bu öneri learner-ready değildir.
- **Day 88**, date stamp, geo-tag, archive/reporting vocabulary açısından desteklidir; fakat metadata'nın belirli bir görüntüye gerçekten uygulandığını varsayar. Reconciled sourcebook, stamp/geotag/report cümlelerinin yalnız kayıt varsa ve “where enabled” gibi kontrollü dille kullanılmasını ister.

**Genel karar:** Mikro bağlamların temaları ana curriculum içinde şimdilik korunabilir; fakat sekiz günün tamamı “safe as-is” değildir. Day 70, 80 ve 85 yüksek öncelikli; Day 71 de attribution nedeniyle pilot öncesi düzeltilmelidir. Day 57, 64 ve 88 aynı Device-5F fazında kontrollü biçimde netleştirilmelidir. Bu audit curriculum değişikliği yapmaz.

## 2. Runtime Source Mapping

### 2.1 Asıl seed ve dönüşüm yolu

Learner-facing 8K içerik tek bir raw array'in doğrudan render edilmesiyle oluşmaz. Runtime yolu şöyledir:

```text
lib/phase-eight-content.ts
  ├─ phaseEightDays seed records
  ├─ phaseEightDayPlans ──────────────> lib/content-plan.ts ──> /today
  ├─ phaseEightListeningDrills ───────> lib/listening-content.ts ──> /listen
  ├─ phaseEightDayWords ──────────────> lib/words-content.ts ──> /words
  ├─ phaseEightSpeakingPractices ─────> lib/speaking-content.ts ──> /speak
  └─ phaseEightReviewDrills ──────────> lib/review-content.ts ──> /review
```

Sekiz gün için **claim-bearing source-of-truth**, ağırlıklı olarak `lib/phase-eight-content.ts` içindeki şu alanlardır:

- `theme`
- `speakingGoal`
- `transcript`
- `keyLines`
- `miniTaskTr`
- dört seed `words` öğesi
- üç seed `review` öğesi
- `deviceSpeakingPromptByDay`
- `deviceListeningOutputByDay`
- `deviceMiniGoalByDay`

### 2.2 Runtime dönüşümleri

| Runtime alanı | Kaynak ve dönüşüm | Audit etkisi |
|---|---|---|
| Today/plan | `phaseEightDayPlans`, `phaseEightDays` içindeki `theme` ve `speakingGoal` alanlarını map eder; `learningTrackPlan` içine eklenir. | Today başlığı ve açıklaması da learner-facing claim yüzeyidir. |
| Listening | `phaseEightListeningDrills`, title/focus/transcript/keyLines değerlerini seed'den alır; `outputPrompt` için raw seed alanını değil `buildPhaseEightListeningOutput()` sonucunu kullanır. Sekiz günün tamamında `deviceListeningOutputByDay` override'ı vardır. | Raw `outputPrompt` final runtime prompt değildir; audit override metnini esas alır. |
| Words | `phaseEightDayWords`, dört seed teknik öğeyi map eder. `lib/words-content.ts` içindeki `expandDailyWords()` bunlara theme/speaking booster ekleyerek toplamı sekize çıkarır. | İlk dört teknik öğe claim-bearing'dir; ek dört booster genel speaking vocabulary'dir ve yeni 8K claim'i üretmez. |
| Speak | `phaseEightSpeakingPractices`, `buildPhaseEightPrompt()` kullanır. Sekiz günün tamamı `deviceSpeakingPromptByDay` ile override edilir; `targetLines` seed `keyLines` değerleridir; mini goal ayrı override'dan gelir. | Speak sayfasında seed goal, override prompt, key lines ve mini goal birlikte görünür; tek başına raw seed audit etmek yeterli değildir. |
| Review | `phaseEightReviewDrills` üç seed review item'ını üretir; `lib/review-content.ts` içindeki `withProductionReviewItem()` dördüncü production item ekler. | Ek production item genel speaking/rewrite görevidir; sekiz günde yeni device fact üretmez. Seed review model cevapları claim auditine dahildir. |
| Journal | Journal, kaydedilmiş Listen/Words/Speak/Review cevaplarını ilgili runtime array'lerden başlık ve promptlarla tekrar gösterir. | Claim-bearing metin, kullanıcı cevap geçmişinde de görünebilir; onarım yalnız görünür lesson kartı düşünülerek yapılmamalıdır. |

### 2.3 İlgili dosyaların rolü

- `lib/phase-eight-content.ts`: Day 43–90 seed verisi, sekiz device override map'i ve runtime map builder'ları; ana kaynak.
- `lib/listening-content.ts`: Phase Eight listening exportlarını gün sıralı ana `listeningDrills` array'ine ekler; ek claim dönüşümü yapmaz.
- `lib/words-content.ts`: Phase Eight words kayıtlarını ana array'e ekler ve her günü sekiz öğeye genişletir.
- `lib/speaking-content.ts`: Phase Eight speaking exportlarını ana `speakingPractices` array'ine ekler.
- `lib/review-content.ts`: Phase Eight review exportlarını ana array'e ekler ve production review item ekler.
- `lib/content-plan.ts`: Phase Eight planlarını `learningTrackPlan` içine ekler. `firstFourteenDayPlan` adı yanıltıcı biçimde tüm planı alias eder, fakat sekiz günün learner-facing claim metnini değiştirmez.

## 3. Day-by-Day Audit Table

| Day | 8K topic | Learner-facing claim summary | Evidence status | Risk | Recommendation |
|---:|---|---|---|---|---|
| 48 | Device setting clarification | Selected light group ve motorized filter hakkında kibar clarification | **Safe** | Düşük; exact filter veya surface setting söylenmiyor | **Keep as-is** |
| 57 | Export-format feedback | WSQ ve TIFF export; bir report için WSQ gerekli, TIFF yanlış senaryosu | **Safe** formats; **Not enough source data** for report requirement | Orta; fictional requirement cihaz kuralı gibi anlaşılabilir | **Keep but add cautious wording later** |
| 64 | Contactless image workflow | Contactless capture → archive → details → report sırası | **Cautious**; sequence için **Not enough source data** | Orta-yüksek; vocabulary operating procedure'a dönüşüyor | **Revise before pilot** |
| 70 | UVC safety instruction | UVC seçildiğinde darkroom kullanımı ve safety warning kontrolü | **Cautious**; source warning eksik aktarılmış | Yüksek; harmful-to-human-body ve supplied darkroom zorunluluğu eksik | **Revise before pilot** |
| 71 | Customer demo priority | Contactless, chemical-free, 45.9MP “8K” camera | Camera **Safe**; diğerleri **Cautious** source-stated capabilities | Yüksek; unqualified “It is chemical-free” overreach yaratır | **Revise before pilot** |
| 80 | Export/report/AFIS decision | AFIS workflow için WSQ “may be” right format; report check | AFIS prep vocabulary **Cautious**; WSQ–AFIS link **Not enough source data** | Yüksek; direct integration demese de interoperability/procedure çıkarımı doğurur | **Revise before pilot** |
| 85 | Unclear fingerprint detail | Başka UV/VIS/IR mode deneme veya enhancement; önce light değiştirme | Vocabulary **Safe/Cautious**; troubleshooting step **Not enough source data** | Yüksek; source-free operating recommendation ve olası UV safety boşluğu | **Move to Device Lab later**; mevcut metin için **Revise before pilot** |
| 88 | Technical observation/reporting | Fingerprint observed; date stamp/geotag kaydedildi; report tekrar incelenecek | Feature vocabulary **Cautious** | Orta-yüksek; actual record ve enabled state varsayılıyor | **Revise before pilot**; ayrıntılı reporting'i **Move to Device Lab later** |

## 4. Detailed Day Notes

### Day 48 — Clarifying a Device Setting

**Runtime content location**

- Today/plan: `phaseEightDayPlans` → `learningTrackPlan`
- Listening: `phaseEightListeningDrills` → `listeningDrills`
- Words: `phaseEightDayWords` → `baseDayWords` → `expandDailyWords()` → `dayWords`
- Speak: `deviceSpeakingPromptByDay[48]` ve `deviceMiniGoalByDay[48]` → `speakingPractices`
- Review: `phaseEightReviewDrills` → `withProductionReviewItem()` → `reviewDrills`

**Kısa learner-facing snippets**

- “Could you check the selected light group?”
- “I am not sure which motorized filter we need.”
- “Could you confirm the selected filter?”
- Speak override: “Mention the selected light group or selected filter...”

**Source support**

- 8K deck, on named light group bulunduğunu açıkça listeler: **Safe** descriptive vocabulary.
- Motorized filter wheel ve yedi named filter device extraction'da listelenir: “motorized filter” terimi **Safe**.
- Gün, yedi veya sekiz filter sayısı söylemez; catalog conflict'ini sessizce çözmez.
- Gün, belirli bir surface için doğru filter önermediği ve yalnız confirmation istediği için exact-setting sınırını aşmaz.

**Claim-control assessment**

- 45.9MP, UV/VIS/IR, UVC safety, export, metadata, contactless, AFIS, remote scanning, surfaces ve marketing claims bu günde yoktur.
- “Which motorized filter we need” bir operational need bağlamı kurar; fakat cevabı veya setting'i öğretmediği için sourcebook'taki “confirm the selected light/filter” clarification diline uygundur.

**Risk ve öneri**

- Risk: **is safe as-is**.
- Öneri: **Keep as-is**. Device Lab'e taşınması zorunlu değildir; genel clarification practice içinde küçük teknik bağlam olarak kalabilir.

### Day 57 — Giving Feedback About an Export Format

**Runtime content location**

- Today/plan: theme ve export-format speaking goal
- Listening: seed transcript/key lines + Day 57 listening-output override
- Words: `export format`, `WSQ`, `TIFF`, `calm feedback` + dört genel booster
- Speak: Day 57 device prompt ve mini goal
- Review: üç seed item + bir genel production item

**Kısa learner-facing snippets**

- “The report needs WSQ today, not TIFF.”
- “Could you export it again in the required format?”
- “Mention WSQ or TIFF, then ask for the required format.”

**Source support**

- WSQ, TIFF, JPEG, PNG ve BMP, 8K için listed export formats'tır: WSQ/TIFF vocabulary **Safe**.
- Kaynak bir belirli report'un WSQ “need” ettiğini veya TIFF'in yanlış olduğunu söylemez: bu ilişki **Not enough source data**.
- Cümle bir customer/request-specific fictional scenario olarak yorumlanabilir; fakat mevcut metin bunu açıkça belirtmez.

**Claim-control assessment**

- RAW/TIFF capture ile export format kavramı karıştırılmamalıdır. Gün export üzerine kuruludur; bu yön doğru olsa da “required format” dış workflow tarafından belirlenmiş gibi çerçevelenmelidir.
- AFIS, direct integration veya interoperability bu günde yoktur.
- JPEG/PNG/BMP kaynakta vardır ama bu günde learner-facing değildir.

**Risk ve öneri**

- Risk: **needs cautious wording**; mevcut hali source-backed format listesi ile fictional report requirement arasındaki sınırı göstermiyor.
- Öneri: **Keep but add cautious wording later**. Device-5F'te format requirement'ın örnek bir request/workflow koşulu olduğu açıklaştırılmalı; manufacturer rule olarak sunulmamalıdır.

### Day 64 — Explaining a Contactless Image Workflow

**Runtime content location**

- Today/plan: contactless capture/archive/report speaking goal
- Listening: seed transcript/key lines + Day 64 output override
- Words: `contactless workflow`, `image archive`, `report`, `details` + dört genel booster
- Speak: Day 64 process override ve ordered mini goal
- Review: archive/report/contactless seed items + production item

**Kısa learner-facing snippets**

- “First, we use a contactless workflow to capture the fingerprint image.”
- “Then we save the image in the archive.”
- “We add it to the report.”
- Speak override: “Include capture, image archive, and report in a simple order.”

**Source support**

- 8K workflow'un contactless olduğu üretici sunumunda belirtilir: **Cautious / source-stated capability**; attribution gerekir.
- Image archive platform ve detailed reporting feature listelenir: **Cautious / source-stated capability**.
- Sunum capture, archive ve reporting vocabulary sağlar; fakat operator manual ile doğrulanmış zorunlu end-to-end sequence vermez: exact order **Not enough source data**.

**Claim-control assessment**

- Chemical-free, performance, success rate, surface guarantee veya evidence-preservation claim'i yoktur.
- “We use... then... after that...” dili descriptive feature'ları procedural workflow'a yükseltir.
- Device Lab architecture, eksik workflow adımlarının inference ile doldurulmamasını ister.

**Risk ve öneri**

- Risk: **needs cautious wording** ve **should be revised before pilot**.
- Öneri: **Revise before pilot**. Future repair, bunun source-described vocabulary/example sequence olduğunu söylemeli; approved SOP veya universal operator procedure izlenimi vermemelidir. Daha ayrıntılı workflow öğretimi Device Lab'e ayrılmalıdır.

### Day 70 — Giving Instructions Politely / UVC Safety

**Runtime content location**

- Today/plan: UVC safety instruction speaking goal
- Listening: seed safety transcript/key lines + Day 70 output override
- Words: `UVC mode`, `darkroom`, `safety warning`, `workflow` + dört genel booster
- Speak: Day 70 milestone override, özel self-check ve mini goal
- Review: darkroom/safety warning/UVC instruction items + milestone production item

**Kısa learner-facing snippets**

- “Please use the darkroom when UVC mode is selected.”
- “Check the safety warning first.”
- “Capture the image when the workflow is ready.”
- Self-check: “Kibar bir UVC güvenlik talimatı verdim mi?”

**Source support**

- Slide, 8K'nin UVC içerdiğini, UVC'nin human body için harmful olabileceğini ve supplied darkroom ile kullanılması gerektiğini söyler: dar kapsamda **Safe source warning**.
- “Darkroom” tek başına değil, **supplied darkroom** olarak korunmalıdır.
- Kaynak complete UVC safety procedure, exposure limit, PPE, interlock veya emergency procedure sağlamaz.

**Claim-control assessment**

- Gün supplied darkroom kullanım yönünü kısmen korur; fakat bütün future learning pack'ler için zorunlu iki unsuru birlikte söylemez:
  1. “According to the slide, UVC can be harmful to the human body.”
  2. “Use UVC with the supplied darkroom.”
- “Capture the image when the workflow is ready” safety kaynağından gelen bir clearance kriteri değildir. Darkroom ve safety warning kontrolünün tamamlandığını tanımlayan SOP yoktur.
- Bu gün UVC'yi complete safety instruction gibi sunmamalıdır.

**Risk ve öneri**

- Risk: **should be revised before pilot**; yüksek safety-omission riski. Claim blocked değildir, fakat eksik aktarılmıştır.
- Öneri: **Revise before pilot**. Day 70, Device-5F'in ilk önceliği olmalıdır. Daha sonra dar UVC warning modülü Device Lab'e taşınabilir; ana curriculum içinde kalırsa exact warning her learner-facing alanda görünür olmalıdır.

### Day 71 — Choosing a Customer Demo Priority

**Runtime content location**

- Today/plan: customer demo priority goal
- Listening: 8K demo transcript/key lines + Day 71 output override
- Words: `45.9MP 8K camera`, `contactless`, `chemical-free`, `customer demo` + dört genel booster
- Speak: Day 71 8K demo override ve mini goal
- Review: contactless/chemical-free/demo priority items + production item

**Kısa learner-facing snippets**

- “It is chemical-free.”
- “It uses a 45.9MP 8K camera.”
- “I would start with the contactless workflow.”
- Speak override: “Mention contactless, chemical-free, or the 45.9MP 8K camera...”

**Source support**

- Source, 45.9MP “8K” imaging camera listeler: **Safe**, fakat exact pixel dimensions veya true 8K standardı çıkarılmamalıdır.
- Source, device/workflow'un evidence ile temas gerektirmediğini belirtir: **Cautious / source-stated capability**.
- Source, latent evidence detection workflow'unda powder veya chemicals kullanılmadığını belirtir: **Cautious / source-stated capability**.

**Claim-control assessment**

- “It is chemical-free” öznesi belirsiz ve source-described workflow'dan daha geniştir. Sistem, her process veya her evidence outcome için koşulsuz chemical-free fact gibi anlaşılabilir.
- “Contactless” evidence preservation veya “cannot damage evidence” garantisine çevrilmemiştir; olumlu.
- Camera cümlesi marketing superlative, performance veya accuracy eklemez; olumlu.
- Current text “source states/manufacturer states” attribution'ını taşımaz.

**Risk ve öneri**

- Risk: **needs cautious wording**; plain-fact attribution ve scope sorunu.
- Öneri: **Revise before pilot**. Device-5F'te contactless ile chemical/powder-free ifadeleri manufacturer/source-attributed workflow cümlesine dönüştürülmeli. Lightweight demo language ana curriculum içinde kalabilir; ayrıntılı product demo Device Lab'e ayrılmalıdır.

### Day 80 — Making a Work Decision About Export and Report

**Runtime content location**

- Today/plan: export/report/AFIS decision speaking goal
- Listening: AFIS/WSQ transcript/key lines + Day 80 output override
- Words: `AFIS workflow`, `report`, `WSQ`, `next step` + dört genel booster
- Speak: Day 80 AFIS decision override ve mini goal
- Review: AFIS/report/work-decision items + production item

**Kısa learner-facing snippets**

- “The image is needed for an AFIS workflow.”
- “WSQ may be the right export format.”
- “Explain whether to check the report or export for an AFIS workflow.”
- Review answer: “...the image may be needed for AFIS.”

**Source support**

- 8K deck bir manual AFIS submission/preparation sequence gösterir: monocolor/invert, 1:1 ratio, RAW capture, minutia calculation ve identification yönü. Bu **Cautious / source-stated workflow**'dur.
- Deck WSQ export capability listeler: **Safe** format vocabulary.
- Deck, WSQ'yu AFIS için doğru/gerekli format olarak bağlamaz: **Not enough source data**.
- Named AFIS partner, API, certified interface veya automated connection yoktur.

**Claim-control assessment**

- Direct AFIS integration açıkça söylenmez; bu nedenle doğrudan blocked phrase bulunmamıştır.
- Buna rağmen generic “AFIS workflow” ve WSQ “right format” ilişkisi, interoperability veya procedural correctness izlenimi oluşturabilir.
- Gün “AFIS preparation workflow” veya “manual AFIS submission workflow” kontrollü terimlerini kullanmaz.
- Sourcebook, AFIS preparation ile export formatını ancak actual documented workflow/request bağlamında raporlamaya izin verir.

**Risk ve öneri**

- Risk: **should be revised before pilot**; yüksek AFIS implication riski.
- Öneri: **Revise before pilot**. WSQ–AFIS correctness bağlantısı kaldırılmalı veya açıkça “required format is not documented in the available source” denmelidir. AFIS content daha sonra ayrı, controlled Device Lab module olarak sunulmalıdır.

### Day 85 — Giving Options When Fingerprint Detail Is Unclear

**Runtime content location**

- Today/plan: unclear fingerprint detail ve next-step goal
- Listening: UV/VIS/IR, image enhancement ve light-change transcript/key lines + Day 85 output override
- Words: `UV/VIS/IR`, `image enhancement`, `fingerprint detail`, `compare the result` + dört genel booster
- Speak: Day 85 problem-solving override ve mini goal
- Review: options/enhancement/light-mode items + production item

**Kısa learner-facing snippets**

- “We can try another UV, VIS, or IR mode.”
- “We can use image enhancement.”
- “We should change the light first and compare the result.”
- Review answer: “We can try another light mode...”

**Source support**

- UVA/UVB/UVC/VIS/IR capability source-stated'dir: descriptive vocabulary **Safe/Cautious**.
- Image enhancement feature listelenir, fakat algorithm/method açıklanmaz: **Cautious**.
- Exact light/filter selection, troubleshooting order ve surface settings yoktur: proposed next steps **Not enough source data**.

**Claim-control assessment**

- “Change the light first” bir operating recommendation'dır ve presentation bunu universal first step olarak doğrulamaz.
- “Try another UV” ifadesi UV familyası içinde UVC'yi de kapsayabilecek belirsizlik taşır; supplied darkroom uyarısı aynı learning pack içinde yoktur.
- Gün performans veya success-rate sözü vermez ve “compare the result” neutral kalır; ancak safety ve procedure sınırı yine aşılır.

**Risk ve öneri**

- Risk: **contains a blocked operational recommendation until an operator/safety source exists**; main curriculum için yüksek.
- Öneri: Mevcut learner-facing metin **Revise before pilot**. Ayrıntılı troubleshooting **Move to Device Lab later** ve authoritative manual/safety source gelene kadar descriptive clarification ile sınırlı kalmalıdır.

### Day 88 — Summarizing a Technical Observation

**Runtime content location**

- Today/plan: technical observation ve next-step goal
- Listening: observed/date stamp/geotag/report transcript + Day 88 output override
- Words: `observed`, `date stamp`, `geotag`, `technical observation` + dört genel booster
- Speak: Day 88 summary override ve cautious-language mini goal
- Review: date stamp/geotag/observation items + production item

**Kısa learner-facing snippets**

- “The fingerprint was observed on the surface.”
- “The image includes a date stamp.”
- “The geotag is also saved with the image.”
- Mini goal: “...observed veya appears clearer gibi dikkatli dil kullan.”

**Source support**

- Date stamp, location stamp, geo-tag ve light/filter stamp software features olarak listelenir: **Cautious / source-stated capability**.
- Image archive platform ve detailed reporting feature listelenir: **Cautious / source-stated capability**.
- Kaynak bu fictional image record üzerinde stamp/geotag'ın gerçekten enabled veya saved olduğunu doğrulamaz: case statement için **Not enough source data**.

**Claim-control assessment**

- Reconciled sourcebook, reporting language'ın yalnız gerçekten yapılan/recorded işlemi söylemesini ve metadata için “where enabled” kontrolünü ister.
- “Observed on the surface” belirli bir application-surface claim'i değildir; surface success veya universal detection sonucu vermez.
- “Appears clearer” ölçülmüş performance claim'i değildir, fakat karşılaştırma koşulu yoksa gereksiz sonuç dili üretir.
- Location stamp ve light/filter stamp bu günde yoktur; bu eksiklik claim sorunu değildir.

**Risk ve öneri**

- Risk: **needs cautious wording**; case-specific metadata/reporting varsayımı.
- Öneri: **Revise before pilot**. Actual record/where-enabled koşulu eklenmeli. Reporting vocabulary ana curriculum içinde küçük bir micro-context olarak kalabilir; professional reporting ve case-specific placeholders **Move to Device Lab later**.

## 5. Blocked or Cautious Claim Register

| Claim veya ifade | Source status | Affected day | Risk | Action |
|---|---|---:|---|---|
| Selected light group / motorized filter | **Safe** descriptive terms | 48 | Düşük; exact setting verilirse risk yükselir | Mevcut clarification dilini koru; count veya surface setting ekleme |
| “The report needs WSQ today, not TIFF.” | Formatlar **Safe**; requirement **Not enough source data** | 57 | Manufacturer/device rule gibi okunabilir | Fictional/customer-required format olarak çerçevele |
| Contactless capture → archive → report exact order | Bileşenler/capabilities **Cautious**; exact sequence **Not enough source data** | 64 | Sunum feature listesi SOP'ye dönüşür | Source-described example olarak yeniden çerçevele; exact procedure öğretme |
| UVC use with “the darkroom” | Exact warning **Safe with controls**; current wording incomplete | 70 | Harmful-to-human-body ve supplied niteliği kaybolur | Pilot öncesi exact two-part warning ekle |
| “Capture the image when the workflow is ready.” | **Not enough source data** as safety clearance | 70 | “Ready” undefined; complete safety step izlenimi | Kaldır veya non-safety language olarak ayır; SOP bekle |
| “It is chemical-free.” | **Cautious / source-stated capability** | 71 | Cihazın veya tüm işlemlerin koşulsuz özelliği gibi anlaşılır | Manufacturer/source attribution ve latent-evidence workflow kapsamı ekle |
| Contactless workflow | **Cautious / source-stated capability** | 64, 71 | Evidence preservation veya universal outcome'a genişletilebilir | Source-attributed tut; “cannot damage” ekleme |
| 45.9MP “8K” camera | **Safe** with naming limit | 71 | True pixel dimensions/8K standardı çıkarımı | Mevcut spec'i koru; ek teknik çıkarım yapma |
| Generic “AFIS workflow” | **Cautious** | 80 | Direct/integrated workflow izlenimi | “AFIS preparation” veya “manual AFIS submission workflow” kullan |
| “WSQ may be the right export format” for AFIS | **Not enough source data** | 80 | Unsupported compatibility/procedure | Bağlantıyı kaldır veya “not documented” caveat ekle |
| Try another UV/VIS/IR mode | Descriptive modes **Safe/Cautious**; operational advice **Not enough source data** | 85 | Exact setting ve safety boşluğu | Descriptive vocabulary ile sınırla; Device Lab/manual bekle |
| “Change the light first” | **Blocked** as universal troubleshooting instruction under current evidence | 85 | Operator procedure uydurur | Remove or block in future repair |
| Use image enhancement | Feature **Cautious**; method/result undocumented | 85 | Guaranteed improvement izlenimi | “The software lists image enhancement” biçiminde çerçevele |
| Date stamp/geotag are present and saved | Feature **Cautious**; case occurrence **Not enough source data** | 88 | Gerçek record olmadan reporting fact üretir | “Where enabled/if recorded” koşulu kullan |
| “Appears clearer” | Cautious observation language; comparison basis absent | 88 | Performance implication | Gerçek before/after observation yoksa kullanma |

### Checked but not found in the eight days

Aşağıdaki iddialar sekiz günün learner-facing runtime içeriğinde bulunmamıştır:

- Remote scanning “up to 3 meters”
- “Third level identification”
- “No image distortion”
- “World’s first”, “only”, “best” veya “strongest”
- US crime-gun accreditation veya başka accreditation/certification
- Accuracy, success-rate, always-detects veya guaranteed evidence-preservation
- Direct, automatic, API-based veya certified AFIS integration
- Filter count veya yedi/eight-filter reconciliation
- Named application surfaces ya da presentation demonstration'ın lab validation gibi sunulması
- Contactless LITE claim'lerinin 8K'ye aktarılması

## 6. 8K Claims Safe for Main Curriculum

Aşağıdaki alanlar küçük, dil-işlevi odaklı micro-context olarak ana 90 günlük curriculum içinde kalabilir. Her madde kendi kontrolünü korumalıdır:

- `light group`, `motorized filter`, `selected filter` gibi descriptive component vocabulary; count, setting veya surface recommendation olmadan.
- 45.9MP “8K” camera ifadesi; exact pixel dimensions veya 8K video standardı çıkarımı olmadan.
- UVA/UVB/UVC/VIS/IR vocabulary; operating instruction'a dönüşmeden ve UVC varsa exact warning ile.
- WSQ, TIFF, JPEG, PNG ve BMP'nin listed export formats olduğu bilgisi; external system compatibility veya required format iddiası olmadan.
- RAW/TIFF capture vocabulary; export ile karıştırılmadan.
- Image archive, reporting, image enhancement, date/location/geotag/light-filter stamp vocabulary; feature listesi ve “where enabled/if recorded” sınırıyla.
- Source/manufacturer-attributed contactless ve chemical/powder-free workflow language; evidence preservation veya universal success garantisi olmadan.
- `observed`, `confirm`, `required format`, `check the report` gibi genel professional communication chunks; case facts uydurmadan.

Main curriculum için en güvenli kullanım, cihaz bilgisini öğretme amacı değil clarification, feedback, sequencing ve cautious reporting diline kısa bir gerçek iş bağlamı sağlamaktır.

## 7. 8K Claims Better Reserved for Device Lab

Aşağıdaki alanlar teknik olarak kısmen kaynaklı olsa da claim-sensitive, operational veya safety-dense oldukları için genel 90 günlük yoldan çok source-aware Device Lab'e uygundur:

- On light group'un tam listesi ve yedi named filter'ın source-specific listesi.
- Seven-filter device extraction ile eight-filter catalog overview conflict'inin açıklanması.
- Light/filter selection, surface-specific settings ve troubleshooting sequences.
- UVC warning ve supplied-darkroom instruction; yalnız dar source warning olarak ve complete safety training olmadığı görünür biçimde.
- Contactless capture/archive/report workflow'un source/limit notlarıyla açıklanması.
- RAW/TIFF capture ile WSQ/TIFF/JPEG/PNG/BMP export ayrımı.
- AFIS preparation, manual AFIS submission workflow, 1:1 ratio, RAW capture ve minutia-calculation sequence.
- Professional reporting placeholders: recorded light/filter combination, stamp, location, geo-tag ve actual export format.
- Presentation-demonstrated surfaces; her biri manufacturer presentation example olarak, performance validation değil.
- Customer Q&A: direct AFIS, evidence impact, remote scanning, accreditation ve “always works” sorularına controlled answers.

## 8. Conflicts / Follow-up Items

### 8.1 Seven-filter vs eight-filter

Device-specific 8K extraction yedi named filter listeler; High-Tech overview sekiz-filter motorized system söyler. Bu audit conflict'i çözmez. Mevcut sekiz curriculum gününde filter count veya named-filter listesi bulunmadığı için bugün doğrudan ihlal yoktur. Device-6 iki kaydı ayrı source context ile tutmalı; learner-facing universal count üretmemelidir.

### 8.2 AFIS wording

Day 80 direct connection demez, ancak generic “AFIS workflow” ve WSQ “right format” ilişkisi güncel standardın gerisindedir. Deck yalnız manual preparation/submission sequence'i destekler. Named partner, API, interface, certification veya WSQ requirement belgelenmemiştir.

### 8.3 Contactless / chemical-free overreach

Day 64 ve 71 device-level source-stated capability alanına dayanır. Sorun claim'in varlığı değil, attribution ve kapsamdır. “It is chemical-free” yerine source-described latent-evidence workflow sınırı gerekir. Contactless, evidence cannot be damaged veya universal non-contamination guarantee olarak genişletilmemelidir.

### 8.4 Application surface overreach

Sekiz günde mirror, wall, thermal paper, currency veya başka named surface claim'i yoktur. Day 88'de generic “on the surface” vardır; bu presentation demonstration veya başarı garantisi olarak sunulmaz. Future repair bu cümleye named surface eklememelidir; eklenirse “demonstrated in the presentation” framing zorunludur.

### 8.5 Missing source references in curriculum data

Runtime curriculum records claim ID, source file, slide, evidence status veya attribution requirement taşımaz. Claim desteği yalnız dış docs üzerinden insan incelemesiyle kurulabilir. Device-6 için metadata zorunluluğu doğru yaklaşımdır; mevcut curriculum'a bu audit fazında schema eklenmemiştir.

### 8.6 Old wording vs newer source index

Güncel source index ile uyumsuz veya eksik kontrollü eski kalıplar şunlardır:

- Day 57: report-specific WSQ requirement'ın kaynak kuralı gibi görünmesi.
- Day 64: feature vocabulary'nin exact workflow sequence olarak sunulması.
- Day 70: harmful-to-human-body ve supplied-darkroom unsurlarının birlikte zorunlu olmaması.
- Day 71: “It is chemical-free” plain-fact ve belirsiz özne.
- Day 80: generic AFIS workflow ve unsupported WSQ–AFIS link.
- Day 85: source-free “change the light first” troubleshooting recommendation.
- Day 88: actual-record koşulu olmadan stamp/geotag reporting.

## 9. Recommended Fix Phase

### Device-5F: Repair Existing 8K Micro-Contexts

Device-5F ayrı ve açıkça yetkilendirilmiş bir curriculum repair fazı olmalıdır. Bu auditte hiçbir repair yapılmamıştır.

Önerilen sıra:

1. **Day 70 — UVC safety:** Exact harmful-to-human-body ve supplied-darkroom warning'i listening, words/example, speak, review ve self-check boyunca tutarlı hale getir.
2. **Day 80 — AFIS:** Generic wording'i manual preparation/submission çerçevesine indir; unsupported WSQ–AFIS relationship'ı kaldır veya “not documented” ile sınırla.
3. **Day 85 — troubleshooting:** “Change the light first” ve başka-mode recommendation'ı kaldır; descriptive source wording ve operator-procedure gap'i kullan.
4. **Day 71 — attribution:** Contactless ve chemical/powder-free workflow'a source/manufacturer attribution ve doğru scope ekle.
5. **Day 64 — workflow:** Exact SOP izlenimini kaldır; source-described capabilities ve example sequence ayrımını netleştir.
6. **Day 88 — reporting:** Stamp/geotag/observation diline actual-record ve where-enabled koşulu ekle.
7. **Day 57 — export:** Fictional/requested format ile manufacturer/device requirement arasındaki sınırı açıklaştır.
8. **Day 48 — regression only:** İçeriği değiştirmeden filter count/setting eklenmediğini doğrula.

### Device-5F test kapsamı

- Runtime export path üzerinden sekiz günün Listen, Words, Speak, Review ve Today metinlerini yeniden çıkar.
- Day 70'te exact two-part UVC warning'in bütün learner-facing görevlerde görünür olduğunu doğrula.
- `AFIS` geçen her cümlede direct/integrated implication olmadığını ve manual/preparation scope'un korunduğunu doğrula.
- Filter count, remote scanning, marketing superlative, accreditation, performance ve success-rate taraması yap.
- Words expansion ve Review production wrapper sonrasında yeni claim oluşmadığını kontrol et.
- 90 gün, sekiz words/day ve mevcut runtime array bütünlüğü doğrulamalarını yeniden çalıştır.
- Mobile UI veya curriculum yoğunluğu değişirse ayrıca pilot readability kontrolü yap; bu audit UI değişikliğine yetki vermez.

### Device-5F kabul kriteri

- Day 70, 80, 85 ve 71 high-risk kayıtları kapanır.
- Day 57, 64 ve 88 cautious kayıtları controlled wording ile çözülür.
- Day 48 aynı claim sınırında kalır.
- Hiçbir repair yeni device fact, exact setting, performance, certification veya integration iddiası eklemez.
- Source index, sourcebook ve runtime learner-facing text arasında satır bazlı audit izi oluşturulur.

## 10. Final Verdict

### Device-6 proceed kararı

**Device-6 bu auditin gözden geçirilmesinden sonra minimal statik data model olarak ilerleyebilir.** Device-6'nın amacı source, product scope, evidence level, attribution, safety state, release state ve missing-document dependency alanlarını modellemektir; mevcut curriculum repair'ine bağımlı olmamalıdır.

### Önce repair gereken mikro bağlamlar

- **Pilot/content release öncesi zorunlu:** Day 70, Day 80, Day 85 ve Day 71.
- **Aynı Device-5F fazında düzeltilmesi güçlü biçimde önerilen:** Day 64, Day 88 ve Day 57.
- **Safe as-is:** Day 48.

Device-5F, Device-6 statik model çalışmasına teknik ön koşul değildir; fakat bu eski mikro bağlamların yeni Device Lab modüllerinde reuse edilmesi veya curriculum'un yeni pilot-ready sayılması için release gate olmalıdır.

### Main curriculum vs Device Lab

- Day 48 ve düzeltilmiş Day 57 gibi genel communication-function ağırlıklı mikro bağlamlar main curriculum içinde kalabilir.
- Day 64 ve Day 71, güçlü attribution ve “source-described example” sınırıyla küçük main-curriculum context olarak kalabilir; ayrıntılı workflow/demo Device Lab'e taşınmalıdır.
- Day 70 UVC safety, Day 80 AFIS, Day 85 operational troubleshooting ve Day 88 professional reporting, claim yoğunluğu nedeniyle esas olarak Device Lab'de yönetilmelidir. Main curriculum içinde kalacak herhangi bir kısa versiyon aynı safety/attribution/actual-record gate'lerini eksiksiz taşımalıdır.

**Son karar:** Existing 8K content bütünüyle kaldırılmamalıdır; ancak “safe enough as-is” olarak topluca onaylanmamalıdır. Ayrı Device-5F repair fazı açılmalı, ardından main curriculum'da yalnız düşük yoğunluklu communication micro-contexts tutulmalı ve operational/AFIS/UVC/reporting derinliği source-aware Device Lab'e ayrılmalıdır.

