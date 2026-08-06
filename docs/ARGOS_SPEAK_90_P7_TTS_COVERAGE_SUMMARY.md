# Argos Speak 90 P7 TTS Kapsam Özeti

**Tarih:** 6 Ağustos 2026

**Faz:** P7 — TTS kapsam genişletmesi

**Sonuç:** P7 tamamlandı. Listen transcript ve Words word/example için P6'da
kurulan davranış korunurken Listen key lines, Speak prompt/target lines, Review
prompt/örnek cevaplar ve yayımlanmış Device Lab intro/quick fact/key
word/listening/say-it nesneleri aynı kullanıcı-başlatmalı ses sözleşmesine
taşındı. Journal'ın mevcut promptları Türkçe olduğu için gereksiz TTS kapsamına
alınmadı.

## 1. Değişen dosyalar

- `components/tts-audio-scope.tsx`
  - Route içindeki bütün yeni öğrenme nesnelerinin tek `useAudioController`
    paylaşmasını sağlar.
  - TTS config durumunu route başına bir kez kontrol eder; idle, loading,
    playing, paused ve error/retry durumlarını ortak `AudioAction` ile gösterir.
  - Aynı route'ta yeni bir içerik başladığında önceki ses ve isteği durdurur.
- `lib/tts/text-chunks.ts`
  - Sunucudaki 2.000 karakter sınırını kanonik sabit yapar.
  - Uzun metni önce cümle, sonra boşluk sınırında; gerekirse sonlu sabit boyutta
    böler.
- `app/api/tts/route.ts`
  - Davranışı değiştirmeden ortak `TTS_MAX_TEXT_LENGTH` sabitini kullanır.
- `components/audio-action.tsx`
  - Bütün ses eylemlerine hesaplanmış stilde doğrulanan 3 px solid focus-visible
    outline ekler.
- `components/listening-drill.tsx`
  - Dört key line için transcript ile aynı denetleyiciyi kullanan ayrı Dinle,
    pause/resume ve retry eylemleri ekler.
  - Transcript alignment ve kelime vurgusu aynen korunur.
- `components/speaking-practice.tsx`
  - Günlük konuşma promptu ile bütün target line'ları dinlenebilir yapar.
- `components/review-practice.tsx`
  - Bütün Review promptlarını ve yanlış cevap sonrasında görünür örnek İngilizce
    cevabı dinlenebilir yapar.
- `app/device-lab/[deviceSlug]/[moduleId]/page.tsx`
  - Yalnız learner-ready 8K Intro içeriğinde intro, üç quick fact, beş key word,
    listening text ve say-it prompt eylemlerini ekler.
  - Mevcut source-backed seçim ve blocked-claim kapısını değiştirmez.
- `tests/p7-tts-coverage.test.mjs`
  - Sınır, okunur bölümleme, uzun tek token ve planlı route kapsamını test eder.
- `tests/p7-browser-qa.mjs`
  - Kurulu Chrome üzerinden gerçek TTS response/playback, tek aktif ses,
    pause/resume, cache, route matrisi, mobil reflow ve klavye focus denetimi
    sağlar.
- `package.json`
  - `test:p7` ve `test:p7:browser` komutlarını ekler.
- `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`
  - P7'yi tamamlar ve yalnız P8'i sıradaki faz yapar.
- `docs/ARGOS_SPEAK_90_P7_TTS_COVERAGE_SUMMARY.md`
  - Bu kapsam, doğrulama ve risk kaydını oluşturur.

## 2. Kapsam ve davranış matrisi

| Route | Dinlenebilir içerik | Gerçek Chrome sonucu |
|---|---|---|
| `/listen` | transcript + her key line | playback ve pause/resume geçti |
| `/words` | word + example | P6 davranışı korundu, playback geçti |
| `/speak` | prompt + her target line | playback ve tek aktif ses geçti |
| `/review` | her prompt + görünür örnek cevap | playback geçti |
| `/device-lab/8k/8k-intro` | intro, quick facts, key words, listening, say-it | bütün nesne türleri ve cache replay geçti |
| `/journal` | mevcut İngilizce prompt yok | Türkçe promptlar bilinçli olarak hariç |

Yeni yüzeyler alignment istemeyen binary MP3 yolunu kullanır. Listen transcript
alignment isteyen `base64-json` yolunda ve kelime vurgusuyla kalır. Her oynatma
açık kullanıcı eylemiyle başlar; autoplay eklenmedi.

## 3. Tek aktif ses, cache ve maliyet sınırı

- Speak, Review ve Device Lab route'larının her biri tek ses denetleyicisi
  paylaşır. Listen ve Words zaten aynı route-içi tek denetleyici modelindeydi.
- Yeni bir öğe çalındığında aktif istek/medya bırakılır; Chrome matrisinde aynı
  anda tam bir kontrol “Duraklat” durumunda kaldı.
- Cache anahtarı gün, ortak öğrenme scope'u, alignment modu, voice, model ve
  normalize metin hash'ini korur. Aynı gün aynı key line/target metni cache'i
  paylaşabilir.
- Device Lab intro başka seslerden sonra yeniden oynatıldığında yeni `/api/tts`
  isteği oluşmadı.
- Provider config kontrolü yeni route scope'u başına bir kez çalışır. Ses
  kontrolleri sayfa açılışında TTS üretmez.

## 4. 2.000 karakter kapısı

`splitTtsText()` metni sunucunun 2.000 karakter sınırını aşmayacak parçalara
ayırır. Birden fazla parçada UI bölüm sayısını açıkça gösterir ve her parçayı
ayrı bir kullanıcı Dinle eylemiyle başlatır; otomatik zincir oynatma yapmaz.
Testler tam sınırı, cümle sınırında bölmeyi, boşluğu olmayan uzun token'ı,
sonluluğu ve içerik kaybı olmamasını doğruladı. Mevcut günlük öğrenme nesneleri
tek parçadır; uzun metin UX'i otomatik test fixture'ıyla doğrulandı.

## 5. Tarayıcı ve erişilebilirlik kanıtı

- Chrome `150.0.7871.187` ile production build üzerinde 13 gerçek `/api/tts`
  response'u alındı; bütün status değerleri `200`, MIME değerleri binary
  `audio/mpeg` veya alignment için `application/json` oldu.
- UI yalnız controller geçerli, sıfırdan büyük duration ve başarılı `play()`
  sonucunu aldıktan sonra “Duraklat” durumuna geçti.
- Listen, Words, Speak, Review ve Device Lab gerçek playback; pause/resume;
  öğeler arası overlap engeli ve Device Lab cache replay geçti.
- Altı route için 320×812 ve 375×812 olmak üzere 12 reflow kontrolünde yatay
  taşma yoktu.
- Ses kontrollerinin dokunma yüksekliği en az 44 CSS px ölçüldü.
- Gerçek Tab sırası Speak ses kontrolüne ulaştı; `:focus-visible = true`,
  hesaplanmış outline `3px solid` ve ayrı offset olarak doğrulandı.
- Next.js error overlay ve browser console error yoktu.

## 6. Çalıştırılan doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; TypeScript ve 18 sayfa üretimi tamamlandı.
- `npm run test:p2` — 3/3 yerel backup/import regresyonu geçti.
- `npm run test:p6` — 4/4 TTS cache/guard/base64 regresyonu geçti.
- `npm run test:p7` — 4/4 chunk ve kapsam testi geçti.
- `npm run test:p7:browser` — gerçek TTS, route, cache, 320/375, target ve
  klavye focus matrisi geçti.
- `git diff --check` — geçti.
- Kapsam taraması — kayıt, mikrofon, transcription, scoring, AI evaluation,
  autoplay veya yeni Device Lab claim eklenmedi.

## 7. Bilerek değiştirilmemiş alanlar

- Journal'ın Türkçe günlük soruları TTS'e gönderilmedi; kullanıcı tarafından
  yazılan cevaplar da seslendirilmedi.
- Words içerik ve UI yapısı değiştirilmedi; P6 word/example sesi korundu.
- Listen transcript alignment/highlight davranışı kaldırılmadı.
- Device Lab içerik, claim-control, sources, blocked kayıt ve yerel completion
  verisi değiştirilmedi; yeni cihaz gerçeği üretilmedi.
- Ses kaydı, mikrofon izni, MediaRecorder, upload, transcription, AI puanı veya
  pronunciation grading eklenmedi.
- 90 günlük içerik, gün kimlikleri, Words sayısı ve localStorage anahtarları
  değiştirilmedi.
- Paket sürümü yükseltilmedi ve yeni runtime bağımlılığı eklenmedi.

## 8. Bilinen riskler ve ertelenen işler

- Gerçek playback matrisi bu fazda kurulu Chrome ile çalıştırıldı; geniş
  Firefox/Safari cihaz regresyonu P11 uçtan uca kapanışında tekrar ele alınır.
- Uzun metin bölümleme gerçek içerikte tetiklenmedi çünkü mevcut nesneler sınırın
  altındadır; algoritma otomatik fixture ile doğrulandı.
- Süreç içi TTS rate guard çok instance dağıtımında P6'da belgelenen best-effort
  sınırını korur.
- Device Lab'de yalnız 8K Intro learner-ready olduğu için P7 yalnız bu
  source-backed modülü seslendirdi.

## 9. Faz geçişi

P7 bütün kabul ölçütleri geçtiği için `Tamamlandı` olarak işaretlendi. Sıradaki
tek faz P8 — Tarayıcı ses kayıt MVP'si olarak işaretlendi. P8 uygulanmadı veya
hazırlanmadı. Commit veya push yapılmadı.
