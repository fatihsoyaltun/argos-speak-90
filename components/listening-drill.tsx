"use client";

import { useEffect, useMemo, useState } from "react";
import { AudioAction } from "@/components/audio-action";
import {
  CompactSection,
  ExpandableCard,
  StatusPill,
  TaskStepper,
} from "@/components/ui";
import type { ListeningDrill } from "@/lib/listening-content";
import { getTtsServiceStatus } from "@/lib/tts/client";
import { createTtsCacheKey } from "@/lib/tts/audio-cache";
import { useAudioController } from "@/lib/tts/use-audio-controller";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";

type TtsConfigState = "checking" | "configured" | "notConfigured";
type TtsStatusReason =
  | "configured"
  | "missing_api_key"
  | "missing_voice_id"
  | "server_route_error"
  | "loading_timeout"
  | "request_failed";

type TranscriptSegment = {
  id: string;
  text: string;
  wordIndex?: number;
};

function createTranscriptSegments(text: string): TranscriptSegment[] {
  const parts = text.match(/\s+|\S+/g) ?? [text];
  let wordIndex = 0;

  return parts.map((part, index) => {
    if (/^\s+$/.test(part)) {
      return {
        id: `space-${index}`,
        text: part,
      };
    }

    const segment = {
      id: `word-${wordIndex}-${index}`,
      text: part,
      wordIndex,
    };

    wordIndex += 1;
    return segment;
  });
}

const transcriptTokenClass =
  "rounded-md px-1 py-0.5 font-normal leading-[inherit] transition-colors duration-150";
const activeTranscriptTokenClass = "bg-[#f29f05] text-[#201609]";
const inactiveTranscriptTokenClass = "bg-transparent text-foreground";
export function ListeningDrillView({ drill }: { drill: ListeningDrill }) {
  const [response, setResponse] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const audio = useAudioController();
  const stopAudio = audio.stop;
  const [ttsConfigState, setTtsConfigState] =
    useState<TtsConfigState>("checking");
  const [statusError, setStatusError] = useState("");
  const [ttsModelId, setTtsModelId] = useState("");
  const [ttsVoiceId, setTtsVoiceId] = useState("");
  const canShowAudioControls = ttsConfigState === "configured";
  const audioId = `listen-${drill.day}`;
  const ttsCacheKey = useMemo(
    () =>
      createTtsCacheKey({
        day: drill.day,
        includeAlignment: true,
        modelId: ttsModelId,
        text: drill.transcriptExcerpt,
        voiceId: ttsVoiceId,
      }),
    [drill.day, drill.transcriptExcerpt, ttsModelId, ttsVoiceId],
  );
  const transcriptSegments = useMemo(
    () => createTranscriptSegments(drill.transcriptExcerpt),
    [drill.transcriptExcerpt],
  );
  const currentWordIndex = useMemo(() => {
    if (
      audio.alignment.length === 0 ||
      audio.activeId !== audioId ||
      (audio.state !== "playing" && audio.state !== "paused")
    ) {
      return -1;
    }

    return audio.alignment.findIndex((word, index) => {
      const nextStart = audio.alignment[index + 1]?.start;
      const wordEnd =
        typeof nextStart === "number" ? Math.max(word.end, nextStart) : word.end;

      return audio.currentTime >= word.start && audio.currentTime < wordEnd;
    });
  }, [audio.activeId, audio.alignment, audio.currentTime, audio.state, audioId]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(drill.day);
      setResponse(progress.listenOutput);
      setSaveState("idle");
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [drill.day]);

  function resolveTtsStatus(
    configured: boolean,
    reason: TtsStatusReason | "checking" | undefined,
  ) {
    const nextReason = configured ? "configured" : reason || "server_route_error";
    setTtsConfigState(configured ? "configured" : "notConfigured");
    return nextReason;
  }

  useEffect(() => {
    let isActive = true;
    let fallbackTimer: number | undefined;

    try {
      fallbackTimer = window.setTimeout(() => {
        if (!isActive) {
          return;
        }

        resolveTtsStatus(false, "loading_timeout");
        setStatusError(
          "Ses servisi kontrolü zaman aşımına uğradı. Lütfen bağlantını kontrol edip tekrar dene.",
        );
      }, 7_000);
    } catch {
      fallbackTimer = window.setTimeout(() => {
        resolveTtsStatus(false, "server_route_error");
        setStatusError("Ses servisi kontrol edilemedi. Lütfen sayfayı yenile.");
      }, 0);
    }

    async function checkTtsStatus() {
      const status = await getTtsServiceStatus().catch(() => ({
        configured: false,
        reason: "request_failed" as const,
        modelId: "",
        voiceId: "",
      }));

      if (!isActive) {
        return;
      }

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }

      const nextReason = resolveTtsStatus(
        status.configured,
        status.reason ?? "server_route_error",
      );

      setTtsModelId(status.modelId ?? "");
      setTtsVoiceId(status.voiceId ?? "");

      if (!status.configured) {
        setStatusError(
          nextReason === "loading_timeout"
            ? "Ses servisi kontrolü zaman aşımına uğradı. Lütfen bağlantını kontrol edip tekrar dene."
            : nextReason === "request_failed" ||
                nextReason === "server_route_error"
              ? "Ses servisi kontrol edilemedi. Lütfen sayfayı yenileyip tekrar dene."
              : "",
        );
      }
    }

    checkTtsStatus();

    return () => {
      isActive = false;

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [drill.day, stopAudio]);

  const audioRequest = useMemo(
    () => ({
      cacheKey: ttsCacheKey,
      id: audioId,
      includeAlignment: true,
      text: drill.transcriptExcerpt,
    }),
    [audioId, drill.transcriptExcerpt, ttsCacheKey],
  );

  async function handleAudioAction() {
    const isActive = audio.activeId === audioId;

    if (isActive && (audio.state === "loading" || audio.state === "playing")) {
      audio.cancel();
      return;
    }

    if (isActive && audio.state === "error") {
      await audio.retry();
      return;
    }

    await audio.play(audioRequest);
  }

  async function replayAudio() {
    if (audio.activeId === audioId && audio.duration > 0) {
      await audio.playExisting(true);
      return;
    }

    await audio.play(audioRequest);
  }

  function saveResponse() {
    saveDayProgress(drill.day, { listenOutput: response });
    markDayTaskCompleted(drill.day, "listen");
    setSaveState("saved");
  }

  const hasResponse = response.trim().length > 0;
  const hasListenedToCurrentDay =
    audio.activeId === audioId && audio.duration > 0;

  return (
    <div className="space-y-4">
      <section className="rounded-[1.55rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:rounded-[1.75rem] sm:p-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage sm:text-sm">
            Bugünkü çalışma
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance">
            {drill.title}
          </h2>
          <p className="text-sm leading-6 text-sage/95">{drill.focus}</p>
        </div>

        {canShowAudioControls ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <AudioAction
              active={audio.activeId === audioId}
              state={audio.state}
              onAction={() => {
                void handleAudioAction();
              }}
              idleAriaLabel="Metni dinle"
              labels={{
                idle: audio.hasEnded ? "Tekrar oynat" : "Metni dinle",
                loading: "Hazırlanıyor…",
                retry: "Tekrar dene",
              }}
              variant="secondary"
              className="min-h-12 focus-visible:ring-offset-moss"
            />
            <button
              type="button"
              onClick={audio.cancel}
              disabled={
                audio.activeId !== audioId ||
                (audio.state !== "loading" && audio.state !== "playing")
              }
              className="min-h-12 rounded-full border border-surface/35 px-4 py-3 text-sm font-bold text-white outline-none transition hover:bg-surface/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-surface/15 disabled:text-white/45 focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
            >
              Durdur
            </button>
            {audio.activeId === audioId && audio.duration > 0 ? (
              <button
                type="button"
                onClick={() => {
                  void replayAudio();
                }}
                className="min-h-11 rounded-full border border-surface/25 px-4 py-2.5 text-sm font-bold text-sage outline-none transition hover:bg-surface/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss sm:col-span-2"
              >
                Baştan oynat
              </button>
            ) : null}
          </div>
        ) : null}

        {ttsConfigState === "checking" ? (
          <div className="mt-4 rounded-[1.15rem] border border-surface/25 bg-surface/10 p-3 text-sm font-semibold leading-6 text-sage">
            Ses servisi kontrol ediliyor.
          </div>
        ) : null}

        {ttsConfigState === "notConfigured" ? (
          <div className="mt-4 rounded-[1.15rem] border border-surface/25 bg-surface/10 p-3 text-sm font-semibold leading-6 text-sage">
            <p>Ses servisi henüz yapılandırılmadı.</p>
            <p className="mt-2 text-sage/85">
              ElevenLabs API anahtarı ve ses ayarları eklendiğinde bu bölüm
              gerçek ses dosyasıyla oynatılacak.
            </p>
          </div>
        ) : null}

        {statusError || audio.error ? (
          <p className="mt-3 rounded-[1.15rem] border border-surface/25 bg-surface/10 p-3 text-sm font-semibold leading-6 text-sage">
            {audio.error?.message || statusError}
          </p>
        ) : null}

      </section>

      <TaskStepper
        steps={[
          {
            label: "Listen",
            status: hasListenedToCurrentDay
              ? "done"
              : canShowAudioControls
                ? "active"
                : "pending",
          },
          { label: "Read", status: hasResponse ? "done" : "active" },
          { label: "Catch lines", status: hasResponse ? "done" : "active" },
          { label: "Write", status: hasResponse ? "done" : "active" },
        ]}
      />

      <ExpandableCard
        eyebrow="Ne yapacaksın?"
        title="Dinle, oku, kısa cevap yaz"
        description="Detaylı çalışma yönlendirmesini ihtiyaç duyunca aç."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          Önce metni dinle. Sonra transcripti oku ve cümlelerin doğal sırasını
          fark et. Hedef ezber yapmak değil; kısa, gerçek İngilizceyi yakalayıp
          kendi cümleni kurmak.
        </p>
      </ExpandableCard>

      <section className="rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
              Transcript
            </p>
            <h3 className="mt-1 text-xl font-semibold leading-tight">
              Listen, then read
            </h3>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <AudioAction
              active={audio.activeId === audioId}
              state={audio.state}
              onAction={() => {
                void handleAudioAction();
              }}
              disabled={!canShowAudioControls}
              idleAriaLabel="Metni dinle"
              labels={{ idle: "Dinle", playing: "Durdur" }}
              className="px-3.5 py-2 text-xs"
            />
            <StatusPill status="active">
              Day {drill.day}
            </StatusPill>
          </div>
        </div>
        <p className="mt-4 rounded-[1.25rem] bg-background/85 p-4 text-[1.03rem] leading-8 text-foreground">
          {transcriptSegments.map((segment) => {
            const isCurrentWord =
              typeof segment.wordIndex === "number" &&
              segment.wordIndex === currentWordIndex;

            return (
              <span
                key={segment.id}
                className={
                  typeof segment.wordIndex === "number"
                    ? `${transcriptTokenClass} ${
                        isCurrentWord
                          ? activeTranscriptTokenClass
                          : inactiveTranscriptTokenClass
                      }`
                    : undefined
                }
              >
                {segment.text}
              </span>
            );
          })}
        </p>
      </section>

      <ExpandableCard
        eyebrow="Yakalaman gereken cümleler"
        title="Sesli tekrar et"
        description={`${drill.keyLines.length} hedef cümle. İhtiyaç duyunca açıp tekrar et.`}
      >
        <div className="grid gap-2">
          {drill.keyLines.map((line, index) => (
            <div
              key={line}
              className="rounded-[1.15rem] border border-foreground/10 bg-background/85 p-3"
            >
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm font-semibold leading-6 text-foreground">
                  {line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      <CompactSection
        eyebrow="Mini task"
        title="Kısa cevabın"
        description={drill.miniTaskTr}
      >
        <label
          htmlFor="listen-response"
          className="sr-only"
        >
          Kısa cevabın
        </label>
        <p className="rounded-[1.15rem] bg-linen px-3 py-2 text-sm font-semibold leading-6 text-[#2d261d]">
          {drill.outputPrompt}
        </p>
        <textarea
          id="listen-response"
          value={response}
          onChange={(event) => {
            setResponse(event.target.value);
            setSaveState("idle");
          }}
          rows={5}
          placeholder="Example: I have a slow morning. First, I need coffee."
          className="mt-3 w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        <button
          type="button"
          onClick={saveResponse}
          disabled={response.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
        >
          Cevabımı kaydet
        </button>
        {saveState === "saved" ? (
          <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            Cevabın bu cihazda kaydedildi.
          </p>
        ) : null}
      </CompactSection>
    </div>
  );
}
