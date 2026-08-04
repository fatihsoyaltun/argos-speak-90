# AGENTS.md — Argos Speak 90 çalışma kuralları

Bu dosya depo genelindeki kalıcı çalışma sözleşmesidir. Daha yakın bir klasörde başka bir `AGENTS.md` yoksa bütün dosyalar için geçerlidir.

## 1. Ürün yönü

Argos Speak 90, tek kişinin kullandığı, 90 günlük, yerel-öncelikli bir İngilizce çalışma uygulamasıdır. Hedef; her gün kısa ve sakin bir akışta dinleme, kelime, konuşma, tekrar ve günlük çalışması sunmak; Device Lab'de cihazları kaynak destekli, kısa İngilizce “hap bilgiler” ile tanıtmaktır.

Yeni hedef mimari:

- tek kullanıcı ve yerel ilerleme,
- basit bir İlerleme ekranı,
- mobil öncelikli ve erişilebilir arayüz,
- İngilizce öğrenme içeriğinde güvenilir, kullanıcı tarafından başlatılan ses,
- desteklenen tarayıcılarda yerel ses kaydı ve geri dinleme,
- 90 günlük program ve gün kimliklerinin korunması.

Eski çok kullanıcılı Auth/Admin/Supabase/cloud-sync yönü artık ürün hedefi değildir. Bunları bir kerede silmek yasaktır; veri güvenliği ve bağımlılık sırası `docs/ARGOS_SPEAK_90_PHASE_PLAN.md` içindeki fazlarla yönetilir.

## 2. Kanonik plan ve tek-faz çalışma kuralı

Uygulama değişikliklerinde önce şunları oku:

1. bu dosya,
2. `docs/ARGOS_SPEAK_90_PHASE_PLAN.md`,
3. fazın işaret ettiği araştırma, tasarım ve özet belgeleri.

Bir görevde yalnızca faz planında `Durum: Sıradaki` olan tek faz uygulanır. Birden fazla `Sıradaki` faz varsa, hiç yoksa veya önkoşul tamamlanmamışsa kod değiştirme; çelişkiyi raporla ve dur. Faz tamamlanınca doğrulama sonuçlarını yaz, yalnızca o fazı `Tamamlandı` yap ve bir sonraki uygun fazı `Sıradaki` olarak işaretle. Sonraki fazı aynı görevde başlatma.

Her fazda:

- başlangıçta `git status` kontrol et,
- kirli çalışma ağacında kullanıcı değişikliklerini koru,
- fazın izin listesi dışına çıkma,
- fazın “Yapılmayacaklar” bölümünü uygula,
- ilgili kabul ölçütlerini ve doğrulamaları tamamla,
- otomatik commit veya push yapma,
- sonucu, değişen dosyaları, testleri, riskleri ve ertelenen işleri raporla; sonra dur.

## 3. Değişmezler

- Günler `1..90` aralığında kalır; gün kimlikleri ve mevcut yerel ilerleme anahtarları plansız değiştirilmez.
- `sources/`, kaynak kitaplar ve çıkarım dosyaları salt okunurdur. Düzenleme, taşıma veya yeniden adlandırma yapılmaz.
- Ana 90 günlük müfredat ile Device Lab ayrı içerik alanlarıdır. Device Lab ana gün programını sessizce değiştiremez.
- Device Lab'e kaynaksız cihaz gerçeği, model cevabı veya sahte modül eklenmez. Engellenmiş iddialar kullanıcıya gerçekmiş gibi gösterilmez.
- TTS anahtarları ve sağlayıcı sırları yalnızca sunucuda kalır. İstemciye anahtar, gizli URL veya hassas hata ayrıntısı gönderilmez.
- Ses otomatik başlamaz. Oynatma açık kullanıcı eylemiyle başlar ve başarısızlık/retry durumu görünür olur.
- Mikrofon izni otomatik istenmez. Kayıt varsayılan olarak yalnızca oturum belleğinde tutulur; buluta yüklenmez, puanlanmaz, yazıya dökülmez.
- Ses Blob'ları `localStorage` içine yazılmaz. Kalıcı kayıt daha sonra istenirse IndexedDB, saklama süresi, kota ve silme politikası ayrı fazda tasarlanır.
- AI değerlendirme, telaffuz puanı, konuşma transkripsiyonu veya admin takibi açıkça planlanmış yeni bir faz olmadan eklenmez.
- Toplu bağımlılık yükseltmesi, `npm audit fix --force`, genel formatlama veya faz dışı refactor yapılmaz.

## 4. Yerel ilerleme ve tek kullanıcı geçişi

Mevcut `argos-practice-progress`, `argos-active-day` ve Device Lab yerel kayıtları kullanıcı verisidir. Auth/Admin/cloud kaldırılırken:

- önce mevcut veriyi dışa aktarma ve geri alma yolu doğrulanır,
- olası son cloud verisinin kaybı riski açıkça ele alınır,
- yerel anahtarlar, gün numaraları ve tamamlanma anlamı korunur,
- `/stats` temelli basit İlerleme ekranı korunur,
- önce tüketici arayüzleri, sonra route/server kodu, en son bağımlılık ve ortam değişkenleri kaldırılır,
- her alt adımda artık import, route ve metin taraması yapılır.

Supabase şeması değiştirilmez. Kullanıcının olası uzak verisi için güvenli geçiş kapısı doğrulanmadan Auth/Admin/cloud kodu silinmez.

## 5. Erişilebilirlik ve buton kapısı

Yeni veya değişen her etkileşimli öğe için:

- yazı ve arka plan rengi kontrolün kendi varyantında açıkça tanımlanır,
- global `a`, `button` veya kalıtım kuralı utility rengini geçersiz kılamaz,
- normal, hover, focus-visible, active, disabled, loading ve visited durumları gerçek tarayıcıdaki hesaplanmış stillerle denetlenir,
- normal metinde en az 4.5:1, büyük metinde en az 3:1 kontrast hedeflenir,
- odak göstergesi görünür ve yalnız renge bağlı olmayan bir değişim sunar,
- dokunma hedefi tercih edilen olarak en az 44×44 CSS px; hiçbir durumda WCAG 2.2 AA'nın 24×24 CSS px alt sınırının altına düşmez,
- 320 CSS px genişlikte yatay kaydırma olmadan reflow sağlanır,
- ikon butonlarında erişilebilir ad bulunur,
- hareket, `prefers-reduced-motion` ile azaltılabilir.

Tekrarlanan CTA'lar merkezi `Button`/`ButtonLink` varyantlarıyla çözülür. Dağınık `!important` sınıfları kalıcı tasarım çözümü sayılmaz.

## 6. Ses ve kayıt kuralları

“Her şeyi sesli duyma” kapsamı İngilizce öğrenme nesneleridir: dinleme metni ve satırları, kelime ve örnekleri, konuşma hedefleri, tekrar içeriği ve yayımlanmış Device Lab başlık/hap bilgi/kelime/prompt'ları. Navigasyon ve ayar metinlerinin tamamını seslendirmek hedef değildir.

TTS bileşenleri ortak durum makinesi kullanır: `idle`, `loading`, `playing`, `paused`, `error`. `HTMLMediaElement.play()` sonucu beklenir; autoplay/izin hatası kullanıcıya anlaşılır biçimde gösterilir. İstek iptali, tekrar eden isteklerin birleştirilmesi, nesne URL temizliği, sınırlı cache ve sağlayıcı maliyet sınırları test edilir. Mevcut kelime vurgulama davranışı, streaming değişikliğinde kanıt olmadan kaldırılmaz.

Kayıt özelliği progressive enhancement'dır. `navigator.mediaDevices`, `MediaRecorder` ve MIME desteği özellik kontrolüyle kullanılır. Kayıt durduğunda veya bileşen kapandığında tüm medya track'leri durdurulur ve nesne URL'leri serbest bırakılır. Desteklenmeyen tarayıcıda görev metin/tabanlı akışla tamamlanabilir kalır.

## 7. Device Lab içerik ve arayüz sözleşmesi

Öğrenci yüzeyindeki her yayımlanmış Device Lab kartı kısa olmalıdır:

- ürün/cihaz adı,
- tek cümlelik İngilizce tanıtım,
- en çok üç kaynak destekli İngilizce hap bilgi,
- kısa kelime listesi,
- bir dinle eylemi,
- bir kısa konuşma/okuma görevi,
- isteğe bağlı Türkçe yardım,
- yerel tamamlanma durumu.

Kaynaklar, claim-control, blocked claims ve kanıt etiketleri veride ve QA sürecinde korunur; ana öğrenme akışını kaplayan eşit ağırlıklı paneller olmaz. Gerekirse kapalı “Kaynak notları” alanında veya geliştirici belgesinde gösterilir. `Admin coaching` öğrenci yüzeyine taşınmaz. Ertelenmiş cihazlar kaynak destekli kartları hazır olmadan yayımlanmaz.

## 8. Words ve 90 günlük runtime

Words sayısı 10'a çıkarılacağı fazda:

- tam 90 gün ve her gün tam 10 öğe doğrulanır,
- gün içi tekrar, boş alan, geçersiz gün ve sonsuz doldurma döngüsü test edilir,
- yoğunluğu azaltmak için 10 öğe eşit ağırlıklı yeni kelime gibi sunulmaz; faz planındaki aktif + destek/review ayrımı uygulanır,
- mevcut ilerleme kaydı resetlenmez,
- UI sayaçları, doğrulayıcılar, testler ve belgeler aynı fazda güncellenir.

## 9. Doğrulama tabanı

Yalnız belge/yönetişim fazı:

- `git diff --check`,
- değişen dosya kapsamı kontrolü.

Uygulama fazı:

- `npm run lint`,
- `npm run build`,
- `git diff --check`,
- değişen akışların en az 375×812 ve 320 CSS px mobil tarayıcı kontrolü,
- klavye/focus kontrolü,
- ilgili veri/route/import taraması.

TTS fazlarında gerçek ses baytı, süre, oynatma, hata/retry ve mobil kullanıcı eylemi testi gerekir. Kayıt fazlarında Chromium, Firefox ve Safari/iOS için destek veya açık fallback matrisi raporlanır. Build başarısı tek başına ses doğrulaması değildir.

## 10. Planlama fazı sınırı

`PLAN-0` yalnızca `AGENTS.md` ve `docs/ARGOS_SPEAK_90_*.md` yönetişim belgelerini değiştirebilir. Uygulama kodu, route, içerik, Auth/Admin, TTS, storage, paketler veya şema bu fazda değiştirilemez.
