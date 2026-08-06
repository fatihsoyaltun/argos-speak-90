# Argos Speak 90 P8 Tarayıcı Ses Kayıt Özeti

**Tarih:** 6 Ağustos 2026

**Faz:** P8 — Tarayıcı ses kayıt MVP'si

**Sonuç:** P8 tamamlandı. Kullanıcının sesini yalnız açık eylemden sonra alan,
oturum belleğinde tutan, geri dinleten ve güvenli biçimde temizleyen ortak
`VoiceRecorder` progressive enhancement bileşeni Speak ile yayımlanmış Device
Lab reading/say-it görevlerine eklendi. Upload, kalıcı Blob saklama,
transkripsiyon, AI değerlendirme ve telaffuz puanı eklenmedi.

## 1. Değişen dosyalar

- `components/voice-recorder.tsx`
  - Ortak kayıt, durdurma, playback, yeniden kayıt ve silme akışını sunar.
  - Mikrofonu yalnız “Kaydı başlat” eyleminden sonra ister.
  - NotAllowed, NotFound, NotReadable, pending timeout, unsupported ve genel
    kayıt hatalarını güvenli Türkçe geri bildirimle ele alır.
  - Tek aktif recorder, 90 saniye sınırı, track ve object URL cleanup uygular.
- `app/globals.css`
  - Yalnız yeni recorder kontrollerine semantic focus rengiyle açık 3 px
    `focus-visible` outline tanımlar.
- `lib/voice-recording.ts`
  - WebM/Opus → MP4 → browser-default MIME seçimini, 15 saniye izin timeout'unu,
    90 saniye sınırını ve güvenli hata eşlemesini tanımlar.
- `components/speaking-practice.tsx`
  - First try ve Second try için birbirinden bağımsız, session-only kayıt
    kontrolleri ekler; var olan metin autosave/completion anlamını değiştirmez.
- `app/device-lab/[deviceSlug]/[moduleId]/page.tsx`
  - Yalnız learner-ready 8K Intro modülündeki reading ve say-it görevlerine
    recorder ekler; claim/source/içerik seçimlerini değiştirmez.
- `tests/p8-voice-recording.test.mjs`
  - MIME, süre/timeout, hata dili, session-only sınır ve planlı entegrasyonları
    doğrular.
- `tests/p8-browser-qa.mjs`
  - Production Chrome'da kayıt yaşam döngüsü, privacy, cleanup, fallback,
    mobil reflow, target ve klavye focus matrisini çalıştırır.
- `package.json`
  - `test:p8` ve `test:p8:browser` komutlarını ekler.
- `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`
  - P8'i tamamlar ve yalnız P9'u sıradaki faz yapar.
- `docs/ARGOS_SPEAK_90_P8_VOICE_RECORDING_SUMMARY.md`
  - Bu kapsam, kanıt ve risk kaydını oluşturur.

## 2. Kayıt ve gizlilik sözleşmesi

- Sayfa açılışında `getUserMedia()` çağrılmaz. Chrome instrumentation sayacı
  ilk render'da `0`, kullanıcı kayıt düğmesine bastıktan sonra `1` oldu.
- Kayıtlar yalnız React state/ref, Blob ve object URL olarak sekme belleğinde
  tutulur. `localStorage`, `sessionStorage`, IndexedDB, API çağrısı veya upload
  yoktur. Refresh sonrasında recorder boş `idle` durumuna döner.
- Bileşen görünür biçimde kaydın yenilemede silindiğini; kalıcı saklanmadığını,
  buluta yüklenmediğini, yazıya dökülmediğini ve puanlanmadığını açıklar.
- Kayıt bittiğinde, bileşen kapandığında veya başka bir recorder başladığında
  bütün mikrofon track'leri durdurulur. Silme, yeniden kayıt ve unmount object
  URL'leri revoke eder.
- Kayıt süresi `60..120` aralığına clamp edilir; ürün varsayılanı 90 saniyedir.
- Kullanıcı izin penceresini yanıtsız bırakırsa 15 saniyede anlaşılır timeout ve
  görünür retry sunulur. Geç çözülen bir stream hemen kapatılır.
- Aynı sekmede yeni recorder başlatılırsa önceki aktif kayıt durdurulur.

## 3. Entegrasyon sınırı

| Route/görev | Eklenen kayıt | Korunan davranış |
|---|---|---|
| `/speak` First try | Session-only recorder | `speakFirstTry` metin kaydı ve gün ID'si |
| `/speak` Second try | Session-only recorder | `speakSecondTry`, completion ve autosave |
| `/device-lab/8k/8k-intro` Listen | Okuma denemesi | Source-backed listening text ve TTS |
| `/device-lab/8k/8k-intro` Say it | Kısa konuşma kaydı | Prompt, claim-control ve local completion |

Başka route'a kayıt eklenmedi. Yeni cihaz iddiası, cihaz modülü veya öğrenme
metni üretilmedi. TTS state/cache/provider davranışı değiştirilmedi.

## 4. Tarayıcı ve fallback matrisi

| Tarayıcı | Doğrulama | Sonuç / fallback |
|---|---|---|
| Chrome 150 / Windows | Gerçek production Chrome + fake audio input | `MediaRecorder`, WebM/Opus Blob, playback, re-record, delete, refresh, timeout ve cleanup geçti. |
| Firefox | Bu Windows ortamında gerçek Firefox yok; belgeli runtime fallback | API'ler özellik kontrolünden geçerse desteklenen WebM/Opus, MP4 veya browser-default kullanılır; geçmezse recorder yerine metin görevi kalır. |
| Safari / iOS | Bu Windows ortamında gerçek WebKit cihazı yok; resmî WebKit format bilgisi + belgeli runtime fallback | `isTypeSupported()` sonucuna göre WebM/Opus veya MP4, sonra browser-default denenir; API yoksa metin görevi kalır. |

`getUserMedia()` güvenli bağlam ve izin gerektirir; izin reddi, cihaz yokluğu ve
donanım erişim hataları ayrı hata adlarıdır. Kullanıcı izin penceresini hiç
yanıtlamayabileceği için timeout gereklidir: [MDN — getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).
Format desteği kullanıcı ajanında runtime kontrol edilmelidir:
[MDN — MediaRecorder.isTypeSupported](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static).
WebKit de özellik/format kontrolünü önerir ve MP4 kayıt yolunu belgeler:
[WebKit — MediaRecorder API](https://webkit.org/blog/11353/mediarecorder-api/).
Yeni WebKit sürümlerinde WebM/Opus desteği de genişletilmiştir:
[WebKit — Safari 18.4](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/).

Firefox ve Safari/iOS satırları gerçek cihaz başarısı iddiası değildir. P11'de
gerçek cihaz erişimi varsa aynı lifecycle matrisi yeniden çalıştırılmalıdır.

## 5. Erişilebilirlik ve mobil kanıt

- Speak 375×812 ve Device Lab 320×812 production Chrome kontrolünde yatay
  taşma yoktur.
- Yeni recorder düğmelerinin ölçülen minimum yüksekliği `46px`tir.
- Device Lab'de Tab ile recorder düğmesine ulaşıldı; `:focus-visible = true`,
  hesaplanmış outline `3px solid rgb(143, 79, 56)` oldu.
- Idle, requesting/loading, recording, stopping/loading, ready, error ve
  unsupported durumları görünür metinle sunulur. Kırmızı recording işareti
  ayrıca “Kayıt” metni taşır; durum yalnız renge bağlı değildir.
- Recorder desteklenmediğinde prompt ve metin görevleri DOM'da kalır.

## 6. Doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; TypeScript ve 18 statik sayfa üretimi tamamlandı.
- `npm run test:p2` — 3/3 geçti.
- `npm run test:p6` — 4/4 geçti.
- `npm run test:p7` — 4/4 geçti.
- `npm run test:p8` — 4/4 geçti.
- `npm run test:p8:browser` — production Chrome kayıt/mobil/focus/fallback
  matrisi geçti.
- `git diff --check` — geçti.

## 7. Bilerek değiştirilmemiş alanlar

- Kayıt Blob'ları hiçbir storage veya sunucuya yazılmadı.
- Upload, cloud/admin erişimi, transkripsiyon, AI değerlendirme, model cevap,
  telaffuz skoru ve pronunciation grading eklenmedi.
- TTS API/provider/cache, kelime vurgusu ve ses kapsamı değiştirilmedi.
- Gün `1..90`, gün kimlikleri, Words sayısı ve yerel ilerleme anahtarları
  değiştirilmedi.
- Device Lab claims, sources, blocked kayıtlar ve içerik verisi değiştirilmedi.
- Paket sürümü veya yeni runtime bağımlılığı eklenmedi.

## 8. Riskler ve ertelenen işler

- Chrome testi gerçek MediaRecorder motorunu fake audio input ile çalıştırdı;
  fiziksel mikrofon ses kalitesi testi değildir.
- Firefox ve Safari/iOS gerçek cihaz üzerinde bu ortamda çalıştırılamadı;
  runtime fallback ve resmî format belgeleriyle güvenli davranış korundu.
- Mikrofon/TTS aynı anda kullanıcı tarafından başlatılırsa tarayıcı ikisini de
  çalıştırabilir; otomatik medya koordinasyonu bu fazın kapsamına eklenmedi.
- Kalıcı kayıt istenirse IndexedDB, kota, saklama süresi ve silme politikası
  ayrı ve açıkça planlanmış yeni bir faz gerektirir.

## 9. Faz geçişi

P8 bütün kabul ölçütleri geçtiği için `Tamamlandı` olarak işaretlendi. Yalnız
P9 — Words 8 → 10 `Sıradaki` yapıldı. P9 uygulanmadı veya hazırlanmadı.
Commit veya push yapılmadı.
