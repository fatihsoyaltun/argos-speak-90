# Argos Speak 90 Stratejik Audit ve Optimizasyon Raporu

**Audit tarihi:** 3 Ağustos 2026

**Hedef bağlamı:** Ocak 2027 Hollanda iş görevi

**Kapsam:** Mevcut İngilizce programı, çalışma zamanı yapısı, ilerleme ve senkronizasyon modeli ile kaynak kontrollü ForenScope cihaz eğitiminin birlikte değerlendirilmesi

> Bu çalışma bir içerik ve teknik durum auditidir; uygulama kodu, mevcut curriculum, UI, Supabase/Auth/Admin/cloud sync mantığı, sourcebook veya extraction dosyaları değiştirilmemiştir. Güncel web ya da akademik veri tabanı taraması yapılmamıştır. Metodoloji değerlendirmesi genel kabul gören dil öğrenme ilkelerine, erişilebilen repo belgelerine ve uygulama davranışına dayanır; güncel bir akademik etki büyüklüğü veya yeni literatür doğrulaması iddia etmez.

## 1. Yönetici Özeti

Argos Speak 90 bugün içerik bütünlüğü doğrulanmış, mobil ve yerel öncelikli, günlük üretimi merkeze alan bir erken pilot ürünüdür. Çalışma zamanı verisinde 90 günün tamamı için Listen, Words, Speak ve Review içeriği vardır; her gün sekiz kelime/ifade ve en az bir üretim odaklı review görevi bulunur. İçerik ilerlemesi A1 temelden A2+/erken B1 yönelimli görevlere doğru kurulmuştur. Bu, ölçülmüş bir kullanıcı seviyesinin veya program sonunda garanti edilen B1'in kanıtı değildir.

Ocak 2027 hedefi için program uygun bir ana omurgadır fakat tek başına yeterli kanıt üretmez. Genel İngilizceyi 90 gün boyunca koruyup sonraki 30–60 günde iş senaryoları, soru-cevap ve kaynak kontrollü cihaz anlatımıyla genişletmek daha gerçekçidir. Device Lab ana programın yerine geçmemeli; haftada iki veya üç kısa profesyonel oturumdan oluşan paralel bir hat olmalıdır.

En güçlü taraflar şunlardır:

- Net günlük akış, düşük karar yükü ve mobil öncelikli sunum.
- Her gün konuşma üretimi, first try/second try döngüsü ve kişisel cevap alanları.
- 90 günlük verinin çalışma zamanı exportları üzerinden doğrulanmış olması.
- Yerel öncelikli ilerleme, JSON dışa/içe aktarma ve isteğe bağlı bulut senkronizasyonu.
- Cihaz kaynaklarında ürün sınırı, kanıt seviyesi, safety gate ve blocked claim yaklaşımının kurulmuş olması.

En büyük riskler şunlardır:

1. Açık uçlu üretim cevapları hâlâ model cümle içerip içermediğine göre mekanik biçimde değerlendirilebildiği için doğru kişisel cevaplar yanlış geri bildirim alabilir.
2. Tamamlama metriği konuşma kalitesi, süre, anlaşılırlık veya iyileşmeyi kanıtlamaz; ses kaydı, pronunciation değerlendirmesi ve öğretmen puanı yoktur.
3. Mevcut günlük kartta belirtilen kısa süre, Ocak 2027'ye kadar pratik iş İngilizcesini en üst düzeye çıkarma hedefi için tek başına yetersiz kalabilir.
4. Device Lab mevcut büyük içerik dosyalarına, alt gezinmeye veya tek parça ilerleme JSON'una doğrudan eklenirse bakım ve mobil yoğunluk sorunu yaratır.
5. Sunum kaynakları operator manual, tam safety guide, validation report veya certification record değildir; cihaz eğitiminde yanlış atıf ve pazarlama iddiası riski yüksektir.

En mantıklı sonraki adım, bu auditin insan tarafından gözden geçirilmesinden sonra önce yüksek öncelikli veri kalite kusurlarını ayrı bir fazda ele almak, ardından Device-6'da yalnızca statik veri modeli ve 2–3 kaynak kontrollü modül tanımlamaktır. İlk sürümde geniş cihaz kataloğu, otomatik öneri, safety eğitimi veya bulut ilerlemesi yapılmamalıdır.

## 2. Hedef Analizi

### 2.1 Ocak 2027 hedefi ile uyum

3 Ağustos 2026'dan Ocak 2027'nin başına yaklaşık beş aylık bir pencere vardır. Bu süre, düzenli uygulamayla pratik iletişim kapasitesini belirgin biçimde geliştirmek için kullanılabilir; ancak başlangıç seviyesi, gerçek çalışma süresi, canlı konuşma fırsatı ve geri bildirim kalitesi bilinmeden belirli bir CEFR sonucu garanti edilemez.

Mevcut 90 günlük plan hedefe şu yollarla hizmet eder:

- Günlük yaşam, iş, planlama, clarification, problem açıklama, görüş bildirme ve follow-up dili oluşturur.
- Kısa üretimden daha uzun ve gerekçeli üretime doğru ilerler.
- First try ve second try ile aynı mesajı daha açık söyleme alışkanlığı kazandırır.
- 48, 57, 64, 70, 71, 80, 85 ve 88. günlerde sınırlı 8K mikro bağlamı içerir.
- Milestone günlerinde zayıf nokta ve sonraki speaking goal üzerine öz değerlendirme ister.

Şu ihtiyaçları ise tek başına karşılamaz:

- Hollanda'daki iş görevinin özel toplantı, seyahat, saha kurulumu, müşteri itirazı ve teknik demo repertuvarı.
- Canlı karşı tarafın beklenmedik sorularına ölçülmüş yanıt verme becerisi.
- Telaffuz, akıcılık, doğruluk ve teknik claim-control için güvenilir dış değerlendirme.
- ForenScope ürün ailesinin cihaz bazında güvenli, ayrıştırılmış ve sürdürülür öğretimi.

### 2.2 Device Lab neden gerekli?

Genel İngilizce, kullanıcının cümle kurma, soru sorma, onarma, açıklama ve etkileşim altyapısını geliştirir. Cihaz sunumu ise ayrı bir mesleki görev alanıdır: ürün adı, component, imaging vocabulary, safe attribution, demonstration framing, reporting language ve blocked claim yönetimi gerektirir. Device Lab bu alanı tek yerde kaynak kontrollü tutarak curriculum içinde cihaz broşürü oluşmasını ve bir ürünün özelliğinin diğerine taşınmasını önleyebilir.

Device Lab'in amacı cihaz ezberletmek değil, kullanıcının şu iletişim görevlerini güvenli biçimde yapmasına yardım etmektir:

- Cihazı kısa ve kontrollü tanıtmak.
- Kaynakta açıkça bulunan component ve capability dilini açıklamak.
- Bir presentation demonstration örneğini validation sonucu gibi sunmamak.
- Bilinmeyen veya doğrulanmamış konuda sınır koymak.
- Safety ve integration sorularında belge eksikliğini dürüstçe söylemek.

### 2.3 Genel İngilizce ile cihaz İngilizcesinin ayrımı

| Hat | Ana amaç | Önerilen sıklık | İlerleme ölçütü |
|---|---|---:|---|
| Ana 90 günlük yol | Günlük ve iş İngilizcesinde otomatikleşme, anlaşılır üretim, clarification ve interaction | Haftada 5–6 gün | Süreklilik, first/second try farkı, görev tamamlama ve koç örneklemesi |
| Device Lab | Kaynak kontrollü ürün tanıtımı, demo, reporting ve customer Q&A | Başlangıçta haftada 2 kısa oturum; sonra 2–3 | Claim doğruluğu, cihaz atfı, caveat kullanımı ve sözlü görev başarısı |
| Canlı prova | Beklenmedik soru, repair strategy ve konuşma baskısı | Haftada en az 1 | Kayıt/koç rubric'i veya yapılandırılmış öz değerlendirme |

Cihaz kelimeleri ana kelime listesini erken dönemde istila etmemelidir. Önce temel cümle iskeletleri ve konuşma alışkanlığı kurulmalı; cihaz içeriği 15–30. günler arasında çok düşük dozda tanışma, 31. günden sonra düzenli paralel görev biçiminde eklenmelidir.

## 3. Data Quality Audit

| Alan | Mevcut durum | Risk | Önerilen iyileştirme | Öncelik |
|---|---|---|---|---|
| Vocabulary lists | 90 gün için günde tam sekiz öğe vardır; örnek cümleler, Türkçe kısa anlam ve yaklaşık telaffuz desteği sunulur. Tema eşleştirme ve speaking booster mekanizması kullanılır. | Eski auditte tekrarlayan genel booster ifadeleri saptanmıştır. Onarım temayı güçlendirse de mekanik dönüşüm, anlamsal tekrar ve aynı işlevi taşıyan öğe yoğunluğu örneklemle yeniden kontrol edilmelidir. Sekiz yeni öğenin tamamını etkin üretime taşımak her gün gerçekçi olmayabilir. | Sekiz öğeyi “4 ana üretim + 4 tanıma/tekrar” olarak pedagojik role ayır; haftalık benzersiz öğe, tekrar aralığı ve aktif kullanım oranı auditini otomatikleştir; cihaz terimlerini ayrı havuzda tut. | High |
| Listening drills | 90 gün mevcuttur; kısa doğal metin, key lines, Türkçe görev ve yazılı output bulunur. TTS oynatma ve takip desteği vardır; ileri günlerde istenen üretim ölçeklenir. | TTS tek başına gerçek konuşmadaki aksan, hız, üst üste konuşma ve bozuk akustik koşulları temsil etmez. Metinlerin çoğu anlaşılır fakat kontrollüdür. Dinleme sonrası yazı, doğrudan sözlü tepkiyi ölçmez. | Mevcut içerik değiştirilmeden ileride hız/aksan varyantı, gist/detail ayrımı, kısa sözlü retell ve shadowing turu eklenmesini planla; her yeni ses kaynağında lisans ve kaynak kontrolü uygula. | High |
| Speaking prompts | Her gün prompt, target lines, mini goal, first try, second try ve self-check vardır. Onarım sonrası gün 15–90 görevleri daha çeşitli ve daha uzundur. | Uygulama ses kaydetmez; yazılan first/second try konuşmanın gerçekleştiğini kanıtlamaz. First try boş bırakılıp yalnız second try ile Speak tamamlanabilir. Self-check durumu kalıcı değildir. | Önce veri politikasını belirle; basit süre/kayıt kanıtı veya koç rubric'i için ayrı faz planla. Tamamlama ile kaliteyi ayrı metrik yap; first try ve second try farkını saklanabilir değerlendirme alanına dönüştür. | High |
| Review exercises | Her gün en az bir kişisel üretim öğesi eklenmiştir; recall, fill blank ve short answer karışımı vardır. | Açık uçlu cevap, normalize edilmiş model cevabı aynen içeriyorsa “doğru” sayılır. Kişisel ve geçerli alternatifler haksız biçimde “tekrar” alabilir; kullanıcı model cümleyi kopyalayarak başarı gösterebilir. | Kapalı ve açık görevleri ayır. Açık görevde otomatik doğru/yanlış verme; checklist, örnek cevap ve koç/öz değerlendirme kullan. Exact answer yalnız gerçekten tek cevaplı öğelerde kalsın. | High |
| Journal prompts | Günlük not, zorlanılan bölüm ve yarın tekrar edilecek konu saklanır; tüm günlük yazılı cevaplar tek ekranda görülebilir. | “Yarın tekrar” notu ertesi gün otomatik göreve dönüşmez. Journal bilgi depolar fakat retrieval döngüsünü kapatmaz. Her tuşta kaydetme, uzun vadede tek parça store üzerinde gereksiz yazma oluşturabilir. | Sonraki fazda nottan ertesi güne pasif reminder üret; otomatik içerik yazma. Haftalık koç review şablonu ve seçilmiş weak-point kuyruğu tasarla. | Medium |
| Günlük iş yükü | Today ekranı kısa ve anlaşılır bir dört modüllü akış sunar; Journal ayrı sayfadır. | “12 min session” beklentisi Words, Listen, iki konuşma denemesi ve Review için yüzeysel tamamlama teşvik edebilir. Device Lab aynı güne zorunlu eklenirse yük artar. | Ana akışı 25–35 dakikalık çekirdek ve 10–15 dakikalık opsiyonel Device Lab olarak planla; yoğun günlerde minimum viable practice tanımla. Süreyi pilot verisiyle doğrula. | High |
| Assessment/rubric | Otomatik grammar/pronunciation iddiası yoktur; 1–3 öz değerlendirme açıklaması ve admin tarafından yazılı cevap inceleme imkânı vardır. | Kullanıcı veya admin, completion yüzdesini proficiency sanabilir. Speaking rubric sonucu kalıcı ve karşılaştırılabilir değildir. | Dashboard dilinde “tamamlama” ile “beceri kanıtı”nı kesin ayır. Haftalık 1 kayıt veya canlı demo için basit dört boyutlu rubric planla: anlaşılırlık, görev tamlığı, akış, claim-control. | High |
| Repetition sistemi | Günlük review, hedef ifadelerin farklı modüllerde yeniden kullanımı ve milestone günleri vardır. | Adaptif spaced repetition veya kişinin hatasına göre planlanan retrieval kuyruğu yoktur; aynı gün içindeki tekrar uzun dönem hatırlamayı garanti etmez. | Sabit ve anlaşılır tekrar pencereleri öner: aynı gün, +1, +3, +7, +14. Önce statik kural ve kullanıcı işaretlemesiyle pilot et; karmaşık algoritmayla başlamama. | Medium |
| 8K mevcut mikro içerik | Geç ileri günlerde contactless workflow, archive, stamp/geotag ve reporting gibi kontrollü mikro bağlamlar vardır. | Mevcut metnin, Device Source Index'teki daha yeni conflict ve evidence gate kurallarıyla satır bazında tekrar eşleştirildiğine dair bu auditte yeni bir otomatik doğrulama yoktur. Cihaz dili genel programın sonucu gibi algılanabilir. | Yeni cihaz içeriği eklemeden önce mevcut sekiz mikro bağlam için claim ID/source reference kontrolü yap; source-owned Device Lab'e taşınma stratejisini daha sonra değerlendir. | High |
| Device source documents | Beş cihaz grubu, katalog özeti, 8K sourcebook, reconciliation ve source index vardır. Kanıt seviyeleri ve ürün sınırları açıkça yönetilir. | Ana kaynaklar üretici sunumlarıdır; operator procedure, safety, validation, certification ve bazı model atıfları eksiktir. “verified technical fact” bağımsız laboratuvar doğrulaması anlamına gelmez. | Source index'i tek kontrol girişi yap; her learner claim için ürün scope, evidence label, slide/source, safety state, release state ve missing dependency zorunlu olsun. | High |
| Device Lab planning docs | Intake, index ve architecture planları hazırdır; deny-by-default safety ve source ownership yaklaşımı güçlüdür. | Tasarım belgelerinin kapsamı geniştir. Hepsi bir anda uygulanırsa 8K merkezli model, route/UI yoğunluğu ve erken cloud şeması oluşabilir. | Device-6'yı yalnız statik model ve 2–3 kontrollü modülle sınırla. Deferred/blocked içerik learner-facing olmamalı. UI, progress ve cloud ayrı fazlarda kalmalı. | High |
| High-Tech catalog extraction | Cihaz envanteri ve 8K/Contactless LITE çakışmalarını bulmak için yararlı kısa bir cross-reference vardır. | Kaydedilmiş dosya, sözünü ettiği tam bölümleri ve “§10”u içermeyen kısa bir özettir. Catalog-level ifadeler otomatik olarak device fact sayılamaz. | Tam yapılandırılmış extraction istenene kadar yalnız naming/conflict discovery için kullan; learner content kaynağı yapma. | High |
| Bağımsız `data/` alanı | Repo içinde `data/` klasörü bulunmamaktadır; içerik büyük `lib/*.ts` dosyalarında tutulur. | Device Lab verisi de aynı yapıya eklenirse dosya boyutu, bağımlılık ve review yüzeyi büyür; curriculum ve source-controlled device data sınırı bulanıklaşır. | Device-6'da ayrı, statik ve typed bir cihaz veri sınırı tasarla; mevcut curriculum dosyalarına dokunma. Klasör adı ve konumu faz tasarımında kararlaştırılsın. | Medium |

### Veri kalitesi sonucu

İngilizce edinimine en çok katkı sağlayan parçalar günlük sesli üretim talebi, first/second try, tematik listening-to-output geçişi, kişisel cümle üretimi ve repair/clarification senaryolarıdır. Yalnız bilgi sunan ama tek başına konuşma kazandırmayan parçalar target-line listeleri, cihaz spec tabloları ve sunum yüzeyi envanterleridir. Bunlar mutlaka retell, comparison, customer Q&A veya reporting göreviyle eşleştirilmelidir.

Program tamamen ezbere dayalı değildir; açık üretim belirgin biçimde vardır. Bununla birlikte exact/model-answer kontrolü ve target line görünürlüğü, özellikle hızlı tamamlamak isteyen kullanıcıyı kopyalamaya çekebilir. İyileştirme yönü daha fazla içerik eklemek değil, gerçek retrieval ile kişisel üretimin değerlendirme mantığını birbirinden ayırmaktır.

## 4. Code Review / Technical Review

### 4.1 Genel teknik görünüm

Uygulama Next.js App Router yapısında ince route bileşenleri ve daha büyük practice bileşenleri kullanır. Mevcut route'lar ana öğrenme akışı, Journal, Stats, Settings, Pilot, Login, Account ve Admin alanlarını kapsar. `/device-lab` yoktur; bu auditte oluşturulmamıştır. Mobil çerçeve, merkezi `AppShell`, sabit alt gezinme ve tekrar kullanılan UI parçalarıyla tutarlıdır.

Yerel ilerleme bir sürümlü JSON store içinde 90 gün bazında saklanır. Bulut özellikleri opsiyoneldir ve manuel push/pull/sync akışı kullanır. Admin alanı aynı team kapsamındaki senkronize yazılı verileri koçluk amacıyla gösterir. TTS istemci/API hattı hata sınıflandırması, durum kontrolü, istek birleştirme ve bellek içi ses cache'i içerir.

### 4.2 Teknik bulgular

| Dosya/alan | Gözlem | Risk | Öneri | Değiştirme aciliyeti |
|---|---|---|---|---|
| `components/review-practice.tsx` | Cevap normalize edildikten sonra model cevapla eşitlik veya model cevabı içerme kontrolü yapılır. Bu mantık short answer için de kullanılır. | Doğru kişisel cevap yanlış, model cümleyi kopyalayan cevap doğru görünebilir. Öğrenme geri bildiriminin güvenilirliği etkilenir. | Görev türüne göre evaluator ayır; açık üretimi otomatik doğru/yanlış yerine self/coach review olarak işaretle. | Kritik |
| `components/speaking-practice.tsx` | First ve second try metin olarak yerelde saklanır; self-check yalnız component state'indedir. Second try doluysa görev tamamlanabilir. | Sesli üretim, first try ve iyileşme kanıtlanmaz; boş first try ile completion mümkündür. | Completion ve proficiency kanıtını ayır; ileride first try şartı, kalıcı self-check/rating ve açık rıza ile kayıt opsiyonu tasarla. | Kritik |
| `lib/practice-storage.ts` | Sürüm 1, tüm günleri tek localStorage JSON'u içinde tutar; alan değişimlerinde store okunup yazılır. Import sanitize edilir ve yerel-first yaklaşım nettir. | Device Lab progress eklendiğinde tek parça store büyür, şema migration ve yazma yoğunluğu riski artar. Tarayıcı verisi silinirse manuel/cloud yedek yoksa kayıp olur. | Device Lab için ayrı namespace ve schema version planla; migration testleri, boyut sınırı ve debounce düşün. Mevcut store'u Device-6'da değiştirme. | High |
| `lib/supabase/progress-sync.ts` | Manuel sync, günün `updatedAt` değerine göre yerel veya cloud gün nesnesini seçer; day/practice/review tablolarına upsert yapar. | Aynı gün iki cihazda farklı alanlar değişirse daha yeni bütün gün eski cihazdaki diğer alanı ezebilir. Yerelde kaldırılan review kayıtları cloud'da ayrıca silinmez. | Device-9 öncesi alan bazlı merge/tombstone ve eşzamanlı düzenleme senaryosu tanımla. Device Lab sync'i mevcut merge'e doğrudan bağlama. | High |
| `components/cloud-sync-panel.tsx` | Yerel öncelikli, kullanıcı kontrollü push/pull/sync ve anlaşılır durum mesajları vardır. | Manuel sync unutulursa admin görünümü güncel değildir; “synced” ifadesi öğrenme kalitesi değil veri durumu gösterir. | UI dilinde son cihaz değişikliği, son cloud sync ve conflict durumunu ayır; Device-9'a kadar cihaz ilerlemesi ekleme. | Medium |
| `lib/admin/server.ts`, `app/admin/**` | Admin rolü ve team filtresiyle özet/detay alınır; yazılı practice ve review görüntülenir. Sorgular aynı team'i kod düzeyinde sınırlar. | Güvenlik RLS politikalarının doğru kurulmasına da bağlıdır; bu audit veritabanı politikalarını canlı ortamda doğrulamaz. Admin yalnız senkronize metni görür, konuşma kalitesini göremez. | RLS için ayrı entegrasyon testi; admin metriklerinde “yazılı/senkronize kanıt” etiketi; Device-9'da en az veri ilkesi ve saklama politikası. | High |
| `app/api/tts/route.ts` | ElevenLabs proxy'si metin sınırı ve yapılandırılmış hata yanıtı uygular; yanıtlar `no-store`dur. Route düzeyinde auth veya rate-limit görülmemiştir. | Herkese açık dağıtımda kötüye kullanım, kota ve maliyet riski doğabilir. | Dağıtımdan önce oran sınırlama, abuse kontrolü, input quota ve izleme yaklaşımı belirle; anahtar yalnız sunucuda kalmaya devam etsin. | High |
| `lib/tts/audio-cache.ts` | Aynı istekleri birleştiren bellek içi `Map` ve object URL cache'i vardır; `lastUsed` tutulur. Otomatik boyut/TTL tahliyesi yoktur. | Uzun oturumda çok sayıda benzersiz metin object URL belleğini artırabilir; cache sayfa yenilenince kaybolur. | Maksimum entry/byte veya LRU/TTL tahliyesi eklenmesini ayrı teknik fazda değerlendir; ölçmeden kalıcı cache ekleme. | Medium |
| `lib/content-plan.ts` | `firstFourteenDayPlan` adı tüm `learningTrackPlan` dizisine alias edilmiştir. | İsim davranışı yanlış anlatır; ileride yalnız ilk 14 gün bekleyen kod hatalı sonuç alabilir. | Alias'ı gerçek ilk 14 günlük slice veya doğru adla düzeltmek için küçük ayrı bakım işi aç; bu auditte değiştirme. | Medium |
| `lib/*-content.ts` ve phase dosyaları | Curriculum büyük TypeScript literal/builder dosyalarında tutulur; bazı dosyalar 800–1600 satır bandındadır. Tipler vardır ancak içerik, dönüşüm ve export aynı bölgede yoğunlaşır. | İçerik review'u, diff okuma, kaynak izi ve cihaz içeriği izolasyonu zorlaşır. Device data aynı yere eklenirse hata alanı büyür. | Curriculum ile Device Lab source data'yı ayrı paketlerde tut; validation script ve stable ID kullan; mevcut veriyi büyük bir yeniden yazımla taşımama. | High |
| `app/stats/page.tsx` | Aktif günün 4 modül completion'ını ve local practice durumunu gösterir. | Süreklilik, speaking output gelişimi, milestone sonucu ve weak point trendi görünmez. Completion proficiency gibi okunabilir. | Pilot sonrası az sayıda anlamlı metrik tasarla: practiced days, ikinci deneme yapılma oranı, koçlanan milestone, review backlog. | Medium |
| `app/journal/page.tsx` | Günün cevaplarını, zor bölümü ve next review notunu toplar. | Notlar bir sonraki güne görev olarak taşınmaz; açık review için “Doğru/Tekrar” etiketi mekanik evaluator sorununu tekrar görünür kılar. | Review evaluator düzeltildikten sonra journal label'larını uyumlu hale getir; weak point geri çağırma planı oluştur. | High |
| `components/bottom-navigation.tsx` | Sabit, yatay kaydırılabilir mobil alt menü kullanılır. | Device Lab doğrudan birden fazla yeni nav öğesiyle eklenirse keşfedilebilirlik ve parmakla kullanım yoğunluğu kötüleşebilir. | Tek bir future Device Lab giriş noktası düşün; cihaz/modül hiyerarşisini kendi içinde tut. Device-7'de küçük ekran testi yap. | Medium |
| `components/listening-drill.tsx`, `components/words-practice.tsx`, `components/ui.tsx` | İşlev zengin practice bileşenleri ve merkezi UI primitive'leri vardır; bazı bileşenler büyüktür. | Yeni cihaz kipleri mevcut bileşenlere koşullu dallar eklerse karmaşıklık artar. | Device Lab'i mevcut practice bileşenlerinden composition yoluyla yararlanan ayrı sınır olarak kur; devasa koşullu bileşen oluşturma. | Medium |
| `app/layout.tsx`, `components/app-shell.tsx` | Dil `en`, içerik genişliği sınırlı, spacing ve alt menü payı mobile-first yapıya uygundur. | Teknik spec tabloları ve uzun caveat metinleri mobilde yoğun olabilir. | Device-7'de kart başına tek öğrenme amacı, progressive disclosure ve 320/375 px doğrulaması uygula. | Medium |
| `lib/supabase/types.ts` | Şema genel 90 günlük day/practice/review ve profil/team durumunu kapsar; Device Lab tabloları yoktur. | Device model kesinleşmeden cloud şeması eklemek migration ve kaynak sürümleme borcu yaratır. | Device-6/7/8 tamamlanana kadar cloud şemasını değiştirme; Device-9'da module/version/claim kimliği üzerinden tasarla. | Low şimdi / High Device-9'da |
| `data/` | Klasör yoktur. | İstenen inceleme alanlarından biri mevcut değildir; static Device Lab verisinin nereye ait olacağı henüz uygulanmamıştır. | Eksikliği hata saymadan Device-6 tasarım kararı olarak ele al. | Medium |

### 4.3 Öncelik özeti

**Kritik sorunlar:** Açık uçlu review değerlendirmesi ve speaking completion'ın konuşma kanıtı sayılma riski. Bunlar curriculum metninden değil davranış ve ölçüm modelinden kaynaklanır.

**Orta seviye iyileştirmeler:** TTS cache sınırı, yanlış adlandırılmış plan alias'ı, Stats'in zayıf eğilim görünümü, Journal-to-review bağlantısı ve mobil Device Lab navigasyonu.

**Teknik borç:** Büyük içerik dosyaları, tek parça local store, component boyutları ve completion/skill veri kavramlarının iç içe geçmesi.

**Device Lab entegrasyon riski:** Mevcut curriculum array'lerine cihazları eklemek, alt menüyü cihaz başlıklarıyla doldurmak, blocked claim'leri aynı typed modelde learner-ready içerik gibi render etmek ve erken cloud schema kurmak. Önerilen çözüm, source/claim/module katmanlarını ayıran statik bir model; deny-by-default release; ayrı local namespace; sonra minimal UI'dır.

## 5. İngilizce Öğrenme Metodolojisi Değerlendirmesi

Bu bölüm güncel akademik tarama değildir. Genel kabul gören dil öğrenme ilkeleri ve repo içindeki gerçek uygulama davranışı üzerinden hazırlanmıştır.

| Yöntem | Ne işe yarar? | Argos'ta mevcut mu? | Nasıl güçlendirilmeli? | Uygulamada nasıl görünmeli? |
|---|---|---|---|---|
| Spaced repetition | Bir öğeyi unutma başlamadan farklı günlerde geri çağırarak uzun dönem hatırlamayı destekler. | Kısmen; daily review, tekrar eden chunks ve milestone vardır, kişisel adaptif sıra yoktur. | Basit +1, +3, +7, +14 gün kuralı ve weak-point işaretiyle başla. | “Bugün tekrar et” bölümünde en fazla 3 eski öğe; neden geri geldiği görünür. |
| Active recall | Cevabı görmeden hatırlama, pasif tekrar yerine erişim gücünü çalıştırır. | Var; recall, fill blank ve prompts bulunur. Target lines her zaman görünürse etkisi azalabilir. | Önce kapalı prompt, sonra hint, en son model sırala. | “Önce söyle”, “İpucu aç”, “Örneği gör” adımları. |
| Shadowing | Duyulan ifadeyi ritim ve bağlantıları taklit ederek hemen tekrar etmeyi çalıştırır. | Kısmen; audio, replay, kelime takibi ve repeat yönlendirmesi vardır; ayrı shadowing ölçüsü yoktur. | Kısa key line'larda üç tur: dinle, metinle eşlik et, metinsiz tekrar. | Tek satırlık ses ve tur göstergesi; otomatik pronunciation puanı iddia edilmez. |
| Comprehensible input | Seviyeye yakın ve bağlamdan anlaşılır girdi, yeni dilin işlenmesini sağlar. | Güçlü; kısa metin, key lines ve Türkçe task desteği vardır. | İleri fazlarda aynı işlevi biraz daha doğal hız, paraphrase ve aksan çeşitliliğiyle sun. | Temel ve doğal hız seçenekleri; gist sorusu metinden önce gelir. |
| Output practice | Öğrenenin anlamı kendi cümlesiyle üretmesini ve boşluklarını fark etmesini sağlar. | Güçlü; her gün speaking ve yazılı output vardır. | Yazıyı konuşmanın kanıtı saymama; kısa retell, response ve live Q&A ekleme. | Zamanlayıcı, first/second try ve haftalık canlı görev; kayıt opsiyonelse açık rıza. |
| Deliberate practice | Belirli bir zayıf noktayı net hedef ve geri bildirimle tekrar çalıştırır. | Kısmen; mini goal, difficult part ve self-check vardır. | Weak point'i sonraki görevde tek hedefe dönüştür; koç feedback'i kısa ve davranışsal olsun. | “Bu turdaki tek hedef: daha net next step söyle.” gibi bir focus kartı. |
| Retrieval practice | Eski bilgiyi yeni bağlamda geri çağırarak erişilebilir kılar. | Kısmen; review ve theme reuse vardır. | Eski chunk'ı farklı task türünde ve gecikmeli olarak çağır. | Bir hafta önceki ifadeyle bugün customer question yanıtı üretme. |
| Interleaving | Benzer ama farklı görevleri karıştırarak doğru stratejiyi seçmeyi geliştirir. | Günlük modality karışımı var; cihazlar arası ve iletişim işlevleri arası kontrollü karışım sınırlı. | Önce cihaz içinde, kaynakları yeterli olduğunda cihazlar arasında karşılaştırmalı görev ekle. | Aynı oturumda kısa intro, clarification ve reporting; blocked özellik karşılaştırılmaz. |
| Second try improvement | İlk üretimden sonra mesajı daha açık, düzenli veya doğal söylemeyi öğretir. | Çok belirgin biçimde var. | First try zorunluluğunu ve “neyi değiştirdim?” açıklamasını kalıcı hale getir. | İki metin yan yana değilse bile bir kısa fark seçimi: netlik, sıra, kelime, repair. |
| Self-explanation | Öğrenenin neden o ifadeyi seçtiğini açıklaması farkındalık ve transfer sağlar. | Journal ve bazı reason görevlerinde kısmen vardır. | Haftada bir “Neyi neden değiştirdin?” sorusu ekle; her gün yükleme. | Milestone'da tek cümlelik değişiklik gerekçesi. |
| Task-based learning | Dili gerçek bir sonuç için kullanır: randevu ayarlama, problem çözme, demo yapma. | Orta-güçlü; iş ve iletişim senaryoları vardır. | Ocak bağlamında airport, hotel, team briefing, site setup ve customer Q&A görevleri eklenmesini ayrı içerik fazında planla. | Görev kartı, başarı koşulu ve follow-up soru; grammar konusu başlık olmaz. |
| Domain-specific language | Mesleki terim ve söylem kalıplarını gerçek görevlerde kullanılabilir kılar. | Sınırlı 8K mikro içerik ve güçlü kaynak dokümanı altyapısı vardır; çok cihazlı learner path henüz yoktur. | Source-owned Device Lab, evidence labels ve caveat kalıplarıyla paralel hat oluştur. | Intro, controlled demo, reporting, Q&A ve claim-control challenge modülleri. |

### 5.1 Konuşma refleksi, yük ve üretim dengesi

- **Konuşma refleksi:** Günlük tekrar ve second try refleks için doğru yönü gösterir. Fakat refleks yalnız metin girmekle kanıtlanamaz; haftalık zamanlı, notsuz ve beklenmedik follow-up içeren üretim gerekir.
- **Günlük yük:** Dört çekirdek adım sade görünür. Nitelikli iki konuşma denemesiyle gerçekçi toplam 25–35 dakika daha uygundur. Her gün zorunlu Journal ve Device Lab eklemek yükü aşırı artırabilir.
- **Teknik içeriğin zamanı:** İlk 14 gün alışkanlık ve temel iletişim öncelikli olmalı. 15–30. günlerde haftada bir veya iki 5–10 dakikalık kaynak kontrollü tanışma; 31. günden sonra haftada iki veya üç Device Lab görevi uygundur.
- **Ezber mi üretim mi?:** Program üretime yönelir; ancak model cevap kontrolü ezbere kaçış yolu bırakır. Modeli en son gösteren retrieval akışı ve açık cevapta doğru/yanlış yerine rubric kullanımı üretim tarafını güçlendirir.

## 6. ForenScope Device Training Audit

Buradaki “güvenli” ifadesi, mevcut sunum/extraction kapsamında kontrollü eğitim dili kurulabileceği anlamına gelir; bağımsız laboratuvar validation, operator certification veya tam safety eğitimi anlamına gelmez.

| Cihaz/kaynak | Güvenli eğitim alanları | Dikkatli kullanılacak alanlar | Blocked claims | Eksik belge | Önerilen Device Lab modülleri |
|---|---|---|---|---|---|
| 8K | Kaynak destekli adlandırma; 45.9 MP; UV/VIS/IR vocabulary; 10 light group; device extraction bağlamında yedi named filter; Android control, RAW/TIFF ve export formats; stamping/archive/reporting vocabulary; presentation-demonstrated surfaces; kesin UVC warning | Contactless/chemical-free capability üretici atfıyla; “up to 3 meters” yalnız source-stated ve doğrulanmamış; surfaces yalnız presentation demonstration; AFIS yalnız manual preparation/submission workflow | Direct/automatic/certified AFIS integration; guaranteed match; “world's first and only”; “no image distortion”; “third level identification”; adsız crime-gun accreditation; performance/accuracy; exact surface settings | Operator manual, datasheet, tam UVC safety/compliance, AFIS documentation, accreditation certificate/named agency, validation report, exact settings | 8K Intro; Controlled Demo; Light/Filter Vocabulary; UVC Source Warning; Export/Reporting; Manual AFIS Preparation; Customer Q&A |
| t-ZOOM Plus DNA | Product intro; device-attributed components ve changeable lenses; iki ring-light sistemi; yedi named filter; multispectral/software/connectivity vocabulary; açıkça device-labeled examples | “6 meters to 600 microns”, AUTO Search ve Smart Button davranışı doğrulanmalı; bare “t-ZOOM” slides 17/22 Plus DNA'ya atanamaz; contactless wording scope kontrolü ister | DNA extraction, profiling veya on-device DNA analysis; safety instruction; “ultimate/unique/strongest” superlatives; bare t-ZOOM examples'ın otomatik atfı | Operator/user manual, technical datasheet, UV/IR safety document, software workflow, t-ZOOM model/version clarification, DNA function evidence | Intro; Components; Light/Filter Vocabulary; Software/Connectivity Overview; Controlled Demo; Claim-Controlled Q&A |
| SuperSpectral Force/Core | Force ve Core için ayrı identity/spec; sensor, storage, display, 4K/RAW, autofocus, digital zoom; Force ve Core'a ait light/filter vocabulary; kaynakta açık Force/Core comparison | Application gallery yalnız family-level manufacturer demonstration olabilir; Force optional lens yalnız Force atfıyla; aynı Force deckindeki farklı light descriptions birleştirilmemeli | Safety/exposure instruction; uygulamaları kanıtsız belirli SKU'ya atama; Core'a Force lens compatibility aktarma; performance claims; SuperSpectral SAFE içeriğini Force/Core'a aktarma | Operator manuals, SKU datasheets, UV/IR safety/compliance, application attribution, software/case management docs, validation data | Force Intro; Core Intro; Source-Controlled Comparison; Spectral/Filter Vocabulary; Family Demonstration Gallery; Q&A |
| Contactless LITE | Identity; 32.5 MP camera; RAW photo; four-LED terminology; autofocus; source-stated 20 cm–5 m range; battery/charging/TF-card; device-labeled reflective/hard-surface demonstrations | “Multispectral” için wavelength çıkarımı yapılmamalı; range performance garantisi değildir; surface examples validation değildir; 4K yalnız overview kaynağında takip ister | Body fluid, blood, GSR, document/art veya Touch DNA'nın device-specific kullanımı; software/archive/cloud/AI/reporting/AFIS; safety instruction; “world's first” | Device manual, device-specific datasheet, software/workflow docs, LED/electrical safety, device-specific 4K evidence, application validation | Intro; Camera/Light Vocabulary; Reflective-Surface Demonstration; Distance Language With Caveat; Customer Q&A |
| Contactless LAB ULTRA | Identity; components/configuration; four in-lights, seven out-lights ve six filters sayısal vocabulary; control panel; device-labeled surfaces; optional accessory vocabulary | Capture One, laptop, mouse ve keyboard mutlaka optional kalmalı; `UV365` printed wording olarak kullanılmalı; Canon R7 için dış spec eklenmemeli; NJSP brand reference certification sayılmamalı | AFIS, case management, reporting, metadata, cloud/AI; safety/PPE/exposure instruction; performance, universal success ve accreditation | User manual, light/filter selection procedure, camera/lens/filter/wavelength datasheet, UV/light safety, software/reporting docs, validation/certification | Components Intro; In-light/Out-light Vocabulary; Optional Configuration; Controlled Surface Demo; Q&A; safety ve workflow modülleri ertelenir |
| High-Tech catalog overview | Internal inventory, naming variant ve conflict discovery; catalog/category vocabulary | 8K ve Contactless LITE için derin içerik başka device extraction'larla reconcile edilmeden kullanılamaz; saved file kısa summary'dir | Catalog-level claim'i otomatik cihaz claim'i yapmak; 8K eight-filter ifadesiyle seven-filter conflict'i çözmek; Contactless LITE 4K'yı device fact yapmak; name-only ürünlerden teknik özellik üretmek; superlatives/accreditation | Tam structured extraction, catalog date/version, her name-only product için device source, filter/video/naming/accreditation reconciliation | Learner-facing device module önerilmez; yalnız internal Source/Conflict Register |

### 6.1 Zorunlu engeller ve takipler

- 8K için **direct AFIS integration blocked**; yalnız AFIS preparation, AFIS-related workflow veya manual AFIS submission workflow denebilir.
- 8K için device extraction yedi named filter, overview sekiz-filter system söyler. Conflict çözülene kadar bağlam belirtilmeden evrensel sayı verilmemelidir.
- t-ZOOM Plus DNA için DNA extraction/analysis/profiling blocked; deck trace visualization/localization düzeyindedir.
- t-ZOOM Plus DNA safety instruction blocked; güvenlik kaynağı yoktur.
- SuperSpectral Force/Core safety instruction blocked; SuperSpectral SAFE ayrı ürün ve kapsam dışıdır.
- Contactless LITE için body fluid, blood, GSR ve Touch DNA device-specific iddiaları blocked; 4K overview-only claim takip gerektirir.
- Catalog claims hiçbir cihaza otomatik atanamaz. “Not documented”, “not supported” anlamına gelmez.
- Presentation demonstration; success rate, sensitivity, repeatability, sample size, chain of custody veya forensic admissibility kanıtı değildir.

## 7. Teknik Terimler — TR/EN Mini Sözlük

| Türkçe | English | Kullanım Notu | Claim-Control |
|---|---|---|---|
| temassız görüntüleme | contactless imaging | Kanıt yüzeyine temas etmeden görüntüleme yaklaşımını anlatır. | Yalnız device-specific source destekliyorsa cihaz claim'i; aksi halde manufacturer/category atfı gerekir. |
| gizli parmak izi | latent fingerprint | Görünür olmayan veya zor görülen parmak izi bağlamında kullanılır. | Detection success garantisi verilmez. |
| çok spektrumlu görüntüleme | multispectral imaging | Birden fazla spectral band ile görüntülemeyi anlatır. | Kaynak band/wavelength vermiyorsa aralık çıkarımı yapılmaz. |
| morötesi / görünür / kızılötesi | UV / VIS / IR | Spectral vocabulary için kullanılır. | Device-specific range ve safety instruction ayrıca kaynaklanmalıdır. |
| ışık grubu | light group | Kaynakta adlandırılmış illumination grubudur. | Sayı ve adlar cihazlar arasında kopyalanmaz. |
| motorlu filtre | motorized filter | Yazılım veya sistemle hareket eden filtre düzenini anlatır. | 8K seven/eight conflict'i nedeniyle source context belirtilir. |
| dar bant geçiren filtre | narrow bandpass filter | Sınırlı dalga boyu aralığını geçiren filtre terimidir. | Exact operating setting olarak öğretilmez. |
| uzun geçiren filtre | long-pass filter | Belirli eşik üzerindeki dalga boylarını geçiren filtre terimidir. | Surface recommendation için manual gerekir. |
| ham görüntü | RAW image | İşlenmemiş veya az işlenmiş capture formatı için kullanılır. | Her cihazda bulunduğu varsayılmaz. |
| TIFF görüntüsü | TIFF image | Kaynakta listelenmiş capture/export formatı olabilir. | Capture ile export capability ayrıştırılır. |
| WSQ dışa aktarma | WSQ export | Özellikle fingerprint image değişimi bağlamında bir format ifadesidir. | 8K kaynağıyla sınırlı; AFIS integration kanıtı değildir. |
| AFIS hazırlığı | AFIS preparation | Görüntüyü manuel gönderim sürecine hazırlama dilidir. | Direct connection, certified interface veya guaranteed match denmez. |
| manuel AFIS gönderim iş akışı | manual AFIS submission workflow | 8K sunumundaki sıralı hazırlık ifadelerini kontrollü biçimde anlatır. | Yalnız source-stated workflow; direct integration blocked. |
| kanıt yüzeyi | evidence surface | Görüntülenen yüzeyi tarafsız biçimde adlandırır. | Demonstrated surface, validated compatibility olarak sunulmaz. |
| sunumda gösterilen örnek | demonstrated in the presentation | Fotoğraf veya demo örneğinin kaynağını belirtir. | Independent lab validation anlamına gelmez. |
| kaynak şöyle belirtir | the source states | Bir capability'nin kaynak atfını görünür kılar. | Source-stated capability için tercih edilir. |
| üretici şöyle belirtir | the manufacturer states | Pazarlama sunumundan gelen ifadeyi açıkça üreticiye atfeder. | Validation veya bağımsız doğrulama izlenimi verilmez. |
| kaynakta belgelenmemiş | not documented in the available source | Mevcut dosyada kanıt bulunmadığını söyler. | “Cihaz desteklemiyor” biçimine çevrilmez. |
| görüntü kaydı | image record | Capture, stamp ve report bağlamında tarafsız terimdir. | Gerçekten kaydedilmeyen metadata rapora yazılmaz. |
| ışık ve filtre damgası | light and filter stamp | 8K yazılımında listelenen metadata özelliğidir. | Otomatik olarak her capture'da gerçekleştiği varsayılmaz. |
| kaynak kontrollü raporlama dili | source-controlled reporting language | Yapılan işlemi caveat ve source sınırıyla anlatır. | SOP veya legal admissibility iddiası değildir. |
| UVC güvenlik uyarısı | UVC safety warning | 8K kaynağındaki harmful-to-human-body ve supplied-darkroom uyarısıdır. | Yalnız dar source warning; tam safety training değildir. |

## 8. Program Optimizasyonu

### 8.1 Seçeneklerin değerlendirilmesi

| Seçenek | Artı | Risk | Karar |
|---|---|---|---|
| Mevcut 90 günü aynen sürdürmek | En düşük değişiklik, net alışkanlık, doğrulanmış içerik | Ocak'a kalan süre ve teknik iş görevi yeterince kullanılmaz; ölçüm kusurları kalır | Ana omurga olarak korunmalı, tek plan olarak seçilmemeli |
| 90 güne opsiyonel Device Lab eklemek | Genel İngilizceyi bozmadan mesleki aktarım sağlar | Günlük zorunlu yapılırsa overload; kaynak gate'i zayıf olursa brochure etkisi | Önerilir; 31. günden sonra haftada 2–3 kısa görev |
| 120–150 günlük geniş plan | Ocak'a kadar consolidation, canlı Q&A ve teknik sprint için zaman verir | Fazla içerik üretme ve scope creep riski | En uygun çerçeve; 90 günlük çekirdeğin üstüne extension olarak |
| Yoğun teknik speaking sprintleri | Seyahate yakın gerçek demo refleksini artırır | Temel dil kurulmadan erken uygulanırsa ezber ve claim hatası üretir | Gün 91 sonrası ve seyahat öncesi kontrollü biçimde önerilir |

### 8.2 Önerilen çalışma ritmi

- **Günlük çekirdek süre:** 25–35 dakika; Listen 6–8, Words/retrieval 6–8, Speak 8–12, Review 5–7 dakika.
- **Device Lab günü:** Çekirdeğe ek, opsiyonel 10–15 dakika; haftada önce iki, gün 61 sonrası en fazla üç oturum.
- **Haftalık ritim:** Beş tam çekirdek gün, bir consolidation/canlı role-play günü, bir hafif tekrar veya dinlenme günü.
- **Tekrar aralıkları:** İlk karşılaşma sonrası aynı gün kısa retrieval; +1, +3, +7 ve +14 gün. Kullanıcının weak point'i önce gelir.
- **Speaking output:** Gün 1–30'da 20–45 saniye; 31–60'ta 45–60 saniye; 61–90'da 60–90 saniye; 91–120'de 90–120 saniye ve follow-up; son fazda 2–3 dakikalık kontrollü demo ile kısa Q&A. Bunlar hedef süredir, CEFR kanıtı değildir.
- **Milestone:** 14, 30, 42, 60, 70, 90, 105, 120 ve seyahat öncesi. Her milestone'da notsuz konuşma örneği, tek weak point ve sonraki hedef.
- **Pilot kuralı:** Completion yüzdesi tek karar ölçütü olmasın. Haftada en az bir speaking örneği veya canlı görev, en az bir weak-point takibi ve iki haftada bir admin/coach örneklemesi olmadan süre ya da içerik artırılmasın.

### 8.3 Net öneri

Mevcut 90 günlük planı curriculum olarak koru; onu 120–150 günlük bir çalışma takviminin çekirdeği yap. Device Lab'i 31. günden itibaren opsiyonel paralel hat olarak ekle. Gün 91'den sonra genel iş İngilizcesi consolidation, Netherlands work scenarios ve yoğunlaştırılmış ama claim-controlled technical speaking sprintleri uygula. Yeni modül sayısını değil, haftalık ölçülebilir sözlü üretimi artır.

## 9. Day-by-Day Timeline

### Faz 1: Gün 1–30 — Alışkanlık ve temel konuşma otomatikliği

- **Ana hedef:** Her gün düşük sürtünmeyle sesli üretim; kendini tanıtma, rutin, tercih, plan ve temel work language.
- **Günlük görevler:** Listen, kısa shadowing, dört ana kelimeyi aktif üretim, first/second try, kısa review.
- **Haftalık speaking output:** Bir adet notsuz 30–45 saniyelik kayıt/canlı anlatım; otomatik scoring yok.
- **Device Lab görevi:** Gün 1–14 yok; gün 15 sonrası haftada bir, yalnız source/claim-control tanışması ve 8K identity vocabulary.
- **Milestone:** Gün 14'te sürdürülebilirlik ve temel intro; gün 30'da 45 saniyelik kişisel/work introduction.
- **Admin/coach kontrolü:** Tamamlama değil, iki first/second try örneği ve tek weak point.

### Faz 2: Gün 31–60 — İşlevsel etkileşim ve kontrollü cihaz tanıtımı

- **Ana hedef:** Clarification, scheduling, problem açıklama, opinion ve next step dilini otomatikleştirmek.
- **Günlük görevler:** Çekirdek 90 günlük akış; haftada iki gecikmeli retrieval seti.
- **Haftalık speaking output:** 45–60 saniyelik iş senaryosu ve iki follow-up soruya kısa cevap.
- **Device Lab görevi:** Haftada iki 10–15 dakikalık oturum; 8K Intro/Controlled Demo ve ikinci bir güvenli intro modülü.
- **Milestone:** Gün 42 ve 60'ta notsuz explanation + clarification.
- **Admin/coach kontrolü:** Anlaşılırlık, görev tamlığı, repair strategy ve claim-control için kısa rubric.

### Faz 3: Gün 61–90 — Erken B1 yönelimli üretim ve müşteri Q&A

- **Ana hedef:** Gerekçe, comparison, summary, report ve daha uzun response üretmek.
- **Günlük görevler:** 60–90 saniyelik speaking hedefi; eski chunks için +7/+14 retrieval; ikinci denemede bilinçli tek iyileştirme.
- **Haftalık speaking output:** Bir work briefing ve bir kaynak kontrollü customer Q&A.
- **Device Lab görevi:** Haftada iki veya üç; 8K reporting/manual AFIS caveat, Contactless LITE reflective demo veya Force/Core controlled comparison.
- **Milestone:** Gün 70 ve 90; 90. günde 90 saniyelik genel iş konuşması ve ayrı kısa cihaz tanıtımı.
- **Admin/coach kontrolü:** Model cümle eşleşmesi değil görev başarısı ve yanlış teknik iddia taraması.

### Faz 4: Gün 91–120 — Transfer, canlı prova ve teknik speaking sprint

- **Ana hedef:** 90 günlük dili yeni ve beklenmedik iş görevlerine aktarmak.
- **Günlük görevler:** Beş gün consolidation/role-play; bir canlı prova; bir hafif gün. Yeni genel vocabulary yükü sınırlı.
- **Haftalık speaking output:** 90–120 saniyelik briefing, problem/solution ve üç follow-up sorusu.
- **Device Lab görevi:** Bir cihaz intro, bir demo/Q&A, bir reporting/claim-control challenge; yalnız released modules.
- **Milestone:** Gün 105 ve 120; notsuz iki dakikalık kontrollü demo ve “not documented” yanıtı.
- **Admin/coach kontrolü:** Tekrarlanan zayıf noktalar, teknik atıf, safety sınırı ve konuşma baskısı.

### Faz 5: Gün 121–seyahat öncesi — Hollanda görevi provası ve güvenilirlik

- **Ana hedef:** Seyahat, ekip, müşteri ve saha bağlamını tek oturumda yönetmek; aşırı ezberi azaltmak.
- **Günlük görevler:** Kısa maintenance retrieval, değişken role-play, dinleme hızı/aksan çeşitliliği ve repair practice.
- **Haftalık speaking output:** Uçtan uca senaryo: arrival, team introduction, device demo, uncertain question, next step ve follow-up email özeti.
- **Device Lab görevi:** 2–3 dakikalık kaynak kontrollü demo; iki cihazı yalnız doğrulanmış facts ile karşılaştırma; blocked claim'e güvenli yanıt.
- **Milestone:** Seyahatten 14 ve 3 gün önce iki mock assignment. Amaç expert-level technical-sales fluency iddiası değil, kontrollü ve anlaşılır iş iletişimidir.
- **Admin/coach kontrolü:** En fazla üç yüksek etkili hata; son hafta yeni içerik değil tekrar ve güven.

### İlk 14 gün için ayrıntılı plan

| Gün | Ana çalışma | Sözlü çıktı | Tekrar/koç notu |
|---:|---|---|---|
| 1 | Mevcut morning routine içeriği; iki kez dinle, bir key line shadow et, dört ana öğeyi seç | 20–30 saniye morning anlatımı, iki deneme | İlk denemeyi düzeltmeden sakla; tek hedef sıra belirteçleri |
| 2 | Natural self-introduction | 3–4 cümlelik intro | Koç yalnız anlaşılırlık ve eksik temel bilgiye bakar |
| 3 | Weekday routine ve sequence | 20–30 saniye sıralı anlatım | Gün 1'den bir ifadeyi notsuz geri çağır |
| 4 | Like, prefer ve avoid | Üç gerçek tercih | Model cümleyi kişisel bilgiyle değiştirme kontrolü |
| 5 | Work/study responsibility | İş sorumluluğu + neden İngilizce çalıştığı | Gün 2 intro'yu 20 saniyede yeniden söyle |
| 6 | Time ve simple plan | Gün planını saat ve next step ile anlat | İlk haftanın zor kelimesini Journal'a işaretle |
| 7 | Hafif consolidation | Gün 1–6'dan 30 saniyelik serbest özet | Yeni kelime yükü yok; koç örneklemesi |
| 8 | Location/direction veya mevcut gün teması | Kısa bilgi isteme ve cevap | Gün 3 sequence ifadelerini +5 gün retrieval olarak çağır |
| 9 | Request/help language | Bir doğal request ve follow-up | Cevabı görmeden söyle, sonra örnekle karşılaştır |
| 10 | Problem ve repair başlangıcı | Küçük bir sorunu ve ihtiyacı anlat | Second try'da tek iyileştirmeyi adlandır |
| 11 | Past event veya mevcut gün teması | Dün olan bir şeyi 3–4 cümleyle anlat | Akış bozulursa repair phrase kullan |
| 12 | Appointment/plan | Zaman öner, onayla, alternatif ver | Gün 5 work ifadelerinden birini yeniden kullan |
| 13 | Short conversation linking | İki fikir + bir reason | 30–40 saniye notsuz; transcript okumama |
| 14 | Milestone ve hafif tekrar | Self-intro + routine + next goal, 45 saniyeye kadar | Tek weak point ve 15–30. gün hedefi; Device Lab henüz zorunlu değil |

İlk 14 günde amaç içerik bitirmek değil, her gün gerçekten sesli iki tur üretim yapabilmektir. Teknik cihaz spec'i eklemek bu fazın önceliği değildir.

## 10. Actionable Implementation Plan

| Faz | Amaç | Değişecek dosya türleri | Ana risk | Test yöntemi | Kabul kriteri |
|---|---|---|---|---|---|
| Audit sonrası data kalite düzeltmeleri | Açık review değerlendirmesi, completion/quality ayrımı, tekrar yoğunluğu ve mevcut 8K mikro claim'lerini düzeltme planına bağlamak | Ayrı onaydan sonra curriculum data, practice evaluator, validation script ve testler | Mevcut 90 günlük içeriği toplu yeniden yazmak veya kazanılmış doğrulamayı bozmak | Runtime array sayımları; görev türü testleri; açık cevap varyantları; 90 gün integrity check; pilot örneklemesi | 90 gün/8 kelime/gün korunur; açık üretim haksız doğru-yanlış almaz; claim kontrol listesi geçer |
| Device-6 static Device Lab data model | Source, product scope, claim, evidence, safety, module readiness ve missing dependency için minimal typed model | Yalnız statik TypeScript/data ve test/validation dosyaları; mevcut curriculum değişmez | Mimariyi tüm gelecek cihazları çözmeye zorlamak; blocked claim'i learner-ready yapmak | Type checking; fixture validation; her claim'in source ve scope zorunluluğu; deny-by-default testleri | 2–3 modül; yalnız ready/ready-with-controls render adayı; blocked/deferred varsayılan kapalı; 8K UVC ve AFIS sınırları temsil edilir |
| Device-7 minimal `/device-lab` UI prototype | Seçilmiş modülleri mobile-first ve source/limit görünürlüğüyle sunmak | Yeni route, küçük components, static data consumer ve UI testleri | Alt menü ve kart yoğunluğu; katalog/broşür hissi; caveat'ın gizlenmesi | 320/375/768 px manuel test; keyboard/screen reader; blocked content snapshot; content QA | Tek giriş, en fazla 2–3 modül, source/limit görünür, hiçbir blocked claim gösterilmez, ana Today flow etkilenmez |
| Device-8 local progress | Device Lab practice durumunu ana 90 günlük progressten ayrı yerelde tutmak | Ayrı storage namespace/schema, migration ve unit tests | Mevcut store'u büyütmek, veri kaybı, completion'ı proficiency sanmak | Eski store migration, corrupt JSON, import/export, quota ve reset testleri | Eski ilerleme korunur; Device Lab reset ayrı; module version saklanır; quality/completion ayrıdır |
| Device-9 cloud/admin tracking | Yalnız kanıtlanmış local modelden gerekli minimum cihaz ilerlemesini isteğe bağlı sync etmek | Supabase migration/type, sync, RLS, admin ve privacy docs | Team veri sızıntısı, conflict, fazla veri saklama, eski claim version'ı | RLS entegrasyonu; iki cihaz conflict; role/team boundary; deletion/tombstone; rollback | Yetkisiz erişim yok; manuel sync açık; module/source version izlenir; admin yalnız gerekli veriyi görür |
| Device-10 manuals/datasheets source expansion | Blocked/deferred alanları yetkili belgeyle yeniden değerlendirmek | Yeni originals, extraction, source index/reconciliation; mevcut kayıtlar immutable kalır | Pazarlama PDF'sini manual sanmak, eski source context'i silmek | Belge kimliği/sürümü; çift inceleme; claim diff; safety uzman review'u | Her kaldırılan block için doğrudan belge, sayfa ve reviewer vardır; çelişki sessizce çözülmez |
| Device-11 broader device modules | Kanıt yeterli cihazlarda workflow, reporting, comparison ve Q&A kapsamını genişletmek | Static modules, tests ve onaylı UI; gerekirse progress mapping | Her cihazı aynı şablonda aynı derinlikte sunmak; otomatik recommendation veya certification izlenimi | Device-by-device content QA; attribution test; safety gate; müşteri Q&A red-team | Yalnız source-ready modüller yayınlanır; ürünler karışmaz; unsafe claims register sıfır ihlal gösterir |

### Device-6 için önerilen minimal kapsam

Device-6 henüz route, UI, progress veya cloud davranışı üretmemelidir. İlk fixture için şu üç modül yeterlidir:

1. **8K Intro / Controlled Demo:** Product identity, camera, UV/VIS/IR ve manufacturer-attributed contactless vocabulary.
2. **8K UVC Source Warning:** Yalnız UVC'nin insan vücuduna zararlı olabileceği ve supplied darkroom ile kullanılması gerektiği yönündeki dar kaynak uyarısı; tam safety training değildir.
3. **Contactless LITE Intro** veya **SuperSpectral Force/Core Comparison:** Yalnız source index'te safe kabul edilen device-owned facts; 4K/body-fluid veya safety claim yok.

Manual AFIS Preparation ilk üç modüle eklenirse scope büyür; ayrı ready-with-controls modülü olarak daha sonra eklenmesi daha güvenlidir.

## 11. Kaynak ve Referans Stratejisi

Bu audit sırasında yeni web veya akademik veri tabanı taraması yapılmamıştır. Bu nedenle aşağıdaki kaynaklar doğrudan alıntılanmış kanıtlar değil, sonraki eğitim ve doğrulama fazları için güvenilir kaynak türü önerileridir. Erişilebilirlik, güncellik, lisans ve sürüm kullanıcı/proje sahibi tarafından doğrulanmalıdır.

### Genel İngilizce için

- Güncel ve resmi **CEFR self-assessment grids**: hedef beceriyi garanti değil, öz değerlendirme çerçevesi olarak kullanmak.
- Cambridge ve British Council gibi kurumsal sağlayıcılardan grammar, speaking function ve listening materyalleri: seviye ve lisans kontrolüyle.
- Seviyelendirilmiş okuma ve ses kaynakları: **graded readers**, kısa iş diyaloğu ve farklı aksan örnekleri.
- Shadowing için yasal kullanımı açık, transcript'i bulunan kısa audio kaynakları.
- Canlı öğretmen/koç veya güvenilir conversation partner değerlendirmesi: uygulamanın veremediği interaction ve pronunciation feedback'i için.

### ForenScope ve forensic English için

- Cihaz bazında sürüm ve model numarası taşıyan operator/user manuals.
- Teknik datasheets: sensor, lens, wavelength, filter, battery, dimension ve compatibility ayrıntıları.
- UV/IR/light safety ve compliance belgeleri; exposure limits, enclosure, PPE, interlock ve emergency procedure bilgileri.
- Kurum onaylı SOP'ler; exact settings ve surface workflow yalnız bu düzeyde öğretilmelidir.
- AFIS interface/preparation dokümanı; named system, import formatı, API/certified interface ve manual workflow ayrımı.
- Accreditation/certification iddiası için certificate, named agency, scope, tarih ve model/version.
- Performance claim için tanımlı test yöntemi, sample size, koşullar, karşılaştırma seti ve mümkünse bağımsız validation.
- Repo extraction'larından türetilen iki dilli forensic glossary; her terim source/slide, device scope, evidence level ve blocked status taşımalıdır.

### Kaynak işleme kuralı

Yeni belge önce originals alanına eklenmeli, tek cihaz için extraction oluşturulmalı, `git diff --check` yapılmalı, source index'te conflict review tamamlanmalı ve ancak sonra learner module değerlendirmesine alınmalıdır. Eski extraction silinmemeli veya yeni belgeyle sessizce yeniden yazılmamalıdır.

## 12. Final Verdict

### Program Ocak 2027 hedefi için uygun mu?

**Evet, koşullu olarak uygundur.** Mevcut 90 günlük plan güçlü bir genel İngilizce ve konuşma alışkanlığı omurgasıdır. Onu bitirmek B1'i, akıcılığı veya teknik satış uzmanlığını garanti etmez. Ocak hedefi için 120–150 günlük çalışma takvimine yerleştirilmesi, haftalık canlı/recorded output, nitelikli geri bildirim ve 31. günden sonra paralel, kaynak kontrollü Device Lab ile desteklenmesi gerekir.

### En büyük beş iyileştirme

1. Açık uçlu review cevaplarında model cümleye dayalı doğru/yanlış kontrolünü kaldırmak veya görev türüne göre ayırmak.
2. Completion, speaking evidence ve proficiency kavramlarını veri modelinde ve kullanıcı dilinde ayırmak.
3. Kişisel weak point'leri +1/+3/+7/+14 retrieval döngüsüne bağlamak.
4. Device Lab'i source-owned, deny-by-default statik model ve yalnız 2–3 güvenli modülle başlatmak.
5. Seyahat öncesi fazda haftalık canlı Q&A, Netherlands work scenarios ve claim-controlled demo sprintleri uygulamak.

### Hemen yapılmalı

- Bu audit insan tarafından gözden geçirilmeli ve High/Kritik bulgular ayrı issue/fazlara dönüştürülmeli.
- Mevcut sekiz 8K curriculum mikro bağlamı, güncel source index ve reconciliation kurallarına karşı claim-level kontrol edilmelidir.
- Pilot iki hafta boyunca gerçek süre, tamamlanan iki deneme, weak point ve koç geri bildirimi toplamalıdır.
- Device-6 acceptance criteria uygulamadan önce onaylanmalıdır.

### Yapılmamalı

- Program sonu için guaranteed B1 veya expert-level technical-sales fluency iddiası.
- Device Lab'i ana 90 günlük yolun yerine koymak ya da uygulamayı ürün broşürüne çevirmek.
- Catalog-level, marketing, unresolved, blocked veya safety-gap claim'leri learner fact yapmak.
- Direct AFIS integration, DNA analysis, universal surface success, accreditation veya complete safety training iddiası.
- Device-6 sırasında route, UI, local progress, Supabase veya admin kapsamına sıçramak.

### Device-6 kararı

**Bu audit gözden geçirildikten sonra Device-6'ya geçilebilir.** Device-6 minimal kalmalıdır: statik Device Lab data model ve yalnız 2–3 source-controlled modül. Model; product scope, source reference, evidence label, attribution, demonstration flag, safety state, release state, block reason ve missing-document dependency alanlarını zorunlu kılmalıdır. Geniş cihaz kataloğu, otomatik öneri, route/UI, progress ve cloud sonraki ayrı fazlarda kalmalıdır.

## İnceleme ve doğrulama kaydı

İncelenen ana belge grupları:

- Curriculum: `ACTUAL_CURRICULUM_VERIFICATION.md`, `CURRICULUM_AUDIT.md`, `CURRICULUM_REPAIR_SUMMARY.md`, `ASSESSMENT_RUBRIC.md`, `PILOT_READINESS_QA.md`.
- Device governance: `DEVICE_SOURCE_INTAKE_PLAN.md`, `DEVICE_SOURCE_INDEX.md`, `DEVICE_LAB_ARCHITECTURE_PLAN.md`, `DEVICE_4_SOURCEBOOK_RECONCILIATION.md`, `DEVICE_ENGLISH_SOURCEBOOK.md`.
- Device extractions: 8K, t-ZOOM Plus DNA, SuperSpectral Force/Core, Contactless LITE, Contactless LAB ULTRA ve High-Tech overview extraction dosyaları.
- Uygulama: `app/`, `components/` ve `lib/` altındaki ilgili route, practice, storage, sync, admin, auth ve TTS dosyaları.
- `data/` klasörü bulunamadı; auditte eksik olarak kaydedildi.

Bu fazda yalnız bu rapor oluşturulmuştur. Kod değişmediği için build gerekmemiştir; repository whitespace doğrulaması `git diff --check` ile yapılmalıdır.
