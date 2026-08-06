import type { Metadata } from "next";
import { ButtonLink, CompactSection, PageHeader } from "@/components/ui";
import {
  assertDeviceLabDataValid,
  deviceLabDevices,
} from "@/lib/device-lab";
import {
  ControlLabel,
  ControlLegend,
} from "./_components/device-lab-ui";

const validationResult = assertDeviceLabDataValid(deviceLabDevices);

export const metadata: Metadata = {
  title: "Device Lab",
};

export default function DeviceLabPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Professional English"
        title="Professional English / Device Lab"
        description="Burası ForenScope cihaz iletişimi için kaynak kontrollü bir profesyonel İngilizce alanıdır."
      />

      <div className="flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-moss/20 bg-sage p-3 text-sm font-semibold leading-5 text-moss">
        <ControlLabel value="safe" />
        <span>
          Statik veri kontrolü tamamlandı: {validationResult.valid ? "geçerli" : "geçersiz"}.
        </span>
      </div>

      <section aria-labelledby="device-list-title" className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Cihaz kayıtları
          </p>
          <h2 id="device-list-title" className="mt-1 text-2xl font-semibold leading-tight">
            Kaynağa göre ayrılmış cihazlar
          </h2>
        </div>

        <div className="grid gap-4">
          {deviceLabDevices.map((device) => (
            <CompactSection
              key={device.slug}
              eyebrow={device.categoryEn}
              title={device.productName}
              description={device.categoryTr}
              action={<ControlLabel value={device.releaseStatus} />}
            >
              <div className="flex flex-wrap gap-2">
                <ControlLabel value={device.sourceStrength} />
                <span className="inline-flex items-center rounded-full border border-foreground/10 bg-background px-2.5 py-1 text-[0.7rem] font-black leading-4 text-muted">
                  {device.modules.length} mevcut modül
                </span>
              </div>

              <div className="mt-4 rounded-[1.15rem] bg-background/80 p-3.5">
                <h3 className="text-sm font-black">Güvenli çalışma alanları</h3>
                <ul className="mt-2 space-y-2 text-sm font-medium leading-5 text-muted">
                  {device.safeTrainingAreasTr.slice(0, 3).map((area) => (
                    <li key={area} className="flex gap-2">
                      <span aria-hidden="true" className="text-moss">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {device.modules.length === 0 ? (
                <p className="mt-3 rounded-[1.15rem] border border-foreground/10 bg-linen p-3 text-sm font-semibold leading-6 text-[#2d261d]">
                  Metadata kaydı mevcuttur. Kaynak kontrollü öğrenen modülü henüz
                  yayımlanmamıştır; durum ertelenmiş veya blokludur.
                </p>
              ) : null}

              <ButtonLink
                href={`/device-lab/${device.slug}`}
                className="mt-4 w-full focus-visible:ring-offset-surface sm:w-auto"
              >
                Cihaz detayını aç
              </ButtonLink>
            </CompactSection>
          ))}
        </div>
      </section>

      <ControlLegend />
    </div>
  );
}
