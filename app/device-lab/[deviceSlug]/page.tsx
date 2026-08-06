import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpandableCard, PageHeader } from "@/components/ui";
import {
  getDeviceLabModuleIntro,
  getLearnerReadyDeviceLabDevice,
  learnerReadyDeviceLabDevices,
} from "@/lib/device-lab";
import { BackLink, ModuleLinkCard } from "../_components/device-lab-ui";

type DevicePageProps = {
  params: Promise<{ deviceSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return learnerReadyDeviceLabDevices.map((device) => ({
    deviceSlug: device.slug,
  }));
}

export async function generateMetadata({
  params,
}: DevicePageProps): Promise<Metadata> {
  const { deviceSlug } = await params;
  const device = getLearnerReadyDeviceLabDevice(deviceSlug);

  return {
    title: device ? `${device.productName} · Device Lab` : "Device Lab",
  };
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { deviceSlug } = await params;
  const device = getLearnerReadyDeviceLabDevice(deviceSlug);

  if (!device) {
    notFound();
  }

  const modules = device.modules.filter(
    (module) => module.releaseStatus === "learner_ready",
  );

  return (
    <div className="space-y-5">
      <BackLink href="/device-lab">Device Lab</BackLink>

      <PageHeader
        eyebrow="Device Lab"
        title={device.productName}
        description={getDeviceLabModuleIntro(modules[0])}
      />

      <section aria-labelledby="ready-modules-title" className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
            Hazır pratikler
          </p>
          <h2
            id="ready-modules-title"
            className="mt-1 text-2xl font-semibold leading-tight"
          >
            Kısa modüller
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {device.categoryTr}
          </p>
        </div>

        <div className="grid gap-3">
          {modules.map((module) => (
            <ModuleLinkCard
              key={module.id}
              deviceSlug={device.slug}
              module={module}
            />
          ))}
        </div>
      </section>

      <ExpandableCard
        eyebrow="Kaynak notları"
        title="Cihaz kapsamı"
        description="Kaynak gücü ve yayın sınırını aç."
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-[1.1rem] bg-background p-3">
            <dt className="font-black text-foreground">Kaynak gücü</dt>
            <dd className="mt-1 font-semibold text-muted">
              {device.sourceStrength}
            </dd>
          </div>
          <div className="rounded-[1.1rem] bg-background p-3">
            <dt className="font-black text-foreground">Yayın sınırı</dt>
            <dd className="mt-1 font-semibold text-muted">
              Yalnız learner_ready modüller gösterilir.
            </dd>
          </div>
        </dl>
      </ExpandableCard>
    </div>
  );
}
