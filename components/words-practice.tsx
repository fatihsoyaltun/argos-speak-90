"use client";

import { useEffect, useState } from "react";
import { AudioAction } from "@/components/audio-action";
import { ExpandableCard, ProgressStrip } from "@/components/ui";
import type { WordItem } from "@/lib/words-content";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";
import {
  createTtsCacheKey,
} from "@/lib/tts/audio-cache";
import { getTtsServiceStatus } from "@/lib/tts/client";
import {
  type AudioControllerRequest,
  useAudioController,
} from "@/lib/tts/use-audio-controller";

type WordAudioKind = "word" | "example";
type TtsConfigState = "checking" | "configured" | "notConfigured";

function getAudioId(kind: WordAudioKind, index: number) {
  return `${kind}-${index}`;
}

export function WordsPractice({
  day,
  words,
}: {
  day: number;
  words: WordItem[];
}) {
  const [sentence, setSentence] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [ttsConfigState, setTtsConfigState] =
    useState<TtsConfigState>("checking");
  const [ttsModelId, setTtsModelId] = useState("");
  const [ttsVoiceId, setTtsVoiceId] = useState("");
  const audio = useAudioController();
  const stopAudio = audio.stop;
  const canShowAudioControls = ttsConfigState === "configured";

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(day);
      setSentence(progress.wordsOutput);
      setSaveState("idle");
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [day]);

  useEffect(() => {
    let isActive = true;

    async function checkTtsStatus() {
      const status = await getTtsServiceStatus().catch(() => ({
        configured: false,
        modelId: "",
        voiceId: "",
      }));

      if (!isActive) {
        return;
      }

      setTtsConfigState(status.configured ? "configured" : "notConfigured");
      setTtsModelId(status.modelId ?? "");
      setTtsVoiceId(status.voiceId ?? "");
    }

    checkTtsStatus();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [day, stopAudio]);

  function saveSentence() {
    saveDayProgress(day, { wordsOutput: sentence });
    markDayTaskCompleted(day, "words");
    setSaveState("saved");
  }

  function createWordAudioRequest({
    id,
    kind,
    text,
  }: {
    id: string;
    kind: WordAudioKind;
    text: string;
  }): AudioControllerRequest {
    const cacheKey = createTtsCacheKey({
      day,
      includeAlignment: false,
      modelId: ttsModelId,
      scope: `words:${kind}`,
      text,
      voiceId: ttsVoiceId,
    });

    return {
      cacheKey,
      id,
      includeAlignment: false,
      text,
    };
  }

  async function handleWordAudio(request: AudioControllerRequest) {
    const isActive = audio.activeId === request.id;

    if (isActive && (audio.state === "loading" || audio.state === "playing")) {
      audio.cancel();
      return;
    }

    if (isActive && audio.state === "error") {
      await audio.retry();
      return;
    }

    await audio.play(request);
  }

  return (
    <div className="space-y-4">
      <ExpandableCard
        eyebrow="Ne yapacaksın?"
        title="Kelimeleri hızlı tara, sonra kullan"
        description="Anlamı görünür tut; örnek cümleyi ihtiyaç duyunca aç."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          Kelimeleri tek tek oku. Telaffuzu sesli dene, Türkçe anlamı kontrol
          et, sonra örnek cümleyi yüksek sesle tekrar et. Hedef kelimeyi pasif
          bilmek değil; kısa bir cümlede kullanmak.
        </p>
      </ExpandableCard>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
              Day {day} words
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              Bugün kullanacağın kelimeler
            </h2>
          </div>
          <a
            href="#word-sentence-card"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-linen px-4 py-2 text-sm font-black text-[#17201a] outline-none transition hover:bg-sage active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:min-w-fit"
          >
            Yazma pratiğine geç
          </a>
        </div>

        <ProgressStrip
          items={[
            { label: `Day ${day}`, status: "active" },
            { label: `${words.length} words`, status: "done" },
            {
              label:
                ttsConfigState === "checking"
                  ? "Audio checking"
                  : ttsConfigState === "configured"
                    ? "Audio ready"
                    : "Audio off",
              status:
                ttsConfigState === "configured"
                  ? "synced"
                  : ttsConfigState === "checking"
                    ? "pending"
                    : "noSync",
            },
          ]}
        />

        {ttsConfigState === "notConfigured" ? (
          <p className="rounded-[1.15rem] border border-foreground/10 bg-linen/70 px-4 py-3 text-sm font-semibold leading-6 text-foreground">
            Kelime seslendirme henüz yapılandırılmadı.
          </p>
        ) : null}

        <div className="grid gap-2.5">
          {words.map((item, index) => {
            const wordAudioId = getAudioId("word", index);
            const exampleAudioId = getAudioId("example", index);
            const wordIsActive = audio.activeId === wordAudioId;
            const exampleIsActive = audio.activeId === exampleAudioId;

            return (
              <article
                key={item.word}
                className="rounded-[1.35rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.6rem] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                      Word {index + 1}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
                        {item.word}
                      </h3>
                      <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
                        {item.pronunciation}
                      </span>
                    </div>
                  </div>
                  {canShowAudioControls ? (
                    <AudioAction
                      active={wordIsActive}
                      state={audio.state}
                      onAction={() => {
                        void handleWordAudio(
                          createWordAudioRequest({
                            id: wordAudioId,
                            kind: "word",
                            text: item.word,
                          }),
                        );
                      }}
                      idleAriaLabel="Kelimeyi dinle"
                      className="min-w-[5.75rem] shrink-0 px-3.5 py-2 text-xs"
                    />
                  ) : null}
                </div>

                {wordIsActive && audio.error ? (
                  <p className="mt-3 rounded-[1rem] border border-clay/20 bg-linen/70 p-3 text-sm font-semibold leading-5 text-foreground">
                    {audio.error.message}
                  </p>
                ) : null}

                <div className="mt-3 rounded-[1.15rem] bg-background/85 px-3 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    Kısa anlam
                  </p>
                  <p className="mt-1 text-base font-semibold leading-6 text-foreground">
                    {item.shortMeaningTr}
                  </p>
                </div>

                <details className="group mt-3 rounded-[1.15rem] border border-foreground/10 bg-linen/60 px-3 py-3">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-linen [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                        Example
                      </span>
                      <span className="mt-0.5 block text-sm font-semibold leading-5 text-foreground">
                        Örnek cümleyi aç
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-lg font-black leading-none text-[#17201a] transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-3 border-t border-foreground/10 pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-base font-semibold leading-7 text-foreground">
                        {item.exampleSentence}
                      </p>
                      {canShowAudioControls ? (
                        <AudioAction
                          active={exampleIsActive}
                          state={audio.state}
                          onAction={() => {
                            void handleWordAudio(
                              createWordAudioRequest({
                                id: exampleAudioId,
                                kind: "example",
                                text: item.exampleSentence,
                              }),
                            );
                          }}
                          idleAriaLabel="Örnek cümleyi dinle"
                          className="min-w-[5.75rem] shrink-0 px-3.5 py-2 text-xs"
                        />
                      ) : null}
                    </div>
                    {exampleIsActive && audio.error ? (
                      <p className="mt-3 rounded-[1rem] border border-clay/20 bg-surface/70 p-3 text-sm font-semibold leading-5 text-foreground">
                        {audio.error.message}
                      </p>
                    ) : null}
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="word-sentence-card"
        className="scroll-mt-6 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
      >
        <label
          htmlFor="word-sentence"
          className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm"
        >
          Yazma pratiği
        </label>
        <p className="mt-2 text-base leading-7 text-muted">
          Yukarıdaki kelimelerden en az birini seç. Kendi hayatınla ilgili kısa
          ve gerçek bir İngilizce cümle yaz.
        </p>
        <textarea
          id="word-sentence"
          value={sentence}
          onChange={(event) => {
            setSentence(event.target.value);
            setSaveState("idle");
          }}
          rows={5}
          placeholder="Example: I have a short meeting after work."
          className="mt-4 w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        <button
          type="button"
          onClick={saveSentence}
          disabled={sentence.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
        >
          Cümlemi kaydet
        </button>
        {saveState === "saved" ? (
          <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            Cümlen bu cihazda kaydedildi.
          </p>
        ) : null}
      </section>
    </div>
  );
}
