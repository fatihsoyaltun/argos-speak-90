# Argos Speak 90 Güvenli Faz Planı

**Kanonik uygulama sırası**

**Son güncelleme:** 6 Eylül 2026

## 1. Faz yürütme protokolü

- Bir Codex görevi tam olarak bir `Durum: Sıradaki` fazı uygular.
- Başlamadan `AGENTS.md`, bu dosya ve fazın referans belgeleri okunur.
- Önkoşul, temiz/kontrol edilmiş çalışma ağacı ve izin listesi doğrulanır.
- Faz kapsamı dışındaki fırsat iyileştirmeleri not edilir; uygulanmaz.
- Kabul ölçütleri sağlanmadan faz `Tamamlandı` yapılmaz.
- Tamamlanırsa yalnız o faz `Tamamlandı`, bir sonraki uygun faz `Sıradaki` yapılır; sonraki faz çalıştırılmaz.
- Otomatik commit/push yapılmaz.
- Engelde kod değiştirmeden veya güvenli değişiklikleri koruyarak neden raporlanır; başka faza atlanmaz.

Durum sözlüğü: `Tamamlandı`, `Sıradaki`, `Bekliyor`, `Engelli`.

## 2. Durum özeti

| Faz | Ad | Durum | Ana bağımlılık |
|---|---|---|---|
| PLAN-0 | Araştırma ve yönetişim | Tamamlandı | — |
| P1 | Buton kontrastı ve etkileşim acil kapısı | Tamamlandı | PLAN-0 |
| P2 | Tek kullanıcı veri güvenliği ve çıkış envanteri | Tamamlandı | P1 |
| P3 | Login/Admin/cloud emekliliği | Tamamlandı | P2 |
| P4 | Tasarım sistemi, shell ve navigation temeli | Tamamlandı | P3 |
| P5 | Device Lab sade hap bilgi deneyimi | Tamamlandı | P4 |
| P6 | TTS güvenilirlik temeli | Tamamlandı | P4 |
| P7 | TTS kapsam genişletmesi | Tamamlandı | P5, P6 |
| P8 | Tarayıcı ses kayıt MVP'si | Tamamlandı | P4, P6 |
| P9 | Words 8 → 10 | Tamamlandı | P4, P6 |
| P10A | Bugün ve Pratik merkezi yeniden tasarımı | Tamamlandı | P4, P7 |
| P10B | Listen ve Words yeniden tasarımı | Tamamlandı | P7, P9 |
| P10C | Speak, Review ve Journal yeniden tasarımı | Tamamlandı | P7, P8 |
| P10D | İlerleme ve Ayarlar yeniden tasarımı | Tamamlandı | P3, P6 |
| P11 | Uçtan uca regresyon ve belge kapanışı | Tamamlandı | P10A–P10D |
| P12 | Device Lab 8K sonrası genişletme (kaynak destekli) | Tamamlandı | P5, P6, P11 |

P5 ve P6, P4 tamamlandıktan sonra teknik olarak paralel olabilir; ancak tek-faz kuralı nedeniyle tabloda P5 önce yürütülür. P7 ikisini de bekler.

---

## PLAN-0 — Araştırma ve yönetişim

**Durum: Tamamlandı**

### Amaç

Depoyu ve çalışan UI'ı incelemek; güncel birincil kaynaklarla hedef mimari, tasarım ve güvenli uygulama sırası oluşturmak.

### İzin listesi

- `AGENTS.md`
- `docs/ARGOS_SPEAK_90_RESEARCH_REPORT.md`
- `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`
- `docs/ARGOS_SPEAK_90_DESIGN_PLAN.md`
- `docs/ARGOS_SPEAK_90_BOOT_PROMPT.md`

### Kabul ölçütleri

- Auth/Admin/cloud, TTS, storage, Words runtime ve Device Lab mimarisi belgelenmiş.
- Görünmeyen buton kök nedeni ve Device Lab mobil yoğunluğu kanıtlanmış.
- Risk, bağımlılık, sıra, kabul kapıları ve yapılmayacaklar yazılmış.
- Tek faz yürüten yeniden kullanılabilir bootstrap prompt oluşturulmuş.
- Yalnız belge/yönetişim dosyaları değişmiş ve `git diff --check` geçmiş.

### Yapılmayacaklar

Uygulama kodu, route, içerik, paket, Auth/Admin, Supabase, TTS veya storage değişikliği.

---

## P1 — Buton kontrastı ve etkileşim acil kapısı

**Durum: Tamamlandı**

### Amaç

Device Lab'deki görünmez CTA'yı kök nedenden düzeltmek ve bütün mevcut button/link kontrolleri için tekrarlanabilir erişilebilirlik envanteri oluşturmak.

### Önkoşullar

- PLAN-0 tamamlanmış.
- Başlangıç `git status` incelenmiş.

### İzin verilen iş

- `app/globals.css` içindeki global anchor cascade problemini düzeltmek.
- Mevcut shared UI içinde merkezi, küçük bir `Button`/`ButtonLink` varyantı kurmak veya var olanı güvenli biçimde genişletmek.
- Device Lab CTA'larını bu varyanta taşımak.
- Depodaki mevcut 31 button ve 27 link kullanımını statik + tarayıcı matrisiyle denetlemek; yalnız okunurluk/target/focus için gerekli dar düzeltmeleri yapmak.
- Erişilebilirlik denetim özeti eklemek.

### Kabul ölçütleri

- Altı Device Lab CTA'sında hesaplanmış metin/zemin kontrastı ≥ 4.5:1.
- Global `a { color: inherit }` utility rengini geçersiz kılmıyor.
- Default, hover, focus-visible, active, disabled, loading ve visited durumları tanımlı/denetlenmiş.
- Tercihen bütün hedefler ≥ 44×44; istisna varsa en az 24×24 ve gerekçeli.
- 320 px reflow ve klavye focus görünür.
- `npm run lint`, `npm run build`, `git diff --check` geçiyor.

### Yapılmayacaklar

- Genel yeniden tasarım.
- Auth/Admin/TTS/Device Lab içerik değişikliği.
- Dağınık `!important` ekleyerek sorunu örtmek.

---

## P2 — Tek kullanıcı veri güvenliği ve çıkış envanteri

**Durum: Tamamlandı**

### Amaç

Login/Admin/cloud kaldırılmadan önce kullanıcı ilerlemesini kaybetmeyecek kanıtlı geçiş kapısını kurmak.

### İzin verilen iş

- Auth/session/admin/cloud/Supabase import-route-env-package envanteri.
- `argos-practice-progress`, `argos-active-day` ve Device Lab storage şeması uyumluluk testleri.
- Yerel JSON export/import round-trip testi ve gerekiyorsa geriye uyumlu, yerel-only yedek iyileştirmesi.
- Olası cloud ilerlemesini son kez yerel export'a alma prosedürü; yalnız kullanıcı kontrollü ve açık.
- Migration checklist/özet belgesi.

### Kabul ölçütleri

- Var olan yerel fixture yükleniyor, export ediliyor, temiz profile import edilip aynı gün/görev durumunu veriyor.
- Cloud'da olabilecek tek kullanıcı verisi için açık backup/son çekme kararı belgeli ve uygulanabilir.
- Silinecek bütün consumer → server → dependency zinciri listelenmiş.
- Bu faz hiçbir route'u veya Auth/Admin kodunu henüz silmiyor.
- Lint/build/diff-check ve storage round-trip testi geçiyor.

### Yapılmayacaklar

- Supabase şema değişikliği.
- Storage key rename/reset.
- Auth/Admin route kaldırma.
- Otomatik cloud silme.

---

## P3 — Login/Admin/cloud emekliliği

**Durum: Tamamlandı**

### Amaç

Uygulamayı tek kullanıcı, yerel ilerleme modeline geçirmek; basit `/stats` ilerlemesini korumak.

### Uygulama sırası

1. Settings/navigation/pilot içindeki login, account, team, admin ve sync tüketicilerini kaldır.
2. `/login`, `/account`, `/admin`, `/admin/users/[userId]` için bilinçli route emekliliği uygula.
3. Auth/session/cloud sync/Admin server kodunu kaldır.
4. Artık import kalmadığı kanıtlanınca Supabase client/server/types, paketler ve kullanılmayan env dokümantasyonunu temizle.
5. `/stats` adını görünürde “İlerleme” yap; mevcut local progress'i koru.

### Kabul ölçütleri

- Eski local progress ve active day aynen yükleniyor.
- Uygulamada login/account/admin/cloud sync CTA veya metni kalmıyor.
- Build route listesinde emekli route'lar yok.
- `rg` taramasında uygulama kaynaklarında artık Auth/Admin/Supabase consumer import'u yok.
- Kullanılmayan Supabase paketleri ancak import sıfırlandıktan sonra kaldırılmış.
- `/stats` ve local export/import çalışıyor.
- Lint/build/diff-check ve mobil smoke test geçiyor.

### Yapılmayacaklar

- LocalStorage anahtarlarını değiştirmek.
- Ana müfredat veya Device Lab içeriğini değiştirmek.
- Supabase uzak proje/veritabanını silmek.
- Tasarımın bütününü aynı fazda yenilemek.

---

## P4 — Tasarım sistemi, shell ve navigation temeli

**Durum: Tamamlandı**

### Amaç

Yeni sakin, mobil ve ses-öncelikli ürün için semantic token, temel bileşen ve beş hedefli kabuk oluşturmak.

### İzin verilen iş

- Semantic renk/spacing/type token'ları.
- Button/ButtonLink, Card, SectionHeader, Status/Feedback gibi dar ortak primitives.
- Alt navigation: Bugün, Pratik, Device Lab, İlerleme, Ayarlar.
- Pratik hub route'u veya mevcut route'ların en az değişiklikle gruplanması.
- Benzersiz metadata title ve tek `h1` sözleşmesi.
- Safe-area, 320 px reflow ve reduced-motion temeli.

### Kabul ölçütleri

- Beşten fazla sabit nav öğesi yok.
- Bütün temel varyant durumları kontrast/focus/target kapısından geçiyor.
- Mevcut görev route'larına erişim kaybolmuyor.
- 320, 375, 768 ve desktop viewport smoke testleri geçiyor.
- Lint/build/diff-check geçiyor.

### Yapılmayacaklar

- Tüm sayfaları aynı anda yeniden yazmak.
- TTS sağlayıcı veya content runtime değişikliği.
- Device Lab'e yeni facts eklemek.

---

## P5 — Device Lab sade hap bilgi deneyimi

**Durum: Tamamlandı**

### Amaç

Device Lab'i kaynak güvenliğini koruyarak kısa İngilizce cihaz tanıtımına dönüştürmek.

### İzin verilen iş

- Landing'de yalnız yayımlanmış/hazır cihazları öğrenci kartı olarak göstermek.
- Mevcut source-backed claims'i “intro + en çok 3 quick facts + kısa words + tek say it” sunumuna dönüştürmek.
- Source/blocked/claim-control alanlarını kapalı kaynak notuna veya geliştirici QA belgesine taşımak.
- Admin coaching'i öğrenci yüzeyinden kaldırmak.
- Dört eşit textarea'yı bir isteğe bağlı nota indirmek; mevcut yerel kaydı geriye uyumlu okumak.
- TTS/kayıt için semantik hook/ID hazırlamak; henüz sağlayıcı kapsamını genişletmemek.

### Kabul ölçütleri

- Örnek modül 375×812'de hedef olarak 3–5 ekran uzunluğunda.
- Öğrencinin ilk viewport'unda cihaz adı, intro ve ana dinle/say it akışı görünür.
- Yalnız source-backed facts yayımlanıyor; blocked claim görünür gerçek değil.
- Deferred cihazlar sahte modülle açılmıyor.
- Mevcut Device Lab local completion okunuyor ve reset yalnız ilgili modülü etkiliyor.
- Lint/build/diff-check ve tüm Device Lab route smoke testleri geçiyor.

### Yapılmayacaklar

- Yeni cihaz gerçeği veya modülü uydurmak.
- TTS API davranışını değiştirmek.
- Cloud/admin tracking eklemek.
- AI model cevap/puan eklemek.

---

## P6 — TTS güvenilirlik temeli

**Durum: Tamamlandı**

**Son doğrulama notu (6 Ağustos 2026):** Ele geçirilmiş ElevenLabs anahtarı
iptal/rotate edildi; yeni anahtar yalnız ignored `.env.local` içinde tutuluyor.
İzlenen dosya, istemci bundle ve log taramaları temizdir. Gerçek ElevenLabs binary
ve timed istekleri doğru MIME, sıfırdan büyük ses baytı ve dört kelimelik alignment
ile geçti. Settings, Listen ve Words için play/pause/resume/replay, cache,
overlap, highlighting, word/example audio, klavye focus ve 320×812 ile 375×812
manuel tarayıcı QA geçti. P6 tamamlandı; yalnız P7 `Sıradaki` yapıldı. Ayrıntı:
`docs/ARGOS_SPEAK_90_P6_TTS_RELIABILITY_SUMMARY.md`.

### Amaç

Mevcut ElevenLabs akışını genişletmeden önce güvenilir, ölçülebilir ve ortak bir ses katmanı yapmak.

### İzin verilen iş

- Ortak AudioAction/useAudioController durum makinesi.
- `play()` Promise, autoplay engeli, timeout, abort, retry ve yapılandırılmış hata yönetimi.
- Request dedupe'u koruyup LRU/TTL/limit, object URL cleanup ve cache reset.
- Base64 JSON ile binary/streaming yaklaşımını gerçek ölçümle karşılaştırmak.
- Kelime zamanlama/highlight gereken içerik için mevcut davranışı koruyan karar.
- Settings audio health testi.
- Sunucu input validation, rate/cost guard ve güvenli log sınırı.

### Kabul ölçütleri

- Listen ve Words mevcut ses davranışı regresyonsuz.
- Gerçek TTS isteği ses baytı, doğru MIME, >0 süre ve kullanıcı eylemiyle playback üretiyor.
- Hata/retry/offline/eksik config durumları anlaşılır.
- Aynı ses tekrarında sınırsız bellek büyümesi yok.
- Anahtar istemci bundle/log'una sızmıyor.
- Lint/build/diff-check ve desktop+mobil audio QA geçiyor.

### Yapılmayacaklar

- Autoplay.
- TTS anahtarını istemciye taşımak.
- Transcript highlight'ı ölçmeden kaldırmak.
- Henüz bütün route'lara ses eklemek.

---

## P7 — TTS kapsam genişletmesi

**Durum: Tamamlandı**

**Son doğrulama notu (6 Ağustos 2026):** Listen key lines, Speak, Review ve
yayımlanmış Device Lab öğrenme nesneleri P6 ortak ses davranışına taşındı;
Words word/example ile Listen transcript davranışı korundu. Route başına tek
aktif oynatma, kontrollü 2.000 karakter bölümleme, cache reuse, 13 gerçek TTS
yanıtı, 320/375 mobil reflow ve 3 px klavye focus göstergesi geçti. Journal'ın
mevcut promptları Türkçe olduğu için TTS kapsamına alınmadı. Ayrıntı:
`docs/ARGOS_SPEAK_90_P7_TTS_COVERAGE_SUMMARY.md`.

### Amaç

İlgili bütün İngilizce öğrenme içeriğini aynı ses davranışıyla dinlenebilir yapmak.

### Kapsam

- Listen transcript/key lines.
- Words word + example.
- Speak prompt ve hedef cümleler.
- Review İngilizce prompt/öğrenme metni.
- Yayımlanmış Device Lab intro, quick facts, key words ve say-it prompt.
- Journal'da yalnız İngilizce prompt varsa o prompt.

### Kabul ölçütleri

- Her kapsam nesnesinde tutarlı Dinle/playing/error state var.
- Aynı anda yalnız bir içerik oynuyor.
- Türkçe navigasyon/ayar metni gereksiz yere TTS'e gönderilmiyor.
- Uzun metin ve 2.000 karakter sınırı kontrollü chunk/UX ile ele alınmış.
- Route bazlı gerçek playback matrisi raporlanmış.
- TTS maliyetini artıran gereksiz yeniden çağrılar engellenmiş.
- Lint/build/diff-check geçiyor.

### Yapılmayacaklar

- Otomatik sayfa okuma.
- AI değerlendirme/telaffuz skoru.
- Kaynaksız Device Lab metni üretmek.

---

## P8 — Tarayıcı ses kayıt MVP'si

**Durum: Tamamlandı**

**Son doğrulama notu (6 Ağustos 2026):** Ortak session-only VoiceRecorder;
Speak first/second try ile yayımlanmış Device Lab reading/say-it görevlerine
eklendi. Chrome 150 gerçek MediaRecorder/fake microphone matrisinde açık kullanıcı
eylemi, WebM/Opus kayıt ve playback, yeniden kayıt, silme, refresh temizliği,
pending timeout, stop/unmount track kapanması, object URL iptali, 320/375 reflow
ve 3 px klavye odağı geçti. Firefox ve Safari/iOS için format/API özellik
kontrolü ile metin görevi fallback'i belgelendi. Ayrıntı:
`docs/ARGOS_SPEAK_90_P8_VOICE_RECORDING_SUMMARY.md`.

### Amaç

Speak ve uygun okuma görevlerinde kullanıcının sesini yerel olarak kaydedip geri dinlemesini sağlamak.

### İzin verilen iş

- Ortak VoiceRecorder progressive enhancement bileşeni.
- `getUserMedia`, `MediaRecorder`, `isTypeSupported` özellik kontrolü.
- WebM/Opus, MP4 ve browser-default MIME fallback.
- Başlat/durdur/oynat/yeniden kaydet/sil/isteğe bağlı indir.
- 60–120 saniye sınırı, track ve object URL cleanup.
- Speak ve seçilmiş reading/say-it görev entegrasyonu.

### Kabul ölçütleri

- İzin yalnız açık kullanıcı eyleminden sonra isteniyor.
- NotAllowed, NotFound, NotReadable, timeout/pending ve unsupported durumları anlaşılır.
- Kayıt session-only; refresh sonrası saklanmıyor ve bu açıkça yazıyor.
- Stop/unmount sonrasında aktif mic track kalmıyor.
- Chromium, Firefox ve Safari/iOS matrisi gerçek cihaz veya belgeli fallback ile raporlu.
- Kayıt olmayan tarayıcıda metin görevi çalışıyor.
- Lint/build/diff-check geçiyor.

### Yapılmayacaklar

- Blob'u localStorage'a yazmak.
- Upload/cloud/admin erişimi.
- AI skor, transkripsiyon veya pronunciation grading.
- Sayfa açılışında mikrofon izni.

---

## P9 — Words 8 → 10

**Durum: Tamamlandı**

### Amaç

90 günlük runtime'ı bozmadan her güne 10 Words öğesi sağlamak ve mobil yoğunluğu 5+5 sunumla yönetmek.

### İzin verilen iş

- `TARGET_DAILY_WORD_COUNT` ve expand/booster runtime'ı.
- Gerekli, kaynak/mevcut içerik kurallarına uygun kelime havuzu düzenlemesi.
- 5 aktif + 5 destek/review rolü veya eşdeğer açık metadata.
- Progressive 5+5 Words UI.
- Sayaçlar, testler ve doğrulama belgeleri.

### Kabul ölçütleri

- Gün 1–90; her gün tam 10 öğe; toplam 900 runtime öğesi.
- Gün içinde duplicate yok, tüm zorunlu alanlar dolu.
- Runtime sonlu ve deterministik.
- Tema/stage uyumu örneklem + otomatik doğrulama ile raporlu.
- Eski progress/local storage yükleniyor, reset yok.
- İlk viewport 10 büyük kart göstermiyor; 5+5 akış anlaşılır.
- Tüm kelime ve örnek sesleri P7 sözleşmesiyle çalışıyor.
- Lint/build/diff-check geçiyor.

### Yapılmayacaklar

- Gün sayısını veya gün kimliklerini değiştirmek.
- On kelimeyi eşit ağırlıklı on yeni aktif kelime olarak yığmak.
- Source extraction/sourcebook düzenlemek.

---

## P10A — Bugün ve Pratik merkezi yeniden tasarımı

**Durum: Tamamlandı**

### Amaç

Günlük başlangıç akışını tek sonraki eylem ve kompakt görev özeti çevresinde sadeleştirmek.

### Kabul ölçütleri

- Today'de gün /90, tek ana CTA ve kompakt tamamlanma listesi var.
- Pratik hub bütün beş göreve erişim sağlıyor.
- Var olan tamamlanma semantiği korunuyor.
- 320/375 mobil, klavye, metadata ve build kapıları geçiyor.

### Yapılmayacaklar

Diğer route gruplarını aynı fazda yeniden tasarlamak.

---

## P10B — Listen ve Words yeniden tasarımı

**Durum: Tamamlandı**

### Amaç

Ses öncelikli Listen ve 5+5 Words deneyimini son tasarım sözleşmesine taşımak.

### Kabul ölçütleri

- Listen tek ana ses kontrolü ve okunur transcript sunuyor.
- Words 10 öğeyi kademeli sunuyor.
- TTS/highlight/completion regresyonu yok.
- Mobil yoğunluk, focus, kontrast ve gerçek playback kapıları geçiyor.

**Son doğrulama notu (6 Eylül 2026):** Listen tek Metni dinle birincil kontrolü + okunur transcript/highlight; Words 5+5 progressive reveal ve N/10 gerçek sayaç. lint, build, test:p9, test:p10b, git diff --check geçti. Production next start üzerinde 375px DOM ve /api/tts gerçek ses baytı doğrulandı.

---

## P10C — Speak, Review ve Journal yeniden tasarımı

**Durum: Tamamlandı**

### Amaç

Uzun form yığınını prompt → dinle → cevap/kayıt → review → tamamla akışına indirmek.

### Kabul ölçütleri

- Bir anda tek ana görev alanı.
- Ses ve kayıt fallback'i tutarlı.
- Autosave ve eski metin cevapları korunuyor.
- AI score/model answer yok.
- Mobil, klavye, gerçek playback/kayıt ve build kapıları geçiyor.

**Son doğrulama notu (6 Eylül 2026):** Speak/Review tek birincil alanlı adım akışı (prompt → dinle → cevap/kayıt → gözden geçir → tamamla); Journal tek not + autosave, ek alanlar/eski cevaplar ExpandableCard. lint, build, test:p9/p10a/p10b/p10c, git diff --check geçti. Production next start + Chrome CDP: 320/375 reflow, focus, Speak gerçek /api/tts playback, kayıt UI yalnız cevap adımında.

---

## P10D — İlerleme ve Ayarlar yeniden tasarımı

**Durum: Tamamlandı**

### Amaç

Tek kullanıcı yerel modeli açıkça anlatan sade İlerleme ve Ayarlar yüzeyi oluşturmak.

### Kabul ölçütleri

- İlerleme aktif gün, görev özeti ve yerel saklama bilgisini gösteriyor.
- Ayarlar yalnız program, veri yedeği, ses health ve mikrofon gizliliği bölümlerini taşıyor.
- Export/import round-trip çalışıyor.
- Login/admin/cloud dili geri dönmüyor.
- Reset tehlikeli eylemi açık onaylı ve yalnız hedef veriyi siliyor.

**Son doğrulama notu (6 Eylül 2026):** İlerleme aktif gün / görev özeti / son 7 gün / Device Lab sayısı / “bu cihazda saklanıyor” + dışa aktar. Ayarlar yalnız Program, Veriler, Ses health, Mikrofon gizliliği. Reset `SİL` onaylı ve `clearLocalUserData` yalnız hedef anahtarları siliyor. lint (0 uyarı), build, test:p10d (+ p2/p9/p10a–c), git diff --check geçti. P11 başlatılmadı.

---

## P11 — Uçtan uca regresyon ve belge kapanışı

**Durum: Tamamlandı**

### Amaç

Yeni tek kullanıcı ürününün veri, route, erişilebilirlik, mobil, TTS, kayıt ve 90 günlük runtime bütünlüğünü kanıtlamak.

### Kabul ölçütleri

- 90 gün ve Words 10 otomatik doğrulaması.
- Eski local fixture migration ve export/import round-trip.
- Emekli Auth/Admin/cloud route/import/package taraması sıfır.
- Bütün öğrenci route'ları 320/375/768/desktop smoke.
- Bütün CTA state kontrast/focus/target matrisi.
- TTS gerçek ses ve hata/retry matrisi.
- Recording browser/fallback ve track cleanup matrisi.
- Device Lab yalnız source-backed yayımlanmış facts.
- `npm run lint`, `npm run build`, `git diff --check` geçiyor.
- Mimari, kullanım ve privacy belgeleri güncel.

**Son doğrulama notu (6 Eylül 2026):** P11 kapanış regresyonu tamamlandı. `test:p11` ve `test:p11:browser` kabul kapıları geçti; lint/build/diff-check geçti. Yeni özellik eklenmedi. Sonraki faz yok; tabloda Sıradaki bırakılmadı.

### Yapılmayacaklar

- Bu kapanış fazında yeni özellik eklemek.
- Test başarısızlığını belgeyle geçiştirmek.

## P12 — Device Lab 8K sonrası genişletme (kaynak destekli)

**Durum: Tamamlandı**

### Amaç

P5/Device-6/Device-7'de yayımlanmamış (`draft_controlled`) durumda bekleyen kaynak destekli Device Lab modüllerini insan/agent claim-control incelemesinden geçirip yayımlamak; `docs/DEVICE_SOURCE_INDEX.md` ve `docs/DEVICE_LAB_ARCHITECTURE_PLAN.md`'nin zaten "ready with controls" olarak işaretlediği ama Device-6'da veri modeline alınmamış t-ZOOM Plus DNA Intro ve SuperSpectral Force/Core Comparison modüllerini, yalnız mevcut `docs/sources/forenscope/*` çıkarımlarına dayanarak eklemek. Device Lab'i 8K'nin ötesine, kaynak kanıtının izin verdiği kadar büyütmek.

### Önkoşullar

- P5 (sade hap bilgi deneyimi), P6 (TTS güvenilirlik temeli) ve P11 (regresyon kapanışı) tamamlanmış.
- Başlangıç `git status` temiz.
- Faz planında başka bir `Sıradaki` faz yoktu; bu faz doğrudan kullanıcı talebiyle açılıp aynı görevde tamamlandı.

### İzin verilen iş

- `lib/device-lab/8k.ts` ve `lib/device-lab/contactless-lite.ts` içindeki mevcut kaynak destekli `draft_controlled` claim/modülleri (8K Customer Demo, 8K UVC Source Warning, Contactless LITE Intro, Contactless LITE Reflective Surfaces Demo) claim-control incelemesinden geçirip `learner_ready` yapmak.
- Yalnız `docs/sources/forenscope/TZOOM_PLUS_DNA_PRESENTATION_EXTRACTION.md` ve `docs/sources/forenscope/SUPERSPECTRAL_FORCE_AND_CORE_PRESENTATION_EXTRACTION.md` çıkarımlarına dayanan yeni `lib/device-lab/tzoom-plus-dna.ts` (Intro) ve `lib/device-lab/superspectral-force-core.ts` (Force/Core Comparison) dosyalarını eklemek.
- `lib/device-lab/devices.ts` ve `lib/device-lab/validation.ts`'i bu iki cihazın gerçek modül almasına izin verecek şekilde güncellemek (Device-6'nın "yalnız 8K ve Contactless LITE" kapısını genişletmek).
- `lib/device-lab/index.ts` re-export güncellemesi.
- `docs/DEVICE_LAB_EXPANDED_RELEASE_SUMMARY.md` özet belgesini eklemek.

### Yapılmayacaklar

- `docs/sources/forenscope/*` çıkarım dosyalarını veya `docs/DEVICE_SOURCE_INDEX.md`/`docs/DEVICE_LAB_ARCHITECTURE_PLAN.md`'yi düzenlemek.
- Contactless LAB ULTRA veya High-Tech catalog overview için öğrenci modülü eklemek (kaynak kanıtı hâlâ yetersiz/internal-only).
- t-ZOOM Plus DNA uygulama-demo (GSR/semen/blood/dead-skin) modülü eklemek (bare-"t-ZOOM" atıf çelişkisi ve tekil-örnek sınırı nedeniyle deferred).
- AFIS, DNA extraction/analysis, performans/sertifika iddiası, yeni güvenlik talimatı eklemek.
- Ana 90 günlük müfredatı, gün kimliklerini, Auth/Admin/cloud kodunu değiştirmek.

### Kabul ölçütleri

- 8K'nin ötesinde en az bir yeni cihaz öğrenci arayüzünde görünür ve kaynak destekli.
- Her yeni/yayımlanan claim'in tam `sourceReferences`'ı ve claim-control seviyesi var; forbidden-phrase taraması temiz.
- `assertDeviceLabDataValid` importta 0 hata ile geçiyor.
- Mevcut 8K akışı (üç modül) ve Contactless LITE akışı regresyonsuz çalışıyor.
- `npm run lint`, `npm run build`, `git diff --check` geçiyor.
- 320/375 px mobil görünüm, klavye/focus ve TTS auto-play olmaması manuel/agent tarayıcı kontrolünden geçti.

**Son doğrulama notu (6 Eylül 2026):** 8K Customer Demo, 8K UVC Source Warning, Contactless LITE Intro ve Contactless LITE Reflective Surfaces Demo `learner_ready` yapıldı (Contactless LITE artık ikinci yayımlanmış cihaz). t-ZOOM Plus DNA Intro ve SuperSpectral Force/Core Comparison yeni `learner_ready` modülleri eklendi (üçüncü ve dördüncü cihaz). Contactless LAB ULTRA ve High-Tech catalog `deferred`/`blocked` kaldı, öğrenci modülü yok. `assertDeviceLabDataValid` 0 hatayla geçti; `npx tsc --noEmit`, `npm run lint`, `npm run build` geçti; `next start` üzerinde 320/375 px agent tarayıcı QA'sı tüm yeni/mevcut route'larda overflow'suz, TTS auto-play'siz ve blocked-claim bölümleri varsayılan kapalı olarak geçti. Ayrıntı: `docs/DEVICE_LAB_EXPANDED_RELEASE_SUMMARY.md`. Sonraki faz yok; tabloda `Sıradaki` bırakılmadı.

---

## 3. Genel “yapılmayacaklar”

- Bir görevde iki faz çalıştırmak.
- Veri yedeği olmadan Auth/cloud kodunu silmek.
- Büyük tek seferlik yeniden tasarım.
- Otomatik oynatma veya sayfa açılışında mikrofon izni.
- Ses kaydını localStorage/buluta yazmak.
- AI değerlendirme, telaffuz skoru, transkripsiyon veya admin tracking.
- Kaynaksız Device Lab fact/model answer üretmek.
- 90 günlük gün kimliklerini veya yerel progress key'lerini plansız değiştirmek.
- Sourcebook/extraction/sources dosyalarını düzenlemek.
- Otomatik commit/push veya `npm audit fix --force`.

## 4. Faz raporu şablonu

Her uygulama görevinin final raporu şu sırada olmalıdır:

1. Tamamlanan faz ve sonuç.
2. Değişen dosyalar.
3. Kabul ölçütü kanıtları.
4. Çalıştırılan doğrulamalar ve sonuçları.
5. Bilinen risk/ertelenen iş.
6. Faz planında yapılan yalnız durum değişikliği.
7. “Sonraki faz çalıştırılmadı; commit/push yapılmadı.”
