# Argos Speak 90 P3 Tek Kullanıcı Geçiş Özeti

**Tarih:** 5 Ağustos 2026

**Faz:** P3 — Login/Admin/cloud emekliliği

**Sonuç:** Uygulama tek kullanıcı ve yerel ilerleme modeline geçirildi; `/stats`
route'u İlerleme yüzeyi olarak ve P2 tam yerel yedek akışı korunarak eski
hesap/yönetim/cloud kodu emekli edildi.

## 1. Uygulanan geçiş

Geçiş P2 envanterindeki bağımlılık sırasıyla uygulandı:

1. Ayarlar içindeki hesap, oturum, ekip, yönetim ve cloud sync tüketicileri
   kaldırıldı. Aktif gün, yerel veri temizleme, tam JSON dışa/içe aktarma,
   Device Lab bağlantısı ve ses durumu korundu.
2. Eski `/pilot` route'u silinmedi; görünür ekip pilotu içeriği yerel günlük
   çalışma ve JSON yedek rehberine dönüştürüldü.
3. `/login`, `/account`, `/admin` ve `/admin/users/[userId]` sayfaları emekli
   edildi.
4. Son tüketicileriyle birlikte Auth/session, Admin server, cloud progress sync,
   Supabase browser/server/env/type kodu kaldırıldı.
5. Uygulama import taraması sıfıra indikten sonra `@supabase/ssr` ve
   `@supabase/supabase-js` paketleri ile eski Supabase/Admin/pilot kurulum
   belgeleri kaldırıldı. README içindeki public Supabase env anlatımı temizlendi.
6. `/stats` route'u korunarak alt navigasyonda ve sayfa içeriğinde görünür adı
   “İlerleme” yapıldı.

## 2. Yerel veri uyumluluğu

Şu kullanıcı verisi anahtarları ve şemaları değiştirilmedi:

- `argos-active-day`
- `argos-practice-progress`
- `argos-device-lab-practice-v1`

P2'nin `version: 2` tam yedeği aktif gün, ana pratik store'u ve Device Lab
store'unu aynı biçimde taşımaya devam eder. Eski sync zaman damgası sabiti yalnız
geriye dönük temizleme ve “yedek dışında metadata” test sözleşmesi için kaldı;
uygulamada sync tüketicisi yoktur.

Otomatik testte tam yedek round-trip'i, legacy yalnız-pratik importu ve geçersiz
yedekte atomik koruma 3/3 geçti. Gerçek Chromium oturumunda `argos-active-day=12`
yüklenip Ayarlar'dan tam JSON üretildi; anahtar `1` yapıldıktan sonra aynı JSON
arayüzden içe aktarıldı. Sonuçta anahtar yeniden `12` oldu ve `/stats` ekranı
`Aktif gün 12`, `Tamamlanan görev 0/4` gösterdi.

## 3. Route, import, paket ve metin kanıtı

- Üretim build route listesinde `/login`, `/account`, `/admin` ve
  `/admin/users/[userId]` yoktur.
- Dev sunucusunda bu dört route örneği HTTP `404` döndürdü.
- Uygulama kaynaklarında `@/lib/auth`, `@/lib/admin`, `@/lib/supabase`,
  `@supabase/*`, eski consumer bileşenleri, emekli route bağlantıları ve public
  Supabase env adları için tarama sonucu sıfırdır.
- Görünür TSX yüzeyinde login/account/admin panel/cloud sync dili kalmamıştır.
  Device Lab'in P5 kapsamındaki içerik yönetişimi ve admin coaching alanları bu
  fazda değiştirilmedi.
- `package.json` ve lockfile artık Supabase paketlerini içermez.

## 4. Mobil ve klavye doğrulaması

Gerçek Chromium ile:

- Ayarlar `375×812`: `scrollWidth = clientWidth = 375`; içerik dolu, Next.js
  hata diyaloğu yok, emekli hesap/sync dili yok.
- Ayarlar `320×812`: `scrollWidth = clientWidth = 320`.
- İlerleme `320×812`: `scrollWidth = clientWidth = 320`; tek `h1` metni
  “Yerel ilerlemen” ve alt navigasyon etiketi “İlerleme”.
- Yerel rehber `375×812`: yatay taşma ve emekli hesap/sync dili yok.
- Device Lab örnek modülü `375×812`: yatay taşma yok ve yerel kayıt açıklaması
  yalnız bu tarayıcıda saklandığını söylüyor.
- Ayarlar Device Lab bağlantısı klavye odağı aldı; hesaplanan hedefi `309×46`
  CSS px ve focus ring'i 4 px yüzey offset'i ile 2 px clay halkasıdır.
- Genişletilmiş yedek alanında export, download, import textarea, dosya seçimi
  ve import düğmeleri erişilebilir ağaçta adlarıyla bulundu.

## 5. Doğrulamalar

- `npm run test:p2` — 3/3 geçti.
- `npm run lint` — geçti.
- `npm run build` — geçti; 26 statik sayfa üretim adımı tamamlandı ve emekli
  route'lar route manifestinde yok.
- Auth/Admin/Supabase consumer-route-package-env taraması — sıfır eşleşme.
- Görünür emekli hesap/admin/cloud-sync dili taraması — sıfır eşleşme.
- Dört emekli route HTTP smoke testi — dört `404`.
- 320/375 mobil, klavye/focus ve yerel JSON UI round-trip — geçti.
- `git diff --check` — geçti.

İlk sandbox build denemesi Google Fonts ağ erişiminde durdu; izinli build
derlemeyi tamamladı. Silinen route'lara ait eski `.next/dev/types` validator'ı
bir kez type check'i etkiledi; yalnız üretilmiş `.next/dev` cache'i
temizlendikten sonra build geçti. Tarayıcı doğrulaması için geçici kurulan global
araç ve Chrome for Testing sürümü test sonunda kaldırıldı.

## 6. Bilinen riskler ve ertelenen işler

- Bu ortamda gerçek bir Supabase kullanıcı oturumu veya uzak veri seti
  açılmadı. Uzak proje/veritabanı silinmedi ya da değiştirilmedi. Yalnız cloud'da
  veri kalmış olma ihtimali varsa P2'deki final JSON prosedürü veya önceki kod
  revizyonu kullanılarak dağıtımdan önce ayrıca kurtarılmalıdır.
- `/pilot` yolu geriye dönük erişim için korundu; yalnız görünür içeriği yerel
  rehberdir. Route ve shell bilgi mimarisi P4 kapsamıdır.
- Genel tasarım sistemi, navigation sadeleştirmesi, Device Lab içerik düzeni,
  TTS, kayıt ve Words runtime bu fazda bilerek değiştirilmedi.
- Uzak Supabase şeması ve politikaları bu fazın yetkisi dışında bırakıldı.

