# Argos Speak 90 P6 TTS Güvenilirlik Özeti

**Tarih:** 6 Ağustos 2026

**Faz:** P6 — TTS güvenilirlik temeli

**Sonuç:** P6 uygulama kapsamı hazırlandı; ancak faz tamamlanma kapısı açık
değildir. Gerçek ElevenLabs isteği ve gerçek mobil/desktop tarayıcı playback QA
zorunludur. Güvenlik devamında mevcut `.env.local` içeriği bilerek okunmadı;
yenilenmiş anahtarın kurulduğu doğrulanmadı ve canlı test çalıştırılmadı.
Bağlanılabilir Browser/Chrome örneği de yoktur. Bu nedenle P6 `Sıradaki`, P7
`Bekliyor` bırakıldı.

## 1. Uygulanan güvenilirlik temeli

- Ortak `AudioAction` ve `useAudioController`, `idle`, `loading`, `playing`,
  `paused`, `error` durumlarını Listen, Words ve Settings sağlık testinde aynı
  sözleşmeyle yönetir.
- `HTMLMediaElement.play()` sonucu beklenir; state yalnız Promise çözüldükten
  sonra `playing` olur. `NotAllowedError`, playback hatası, metadata timeout,
  çevrimdışı durum, TTS timeout, iptal ve retry ayrı kullanıcı mesajları taşır.
- Ses metadata'sı yüklenmeden playback başlamaz; MIME `audio/mpeg`, sıfırdan
  büyük ve sonlu duration doğrulanır. Stop/day change/unmount akışı aktif isteği
  iptal eder ve medya elementinin `src` bağlantısını bırakır.
- Listen kelime zamanlaması ve transcript highlight için
  `includeAlignment: true` kullanmaya devam eder. Bu yol ölçülebilir
  `base64-json` yanıtı ve alignment verisini korur.
- Words ve Settings sağlık testi alignment istemez; doğrudan binary MP3 yanıtı
  kullanır. Böylece gereksiz base64/JSON taşıma yükü bu içeriklerde kaldırılır.
- Sayfa açılışındaki Listen TTS preload'u kaldırıldı. TTS üretimi ve playback
  açık kullanıcı eylemiyle başlar; otomatik oynatma yoktur.

## 2. Cache, istek birleştirme ve temizlik

- Aynı cache key için eşzamanlı istekler tek upstream isteğinde birleşir.
  Tüketici iptalleri ayrı izlenir; son tüketici ayrıldığında upstream istek de
  iptal edilir.
- Bellek içi cache sınırları: en çok 16 kayıt, 12 MiB ve 10 dakika TTL.
  Süresi geçen ve LRU kayıtlar tahliye edilirken object URL revoke edilir.
- Cache key; gün, scope, alignment modu, voice, model ve normalize metin hash'ini
  kapsar. Zamanlamalı ve plain sesler yanlışlıkla aynı kayıt sayılmaz.
- Settings'teki “Ses cache’ini temizle” eylemi oynatmayı durdurur, bütün object
  URL'leri revoke eder, in-flight istekleri iptal eder ve sonucu görünür yazar.

## 3. Sunucu güvenliği ve maliyet kapısı

- `/api/tts` yalnız JSON request kabul eder; 8 KiB request ve 2.000 karakter
  metin sınırı, boş/geçersiz kontrol karakteri doğrulaması uygular.
- Süreç içi guard istemci başına beş dakikada en çok 20 istek ve 8.000 karakter
  bütçesi uygular; aşımda `429`, yapılandırılmış `rate_limited` ve `Retry-After`
  döner. Bu, çok instance dağıtımında best-effort korumadır.
- ElevenLabs çağrıları 15 saniyede timeout olur. İstemci uçtan uca isteği 20
  saniyede iptal eder ve anlaşılır retry mesajı gösterir.
- İstemci hata yanıtına upstream body, endpoint, metin veya config detayı
  gönderilmez. Sunucu logu yalnız hata kodu, upstream status ve varsa request ID
  taşır; API anahtarı, istek metni veya upstream body loglanmaz.
- İstemci kaynakları ve production static bundle taramasında
  `ELEVENLABS_API_KEY` veya `xi-api-key` referansı yoktur.

## 4. Settings ses sağlık testi

- Ayarlar mevcut config durumuna ek olarak kullanıcı tarafından başlatılan
  gerçek “Sesi test et”, durum yenileme ve cache reset eylemleri sunar.
- Başarılı health testi MIME, duration, ses byte sayısı ve binary/JSON taşıma
  türünü görünür sonuç olarak yazar.
- Yapılandırma eksikliği, timeout, offline, playback engeli ve provider hatası
  görünür olur; aynı eylem retry sağlar.

## 5. Otomatik doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; ilk sandbox denemeleri Google Fonts ağ erişiminde
  durdu, ağ izinli tekrar derleme, TypeScript ve 18 statik sayfayı tamamladı.
- `npm run test:p2` — 3/3 yerel backup/import regresyon testi geçti.
- `npm run test:p6` — 4/4 cache TTL/LRU/entry-byte sınırı, request/character
  bütçesi ve base64 yük testi geçti.
- `/api/tts` yapılandırılmamış durum smoke testi — GET `200` +
  `missing_api_key`, POST `503` güvenli hata, yanlış content type `415`.
- İstemci bundle/scope taraması — TTS anahtarı veya provider header'ı yok.
- Kapsam taraması — MediaRecorder, getUserMedia, autoplay, transcription,
  scoring veya AI evaluation eklenmedi.
- Önceki `npm run test:p6:live` denemesi `missing_api_key` ile tamamlanamamıştı.
  README sızıntısı tespit edildikten sonra bu test bilerek yeniden
  çalıştırılmadı; önce anahtar rotasyonu ve yeni `.env.local` kurulumu gerekir.
- In-app Browser keşfi — kullanılabilir browser listesi boş; mobil reflow,
  computed state, klavye/focus ve gerçek playback matrisi çalıştırılamadı.

## 6. Tamamlanma için açık kapılar

P6 ancak aşağıdakiler aynı çalışma durumunda kanıtlandıktan sonra
`Tamamlandı` yapılabilir:

1. Ele geçirilmiş anahtar ElevenLabs tarafında iptal edilmeli; yeni API key ve
   voice ID yalnız yerel `.env.local` içinde sunucu değişkenleri olarak tanımlanarak
   `npm run test:p6:live` çalıştırılmalı; binary ve timed response doğru MIME,
   sıfırdan büyük byte, alignment korunumu ve gerçek transport ölçümü vermeli.
2. Settings health kontrolü gerçek kullanıcı tıklamasıyla sıfırdan büyük sonlu
   duration ve oynatma üretmeli; pause/resume/retry gözlenmeli.
3. Listen transcript highlight ve Words word/example playback regresyonu gerçek
   desktop ile en az 375×812 ve 320 CSS px mobil tarayıcıda doğrulanmalı.
4. Default, hover, focus-visible, active, disabled ve loading hesaplanmış stilleri,
   44×44 hedefler, yatay reflow, klavye sırası ve hata/retry görünürlüğü
   raporlanmalı.

## 7. Bilerek değiştirilmemiş alanlar

- Speak, Review, Journal ve Device Lab'e TTS kapsamı eklenmedi; P7 beklenir.
- Device Lab içeriği, claim-control, sources ve yerel completion değiştirilmedi.
- Ses kaydı, mikrofon izni, MediaRecorder, upload, transcription, AI değerlendirme
  veya pronunciation scoring eklenmedi.
- 90 günlük içerik, gün kimlikleri, Words sayısı ve yerel storage anahtarları
  değiştirilmedi.
- Paket sürümleri yükseltilmedi; bağımlılık eklenmedi.

## 8. Faz durumu

P6 kabul ölçütlerinin gerçek provider ve browser bölümü eksik olduğu için
`Sıradaki` kalır. P7 `Bekliyor` olarak kalır ve bu görevde başlatılmamıştır.
Commit veya push yapılmamıştır.

## 9. Gizli bilgi olayı ve yerel ortam güvenliği

- `README.md` içinde yanlışlıkla gerçek bir ElevenLabs API anahtarı yayımlandığı
  tespit edildi. Anahtar ele geçirilmiş kabul edilmiştir ve kullanılmadan önce
  ElevenLabs tarafında iptal edilip yenisiyle değiştirilmelidir.
- İzlenen kaynak, belge, test ve örnek dosyaları gerçek ElevenLabs anahtar
  değerlerinden arındırıldı; belgelerde yalnız yer tutucu değerler bırakıldı.
- `.env.example` yalnız yer tutucu değerler içerir. ElevenLabs API anahtarı
  yalnız sunucu ortamından okunmaya devam eder.
- `.env.local` bilerek Git dışında tutulur ve `.gitignore` tarafından yok
  sayılır. Bu kontrolde dosyanın içeriği okunmamış veya yazdırılmamıştır.
- Yeni anahtar yerel olarak kurulup canlı provider ve gerçek tarayıcı testleri
  geçene kadar P6 `Sıradaki`, P7 `Bekliyor` kalır.
