import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

const dailySteps = [
  "Today ekranında aktif günü kontrol et.",
  "Listen bölümünde metni dinle, mini task cevabını yaz ve kaydet.",
  "Words bölümünde kelimeleri çalış, örnek cümleleri dinle ve kendi cümleni yaz.",
  "Speak bölümünde ilk denemeyi yaz, sonra ikinci denemeyi daha net hale getir.",
  "Review bölümünde cevapları kontrol et.",
  "Journal bölümünde zorlandığın şeyi ve yarın tekrar edeceğin şeyi not et.",
];

const practiceRules = [
  "Hedef çizgilerini tam cevabın olarak kopyalama; kendi cümleni kur.",
  "Her cevapta en az bir kişisel detay ekle.",
  "Second try, first try’dan belirgin şekilde daha net olmalı.",
  "Journal’da günün en zayıf noktasını kısa not olarak yaz.",
];

const dataSteps = [
  "İlerleme yalnızca bu tarayıcıdaki yerel depolamada tutulur.",
  "Ayarlar bölümünden aktif gün, pratik ilerlemesi ve Device Lab kayıtlarını tek JSON dosyası olarak indirebilirsin.",
  "Tarayıcı verisini temizlemeden veya cihaz değiştirmeden önce güncel bir JSON yedeği al.",
  "Yeni tarayıcıda yedek dosyasını seçip Yerel yedeği içe aktar butonunu kullan.",
];

export default function PilotPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Local guide"
        title="Yerel kullanım rehberi"
        description="Günlük çalışma akışını ve bu cihazdaki ilerlemeni koruma adımlarını hızlıca gör."
      />

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Günlük akış
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Bugün ne yapacağım?
          </h2>
        </div>
        <ol className="space-y-3">
          {dailySteps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-black text-moss">
                {index + 1}
              </span>
              <span className="text-sm font-semibold leading-6 text-muted">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Çalışma bütünlüğü
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Küçük ama gerçek üretim
          </h2>
        </div>
        <div className="grid gap-3">
          {practiceRules.map((item) => (
            <p
              key={item}
              className="rounded-[1.25rem] bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]"
            >
              {item}
            </p>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Yerel veri
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            İlerlemeni yedekle
          </h2>
        </div>
        <div className="grid gap-3">
          {dataSteps.map((item) => (
            <p
              key={item}
              className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4 text-sm font-semibold leading-6 text-muted"
            >
              {item}
            </p>
          ))}
        </div>
      </Card>

      <Link
        href="/settings"
        className="flex min-h-12 items-center justify-center rounded-full border border-foreground/20 bg-linen px-5 py-4 text-center text-sm font-black text-[#17201a] outline-none transition visited:text-[#17201a] hover:bg-sage hover:text-[#17201a] active:scale-[0.98] active:text-[#17201a] focus-visible:text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
      >
        Settings’e dön
      </Link>
    </div>
  );
}
