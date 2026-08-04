# Argos Speak 90 Araştırma ve Mevcut Durum Raporu

**Tarih:** 4 Ağustos 2026

**Kapsam:** Planlama ve yönetişim; uygulama değişikliği yoktur.

**İncelenen depo:** `argos-speak-90`

## 1. Yönetici özeti

Argos Speak 90'ın 90 günlük çekirdeği çalışır durumdadır; ancak ürün iki farklı yöne ayrılmıştır: günlük kişisel çalışma uygulaması ve Auth/Admin/cloud özellikli çok kullanıcılı pilot. Tek kullanıcı hedefinde ikinci yön gereksiz bilişsel ve teknik yük oluşturmaktadır. Device Lab de öğrenciye kısa cihaz tanıtımı vermek yerine kaynak yönetişimi, claim-control, admin coaching ve dört ayrı yazı alanını aynı sayfada gösterdiği için bir öğrenme kartından çok denetim belgesi gibi görünmektedir.

Öncelikli kararlar:

1. Auth/Admin/cloud bir güvenli veri geçişinden sonra fazlı biçimde kaldırılmalı; `/stats` basit yerel İlerleme ekranı olarak korunmalıdır.
2. Görünmeyen Device Lab CTA'sı gerçek bir kontrast hatasıdır: hesaplanmış yazı ve arka plan rengi aynıdır. Önce merkezi buton/link varyantı kurulmalıdır.
3. Device Lab, kaynak kontrolünü kaybetmeden öğrencide “tek cümle + üç hap bilgi + kelimeler + dinle + kısa konuş” modeline indirgenmelidir.
4. Mevcut TTS tabanı önce güvenilir hale getirilmeli, sonra bütün ilgili İngilizce öğrenme nesnelerine yayılmalıdır.
5. Tarayıcı içi kayıt uygulanabilir; ilk sürüm oturum içi, yerel, silinebilir ve puansız olmalıdır.
6. Words 8'den 10'a çıkarılabilir; 90 gün korunmalı, yoğunluk için 5 aktif + 5 destek/review sunumu tercih edilmelidir.
7. Tüm uygulama “sakin, ses-öncelikli çalışma koçu” bilgi mimarisiyle, tek büyük değişiklik yerine route grupları halinde yenilenmelidir.

## 2. Yöntem ve kanıt sınırı

Şunlar incelendi:

- depo ağacı, paketler, route'lar, bileşenler, içerik runtime'ı ve belgeler,
- `AGENTS.md` ve önceki strateji/yoğunluk/Device Lab faz özetleri,
- Auth, Admin, Supabase, cloud sync, yerel ilerleme ve export/import akışları,
- TTS API'si, istemci ses cache'i ve mevcut TTS kapsamı,
- Device Lab statik veri, claim-control, detail/module ve local practice akışı,
- 375×812 mobil viewport'ta çalışan uygulamanın route ve hesaplanmış stil taraması,
- güncel birincil/resmî OpenAI, Next.js, W3C, Apple, MDN ve ElevenLabs belgeleri.

Referans sohbette iki ekran görüntüsü olduğu belirtilse de ham görsel dosyaları bu görev bağlamına aktarılmadı. Bu nedenle görüntülerin pikselleri hakkında doğrulanmamış yorum yapılmadı. Aynı Device Lab ekranı yerel build ile yeniden üretildi; görünmeyen buton ve sayfa yoğunluğu tarayıcı DOM'u, hesaplanmış CSS ve ölçülerle doğrulandı.

## 3. Depo ve mimari haritası

### 3.1 Teknoloji

- Next.js 16.2.4, React 19.2.4, Tailwind CSS 4.
- Supabase browser/server client ve SSR oturum katmanı.
- ElevenLabs tabanlı sunucu TTS endpoint'i.
- Ana pratik ve Device Lab için iki ayrı `localStorage` modeli.

### 3.2 Route yüzeyi

Öğrenci: `/`, `/today`, `/listen`, `/words`, `/speak`, `/review`, `/journal`, `/stats`, `/settings`, `/pilot`.

Hesap/yönetim: `/login`, `/account`, `/admin`, `/admin/users/[userId]`.

Ses: `/api/tts`.

Device Lab: `/device-lab`, altı cihaz detail route'u ve mevcut beş modül route'u.

### 3.3 Ana bileşen kümeleri

- Uygulama kabuğu ve bottom navigation.
- Listen, Words, Speak, Review ve Journal pratikleri.
- Active day, local progress, JSON export/import.
- Session/Auth, cloud sync paneli, Supabase progress ve Admin server araçları.
- Device Lab kartları, modül detail'i ve local practice paneli.

## 4. Bulgular

### 4.1 Auth/Admin/cloud ile tek kullanıcı hedefi çatışıyor

Mevcut uygulama hem yerel hem cloud ilerleme taşıyor. `/settings` içinde hesap, sync ve veri yönetimi; ayrıca login/account/admin route'ları var. Buna karşın `/stats` zaten şu tek kullanıcı özetini sağlıyor: geçerli gün, dört ana görevden tamamlanan sayısı ve yerel çalışma modu. Bu ekran sade ilerleme hedefinin en iyi başlangıç noktasıdır.

Auth/Admin/cloud kodunu doğrudan silmek güvenli değildir. Kullanıcının yalnız cloud'da kalmış son ilerlemesi olabilir; ayrıca session, settings, pilot, admin, Supabase environment ve paket bağımlılıkları birbirine bağlıdır. Güvenli sıra:

1. yerel export/import ve mevcut cloud verisini son kez yerelleştirme kapısını doğrula,
2. tek kullanıcı yerel ilerlemeyi kanonik kaynak yap,
3. kullanıcı arayüzü ve navigation tüketicilerini kaldır,
4. route/server katmanını kaldır,
5. artık import kalmadığını doğruladıktan sonra Supabase bağımlılık/env/belgelerini temizle.

### 4.2 Buton görünürlüğü: doğrulanmış CSS cascade hatası

`/device-lab` üzerindeki altı “Cihaz detayını aç” linkinde DOM metni mevcuttur; fakat hesaplanmış stillerde:

- arka plan: `rgb(23, 32, 26)`,
- metin: `rgb(23, 32, 26)`,
- kontrast: `1:1`,
- hedef: yaklaşık `294×44` CSS px.

Kök neden `app/globals.css` içindeki katmansız `a { color: inherit; }` kuralının Tailwind'in `@layer utilities` içindeki `.text-white` kuralını cascade layer sırası nedeniyle geçersiz kılmasıdır. Bazı başka linklerdeki `!text-white` kullanımı yalnız yerel bir kaçıştır; tasarım sistemi çözümü değildir.

375×812 ilk durum taramasında düşük kontrastlı görünen kontroller yalnız bu altı Device Lab CTA'sıdır. Bununla birlikte dört hedef 44 px tercihinin altındadır: Listen “Dinle” 60×40, Words shortcut 328×40, Settings login linki 169×40 ve Device detail geri linki 135×40. Bunlar WCAG 2.2 AA 24×24 alt sınırını geçse de mobil kullanım için 44×44 hedefi daha güvenlidir. Tarama dinamik hover/focus/active/visited ve bütün sonradan açılan durumları kapsamaz; tam durum matrisi ayrı uygulama fazında zorunludur.

### 4.3 Device Lab öğrenci akışı aşırı yoğun

Örnek `/device-lab/8k/8k-intro` modülü 375×812'de yaklaşık:

- `7.738 px` sayfa yüksekliği, yaklaşık 9,5 ekran,
- 12 section, 14 article, 4 textarea,
- modül goal, claims, vocabulary, listen, speak, review, journal, admin coaching, claim control, blocked claims, sources ve local practice alanları.

Sorun yalnız görsel stil değil, bilgi mimarisidir. Öğrencinin kısa cihaz İngilizcesi hedefiyle kaynak yönetişimi aynı ağırlıkta sunulmuştur. Device landing de ertelenmiş/blocked kayıtları, source strength ve release statülerini öğrenci kartı gibi gösteriyor.

Önerilen öğrenci sözleşmesi: bir cümle İngilizce tanıtım, en çok üç kaynak destekli hap bilgi, kısa kelime grubu, dinle, tek kısa konuşma/okuma görevi, kayıt/geri dinleme ve tamamla. Sources/blocked claims korunmalı fakat kapalı “Kaynak notları” ya da geliştirici QA yüzeyine taşınmalıdır. Hazır olmayan cihazlar öğrenci kataloğunda yayımlanmamalıdır.

### 4.4 Mevcut TTS doğru başlangıç, eksik ürün yüzeyi

`/api/tts` sunucu tarafında ElevenLabs anahtarı, voice ve model kullanıyor; istemci POST ile base64 MP3 alıyor. Listen ve Words içinde ses var. Speak, Review, Journal ve Device Lab'de genel ses kapsamı yok. Device Lab mevcut fazında TTS özellikle dışarıda bırakılmış.

İstemci cache'i bellek içi Map/object URL kullanıyor ve eş zamanlı aynı istekleri birleştiriyor; fakat açık TTL/LRU/kota/persistent cache yok. Base64 JSON, ikili sese göre yaklaşık üçte bir taşıma ek yükü doğurur. Resmî ElevenLabs streaming endpoint'i doğrudan ses akışı sunar; ancak kelime zamanlamalı mevcut transcript davranışı korunacaksa bütün çağrıları körlemesine streaming'e geçirmek doğru değildir. Zamanlama gereken ve gerekmeyen içerik ayrılmalı, ölçülerek karar verilmelidir.

Güvenilirlik gereksinimleri:

- kullanıcı eylemi olmadan autoplay yok,
- `play()` Promise sonucu ve `NotAllowedError` ele alınır,
- idle/loading/playing/paused/error/retry durumları görünürdür,
- binary/streaming route, timeout, abort, hata kodları ve maliyet/rate sınırı değerlendirilir,
- cache sınırlı ve temizlenebilir olur,
- Settings'te basit audio health kontrolü bulunur,
- build yanında gerçek ses baytı, süre ve playback doğrulanır.

“Her şeyi sesli duyma”, İngilizce öğrenme içeriğinin tamamı olarak yorumlanmalıdır; navigasyon ve Türkçe ayar metinlerinin otomatik seslendirilmesi değil.

### 4.5 MediaRecorder ile ses kaydı uygulanabilir

`MediaRecorder` modern tarayıcılarda yaygın biçimde vardır; fakat codec/container desteği değişir. `getUserMedia()` güvenli bağlam (HTTPS veya localhost) ve açık kullanıcı izni ister; kullanıcı izin penceresini yanıtsız bırakırsa Promise uzun süre bekleyebilir.

MVP modeli:

- özellik kontrolü: `navigator.mediaDevices`, `MediaRecorder`, `MediaRecorder.isTypeSupported`,
- MIME sırası: destekleniyorsa `audio/webm;codecs=opus`, Safari için `audio/mp4`, sonra tarayıcı varsayılanı,
- kayıt, durdur, geri dinle, yeniden kaydet, sil ve isteğe bağlı indir,
- 60–120 saniye sınırı,
- ilk sürümde yalnız session memory Blob/object URL,
- unmount/stop anında tüm media track'lerini durdurma ve URL revoke,
- bulut upload, admin erişimi, AI skor, transkripsiyon ve telaffuz puanı yok,
- destek yoksa metin tabanlı görev çalışmaya devam eder.

### 4.6 Words 8 → 10 runtime etkisi

Mevcut runtime `TARGET_DAILY_WORD_COUNT = 8` kullanıyor ve `expandDailyWords()` tema/stage booster havuzlarından tamamlıyor. Mevcut doğrulama belgesi 90 günün her birinde tam 8 öğe olduğunu kabul ediyor. Bu yüzden değişiklik sadece sayaç değildir.

Kabul kapısı:

- 90 gün × 10 = 900 runtime öğesi,
- her gün tam 10, gün içinde benzersiz ve alanları dolu,
- booster döngüsünde sonsuzluk/tekrarlı doldurma yok,
- sayaç, UI metni, doğrulayıcı ve belgeler tutarlı,
- gün ID'leri ve eski ilerleme kayıtları korunmuş,
- yoğunluk artmaması için 5 aktif + 5 destek/review, ilerlemeli 5+5 görünüm.

### 4.7 Genel tasarım sorunu

Önceki yoğunluk denetimi doğru şekilde Settings ve Words'ün ağır, Speak/Review'un uzun dikey akışlar olduğunu kaydetmiş. Bugünkü ek bulgu, sorunların sayfa bazlı makyajdan öte bir navigation ve öncelik sorunu olduğudur.

Önerilen ürün metaforu: **sakin, ses-öncelikli çalışma koçu**.

- Bugün: gün /90, tek sonraki görev, kısa ilerleme.
- Pratik: Listen/Words/Speak/Review/Journal'a kompakt erişim.
- Device Lab: yayımlanmış kısa ürün kartları.
- İlerleme: yerel, basit, anlaşılır.
- Ayarlar: aktif gün, yerel yedek, ses sağlık durumu ve mikrofon gizliliği.

Alt navigasyonda en fazla beş sabit hedef bulunmalıdır. Tam yeniden tasarım, ortak token/bileşen temelinden sonra route gruplarıyla uygulanmalıdır.

## 5. Güncel birincil kaynaklardan tasarım ilkeleri

### Codex yönetişimi

OpenAI, Codex'in çalışmaya başlamadan önce `AGENTS.md` talimatlarını keşfettiğini; kökten çalışma dizinine doğru daha yakın talimatların öncelik kazandığını açıklar. Büyük görev prompt'larında Goal, Context, Output ve Boundaries'in açık yazılması önerilir. Bu nedenle depo talimatı kanonik faz planına bağlanmalı ve bootstrap prompt tek faz/tek çıktı sınırını zorlamalıdır. Kaynaklar: [OpenAI — AGENTS.md](https://developers.openai.com/codex/guides/agents-md), [OpenAI — Prompting](https://learn.chatgpt.com/docs/prompting).

### Next.js ve erişilebilirlik

Next.js route announcer önce `document.title`, sonra `h1`, sonra pathname kullanır; bu nedenle yeniden tasarımda benzersiz sayfa başlıkları ve tek açık `h1` gerekir. Next.js ayrıca `eslint-plugin-jsx-a11y`, kontrast ve `prefers-reduced-motion` kontrollerini vurgular. Kaynak: [Next.js — Accessibility](https://nextjs.org/docs/architecture/accessibility).

WCAG 2.2 normal metinde 4.5:1, büyük metinde 3:1 kontrast; AA hedef boyutunda 24×24 CSS px alt sınırı ve 320 CSS px reflow ister. Mobil ürün kalitesi için Apple'ın genel 44×44 pt düğme önerisi tercih edilen proje eşiği olarak benimsenmiştir. Kaynaklar: [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C — Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [W3C — Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Apple — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons).

### Ses ve tarayıcı kaydı

`HTMLMediaElement.play()` otomatik oynatma politikası nedeniyle reddedilebilir; UI yalnız Promise başarıyla çözüldükten sonra “çalıyor” durumuna geçmelidir. MediaRecorder destekli olsa da MIME farkları özellik kontrolü gerektirir. Mikrofon yalnız güvenli bağlamda ve izinle açılır. Kaynaklar: [MDN — HTMLMediaElement.play()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play), [MDN — MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), [W3C — MediaStream Recording](https://www.w3.org/TR/mediastream-recording/), [MDN — getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

ElevenLabs'in resmî API'si doğrudan ses stream'i döndüren endpoint sunar. Bu, uzun ve zamanlama gerektirmeyen içerikte base64 JSON'a alternatif olarak ölçülmelidir. Kaynak: [ElevenLabs — Stream speech](https://elevenlabs.io/docs/api-reference/text-to-speech/stream).

## 6. Risk kaydı

| Risk | Etki | Önlem / kapı |
|---|---|---|
| Yalnız cloud'da kalan ilerlemenin silinmesi | Yüksek | Auth kaldırmadan önce export/son çekme ve geri yükleme testi |
| Yerel storage anahtarının değişmesi | Yüksek | Anahtar/şema uyumluluk testi ve migration olmadan rename yasağı |
| Büyük yeniden tasarımda fonksiyon kaybı | Yüksek | Token → shell → route grupları sırası; her faz build + browser QA |
| TTS kota, gecikme veya sağlayıcı kesintisi | Orta/Yüksek | Durum makinesi, retry, limitli cache, sağlık kontrolü, maliyet sınırı |
| Autoplay engeli | Orta | Açık kullanıcı eylemi ve `play()` Promise hata yönetimi |
| Safari/iOS kayıt format farkı | Orta | `isTypeSupported`, MIME fallback ve cihaz matrisi |
| Mikrofon gizliliği | Yüksek | Yerel/session-only, görünür izin, açık silme, track cleanup |
| Device Lab'de uydurma teknik iddia | Yüksek | Source ownership ve blocked-claim kapısını koruma |
| 10 kelimeyle aşırı yoğunluk | Orta | 5+5 rol ayrımı ve ilerlemeli gösterim |
| CSS cascade ile yeniden görünmez kontrol | Yüksek | Global anchor color düzeltmesi, merkezi varyant ve computed-style testi |

## 7. Bağımlılık ve göç sırası

1. Kontrast acil düzeltmesi ve erişilebilir kontrol temeli.
2. Yerel veri yedeği/cloud çıkış kapısı.
3. Auth/Admin/cloud emekliliği.
4. Design token, shell ve navigation temeli.
5. Device Lab sade içerik sözleşmesi.
6. TTS güvenilirlik temeli ve ardından kapsam genişletmesi.
7. Ses kayıt MVP'si.
8. Words 10 runtime ve kompakt sunum.
9. Kalan route gruplarının yeni tasarıma taşınması.
10. Uçtan uca erişilebilirlik, mobil, ses ve veri regresyon kapısı.

Bu sıra kullanıcının talep başlıklarını korur; yalnız veri kaybı ve ortak altyapı bağımlılıkları nedeniyle güvenli biçimde düzenlenmiştir.

## 8. Bu planlama fazında yapılmayanlar

- Uygulama kodu, route, component veya içerik değiştirilmedi.
- Auth/Admin/Supabase/TTS/storage davranışı değiştirilmedi.
- Paket veya veritabanı şeması değiştirilmedi.
- Yeni cihaz gerçeği/modülü üretilmedi.
- Ses kaydı, AI değerlendirme veya 10 kelime runtime'ı uygulanmadı.
- Commit veya push yapılmadı.

Uygulama için kanonik sıra ve kabul ölçütleri `docs/ARGOS_SPEAK_90_PHASE_PLAN.md` içindedir.
