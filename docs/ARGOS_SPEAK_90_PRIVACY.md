# Argos Speak 90 Gizlilik Notu

**Son güncelleme:** 6 Eylül 2026 (P11 kapanışı)

## Tek kullanıcı, yerel saklama

Bu uygulama tek kullanıcılıdır. Hesap veya uzak senkron yoktur. İlerleme localStorage içinde tutulur.

Anahtarlar: argos-active-day, argos-practice-progress, argos-device-lab-practice-v1.

## TTS

Oynatma kullanıcı eylemiyle başlar. Metin /api/tts üzerinden ElevenLabs ile sese çevrilebilir. API anahtarı yalnız sunucudadır.

## Mikrofon

Sayfa açılışında mikrofon istenmez. Kayıt Blob u oturum belleğindedir; localStorage/sessionStorage/IndexedDB ye yazılmaz; buluta yüklenmez; yazıya dökülmez; puanlanmaz. Track stop ve revokeObjectURL uygulanır.

## Yedekleme

JSON dışa/içe aktarma kullanıcı kontrolündedir. Otomatik bulut hesabına gönderilmez.

## Ne yoktur?

- Login / account / admin paneli
- Cloud sync istemcisi
- Kayıt upload API si
- AI telaffuz skoru veya konuşma transkripsiyonu
