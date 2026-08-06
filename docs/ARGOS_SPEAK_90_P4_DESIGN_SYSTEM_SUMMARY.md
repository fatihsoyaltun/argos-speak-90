# Argos Speak 90 P4 Tasarım Sistemi Özeti

**Tarih:** 5 Ağustos 2026

**Faz:** P4 — Tasarım sistemi, shell ve navigation temeli

**Sonuç:** Uygulama, mevcut görev ve içerik davranışını koruyarak semantic
tokenlara, dar ortak arayüz primitive'lerine, safe-area/reduced-motion destekli
bir kabuğa ve tam beş hedefli alt navigasyona geçirildi. Mevcut pratik route'ları
yeni `/practice` merkezinde toplandı; her sayfa benzersiz metadata title ve tek
görünür `h1` sözleşmesine bağlandı.

## 1. Uygulanan temel

- Sıcak linen/moss paleti; canvas, surface, metin, action, accent, border,
  danger, focus, disabled, 4/8 spacing, içerik ölçüsü ve minimum kontrol boyutu
  rollerine bağlandı. Eski renk adları, mevcut sayfaları kırmamak için semantic
  rollere yönlenen uyumluluk alias'ları olarak korundu.
- `Button` ve `ButtonLink` aynı `primary`, `secondary`, `soft`, `ghost`,
  `danger` ve `icon` sözleşmesini paylaşır. Icon varyantı TypeScript düzeyinde
  erişilebilir ad ister. Button loading durumu `aria-busy` ve disabled
  davranışını birlikte kullanır.
- Mevcut `Card` ve `StatusPill` korunurken `SectionHeader` ve dört tonlu
  `Feedback` primitive'i eklendi. `CompactSection`, aynı görünümü değiştirmeden
  ortak `SectionHeader` kullanır.
- Shell içerik ölçüsü `44rem` ile sınırlandı. Üst ve alt safe-area inset'leri,
  sabit alt bar kadar ana içerik boşluğu ve global reduced-motion davranışı
  eklendi.
- Alt navigasyon yatay kayan yedi bağlantıdan tam beş hedefe dönüştü: Bugün,
  Pratik, Device Lab, İlerleme, Ayarlar. 320 px'de beş eşit sütun kullanır;
  Device Lab alt route'ları, görev route'ları ve yerel rehber doğru üst hedefi
  aktif gösterir.
- `/practice`, Listen, Words, Speak, Review ve Journal route'larını kısa bir
  merkezde görünür tutar. Günlük görevlerin içerikleri, ilerleme anlamı ve route
  adresleri değiştirilmedi.

## 2. Metadata ve başlık sözleşmesi

Kök layout artık `%s · Argos Speak 90` title şablonunu kullanır. Client page
route'ları dar server layout metadata'larıyla; Device Lab'in dinamik sayfaları
`generateMetadata` ile başlık üretir. Statik tarama ve gerçek Chromium route
matrisinde tüm 14 page route'u metadata kapsamına ve tam bir `PageHeader`/`h1`
sözleşmesine sahiptir.

Örnek doğrulanan başlıklar:

- `Pratik · Argos Speak 90`
- `Listen · Argos Speak 90`
- `İlerleme · Argos Speak 90`
- `8K Latent Fingerprint Detection Tablet · Device Lab · Argos Speak 90`
- `8K Intro · 8K Latent Fingerprint Detection Tablet · Argos Speak 90`

## 3. Kontrol ve kontrast kapısı

Gerçek Chromium'da oluşturulan ortak kontrol matrisi; default, hover,
disabled, loading ve link/visited renklerini hesaplanmış stillerden doğruladı.
Klavye odağında focus halkası `rgb(143, 79, 56)` olarak, yüzey/canvas offset'i
ile görünür oldu. Bütün kontroller en az `44×44` CSS px'tir; metinli ortak
butonların hesaplanan yüksekliği `46px`, alt navigasyonun yüksekliği `52px`tir.

Kaynakta açıkça tanımlanan default/hover/active çiftlerinin kontrastları:

| Varyant/durum | Kontrast |
|---|---:|
| Primary default / hover / active | 16.69:1 / 9.75:1 / 12.61:1 |
| Secondary default / hover / active | 16.42:1 / 13.39:1 / 12.10:1 |
| Soft default / hover / active | 13.18:1 / 11.60:1 / 10.39:1 |
| Ghost canvas / hover / active | 14.98:1 / 13.39:1 / 12.10:1 |
| Danger default / hover / active | 9.85:1 / 12.56:1 / 14.61:1 |
| Disabled ve loading | 6.14:1 |
| Focus ring / canvas ve surface | 5.64:1 / 6.18:1 |
| Moss kontrol sınırı / surface | 9.59:1 |

Chromium otomasyonu ayrı CLI çağrıları arasında basılı işaretçi durumunu
korumadığı için `active` çiftleri doğrudan tanımlı CSS renklerinden WCAG bağıl
parlaklık formülüyle ölçüldü; diğer durumlar hesaplanmış tarayıcı stilleriyle
eşleştirildi. Link varyantlarında visited renkleri her varyantın görünür normal
rengiyle açıkça sabitlendi.

## 4. Mobil, route ve erişilebilirlik kanıtı

- `/practice` 320×812, 375×812, 768×1024 ve 1280×900 viewport'larında
  `scrollWidth === innerWidth`; beş alt menü öğesi, tek `h1`, benzersiz title ve
  44 px altına düşen kontrol yok.
- 320 px'de alt menü öğeleri yaklaşık `58.4×52` CSS px ve hesaplanan yazı boyutu
  `12px`; görsel ekran kontrolünde ana içerik veya menü kırpılmadı.
- Today, Practice, Listen, Words, Speak, Review, Journal, Device Lab, İlerleme,
  Ayarlar ve yerel rehber 375 px route smoke testinde içerik, title, tek `h1`,
  doğru aktif menü, hata overlay'i olmaması ve yatay reflow açısından geçti.
- Örnek Device Lab cihaz ve modül route'ları 375 px'de benzersiz dinamik title,
  tek `h1`, doğru Device Lab aktif durumu ve sıfır yatay taşma gösterdi.
- Klavye tab sırası marka bağlantısı, pratik CTA'ları ve alt navigasyona ulaşır.
  Hesaplanmış focus halkası semantic focus rengini kullandı; ölçülen hedefler
  `48px`, `46px` ve `52px` yüksekliğindedir.
- Reduced-motion medya tercihi gerçek Chromium'da eşleşti; hesaplanan transition
  ve animation süreleri `0.00001s` oldu.
- Axe 4.12.1 ile WCAG 2 A, AA ve 2.2 AA taraması: 18 pass, 0 incomplete,
  0 violation. Next.js hata overlay'i ve tarayıcı page error kaydı yoktu.

## 5. Doğrulamalar

- `npm run lint` — geçti.
- `npm run build` — geçti; `/practice` dahil 27 sayfalık üretim oluşturma
  adımı tamamlandı ve bütün mevcut görev/Device Lab route'ları manifestte kaldı.
- `git diff --check` — geçti.
- Sabit navigasyon sayısı taraması — tam 5.
- Page metadata + `h1` statik taraması — 14/14 route kapsamda.
- 320/375/768/1280 Chromium reflow ve route smoke matrisi — geçti.
- Klavye focus, target, reduced-motion, hesaplanmış durum renkleri ve axe
  taraması — geçti.

İlk sandbox build denemesi yalnız Google Fonts ağ erişiminde durdu; izinli aynı
build başarıyla tamamlandı.

## 6. Bilinen riskler ve ertelenen işler

- Bu faz shell ve primitive temelidir; Today/Practice görev durumlarını
  yeniden düzenlemek P10A, öğrenme sayfalarını yeniden tasarlamak P10B/P10C,
  İlerleme/Ayarlar yüzeylerini yeniden tasarlamak P10D kapsamındadır.
- Device Lab'in uzun kaynak/claim sunumu ve öğrenci kartı yoğunluğu
  değiştirilmedi; P5'e ertelendi. Yeni cihaz gerçeği veya ürün iddiası eklenmedi.
- TTS provider/runtime, ses kapsamı, kayıt ve Words içeriği değiştirilmedi;
  sırasıyla sonraki ilgili fazlara bırakıldı.
- Görsel ve otomatik erişilebilirlik smoke testi bu ortamda Chromium ile
  çalıştırıldı. Tarayıcılar arası tam regresyon P11 kapanışında yeniden
  yapılmalıdır.
