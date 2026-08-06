# Argos Speak 90 P5 Device Lab Özeti

**Tarih:** 6 Ağustos 2026

**Faz:** P5 — Device Lab sade hap bilgi deneyimi

**Sonuç:** Device Lab, kaynak ve claim-control verisini değiştirmeden yalnız
`learner_ready` içeriği yayımlayan kısa öğrenci akışına geçirildi. Landing'de
yalnız 8K görünür; yalnız `8k-intro` modülü üretim route'u olarak oluşturulur.
Taslak, ertelenmiş, bloklu ve bilinmeyen cihaz/modül route'ları kapalıdır.

## 1. Değişen dosyalar

- `lib/device-lab/devices.ts`
  - Yalnız learner-ready cihaz/modül seçim yardımcılarını ekler.
  - Mevcut dinleme metninin ilk cümlesini intro olarak seçer.
  - Yalnız learner-facing izni ve learner-ready durumu olan claim'lerden en çok
    üç quick fact seçer.
- `lib/device-lab/local-practice.ts`
  - Mevcut `argos-device-lab-practice-v1` anahtarını ve sürümünü korur.
  - Tek `practiceNote` alanını geriye uyumlu ekler; alan bulunmayan eski dört
    cevaplı kaydı etiketli tek nota kayıpsız taşır.
  - Eski alanları silmez; reset yalnız aktif `${deviceSlug}:${moduleId}` kaydını
    kaldırmaya devam eder.
- `app/device-lab/page.tsx`
  - Öğrenci kataloğunda yalnız yayımlanmış 8K kartını, intro'yu, yerel durumu ve
    tek “Cihazı aç” eylemini gösterir.
- `app/device-lab/[deviceSlug]/page.tsx`
  - Yalnız learner-ready cihaz ve modülü yayımlar; taslak/deferred metadata
    panellerini öğrenci akışından çıkarır.
- `app/device-lab/[deviceSlug]/[moduleId]/page.tsx`
  - Modülü intro, üç quick fact, kısa key words, Listen, Say it, isteğe bağlı
    Türkçe yardım, tek yerel not ve tamamlanma akışına indirir.
  - TTS/kayıt için kararlı semantic ID ve `data-*` hook'ları ekler; ses veya
    kayıt davranışı eklemez.
  - Claim-control, blocked kayıtlar ve kaynakları tek kapalı “Kaynak notları”
    disclosure'ında korur; admin coaching'i öğrenci yüzeyinde render etmez.
- `app/device-lab/_components/device-lab-practice-panel.tsx`
  - Dört eşit textarea yerine tek isteğe bağlı not, tamamla ve iki adımlı
    modül-bazlı reset sunar.
- `app/device-lab/_components/device-lab-completion-status.tsx`
  - Landing, cihaz ve modül yüzeylerinde mevcut yerel tamamlanmayı salt okunur
    gösterir.
- `app/device-lab/_components/device-lab-ui.tsx`
  - Modül kartını sade öğrenci dili ve yerel tamamlanma etiketiyle günceller.
- `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`
  - P5'i tamamlar ve yalnız P6'yı sıradaki faz yapar.
- `docs/ARGOS_SPEAK_90_P5_DEVICE_LAB_SUMMARY.md`
  - Bu kapsam, doğrulama ve risk kaydını oluşturur.

## 2. Yayın ve içerik kapısı

- `learnerReadyDeviceLabDevices` yalnız en az bir `learner_ready` modülü olan
  cihazı öğrenci kataloğuna alır.
- Sonuç: bir cihaz (`8k`) ve bir modül (`8k-intro`).
- Intro, quick facts, words ve prompt mevcut statik veriden okunur; yeni cihaz
  gerçeği veya yeni modül üretilmez.
- Quick facts filtresi blocked, under-sourced, conflicted veya learner-facing
  izni olmayan claim'i yayımlamaz ve sonucu üç öğeyle sınırlar.
- Contactless LITE kontrollü taslakları dahil bütün draft modüller ile t-ZOOM,
  SuperSpectral, LAB ULTRA ve katalog kayıtları öğrenci route'u değildir.

## 3. Yerel kayıt uyumluluğu

Storage anahtarı ve kök sürüm değişmedi:

```text
argos-device-lab-practice-v1
version: 1
```

Eski `firstTryAnswer`, `secondTryAnswer`, `reviewAnswer` ve `journalNote`
alanları okunmaya ve saklanmaya devam eder. `practiceNote` alanı bulunmayan eski
kayıt ilk okumada bu dört değeri başlıklarıyla tek textarea'da gösterir. Kullanıcı
yeni tek notu kaydettiğinde eski alanlar korunur; `practiceNote` bilerek boş
bırakılırsa eski değerler tekrar UI'a taşınmaz.

İzole Chromium fixture kontrolünde:

- dört eski cevap tek notta eksiksiz göründü,
- yeni not yenilemeden sonra aynı kaldı,
- eski `firstTryAnswer` değeri korunmaya devam etti,
- reset yalnız `8k:8k-intro` kaydını sildi,
- ikinci modül fixture'ı aynı store içinde korundu.

## 4. Kabul ölçütü kanıtları

- 375×812 Chromium: modül yüksekliği `3445 px`, yani `4.24` ekran; hedeflenen
  3–5 ekran aralığında.
- 320×812 Chromium: modül `4.74` ekran; `scrollWidth = 320`, yatay taşma yok.
- İlk 375×812 viewport'ta cihaz adı, tek cümle intro, yerel durum, Listen ve
  Say it eylemleri görünür.
- Modülde tam üç quick fact ve tek textarea bulunur.
- Dokuz audio semantic hook ve bir recording hook vardır; ağ/TTS/MediaRecorder
  davranışı yoktur.
- “Kaynak notları” varsayılan kapalıdır. Claim kartı
  `checkVisibility() = false`; blocked içerik görünür fact değildir.
- Admin coaching öğrenci DOM'unda yoktur.
- Landing'de yalnız `/device-lab/8k`; cihaz sayfasında yalnız
  `/device-lab/8k/8k-intro` bağlantısı bulunur.
- Yerel completion modül, cihaz ve landing yüzeyinde “Yerel tamamlandı” olarak
  yeniden okunur.

Route smoke matrisi:

| Route | Sonuç |
|---|---:|
| `/device-lab` | 200 |
| `/device-lab/8k` | 200 |
| `/device-lab/8k/8k-intro` | 200 |
| `/device-lab/contactless-lite` | 404 |
| `/device-lab/8k/8k-customer-demo` | 404 |
| `/device-lab/tzoom-plus-dna` | 404 |
| `/device-lab/not-a-device` | 404 |

## 5. Erişilebilirlik ve tarayıcı doğrulaması

- 375×812 ve 320×812 gerçek headless Chrome 151 ile kontrol edildi.
- 320 px'de `a`, `button`, `summary` ve `textarea` öğelerinin hiçbiri 24×24
  alt sınırın veya tercih edilen 44×44 hedefin altında değildir.
- Gerçek Tab sırası Listen bağlantısına ulaştı; `:focus-visible = true` ve
  hesaplanmış 3 px clay focus ring + 2 px offset görünürdür.
- Merkezi `Button`/`ButtonLink` varyantları kullanıldı; disabled completion ve
  iki adımlı danger reset durumu gerçek tarayıcıda çalıştı.
- Tek görünür `h1`, erişilebilir kontrol adları ve Next.js hata overlay yokluğu
  doğrulandı.
- Console'da yalnız Next.js development/HMR bilgileri vardı; page error yoktu.

## 6. Çalıştırılan doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; sandbox içindeki ilk deneme mevcut Geist fontlarına
  ağ erişimi olmadığı için durdu, ağ izinli tekrar derleme/TypeScript ve 18
  statik sayfa üretimini tamamladı.
- `npm run test:p2` — 3/3 yerel backup/import round-trip testi geçti.
- Device Lab route smoke matrisi — geçti.
- Chrome 151 mobil, klavye/focus, localStorage migration/reset ve console
  matrisi — geçti.
- `git diff --check` — geçti.
- Kapsam taraması — Device Lab değişikliklerinde `fetch`, `/api/tts`,
  ElevenLabs, MediaRecorder veya admin coaching kullanımı yok; TTS, içerik veri,
  source ve paket dosyalarında diff yok.

## 7. Bilinen riskler ve ertelenen işler

- Kanonik veride yalnız 8K Intro `learner_ready`; diğer cihazların görünmemesi
  bilinçli deny-by-default yayın kararıdır.
- Listen ve Say it P5'te görünür akış ve semantic hook'tur. Gerçek ses davranışı
  P6 güvenilirlik temeli ve daha sonraki kapsam fazını bekler; bu faz TTS API'sini
  değiştirmez.
- Kaynak notları açılırsa yönetişim içeriği uzundur; varsayılan öğrenci akışı
  3–5 ekran hedefini kapalı durumda karşılar.
- Ses kaydı, model cevap, AI değerlendirme, puan, transcription, cloud veya
  admin tracking eklenmedi.

## 8. Faz geçişi

P5 `Tamamlandı`; bir sonraki uygun faz P6 — TTS güvenilirlik temeli
`Sıradaki` olarak işaretlendi. P6 uygulanmadı ve hazırlanmadı.
