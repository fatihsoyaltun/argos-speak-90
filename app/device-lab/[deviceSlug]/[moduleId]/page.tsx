import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ButtonLink,
  CompactSection,
  ExpandableCard,
  PageHeader,
} from "@/components/ui";
import {
  getDeviceLabModuleIntro,
  getDeviceLabQuickFacts,
  getLearnerReadyDeviceLabDevice,
  learnerReadyDeviceLabDevices,
} from "@/lib/device-lab";
import {
  BackLink,
  ControlLabel,
  SourceReferenceList,
} from "../../_components/device-lab-ui";
import { DeviceLabCompletionStatus } from "../../_components/device-lab-completion-status";
import { DeviceLabPracticePanel } from "../../_components/device-lab-practice-panel";

type ModulePageProps = {
  params: Promise<{ deviceSlug: string; moduleId: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return learnerReadyDeviceLabDevices.flatMap((device) =>
    device.modules
      .filter((module) => module.releaseStatus === "learner_ready")
      .map((module) => ({
        deviceSlug: device.slug,
        moduleId: module.id,
      })),
  );
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { deviceSlug, moduleId } = await params;
  const device = getLearnerReadyDeviceLabDevice(deviceSlug);
  const learningModule = device?.modules.find(
    (module) =>
      module.id === moduleId && module.releaseStatus === "learner_ready",
  );

  return {
    title:
      device && learningModule
        ? `${learningModule.titleEn} · ${device.productName}`
        : "Device Lab modülü",
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { deviceSlug, moduleId } = await params;
  const device = getLearnerReadyDeviceLabDevice(deviceSlug);
  const learningModule = device?.modules.find(
    (module) =>
      module.id === moduleId && module.releaseStatus === "learner_ready",
  );

  if (!device || !learningModule) {
    notFound();
  }

  const hookPrefix = `device-lab-${learningModule.id}`;
  const intro = getDeviceLabModuleIntro(learningModule);
  const quickFacts = getDeviceLabQuickFacts(learningModule);
  const keyWords = learningModule.vocabulary.slice(0, 5);

  return (
    <div className="space-y-5">
      <BackLink href={`/device-lab/${device.slug}`}>{device.productName}</BackLink>

      <div
        id={`${hookPrefix}-intro`}
        data-device-lab-audio-hook="intro"
        data-device-lab-module-id={learningModule.id}
      >
        <PageHeader
          eyebrow={learningModule.titleEn}
          title={device.productName}
          description={intro}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DeviceLabCompletionStatus
          deviceSlug={device.slug}
          moduleIds={[learningModule.id]}
        />
        <span className="inline-flex min-h-8 items-center rounded-full border border-foreground/10 bg-surface px-3 py-1.5 text-xs font-black leading-none text-muted">
          {learningModule.learnerLevel}
        </span>
      </div>

      <nav
        aria-label="Modül akışı"
        className="grid grid-cols-2 gap-2 rounded-[1.25rem] border border-foreground/10 bg-surface p-2 shadow-soft"
      >
        <ButtonLink
          href={`#${hookPrefix}-listen`}
          className="w-full focus-visible:ring-offset-surface"
        >
          Listen
        </ButtonLink>
        <ButtonLink
          href={`#${hookPrefix}-say-it`}
          variant="secondary"
          className="w-full focus-visible:ring-offset-surface"
        >
          Say it
        </ButtonLink>
      </nav>

      <CompactSection
        eyebrow="Quick facts"
        title={`${quickFacts.length} kaynak destekli bilgi`}
        description="Kısa tut; metindeki kapsam ve atfı koru."
      >
        <ol className="grid gap-3">
          {quickFacts.map((claim, index) => (
            <li
              key={claim.id}
              id={`${hookPrefix}-fact-${claim.id}`}
              data-device-lab-audio-hook="quick-fact"
              className="flex gap-3 rounded-[1.15rem] border border-foreground/10 bg-background/80 p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-black text-moss">
                {index + 1}
              </span>
              <p className="text-[1.02rem] font-semibold leading-7 text-foreground">
                {claim.text}
              </p>
            </li>
          ))}
        </ol>
      </CompactSection>

      <CompactSection
        eyebrow="Key words"
        title="Kısa kelime listesi"
        description="İngilizce terimi ve kısa Türkçe karşılığını birlikte gör."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {keyWords.map((item) => (
            <li
              key={item.id}
              id={`${hookPrefix}-word-${item.id}`}
              data-device-lab-audio-hook="key-word"
              className="rounded-[1.1rem] border border-foreground/10 bg-background/80 p-3.5"
            >
              <p className="font-semibold leading-5 text-foreground">
                {item.termEn}
              </p>
              <p className="mt-1 text-sm font-bold text-moss">{item.termTr}</p>
            </li>
          ))}
        </ul>
      </CompactSection>

      <div
        id={`${hookPrefix}-listen`}
        data-device-lab-audio-hook="listening-text"
      >
        <CompactSection
          eyebrow="Listen"
          title="Kısa tanıtım metni"
          description="Metni bir kez yavaş, bir kez doğal hızda oku."
        >
          <p className="rounded-[1.15rem] border border-moss/15 bg-sage p-4 text-[1.05rem] font-medium leading-7 text-foreground">
            {learningModule.listeningTextEn}
          </p>
        </CompactSection>
      </div>

      <div
        id={`${hookPrefix}-say-it`}
        data-device-lab-audio-hook="say-it-prompt"
        data-device-lab-recording-hook="say-it-response"
      >
        <CompactSection
          eyebrow="Say it"
          title="Kısa konuşma görevi"
          description="Tek bir kısa deneme yap; puanlama yok."
        >
          <p className="rounded-[1.15rem] bg-sage p-4 text-[1.02rem] font-semibold leading-7 text-foreground">
            {learningModule.speakingPrompt.promptEn}
          </p>
        </CompactSection>
      </div>

      <ExpandableCard
        eyebrow="Türkçe yardım"
        title="Görev ipuçları"
        description="Yalnız gerektiğinde aç."
      >
        <div className="space-y-3 text-sm font-semibold leading-6 text-muted">
          <p>{learningModule.listeningTaskTr}</p>
          <p>{learningModule.speakingPrompt.promptTr}</p>
          <p>{learningModule.firstTryInstructionTr}</p>
        </div>
      </ExpandableCard>

      <DeviceLabPracticePanel
        deviceSlug={device.slug}
        moduleId={learningModule.id}
        moduleTitle={learningModule.titleTr}
        noteInstruction={learningModule.journalPromptTr}
      />

      <ExpandableCard
        eyebrow="Kaynak notları"
        title="Kanıt ve ifade sınırları"
        description="Claim-control, blocked kayıtlar ve kaynak referansları varsayılan olarak kapalıdır."
      >
        <div className="space-y-5">
          <section aria-labelledby={`${hookPrefix}-claim-control-title`}>
            <h3
              id={`${hookPrefix}-claim-control-title`}
              className="font-semibold text-foreground"
            >
              Claim-control
            </h3>
            <div className="mt-3 grid gap-3">
              {learningModule.sourceBackedClaims.map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-[1.1rem] border border-foreground/10 bg-background p-3.5"
                >
                  <div className="flex flex-wrap gap-2">
                    <ControlLabel value={claim.claimControlLevel} />
                    <ControlLabel value={claim.releaseStatus} />
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                    {claim.text}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-3 space-y-2 text-sm font-semibold leading-6 text-muted">
              <p>{learningModule.claimControlNotesTr}</p>
              <p>{learningModule.speakingPrompt.claimControlNotesTr}</p>
            </div>
          </section>

          <section aria-labelledby={`${hookPrefix}-blocked-title`}>
            <h3 id={`${hookPrefix}-blocked-title`} className="font-semibold text-foreground">
              Yayımlanmayan iddialar
            </h3>
            <p className="mt-1 text-sm font-semibold leading-6 text-muted">
              Bunlar öğrenme hedefi veya cihaz gerçeği olarak sunulmaz.
            </p>
            <div className="mt-3 grid gap-3">
              {learningModule.blockedClaims.map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-[1.1rem] border border-danger/20 bg-danger-soft p-3.5"
                >
                  <ControlLabel value="blocked" />
                  <p className="mt-2 text-sm font-semibold leading-6 text-foreground">
                    {claim.text}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-muted">
                    {claim.reason}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby={`${hookPrefix}-sources-title`}>
            <h3 id={`${hookPrefix}-sources-title`} className="font-semibold text-foreground">
              Kaynak referansları
            </h3>
            <div className="mt-3">
              <SourceReferenceList references={learningModule.sourceReferences} />
            </div>
          </section>
        </div>
      </ExpandableCard>
    </div>
  );
}
