import { Card } from "@/components/ui";

export function TeamPrivacyNotice() {
  return (
    <Card className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
        Ekip kullanımı ve görünürlük
      </p>
      <div className="space-y-3 text-sm font-semibold leading-6 text-muted">
        <p>
          Argos Speak 90 İngilizce pratiklerini ve günlük ilerlemeyi takip etmek
          için kullanılır.
        </p>
        <p>
          Giriş yapıp cloud sync kullandığında aktif günün, tamamladığın
          modüller, review durumu, yazılı pratik cevapların ve journal notların
          ekip yöneticisi tarafından görülebilir.
        </p>
        <p>
          Ses dosyaları kullanıcı ilerlemesine kaydedilmez. ElevenLabs API
          anahtarları kullanıcı ilerlemesi içinde saklanmaz.
        </p>
        <p>
          Yerel ilerleme, cloud’a yedeklemediğin sürece bu cihazdaki tarayıcıda
          kalır. Cloud sync isteğe bağlıdır; ancak farklı cihazdan geri yükleme
          ve admin takibi için cloud’a yedekleme gerekir.
        </p>
      </div>
    </Card>
  );
}
