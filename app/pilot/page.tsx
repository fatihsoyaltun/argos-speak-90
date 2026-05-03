import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";

const dailySteps = [
  "Today ekranında aktif günü kontrol et.",
  "Listen bölümünde metni dinle, mini task cevabını yaz ve kaydet.",
  "Words bölümünde kelimeleri çalış, örnek cümleleri dinle ve kendi cümleni yaz.",
  "Speak bölümünde ilk denemeyi yaz, sonra ikinci denemeyi daha net hale getir.",
  "Review bölümünde cevapları kontrol et.",
  "Journal bölümünde zorlandığın şeyi ve yarın tekrar edeceğin şeyi not et.",
  "Settings içinden Cloud'a yedekle veya Senkronize et kullan.",
];

const memberChecklist = [
  "Hesap oluştururken ekip görünürlüğü onayını ver.",
  "Her gün en az bir Listen cevabı, bir Words cümlesi ve iki Speak denemesi yaz.",
  "Review cevaplarını kontrol etmeden günü kapatma.",
  "Admin panelde güncel görünmek için çalışma sonrası cloud sync yap.",
];

const pilotIntegrityRules = [
  "Hedef çizgileri tam cevabın olarak kopyalama; kendi cümleni kur.",
  "Her cevapta en az bir kişisel detay ekle.",
  "Second try, first try’dan belirgin şekilde daha net olmalı.",
  "Journal’da günün en zayıf noktasını kısa not olarak yaz.",
  "Admin, sync edilen cevapları öğrenme ilerlemesi için inceler; amaç ceza değil gelişimi görmektir.",
];

const adminVisibility = [
  "aktif gün",
  "tamamlanan modüller",
  "review durumu",
  "yazılı pratik cevapları",
  "journal notları",
];

const problemTips = [
  {
    title: "Admin panelde görünmüyorsan",
    text: "Giriş yaptığını, doğru takıma bağlı olduğunu ve Cloud'a yedekle yaptığını kontrol et.",
  },
  {
    title: "Başka cihazda cevapların yoksa",
    text: "Eski cihazda cloud sync yap, yeni cihazda Cloud'dan geri yükle veya Senkronize et kullan.",
  },
  {
    title: "Ses çalışmıyorsa",
    text: "Settings içinde ses durumunu kontrol et. Ses sorunu yazılı çalışmanı kaydetmene engel değildir.",
  },
];

export default function PilotPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Pilot guide"
        title="Pilot kullanım rehberi"
        description="Ekip pilotunda nasıl kayıt olunacağını, her gün ne yapılacağını ve cloud sync'in ne zaman kullanılacağını hızlıca gör."
      />

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Üye için hızlı başlangıç
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            İlk gün ne yapacağım?
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
            Minimum günlük çıktı
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Her gün küçük ama gerçek üretim
          </h2>
        </div>
        <div className="grid gap-3">
          {memberChecklist.map((item) => (
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
            Pilot bütünlüğü
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Gerçek üretim kuralları
          </h2>
        </div>
        <div className="grid gap-3">
          {pilotIntegrityRules.map((item) => (
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
            Cloud sync ve admin görünürlüğü
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Admin neyi görebilir?
          </h2>
        </div>
        <p className="text-sm font-semibold leading-6 text-muted">
          Cloud’a sync edilen yazılı cevaplar ve ilerleme bilgileri ekip
          yöneticisi tarafından görülebilir. Local kayıtlar cihazda kalır.
          Admin panelde güncel görünmek için çalışma sonrası Cloud’a yedekle
          veya Senkronize et kullan.
        </p>
        <div className="flex flex-wrap gap-2">
          {adminVisibility.map((item) => (
            <span
              key={item}
              className="rounded-full bg-sage px-3 py-2 text-xs font-black text-moss"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4 text-sm font-semibold leading-6 text-muted">
          Ses kayıtları tutulmaz. ElevenLabs API anahtarı kullanıcı ilerlemesine
          kaydedilmez.
        </p>
      </Card>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Sorun olursa
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Hızlı kontrol listesi
          </h2>
        </div>
        <div className="grid gap-3">
          {problemTips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4"
            >
              <h3 className="text-base font-semibold leading-tight">
                {tip.title}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Link
        href="/settings"
        className="flex min-h-12 items-center justify-center rounded-full border border-foreground/20 bg-linen px-5 py-4 text-center text-sm font-black !text-[#17201a] outline-none transition visited:!text-[#17201a] hover:bg-sage hover:!text-[#17201a] active:scale-[0.98] active:!text-[#17201a] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
      >
        Settings’e dön
      </Link>
    </div>
  );
}
