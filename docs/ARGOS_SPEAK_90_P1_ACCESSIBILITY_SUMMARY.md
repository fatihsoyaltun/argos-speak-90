# Argos Speak 90 P1 Erişilebilirlik Özeti

**Tarih:** 4 Ağustos 2026

**Faz:** P1 — Buton kontrastı ve etkileşim acil kapısı

**Sonuç:** Kabul ölçütleri sağlandı.

## 1. Uygulanan kapsam

- `app/globals.css` içindeki katmansız `a { color: inherit }` kuralı Tailwind `base` katmanına taşındı. Böylece utility katmanındaki metin renkleri global anchor kuralı tarafından ezilmiyor.
- `components/ui.tsx` içine küçük, ortak `Button` ve `ButtonLink` sözleşmesi eklendi. `primary` ve `secondary` varyantları; default, hover, focus-visible, active, disabled, loading ve visited durumlarını açıkça tanımlıyor.
- Device Lab landing'deki altı “Cihaz detayını aç” CTA'sı ortak `ButtonLink` bileşenine taşındı.
- Statik envanterde 44 CSS px tercihinin altında olduğu görülen mevcut etkileşim hedefleri dar biçimde `min-h-11` seviyesine çıkarıldı: kompakt Listen ses kontrolü, Words kısayol/ses/örnek açma kontrolleri, Settings hesap ve dosya seçme kontrolleri, Device Lab geri bağlantısı, Admin geri bağlantısı ve ortak step/status link durumları.
- Global cascade düzeltmesinden sonra artık gerekmeyen dağınık link `!text-*` kaçışları normal state utility'lerine çevrildi. Yeni `!important` çözümü eklenmedi.

Device Lab içeriği, route yapısı, Auth/Admin davranışı, TTS, storage, Supabase, 90 günlük müfredat ve cihaz iddiaları değiştirilmedi.

## 2. Kontrol envanteri

Başlangıç kaynak envanteri:

- 31 mevcut `<button>` kullanımı,
- 27 mevcut Next.js `<Link>` kullanımı,
- 1 yerel `<a>` kullanımı.

Yeni ortak `Button` tanımı kaynak sayımına bir `<button>` bildirimi ekledi; mevcut tüketici davranışları topluca bu bileşene taşınmadı. Yalnız P1'in zorunlu Device Lab CTA'ları ortak `ButtonLink` tüketicisi oldu.

Tarayıcı matrisi şu temsilî kullanıcı ve yönetim yüzeylerini kapsadı:

`/`, `/today`, `/listen`, `/words`, `/speak`, `/review`, `/journal`, `/stats`, `/settings`, `/pilot`, `/login`, `/account`, `/admin`, `/device-lab`, `/device-lab/8k`, `/device-lab/8k/8k-intro`.

Her route 320×812 ve 375×812 viewport'ta denetlendi. Böylece 32 route/viewport örneği ve toplam 444 görünür kontrol örneği tarandı.

## 3. Kontrast ve durum matrisi

Gerçek Chromium computed-style sonuçları:

| Durum | Metin | Zemin | Kontrast |
|---|---|---|---:|
| Default | `rgb(255, 255, 255)` | `rgb(23, 32, 26)` | 16.69:1 |
| Hover | `rgb(255, 255, 255)` | `rgb(51, 73, 58)` | 9.75:1 |
| Active | `rgb(255, 255, 255)` | `rgb(38, 55, 44)` | 12.61:1 |
| Focus-visible | `rgb(255, 255, 255)` | `rgb(23, 32, 26)` | 16.69:1 |
| Visited | `rgb(255, 255, 255)` | `rgb(23, 32, 26)` | 16.69:1 |
| Disabled | `rgb(63, 73, 63)` | `rgb(215, 208, 198)` | 6.14:1 |
| Loading (`disabled` + `aria-busy`) | `rgb(63, 73, 63)` | `rgb(215, 208, 198)` | 6.14:1 |

Altı Device Lab CTA'sının tamamı default durumda 16.69:1 kontrast ve 46 CSS px yükseklik verdi. Focus-visible durumunda clay ring ile surface offset hesaplandı; yalnız renge bağlı olmayan görünür dış halka oluştu. Active transform sonrasında hedef yüksekliği yaklaşık 45.1 CSS px olarak kaldı.

## 4. Reflow, hedef ve klavye kanıtı

- 320 px Device Lab: `scrollWidth = clientWidth = 320`; altı CTA 268.5×46 CSS px.
- 375 px Device Lab: `scrollWidth = clientWidth = 375`; altı CTA 309×46 CSS px.
- 16 route'un iki viewport taramasında yatay taşma, boş sayfa, framework error overlay'i veya 44 CSS px altı görünür button/link/summary/file hedefi bulunmadı.
- 375 px route örnekleminde 198 görünür button/link kontrolüne focus-visible pseudo-state uygulandı; 198 kontrolün tamamında hesaplanmış focus göstergesi değişti.
- Klavye Tab girdisiyle Device Lab CTA'sı focus aldı, `:focus-visible` eşleşti ve ring hesaplandı.
- Temsilî route hata günlüğü taramasında console error veya runtime exception bulunmadı.

Tarayıcı: Chrome 150.0.7871.187, headless Chromium DevTools Protocol.

## 5. Doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; TypeScript ve 28 statik/dinamik route üretimi tamamlandı.
- `git diff --check` — geçti.
- `rg -n '!text-' --glob '*.tsx' app components` — eşleşme yok.

## 6. Kalan riskler ve ertelenen işler

- Bu fazın gerçek tarayıcı matrisi Chromium ile yürütüldü. Daha geniş çapraz tarayıcı görsel regresyonu sonraki tasarım/regresyon fazlarının kapsamındadır.
- Ortak bileşen sözleşmesi P1 için bilinçli olarak küçük tutuldu. Mevcut bütün kontrolleri topluca ortak bileşene taşımak genel refactor olacağı için yapılmadı.
- Auth/Admin/cloud, Device Lab içerik sadeleştirmesi, TTS ve diğer sonraki faz işleri başlatılmadı veya hazırlanmadı.
