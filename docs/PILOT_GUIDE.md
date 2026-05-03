# Argos Speak 90 Pilot Kullanım Rehberi

## Amaç

Bu pilotun amacı, Argos Speak 90'ın gerçek ekip kullanımında günlük İngilizce pratik alışkanlığı oluşturup oluşturmadığını görmek. Pilot boyunca odak; dinleme, kelimeyi kullanma, kısa konuşma üretimi, review ve yazılı çalışma notlarının düzenli tutulmasıdır.

## Kimler kullanacak

Pilot, İngilizce konuşma güvenini artırmak isteyen ekip üyeleri ve ilerlemeyi eğitim amacıyla takip edecek ekip yöneticisi tarafından kullanılır.

Kullanıcılar günlük pratik yapar, cevaplarını kaydeder ve isterse cloud sync ile ilerlemesini yedekler. Ekip yöneticisi yalnızca cloud'a senkronize edilen ilerlemeyi admin panelden görür.

## Pilot süresi

Önerilen ilk pilot süresi 7-14 gündür. Bu süre, kayıt, günlük çalışma akışı, cloud sync alışkanlığı ve admin görünürlüğünü test etmek için yeterlidir.

## Kullanıcı kayıt adımları

1. `/login` sayfasını aç.
2. "Hesap oluştur" seçeneğini kullan.
3. Ad soyad, e-posta ve şifre gir.
4. Ekip kullanımında ilerleme bilgilerinin eğitim takibi amacıyla yönetici tarafından görülebileceğini onayla.
5. Hesap oluşturulduktan sonra `/account` sayfasından giriş durumunu kontrol et.
6. Ekip yöneticisi gerekiyorsa Supabase tarafında kullanıcının `team_id` bilgisini doğru takıma bağlar.

## Günlük çalışma akışı

Her gün kısa ve net ilerle:

1. Today ekranında aktif günü kontrol et.
2. Listen ile metni dinle ve mini cevabı yaz.
3. Words ile kelimeleri ve örnek cümleleri çalış.
4. Speak ile ilk denemeyi ve daha iyi ikinci denemeyi yaz.
5. Review ile aktif recall sorularını kontrol et.
6. Journal'da zorlandığın şeyi ve yarın tekrar edeceğin şeyi not et.
7. Gün sonunda Settings içinden Cloud'a yedekle veya Senkronize et kullan.

## Listen nasıl kullanılacak

Listen ekranında önce metni dinle, sonra transkripti takip et. Yakalaman gereken cümlelere dikkat et. Mini task cevabını kısa ama gerçek bir cümleyle yaz. Amaç yalnızca anlamak değil, duyduğun kalıpları konuşmada kullanmaya hazırlanmaktır.

## Words nasıl kullanılacak

Words ekranında her kelimenin anlamını, telaffuzunu ve örnek cümlesini incele. Kelime seslendirmesi varsa kelimeyi ve örnek cümleyi dinle. En alttaki yazma alanında o günkü kelimelerden en az birini kullanarak kendi cümleni yaz.

## Speak nasıl kullanılacak

Speak ekranında önce hızlı bir ilk deneme yaz. Sonra hedef cümlelere ve self-check maddelerine bakarak ikinci denemeyi daha net hale getir. Erken günlerde 2-4 cümle, ilerleyen günlerde 4-6 cümle hedeflenir.

## Review nasıl kullanılacak

Review ekranında cevapları ezbere bakmadan yaz. "Kontrol et" butonuyla cevabı karşılaştır. Hatalıysa beklenen cevabı not al ve gerekirse Journal'a yarın tekrar edilecek konu olarak ekle.

## Journal nasıl kullanılacak

Journal, aynı cihazdaki yerel çalışma defteridir. O gün yazdığın Listen, Words, Speak ve Review cevaplarını görmene yardım eder. "Bugün zorlandığım şey" ve "Yarın tekrar etmem gereken şey" alanları pilot değerlendirmesi için özellikle önemlidir.

## Cloud sync ne zaman yapılacak

Cloud sync günlük çalışmadan sonra yapılmalıdır. Settings içinden:

- "Cloud'a yedekle" local kayıtları cloud'a gönderir.
- "Cloud'dan geri yükle" başka cihazdaki cloud kayıtlarını bu tarayıcıya alır.
- "Senkronize et" local ve cloud kayıtları son güncelleme zamanına göre dengeler.

Admin panelde güncel görünmek için çalışma sonrası Cloud'a yedekle veya Senkronize et kullan.

## Admin panelde neler görülebilir

Admin, aynı takıma bağlı kullanıcılar için şunları görebilir:

- aktif gün
- son görülme / son sync zamanı
- tamamlanan modüller
- review durumu ve cevap özeti
- yazılı pratik cevapları
- journal notları

Ses kayıtları tutulmaz. Cloud'a sync edilen yazılı cevaplar ve ilerleme bilgileri admin tarafından görülebilir. Local kayıtlar cihazda kalır. Admin panelde güncel görünmek için cloud sync gerekir.

## Kullanıcıdan beklenen minimum günlük çıktı

Her kullanıcıdan günlük minimum beklenti:

- Listen mini task için 1-2 cümle
- Words alanında en az 1 kendi cümlesi
- Speak alanında ilk deneme ve ikinci deneme
- Review cevaplarının kontrol edilmesi
- Journal'da zorlanılan konu veya yarın tekrar edilecek konu için kısa not
- Gün sonunda cloud sync

## Pilot sonunda değerlendirilecek kriterler

Pilot sonunda şu kriterlere bakılır:

- kullanıcılar kayıt ve giriş akışını tamamlayabildi mi
- günlük çalışma akışı anlaşılır mı
- kullanıcılar her gün minimum çıktıyı üretti mi
- cloud sync düzenli yapıldı mı
- admin panel ekip ilerlemesini yeterince net gösteriyor mu
- içerik seviyesi ve süre gerçek kullanıma uygun mu
- kullanıcılar Listen, Words, Speak, Review ve Journal arasındaki ilişkiyi anladı mı

## Admin pilot checklist

- Kullanıcı kayıt oldu mu?
- Kullanıcı profile `team_id` ile aynı takıma bağlandı mı?
- Kullanıcı Day 1 veya test günü çalıştı mı?
- Kullanıcı Cloud'a yedekle yaptı mı?
- Kullanıcı `/admin` içinde görünüyor mu?
- `/admin/users/[userId]` detayları açılıyor mu?
- Kullanıcının yazılı cevapları ve journal notları beklenen şekilde görünüyor mu?
- Admin olmayan kullanıcı `/admin` verilerini göremiyor mu?

## Sık görülebilecek sorunlar ve çözümler

### Kullanıcı admin panelde görünmüyor

Kullanıcının giriş yaptığını, doğru takıma bağlandığını ve Cloud'a yedekle veya Senkronize et kullandığını kontrol et.

### Yazılan cevaplar başka cihazda görünmüyor

Local kayıtlar cihazda kalır. Başka cihazda görmek için önce eski cihazda Cloud'a yedekle, sonra yeni cihazda Cloud'dan geri yükle veya Senkronize et kullan.

### Giriş yapılamıyor

E-posta, şifre ve Supabase bağlantı ayarlarını kontrol et. Gerekirse kullanıcı çıkış yapıp tekrar giriş denemelidir.

### Ses çalışmıyor

ElevenLabs yapılandırmasının hazır olduğunu Settings üzerinden kontrol et. Ses sorunu çalışma cevaplarının kaydedilmesini engellemez.

### Kullanıcı sync yapmayı unutuyor

Pilot boyunca günlük kapanış rutini olarak Settings içinden Cloud'a yedekle veya Senkronize et kullanılması istenmelidir.
