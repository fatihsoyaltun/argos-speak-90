import { notFound } from "next/navigation";
import { CompactSection, PageHeader } from "@/components/ui";
import { deviceLabDevices } from "@/lib/device-lab";
import {
  BackLink,
  BlockedClaimsSection,
  ControlLabel,
  SourceReferenceList,
} from "../../_components/device-lab-ui";

type ModulePageProps = {
  params: Promise<{ deviceSlug: string; moduleId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return deviceLabDevices.flatMap((device) =>
    device.modules.map((module) => ({
      deviceSlug: device.slug,
      moduleId: module.id,
    })),
  );
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { deviceSlug, moduleId } = await params;
  const device = deviceLabDevices.find((item) => item.slug === deviceSlug);
  const learningModule = device?.modules.find((item) => item.id === moduleId);

  if (!device || !learningModule) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <BackLink href={`/device-lab/${device.slug}`}>{device.productName}</BackLink>

      <PageHeader
        eyebrow={`${device.productName} · ${learningModule.kind}`}
        title={learningModule.titleTr}
        description={learningModule.titleEn}
      />

      <div className="flex flex-wrap gap-2">
        <ControlLabel value={learningModule.releaseStatus} />
        <span className="inline-flex items-center rounded-full border border-foreground/10 bg-surface px-2.5 py-1 text-[0.7rem] font-black leading-4 text-muted">
          {learningModule.learnerLevel}
        </span>
        <span className="inline-flex items-center rounded-full border border-foreground/10 bg-surface px-2.5 py-1 text-[0.7rem] font-black leading-4 text-muted">
          read_only
        </span>
      </div>

      <CompactSection
        eyebrow="Module goal"
        title="Modül hedefi"
        description={learningModule.moduleGoalTr}
      />

      <CompactSection
        eyebrow="Source-backed claims"
        title="Kaynak destekli ifadeler"
        description="Her ifade kendi kanıt ve claim-control etiketiyle gösterilir."
      >
        <div className="grid gap-3">
          {learningModule.sourceBackedClaims.map((claim) => (
            <article
              key={claim.id}
              className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-4"
            >
              <div className="flex flex-wrap gap-2">
                <ControlLabel value={claim.claimControlLevel} />
                <ControlLabel value={claim.releaseStatus} />
                <span className="inline-flex max-w-full items-center rounded-full border border-foreground/10 bg-surface px-2.5 py-1 text-[0.7rem] font-black leading-4 break-words text-muted">
                  {claim.evidenceLevel}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
                {claim.text}
              </p>
              {claim.attributionRequired || claim.demonstrationOnly ? (
                <p className="mt-2 text-xs font-bold leading-5 text-clay">
                  {claim.attributionRequired ? "Kaynak/üretici atfı gerekli." : ""}
                  {claim.attributionRequired && claim.demonstrationOnly ? " " : ""}
                  {claim.demonstrationOnly
                    ? "Sunum demonstrasyonu olarak çerçevelenmelidir."
                    : ""}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </CompactSection>

      <CompactSection
        eyebrow="Vocabulary"
        title="Kelime ve ifadeler"
        description="İngilizce terim, Türkçe karşılık ve basit açıklama."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {learningModule.vocabulary.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold leading-5">{item.termEn}</h3>
                  <p className="mt-1 text-sm font-bold text-moss">{item.termTr}</p>
                </div>
                <ControlLabel value={item.claimControlLevel} />
              </div>
              <p className="mt-3 text-sm font-medium leading-6 text-foreground">
                {item.simpleDefinitionEn}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-muted">
                {item.simpleDefinitionTr}
              </p>
              <p className="mt-2 text-xs font-bold leading-5 text-clay">
                {item.usageNoteTr}
              </p>
            </article>
          ))}
        </div>
      </CompactSection>

      <CompactSection
        eyebrow="Listen"
        title="Dinleme metni"
        description="Bu prototipte ses veya TTS yoktur; metin yalnızca okunur."
      >
        <div className="rounded-[1.15rem] border border-moss/15 bg-sage p-4 text-[1.02rem] font-medium leading-7 text-foreground">
          {learningModule.listeningTextEn}
        </div>
        <div className="mt-3 rounded-[1.15rem] bg-background/80 p-4">
          <h3 className="text-sm font-black text-clay">Dinleme görevi</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">
            {learningModule.listeningTaskTr}
          </p>
        </div>
      </CompactSection>

      <CompactSection
        eyebrow="Speak"
        title="Konuşma görevi"
        description={learningModule.speakingPrompt.promptTr}
      >
        {learningModule.speakingPrompt.promptEn ? (
          <p className="rounded-[1.15rem] bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            {learningModule.speakingPrompt.promptEn}
          </p>
        ) : null}
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-clay">
          {learningModule.speakingPrompt.expectedOutputType}
        </p>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2">
          <li className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-moss">
              First try
            </span>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              {learningModule.firstTryInstructionTr}
            </p>
          </li>
          <li className="rounded-[1.15rem] border border-foreground/10 bg-background/80 p-4">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-moss">
              Second try
            </span>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted">
              {learningModule.secondTryInstructionTr}
            </p>
          </li>
        </ol>
      </CompactSection>

      <div className="grid gap-4 sm:grid-cols-2">
        <CompactSection
          eyebrow="Review"
          title="Tekrar görevi"
          description={learningModule.reviewTaskTr}
        />
        <CompactSection
          eyebrow="Journal"
          title="Journal sorusu"
          description={learningModule.journalPromptTr}
        />
      </div>

      <CompactSection
        eyebrow="Static coaching note"
        title="Admin coaching signal"
        description="Bu not yalnızca statik içerik olarak gösterilir; admin sistemine gönderilmez ve takip edilmez."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          {learningModule.adminCoachingSignalTr}
        </p>
      </CompactSection>

      <CompactSection
        eyebrow="Claim control"
        title="Kaynak ve ifade sınırları"
        description="Bu notlar öğrenen metninin cihaz ve kaynak sınırında kalmasına yardımcı olur."
      >
        <div className="space-y-3 text-sm font-semibold leading-6 text-muted">
          <p>{learningModule.claimControlNotesTr}</p>
          <p>{learningModule.speakingPrompt.claimControlNotesTr}</p>
        </div>
      </CompactSection>

      <BlockedClaimsSection claims={learningModule.blockedClaims} />

      <CompactSection
        eyebrow="Sources"
        title="Kaynak referansları"
        description="Dosya, bölüm ve sunum slaytı/sayfası bilgileri."
      >
        <SourceReferenceList references={learningModule.sourceReferences} />
      </CompactSection>
    </div>
  );
}
