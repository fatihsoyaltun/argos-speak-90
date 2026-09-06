# Argos Speak 90 Mimari Özeti

**Son güncelleme:** 6 Eylül 2026 (P11 kapanışı)

## Ürün modeli

Argos Speak 90 **tek kullanıcılı** ve **yerel-öncelikli** bir İngilizce çalışma
uygulamasıdır. Hesap, ekip, Admin paneli veya cloud sync yoktur. İlerleme bu
cihazın tarayıcı depolamasında tutulur; isteğe bağlı JSON yedek ile taşınır.

## Çalışma zamanı

- Next.js App Router (React) istemci ve sunucu bileşenleri
- Öğrenci route'ları: Bugün, Pratik, Listen, Words, Speak, Review, Journal,
  İlerleme (`/stats`), Ayarlar, Device Lab, yerel rehber (`/pilot`)
- Sunucu-only TTS: `app/api/tts` + ElevenLabs; anahtarlar yalnızca `.env.local`
- Ortak UI: `components/ui.tsx` Button/ButtonLink varyantları
- Ortak ses: `lib/tts/*` ve audio action bileşenleri
- Ortak kayıt: voiçe recorder progressive enhancement, session-only

## Yerel veri

| Anahtar | Anlam |
|---|---|
| `argos-active-day` | Aktif gün `1..90` |
| `argos-practice-progress` | Listen/Words/Speak/Review/Journal durumu |
| `argos-device-lab-practice-v1` | Device Lab yerel tamamlanma/not |

Yedek biçimi `version: 2` tam JSON'dur; eski yalnız-pratik export'ları hâlâ
içe aktarılabilir. Reset yalnız hedef kullanıcı anahtarlarını siler.

## Device Lab

Öğrenci yüzeyinde yalnız `learner_ready` ve source-backed yayımlanmış içerik
görünür. Claim-control, blocked kayıtlar ve kaynak notları kapalı disclosure'da
kalır; Admin coaching öğrenci UI'ında yoktur.

## Bilinçli sınırlar

- Auth/Admin/Supabase kodu emekli edilmiştir.
- Ses kaydı buluta yüklenmez, localStorage'a yazılmaz, puanlanmaz.
- AI değerlendirme / telaffuz skoru / transkripsiyon yoktur.
