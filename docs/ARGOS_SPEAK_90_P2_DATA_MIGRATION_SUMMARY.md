# Argos Speak 90 P2 Veri Geçiş Özeti

**Tarih:** 4 Ağustos 2026

**Faz:** P2 — Tek kullanıcı veri güvenliği ve çıkış envanteri

**Sonuç:** Yerel veri round-trip kapısı kuruldu; Auth/Admin/cloud kaldırılmadı.

## 1. Yerel veri sözleşmesi

Mevcut anahtar adları ve gün kimlikleri değiştirilmedi.

| Anahtar | Sahibi | Şema | P2 yedeği |
|---|---|---|---|
| `argos-active-day` | `ActiveDayProvider` | `1..90` sayı metni | Dahil |
| `argos-practice-progress` | Ana Listen/Words/Speak/Review/Journal akışı | `{ version: 1, days }` | Dahil |
| `argos-device-lab-practice-v1` | Device Lab yerel practice paneli | `{ version: 1, modules }` | Dahil |
| `argos-cloud-sync-last-sync` | Cloud sync durum metadatası | ISO tarih metni | Hariç; kullanıcı ilerlemesi değil |
| `sb-<project-ref>-auth-token` | Supabase Auth | Sağlayıcı oturumu | Hariç; token/oturum yedeğe yazılmaz |

Tam yerel yedek zarfı `version: 2` ve `product: "argos-speak-90"`
kimliklerini taşır. İçinde aktif gün, mevcut `version: 1` ana pratik store'u ve
mevcut `version: 1` Device Lab store'u bulunur. API anahtarı, Supabase oturum
verisi, provider URL'si veya cloud sync zaman damgası eklenmez.

Eski `{ version: 1, days }` ve doğrudan `days` nesnesi biçimindeki yalnız-pratik
export'lar geriye uyumlu okunur. Bu legacy import aktif günü ve Device Lab
kaydını değiştirmez. Tam yedek importu üç kullanıcı anahtarını birlikte yazar;
yazma hatasında önceki değerleri best-effort geri yükler.

## 2. Kanıtlanan round-trip

Otomatik fixture şu durumu taşıdı:

- aktif gün `12`,
- Day 12 için `listen`, `words`, `speak` tamamlanması ve yazılı cevaplar,
- Day 90 için dört görev tamamlanması,
- `8k:8k-intro` Device Lab cevabı ve `completedAt` durumu.

Kaynak storage → `version: 2` JSON export → temiz storage import sonrasında
aktif gün, görev dizileri, yazılı alanlar ve Device Lab tamamlanması aynı kaldı.
Ayrıca legacy yalnız-pratik export'un mevcut aktif gün ve Device Lab kaydına
dokunmadığı; geçersiz tam yedeğin mevcut storage'ı değiştirmediği test edildi.

Gerçek Chromium kontrolünde iki ayrı izole tarayıcı oturumu kullanıldı. Kaynak
oturumunda tam JSON üretildi; temiz hedef oturumunda Ayarlar arayüzünden import
edildi. Hedefte `Day 12 / 90`, aynı `completedTasks` dizisi ve aynı Device Lab
`completedAt` değeri doğrulandı.

## 3. Cloud'dan son yerelleştirme kararı ve prosedürü

P3 başlamadan önce olası yalnız-cloud veri için aşağıdaki kullanıcı kontrollü
kapı uygulanır:

1. Mevcut cihazda Ayarlar → Advanced local data bölümünden ilk güvenlik JSON'u
   indirilir.
2. Kullanıcı kendi hesabıyla giriş yapar. Oturum yoksa veya Supabase
   yapılandırılmamışsa bu adım atlanmış sayılmaz; risk kararı açıkça kaydedilir.
3. `Senkronize et` kullanıcı tarafından çalıştırılır. Mevcut kod gün bazında
   `updatedAt` karşılaştırması yapar, cloud'daki daha yeni günleri yerele alır ve
   local-only günleri cloud'a gönderir. Bu işlem otomatik başlamaz.
4. Sonuçtaki çekilen/gönderilen gün sayısı ve aktif gün ekranda kontrol edilir.
5. Advanced local data bölümünden ikinci, nihai JSON indirilir. Device Lab
   cloud kapsamına girmediği için bu final JSON onun tek geçiş kopyasıdır.
6. Ayrı/temiz bir tarayıcı profilinde final JSON içe aktarılır; aktif gün, en az
   bir eski günün görevleri ve Device Lab tamamlanması kontrol edilir.
7. Ancak bu kanıt veya kullanıcının açık “cloud verisine ihtiyacım yok” kararı
   kaydedildikten sonra P3'te consumer kaldırma başlayabilir.

Bu akış cloud verisini, Supabase projesini veya uzak şemayı silmez. Bu görevde
gerçek kullanıcı hesabına giriş yapılmadı ve uzak veri değiştirilmedi.

## 4. Consumer → server → dependency envanteri

### Tüketici yüzeyleri

| Tüketici | Doğrudan bağımlılık / içerik | P3 sırası |
|---|---|---|
| `app/settings/page.tsx` | `CloudSyncPanel`, auth client, Supabase env, login/account/admin/pilot CTA ve metinleri | İlk kaldırılacak tüketici yüzeyi; yerel yedek korunur |
| `components/cloud-sync-panel.tsx` | `lib/supabase/progress-sync.ts` | Final yedek kapısı tamamlandıktan sonra kaldırılır |
| `app/login/page.tsx` | auth client, Supabase env, `TeamPrivacyNotice` | Route emekliliği |
| `app/account/page.tsx` | auth client, Supabase env, `TeamPrivacyNotice` | Route emekliliği |
| `app/admin/page.tsx` | `lib/admin/server.ts` | Route emekliliği |
| `app/admin/users/[userId]/page.tsx` | `lib/admin/server.ts` | Route emekliliği |
| `app/pilot/page.tsx` | login/team/admin/cloud yönlendirme metinleri | Yerel tek kullanıcı yönüne göre tüketici metni temizliği |
| `components/team-privacy-notice.tsx` | login/account cloud görünürlük metni | Son tüketicileriyle birlikte kaldırılır |

### İstemci ve sunucu zinciri

- `lib/supabase/progress-sync.ts` → `lib/auth/session.ts` →
  `lib/supabase/client.ts` → `lib/supabase/env.ts` +
  `lib/supabase/types.ts`.
- `lib/auth/client.ts` → `lib/auth/session.ts` +
  `lib/supabase/client.ts` + `lib/supabase/env.ts` +
  `lib/supabase/types.ts`.
- `lib/admin/server.ts` → `lib/supabase/server.ts` +
  `lib/supabase/types.ts`.
- `lib/auth/server.ts` → `lib/supabase/server.ts` +
  `lib/supabase/types.ts`; mevcut route taramasında doğrudan consumer'ı yoktur,
  fakat server katmanı temizliğinde artık import taramasıyla ele alınmalıdır.
- `lib/supabase/client.ts` ve `lib/supabase/server.ts` → `@supabase/ssr` +
  `@supabase/supabase-js`.

### Env, paket ve doküman zinciri

- Public env adları: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Doğrudan paketler: `@supabase/ssr`, `@supabase/supabase-js`.
- Env anlatımı ve eski kurulum/pilot sözleşmesi en az `README.md`,
  `docs/ADMIN_SETUP.md`, `docs/SUPABASE_AUTH_POLICIES.md`,
  `docs/SUPABASE_PROGRESS_POLICIES.md`, `docs/PILOT_GUIDE.md` ve
  `docs/PILOT_READINESS_QA.md` içinde bulunur.
- Paketler ve env anlatımı yalnız bütün uygulama importları sıfırlandıktan sonra
  P3'ün son adımında kaldırılabilir.

### Uzak veri yüzeyi

Mevcut type ve query envanteri `profiles`, `teams`, `user_status`,
`day_progress`, `practice_entries` ve `review_answers` tablolarını içerir. P2
bu tabloları veya RLS politikalarını değiştirmedi. P3 de uzak Supabase
projesini/veritabanını silmeye yetkili değildir.

## 5. Doğrulamalar

- `npm run test:p2` — 3/3 test geçti.
- `npm run lint` — geçti.
- `npm run build` — geçti; 28 route üretildi. İlk sandbox denemesi Google Fonts
  ağ erişiminde durdu, izinli aynı komut başarılı oldu.
- Chromium 375×812 — tam export ve temiz hedef import geçti; yatay taşma yok
  (`scrollWidth = clientWidth = 375`), framework overlay ve sayfa hatası yok.
- Chromium 320×812 — yatay taşma yok (`scrollWidth = clientWidth = 320`).
- Klavye — Import JSON alanından iki Tab ile “Yerel yedeği içe aktar” düğmesi
  focus aldı; hesaplanan hedef `220×52` CSS px ve görünür clay focus ring vardı.
- `git diff --check` — geçti.

## 6. Bilinen riskler ve P3 kapısı

- Bu ortamda gerçek bir kullanıcı Supabase oturumu/uzak veri seti kullanılmadı.
  P3 öncesinde yukarıdaki son sync + final JSON prosedürü gerçek hesapta
  tamamlanmalı veya kullanıcı cloud verisini istemediğini açıkça kararlaştırmalıdır.
- Browser round-trip Chromium ile yapıldı. Storage formatı standart JSON ve
  `localStorage` olsa da daha geniş çapraz tarayıcı regresyonu P11'de kalır.
- Device Lab cloud'a hiç sync edilmez; final yerel JSON olmadan cihazlar arası
  taşınamaz.
- Auth/Admin route'ları, Supabase kodu, paketleri, env anlatımı ve uzak şema bu
  fazda bilerek korunmuştur.
