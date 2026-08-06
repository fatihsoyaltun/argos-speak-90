# Argos Speak 90 P6 TTS Güvenilirlik Özeti

**Tarih:** 6 Ağustos 2026

**Faz:** P6 — TTS güvenilirlik temeli

**Sonuç:** P6 tamamlandı. Ele geçirilmiş ElevenLabs anahtarı iptal/rotate edildi;
yeni anahtar yalnız ignored `.env.local` içinde tutuluyor. Gerçek binary ve timed
isteklerde doğru MIME, sıfırdan büyük ses baytı, geçerli kelime alignment verisi
ve güvenli response sınırı doğrulandı. Settings, Listen ve Words için gerçek
playback, cache, overlap, highlight, mobil reflow ve klavye/focus matrisi manuel
tarayıcı QA ile geçti. P7 yalnız `Sıradaki` olarak işaretlendi ve başlatılmadı.

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
- `npm run build` — geçti; TypeScript ve 18 sayfa üretimi tamamlandı.
- `npm run test:p2` — 3/3 yerel backup/import regresyon testi geçti.
- `npm run test:p6` — 4/4 cache TTL/LRU/entry-byte sınırı, request/character
  bütçesi ve base64 yük testi geçti.
- `/api/tts` yapılandırılmamış durum smoke testi — GET `200` +
  `missing_api_key`, POST `503` güvenli hata, yanlış content type `415`.
- İstemci bundle/scope taraması — TTS anahtarı veya provider header'ı yok.
- Kapsam taraması — MediaRecorder, getUserMedia, autoplay, transcription,
  scoring veya AI evaluation eklenmedi.
- `npm run test:p6:live` — geçti. Binary yanıt `audio/mpeg` ve 30.973 bayt;
  timed yanıt `application/json`, 30.973 ses baytı, 41.739 transport baytı,
  `%34,8` base64/JSON overhead ve dört geçerli kelime timing kaydı verdi.
- Güçlendirilmiş canlı test, alignment dizisinin boş olmamasını; her timing için
  dolu metin, sonlu ve sıralı başlangıç/bitiş değerlerini; yanıt header/body içinde
  API key veya authorization işaretlerinin bulunmamasını doğruladı.
- Kullanıcının yerel manuel tarayıcı QA sonucu: Settings audio health;
  play/pause/resume/replay; cache reuse/reset; ses değişiminde overlap engeli;
  Listen highlighting/alignment; Words word ve example audio; klavye focus;
  320×812 ve 375×812 layout kontrollerinin tamamı geçti.

## 6. Tamamlanma kapıları

- Ele geçirilmiş anahtar iptal/rotate edildi; yeni anahtar yalnız ignored
  `.env.local` içinde tutuluyor.
- Binary/timed canlı provider testi doğru MIME, ses baytı, alignment ve güvenli
  response kontrolleriyle geçti.
- Settings, Listen ve Words gerçek playback/cache/overlap/highlight matrisi geçti.
- Klavye focus ile 320×812 ve 375×812 mobil layout kontrolleri geçti.
- P6 için açık kabul kapısı kalmadı.

## 7. Bilerek değiştirilmemiş alanlar

- Speak, Review, Journal ve Device Lab'e TTS kapsamı eklenmedi; P7 beklenir.
- Device Lab içeriği, claim-control, sources ve yerel completion değiştirilmedi.
- Ses kaydı, mikrofon izni, MediaRecorder, upload, transcription, AI değerlendirme
  veya pronunciation scoring eklenmedi.
- 90 günlük içerik, gün kimlikleri, Words sayısı ve yerel storage anahtarları
  değiştirilmedi.
- Paket sürümleri yükseltilmedi; bağımlılık eklenmedi.

## 8. Faz durumu

P6 bütün kabul ölçütleri geçtiği için `Tamamlandı` olarak işaretlendi. Tam olarak
P7 `Sıradaki` yapıldı; P7 bu görevde başlatılmadı.
Commit veya push yapılmamıştır.

## 9. Gizli bilgi olayı ve yerel ortam güvenliği

- `README.md` içinde yanlışlıkla gerçek bir ElevenLabs API anahtarı yayımlandığı
  tespit edildi. Anahtar ele geçirilmiş kabul edildi; ElevenLabs tarafında iptal
  edilip yenisiyle değiştirildi.
- İzlenen kaynak, belge, test ve örnek dosyaları gerçek ElevenLabs anahtar
  değerlerinden arındırıldı; belgelerde yalnız yer tutucu değerler bırakıldı.
- Bu oturumun başlangıcında `.env.example` içinde gerçek görünümlü API key ve
  yer tutucu olmayan voice değeri bulundu. Değerler yazdırılmadan dosya yeniden
  yalnız yer tutucularla düzenlendi; son izlenen dosya taraması temizdir.
- `.env.example` artık yalnız yer tutucu değerler içerir. ElevenLabs API anahtarı
  yalnız sunucu ortamından okunmaya devam eder.
- `.env.local` bilerek Git dışında tutulur ve `.gitignore` tarafından yok
  sayılır. Bu kontrolde dosyanın içeriği okunmamış veya yazdırılmamıştır.
- Ele geçirilmiş anahtarın iptal/rotate edildiği ve yeni anahtarın yalnız ignored
  `.env.local` içinde tutulduğu kullanıcı tarafından doğrulandı. Yeni anahtarla
  canlı provider testi geçti; P6 güvenlik kapısı kapandı.
