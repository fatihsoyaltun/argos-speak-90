import { Card } from "@/components/ui";

export function TeamPrivacyNotice() {
  return (
    <Card className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
        Ekip kullanımı ve görünürlük
      </p>
      <div className="space-y-3 text-sm font-semibold leading-6 text-muted">
        <p>
          Bu uygulama İngilizce pratik ilerlemesini takip etmek için kullanılır.
        </p>
        <p>
          Giriş yapıp cloud sync kullandığında aktif günün, tamamladığın
          modüller, review durumu, yazılı pratik cevapların ve journal notların
          ekip yöneticisi tarafından görülebilir.
        </p>
        <p>
          Ses kayıtları tutulmaz. ElevenLabs API anahtarı kullanıcı ilerlemesine
          kaydedilmez.
        </p>
        <p>
          Yerel ilerleme, cloud’a yedeklemediğin sürece bu cihazdaki tarayıcıda
          kalır. Cloud sync isteğe bağlıdır; ancak farklı cihazdan geri yükleme
          ve admin panelde görünmek için cloud’a yedekleme gerekir.
        </p>
      </div>
    </Card>
  );
}
