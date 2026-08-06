import type { Metadata } from "next";
import { ButtonLink, CompactSection, PageHeader } from "@/components/ui";
import {
  getDeviceLabModuleIntro,
  learnerReadyDeviceLabDevices,
} from "@/lib/device-lab";
import { DeviceLabCompletionStatus } from "./_components/device-lab-completion-status";

export const metadata: Metadata = {
  title: "Device Lab",
};

export default function DeviceLabPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Professional English"
        title="Device Lab"
        description="Kaynak destekli cihaz İngilizcesini kısa facts, words ve konuşma göreviyle çalış."
      />

      <section aria-labelledby="device-list-title" className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Yayımlanmış cihazlar
          </p>
          <h2
            id="device-list-title"
            className="mt-1 text-2xl font-semibold leading-tight"
          >
            Kısa cihaz pratikleri
          </h2>
        </div>

        <div className="grid gap-4">
          {learnerReadyDeviceLabDevices.map((device) => {
            const modules = device.modules.filter(
              (module) => module.releaseStatus === "learner_ready",
            );
            const intro = getDeviceLabModuleIntro(modules[0]);
            const moduleIds = modules.map((module) => module.id);

            return (
              <CompactSection
                key={device.slug}
                eyebrow={device.categoryEn}
                title={device.productName}
                description={intro}
              >
                <p className="text-sm font-semibold leading-6 text-muted">
                  {device.categoryTr}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <DeviceLabCompletionStatus
                    deviceSlug={device.slug}
                    moduleIds={moduleIds}
                  />
                  <span className="inline-flex min-h-8 items-center rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs font-black leading-none text-muted">
                    {modules.length} kısa modül
                  </span>
                </div>
                <ButtonLink
                  href={`/device-lab/${device.slug}`}
                  className="mt-4 w-full focus-visible:ring-offset-surface sm:w-auto"
                >
                  Cihazı aç
                </ButtonLink>
              </CompactSection>
            );
          })}
        </div>
      </section>
    </div>
  );
}
