# Argos Speak 90 Tasarım Planı

**Durum:** Uygulama öncesi tasarım sözleşmesi

**Ürün yönü:** Tek kullanıcı, yerel-öncelikli, mobil ve ses-öncelikli

## 1. Tasarım hedefi

Argos Speak 90 bir yönetim paneli veya içerik kataloğu gibi değil, her açılışta “şimdi ne yapmalıyım?” sorusunu tek bakışta yanıtlayan sakin bir çalışma koçu gibi davranmalıdır.

Tasarım ilkeleri:

1. **Bir ekranda bir ana iş.** Ana CTA tek ve belirgin; ikincil eylemler görsel olarak geride.
2. **Ses birinci sınıf özellik.** İngilizce öğrenme nesnesi aynı, anlaşılır “Dinle” davranışına sahip.
3. **Kısa önce, ayrıntı isteğe bağlı.** Açıklamalar ve kaynak notları kapalı/ikincil.
4. **Yerel ve güvenilir.** İlerleme ile kayıt gizliliği açık; hesap/cloud dili yok.
5. **Mobil başlar, geniş ekrana açılır.** 320 CSS px'de tek sütun; geniş ekranda ölçülü iki sütun.
6. **Erişilebilirlik bileşen özelliğidir.** Kontrast, focus ve dokunma hedefi sonradan yapılan QA değil kabul kapısıdır.

## 2. Bilgi mimarisi

### 2.1 Alt navigasyon

En fazla beş sabit hedef:

| Hedef | İşlev |
|---|---|
| Bugün | Gün /90, ilerleme ve tek sonraki görev |
| Pratik | Listen, Words, Speak, Review, Journal görev seçimi |
| Device Lab | Yalnız yayımlanmış cihaz hap bilgi kartları |
| İlerleme | Yerel gün ve görev özeti |
| Ayarlar | Aktif gün, yedek, ses testi ve mikrofon gizliliği |

Route isimleri fazlarda yeniden değerlendirilebilir; ancak görünür navigasyon bu beş zihinsel modele uymalıdır. Today hızlı akışı kaybetmez. `/stats` İlerleme'nin temeli olur. Login, Account, Admin ve Pilot ana kullanıcı navigasyonundan çıkarılır ve güvenli emeklilik fazında route olarak kaldırılır.

### 2.2 Sayfa hiyerarşisi

Her sayfa:

- benzersiz metadata title,
- tek görünür `h1`,
- en üstte kısa bağlam,
- birincil aksiyon,
- gerektiğinde ilerlemeli açıklama,
- ilgili lokal durum/geri bildirim,
- mobilde sabit alt navigasyonla çakışmayan safe-area boşluğu taşır.

## 3. Görsel sistem

Mevcut sıcak linen/moss paleti ürün kişiliğine uygundur; tamamen atılmamalı, semantic token'lara bağlanmalıdır.

Önerilen token rolleri:

| Token | Başlangıç değeri | Kullanım |
|---|---:|---|
| `--bg-canvas` | `#F7F2EA` | Uygulama arka planı |
| `--bg-surface` | `#FFFDF8` | Kart/yüzey |
| `--text-primary` | `#17201A` | Ana metin |
| `--text-secondary` | `#3F493F` | Yardımcı metin |
| `--action-primary` | `#17201A` | Birincil kontrol |
| `--action-primary-text` | `#FFFFFF` | Birincil kontrol metni |
| `--accent-soft` | `#DCE8D8` | Seçili/yumuşak vurgu |
| `--border-subtle` | `#D9D1C5` | Sınır/ayraç |
| `--danger` | doğrulanmış koyu kırmızı | Silme/hata |
| `--focus-ring` | yüksek kontrastlı ayrı ton | Focus-visible |

Renkler uygulanmadan önce bütün semantic çiftler normal ve bütün etkileşim durumlarında ölçülür. `color: inherit` gibi global kurallar etkileşim bileşeninin kendi rengini geçersiz kılamaz.

### 3.1 Tipografi ve ritim

- Ana gövde en az 16 px; satır yüksekliği 1.5–1.7.
- Öğrenme cümlesi 18–20 px; dinleme/okuma sırasında rahat taranır.
- Etiket 12–14 px olabilir fakat kontrast ve büyük harf yoğunluğu korunur.
- İçerik sütunu yaklaşık 40–44rem ile sınırlı.
- 4/8 px spacing sistemi; kart içi 16–20 px, section arası 24–32 px.
- Uzun gölge ve çoklu dekor yerine border, aralık ve tipografik hiyerarşi.

## 4. Kontrol bileşenleri

### 4.1 Merkezi Button / ButtonLink

Aynı görünüm `<button>` ve `<Link>` için aynı variant sözleşmesini kullanır:

- `primary`: koyu zemin + açık metin,
- `secondary`: açık yüzey + koyu metin + belirgin border,
- `soft`: sage zemin + koyu metin,
- `ghost`: şeffaf + koyu metin; yalnız düşük önemde,
- `danger`: açıkça doğrulanmış danger çifti,
- `icon`: erişilebilir ad ve tooltip/visible label bağlamı.

Durumlar: default, hover, focus-visible, active, disabled, loading. Link varyantında visited renginin görünürlüğü bozmaması garanti edilir. İç span/svg'ler `currentColor` kullanır. Minimum yükseklik 44 px; primary tam genişlik yalnız mobil bağlamda gerektiğinde.

Kabul matrisi:

- metin kontrastı ≥ 4.5:1,
- non-text sınır/focus ≥ 3:1,
- hedef tercih edilen ≥ 44×44 CSS px,
- klavye Enter/Space davranışı semantik öğeye uygun,
- focus ring clipping yok,
- loading metni layout'u zıplatmıyor,
- disabled kontrol yalnız renkle anlatılmıyor.

### 4.2 Ses kontrolü

Ortak `AudioAction` görünümü:

- idle: “Dinle” + play ikonu,
- loading: “Hazırlanıyor…” + progress,
- playing: “Duraklat” + mevcut öğe vurgusu,
- paused: “Devam et”,
- error: kısa hata + “Tekrar dene”.

Sayfada birden fazla ses varsa yalnız biri oynar. Uzun metinde satır/kelime vurgusu yalnız erişilebilir ad ve ekran okuyucu akışını bozmadan sunulur. Ses otomatik başlamaz.

### 4.3 Kayıt kontrolü

Ortak `VoiceRecorder`:

- açıklayıcı “Kaydı başlat” eylemi,
- mikrofon izninin yalnız tıklamadan sonra istenmesi,
- kayıt süresi ve belirgin kayıt durumu,
- durdur, geri dinle, yeniden kaydet, sil,
- desteklenmiyorsa görünür fallback metni,
- session-only gizlilik etiketi.

Kayıt butonu ile oynatma butonu karıştırılmamalıdır. Kırmızı yalnız gerçek kayıt sırasında durum işareti olarak, metinsel durumla birlikte kullanılır.

## 5. Sayfa tasarımları

### 5.1 Bugün

Üstten alta:

1. “Gün 12 / 90” ve sade ilerleme çubuğu.
2. “Sıradaki: Words” tek ana kartı ve CTA.
3. Beş görevin kompakt checklist'i.
4. Yalnız gerektiğinde hata/sync değil, yerel yedek hatırlatması.

Tamamlanan görevler büyük kart olarak kalmaz. Aynı ekranda beş eşit CTA gösterilmez.

### 5.2 Pratik merkezi

Listen, Words, Speak, Review ve Journal iki satırlık kompakt kartlar olarak görünür. Kartta görev adı, yaklaşık süre, gün durumu ve tek CTA bulunur. Ana günlük sıralama Bugün sayfasında korunur.

### 5.3 Listen

- Tek büyük “Dinle” kontrolü.
- Kısa transcript; oynarken satır/kelime vurgusu.
- Yardımcı Türkçe açıklama kapalı.
- Tamamla eylemi ses kontrolünden ayrı.

### 5.4 Words

10 kelime tek uzun listede eşit ağırlıkta gösterilmez:

- ilk grup: 5 aktif kelime,
- ikinci grup: 5 destek/review kelimesi,
- “Sonraki 5” ile progressive reveal,
- kartta kelime, kısa anlam, örnek ve tek ses kontrolü,
- üstte gün sayacı `0/10`, grup değil gerçek tamamlanma anlamı.

### 5.5 Speak ve Review

Her görevde:

1. kısa İngilizce prompt ve Dinle,
2. tek cevap/kayıt alanı,
3. geri dinle ve ikinci deneme,
4. isteğe bağlı not,
5. tamamla.

Birinci/ikinci/review/journal alanlarının aynı anda dört büyük textarea olarak açılması engellenir. AI skor veya model cevap yoktur.

### 5.6 Journal

Tek prompt, tek kısa textarea, autosave durumu ve tamamla. Önceki günlükler yalnız isteğe bağlı özet olarak açılır.

### 5.7 İlerleme

`/stats` temeli korunur:

- aktif gün,
- tamamlanan günlük görevler,
- son yedi günün sade özeti,
- Device Lab yerel tamamlanma sayısı,
- “Bu cihazda saklanıyor” açıklaması,
- dışa aktar düğmesi.

Streak, skor veya rekabetçi rozet zorunlu değildir.

### 5.8 Ayarlar

Üç kompakt bölüm:

- Program: aktif gün.
- Veriler: JSON dışa aktar/içe aktar ve reset.
- Ses ve gizlilik: TTS health testi, mikrofon desteği, session-only kayıt açıklaması.

Login, hesap, ekip, admin ve cloud sync yüzeyi bulunmaz.

## 6. Device Lab yeni sözleşmesi

### 6.1 Landing

Yalnız “ready/released” ve kaynak destekli cihazlar görünür. Kart:

- cihaz adı,
- bir satır Türkçe bağlam veya kategori,
- tek İngilizce tanıtım cümlesi,
- modül sayısı/yerel durum,
- okunur “Cihazı aç” CTA'sı.

Source strength, blocked count, claim-control ve admin release etiketi ana kartta gösterilmez. Hazır olmayan cihazlar ayrı geliştirici backlog'unda kalır.

### 6.2 Modül

Tek mobil modül ideal olarak 3–5 ekranı geçmez:

1. ad + bir cümlelik İngilizce intro,
2. “3 quick facts” — her biri ayrı dinlenebilir,
3. “Key words” — en çok 5 kısa öğe,
4. “Say it” — bir kısa prompt, dinle ve kayıt,
5. isteğe bağlı bir not,
6. tamamla ve sonraki modül.

Türkçe yardım disclosure içinde kalır. Kaynak notları varsayılan kapalıdır. Admin coaching ve blocked claims öğrenci akışında yer almaz.

### 6.3 İçerik kartı veri sözleşmesi

Her hap bilgi:

- sabit id,
- kısa İngilizce metin,
- isteğe bağlı kısa Türkçe destek,
- kaynak claim id'si,
- yayın durumu,
- TTS için normalize metin,
- kaynaksızsa `blocked` ve öğrenci yüzeyinden hariç.

Yeni cihaz gerçeği tasarım sırasında üretilmez. Mevcut kaynak sahipliği korunur.

## 7. Mobile-first ve erişilebilirlik kapısı

Her route için en az:

- 320 CSS px reflow,
- 375×812 birincil mobil,
- 768 px tablet,
- geniş desktop,
- %200 zoom,
- klavye tab sırası,
- visible focus,
- route değişiminde benzersiz title + `h1`,
- screen reader erişilebilir ad denetimi,
- reduced motion,
- light mode kontrast matrisi.

Bottom navigation sticky ise içerik safe-area ve bar yüksekliği kadar alt boşluk alır. İki boyutlu kaydırma yalnız doğal olarak gerekli özel bileşende olabilir; ana sayfa yatay kaymaz.

## 8. Tasarım uygulama sırası

1. Buton/link kontrast acil düzeltmesi.
2. Semantic token ve kontrol bileşenleri.
3. Shell, metadata ve beş hedefli navigation.
4. Device Lab kısa kart sözleşmesi.
5. Ortak AudioAction ve TTS state sistemi.
6. VoiceRecorder progressive enhancement.
7. Words 5+5 sunumu.
8. Today/Practice/öğrenme route grupları.
9. İlerleme/Ayarlar.
10. Uçtan uca görsel ve erişilebilirlik regresyonu.

Kesin uygulama sınırları ve faz durumları `docs/ARGOS_SPEAK_90_PHASE_PLAN.md` içindedir. Bu belge tek başına kod değişikliği yetkisi vermez.
