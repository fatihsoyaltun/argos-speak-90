import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompactSection, PageHeader } from "@/components/ui";
import { deviceLabDevices } from "@/lib/device-lab";
import {
  BackLink,
  BlockedClaimsSection,
  ControlLabel,
  ModuleLinkCard,
} from "../_components/device-lab-ui";

type DevicePageProps = {
  params: Promise<{ deviceSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return deviceLabDevices.map((device) => ({ deviceSlug: device.slug }));
}

export async function generateMetadata({
  params,
}: DevicePageProps): Promise<Metadata> {
  const { deviceSlug } = await params;
  const device = deviceLabDevices.find((item) => item.slug === deviceSlug);

  return {
    title: device ? `${device.productName} · Device Lab` : "Device Lab",
  };
}

export default async function DevicePage({ params }: DevicePageProps) {
  const { deviceSlug } = await params;
  const device = deviceLabDevices.find((item) => item.slug === deviceSlug);

  if (!device) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <BackLink href="/device-lab">Device Lab</BackLink>

      <PageHeader
        eyebrow="Device Lab cihaz kaydı"
        title={device.productName}
        description={device.categoryTr}
      />

      <div className="flex flex-wrap gap-2">
        <ControlLabel value={device.releaseStatus} />
        <ControlLabel value={device.sourceStrength} />
      </div>

      <CompactSection
        eyebrow="Kimlik"
        title="Ürün sınırı ve adlar"
        description={device.categoryEn}
      >
        <div className="flex flex-wrap gap-2">
          {device.aliases.map((alias) => (
            <span
              key={alias}
              className="rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-xs font-bold leading-5 text-muted"
            >
              {alias}
            </span>
          ))}
        </div>
      </CompactSection>

      <CompactSection
        eyebrow="Safe"
        title="Güvenli çalışma alanları"
        description="Yalnız mevcut kaynakların izin verdiği iletişim alanları."
      >
        <ul className="space-y-2 text-sm font-semibold leading-6 text-muted">
          {device.safeTrainingAreasTr.map((area) => (
            <li key={area} className="flex gap-2">
              <span aria-hidden="true" className="text-moss">•</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </CompactSection>

      <CompactSection
        eyebrow="Cautious"
        title="Dikkatli ifade gerektiren alanlar"
        description="Atıf, kapsam veya belge sınırı görünür kalmalıdır."
        action={<ControlLabel value="cautious" />}
      >
        <ul className="space-y-2 text-sm font-semibold leading-6 text-muted">
          {device.cautiousAreasTr.map((area) => (
            <li key={area} className="flex gap-2">
              <span aria-hidden="true" className="text-clay">•</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </CompactSection>

      <CompactSection
        eyebrow="Kaynak boşlukları"
        title="Eksik belgeler"
        description="Eksik belge, özelliğin yanlış olduğu anlamına gelmez; mevcut kaynakta belgelenmediğini gösterir."
      >
        <ul className="space-y-2 text-sm font-semibold leading-6 text-muted">
          {device.missingDocumentsTr.map((document) => (
            <li key={document} className="flex gap-2">
              <span aria-hidden="true" className="text-clay">•</span>
              <span>{document}</span>
            </li>
          ))}
        </ul>
      </CompactSection>

      <CompactSection
        eyebrow="Read-only modules"
        title={`Mevcut modüller (${device.modules.length})`}
        description="Yalnız statik veri kaydında gerçekten bulunan modüller bağlantı olarak gösterilir."
      >
        {device.modules.length > 0 ? (
          <div className="grid gap-3">
            {device.modules.map((module) => (
              <ModuleLinkCard
                key={module.id}
                deviceSlug={device.slug}
                module={module}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.15rem] border border-foreground/10 bg-linen p-4">
            <p className="font-semibold leading-6 text-[#2d261d]">
              Bu kayıt metadata/deferred durumundadır. Öğrenen modülü yoktur;
              sahte veya taslak modül kartı oluşturulmamıştır.
            </p>
            {device.recommendedModules.length > 0 ? (
              <p className="mt-2 text-sm font-medium leading-6 text-muted">
                Gelecekte değerlendirilebilecek modül türleri yalnız metadata
                olarak kayıtlıdır: {device.recommendedModules.join(", ")}.
              </p>
            ) : null}
          </div>
        )}
      </CompactSection>

      <BlockedClaimsSection claims={device.blockedClaims} />
    </div>
  );
}
