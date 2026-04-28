"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ListeningDrill } from "@/lib/listening-content";
import { getTtsServiceStatus, requestTtsAudio } from "@/lib/tts/client";
import type { TtsWordTiming } from "@/lib/tts/types";

type AudioState = "idle" | "loading" | "playing" | "paused" | "ended" | "error";
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
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [ttsConfigState, setTtsConfigState] =
    useState<TtsConfigState>("checking");
  const [audioError, setAudioError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [wordTimings, setWordTimings] = useState<TtsWordTiming[]>([]);
  const [hasLoadedAudio, setHasLoadedAudio] = useState(false);
  const [audioDay, setAudioDay] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const playbackRunRef = useRef(0);
  const intentionalStopRef = useRef(false);
  const canShowAudioControls = ttsConfigState === "configured";
  const transcriptSegments = useMemo(
    () => createTranscriptSegments(drill.transcriptExcerpt),
    [drill.transcriptExcerpt],
  );
  const currentWordIndex = useMemo(() => {
    if (
      wordTimings.length === 0 ||
      audioDay !== drill.day ||
      (audioState !== "playing" && audioState !== "paused")
    ) {
      return -1;
    }

    return wordTimings.findIndex((word, index) => {
      const nextStart = wordTimings[index + 1]?.start;
      const wordEnd =
        typeof nextStart === "number" ? Math.max(word.end, nextStart) : word.end;

      return currentTime >= word.start && currentTime < wordEnd;
    });
  }, [audioDay, audioState, currentTime, drill.day, wordTimings]);
  const compactAudioLabel =
    audioState === "loading"
      ? "Yükleniyor"
      : audioState === "playing"
        ? "Durdur"
        : audioState === "paused"
          ? "Devam et"
          : "Dinle";
  const compactAudioAriaLabel =
    audioState === "playing"
      ? "Duraklat"
      : audioState === "paused"
        ? "Devam et"
        : "Metni dinle";
  const compactAudioDisabled = !canShowAudioControls;

  function resolveTtsStatus(
    configured: boolean,
    reason: TtsStatusReason | "checking" | undefined,
  ) {
    const nextReason = configured ? "configured" : reason || "server_route_error";
    setTtsConfigState(configured ? "configured" : "notConfigured");
    return nextReason;
  }

  const releaseAudio = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.onended = null;
      audio.onerror = null;
      audio.ontimeupdate = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      window.URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isActive = true;
    let fallbackTimer: number | undefined;

    try {
      fallbackTimer = window.setTimeout(() => {
        if (!isActive) {
          return;
        }

        resolveTtsStatus(false, "loading_timeout");
        setAudioError(
          "Ses servisi kontrolü zaman aşımına uğradı. Lütfen bağlantını kontrol edip tekrar dene.",
        );
      }, 7_000);
    } catch {
      fallbackTimer = window.setTimeout(() => {
        resolveTtsStatus(false, "server_route_error");
        setAudioError("Ses servisi kontrol edilemedi. Lütfen sayfayı yenile.");
      }, 0);
    }

    async function checkTtsStatus() {
      const status = await getTtsServiceStatus().catch(() => ({
        configured: false,
        reason: "request_failed" as const,
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

      if (!status.configured) {
        setAudioError(
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
    intentionalStopRef.current = true;
    playbackRunRef.current += 1;
    releaseAudio();
    const resetTimer = window.setTimeout(() => {
      setAudioError("");
      setAudioState("idle");
      setCurrentTime(0);
      setWordTimings([]);
      setHasLoadedAudio(false);
      setAudioDay(null);
    }, 0);

    return () => {
      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }

      intentionalStopRef.current = true;
      playbackRunRef.current += 1;
      releaseAudio();
    };
  }, [drill.day, releaseAudio]);

  async function startGeneratedAudio() {
    if (!canShowAudioControls) {
      return;
    }

    playbackRunRef.current += 1;
    const runId = playbackRunRef.current;
    intentionalStopRef.current = false;
    releaseAudio();
    setAudioError("");
    setCurrentTime(0);
    setWordTimings([]);
    setHasLoadedAudio(false);
    setAudioDay(null);
    setAudioState("loading");

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const result = await requestTtsAudio(
      drill.transcriptExcerpt,
      abortController.signal,
    );

    if (
      abortController.signal.aborted ||
      intentionalStopRef.current ||
      playbackRunRef.current !== runId
    ) {
      return;
    }

    abortControllerRef.current = null;

    if (!result.ok) {
      if (result.code === "aborted") {
        setAudioState("idle");
        setAudioError("");
        return;
      }

      setAudioState("error");
      setAudioError(result.message);

      if (result.code === "not_configured") {
        resolveTtsStatus(false, result.reason ?? "server_route_error");
      }

      return;
    }

    try {
      const audioUrl = window.URL.createObjectURL(result.audio);
      const audio = new Audio(audioUrl);

      audioUrlRef.current = audioUrl;
      audioRef.current = audio;
      setHasLoadedAudio(true);
      setAudioDay(drill.day);
      setWordTimings(result.alignment ?? []);
      audio.onended = () => {
        if (playbackRunRef.current === runId && !intentionalStopRef.current) {
          setCurrentTime(0);
          setAudioState("ended");
        }
      };
      audio.onerror = () => {
        if (playbackRunRef.current === runId && !intentionalStopRef.current) {
          setAudioState("error");
          setAudioError("Ses oynatılamadı. Lütfen tekrar dene.");
        }
      };
      audio.ontimeupdate = () => {
        if (playbackRunRef.current === runId) {
          setCurrentTime(audio.currentTime);
        }
      };

      await audio.play();

      if (intentionalStopRef.current || playbackRunRef.current !== runId) {
        releaseAudio();
        return;
      }

      setAudioState("playing");
    } catch (error) {
      const wasStopped =
        intentionalStopRef.current ||
        playbackRunRef.current !== runId ||
        abortController.signal.aborted ||
        (error instanceof DOMException && error.name === "AbortError");

      releaseAudio();
      setHasLoadedAudio(false);
      setAudioDay(null);

      if (wasStopped) {
        setAudioError("");
        return;
      }

      setAudioState("error");
      setAudioError("Ses oynatılamadı. Lütfen tekrar dene.");
    }
  }

  async function playExistingAudio(fromStart: boolean) {
    const audio = audioRef.current;

    if (!audio) {
      await startGeneratedAudio();
      return;
    }

    try {
      intentionalStopRef.current = false;
      setAudioError("");

      if (fromStart) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      await audio.play();
      setAudioState("playing");
    } catch {
      if (intentionalStopRef.current) {
        setAudioError("");
        return;
      }

      setAudioState("error");
      setAudioError("Ses oynatılamadı. Lütfen tekrar dene.");
    }
  }

  async function handlePrimaryAudioAction() {
    if (audioState === "paused") {
      await playExistingAudio(false);
      return;
    }

    if (audioState === "ended" && audioRef.current) {
      await playExistingAudio(true);
      return;
    }

    await startGeneratedAudio();
  }

  async function handleCompactAudioAction() {
    if (audioState === "playing" || audioState === "loading") {
      pauseOrCancelPlayback();
      return;
    }

    await handlePrimaryAudioAction();
  }

  function pauseOrCancelPlayback() {
    setAudioError("");

    if (audioState === "loading") {
      intentionalStopRef.current = true;
      playbackRunRef.current += 1;
      releaseAudio();
      setHasLoadedAudio(false);
      setAudioDay(null);
      setCurrentTime(0);
      setAudioState("idle");
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      setAudioState("idle");
      return;
    }

    intentionalStopRef.current = true;
    audio.pause();
    setCurrentTime(audio.currentTime);
    setAudioState("paused");
  }

  function saveResponse() {
    setSaveState("saved");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:p-6">
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
            <button
              type="button"
              onClick={handlePrimaryAudioAction}
              disabled={audioState === "loading" || audioState === "playing"}
              className="min-h-12 rounded-full bg-white px-4 py-3 text-sm font-bold text-[#17201a] shadow-sm outline-none transition hover:bg-[#efe5d6] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
            >
              {audioState === "loading"
                ? "Ses hazırlanıyor"
                : audioState === "playing"
                  ? "Oynatılıyor"
                  : audioState === "paused"
                    ? "Devam et"
                    : audioState === "ended" || audioState === "error"
                  ? "Tekrar oynat"
                  : "Metni dinle"}
            </button>
            <button
              type="button"
              onClick={pauseOrCancelPlayback}
              disabled={audioState !== "loading" && audioState !== "playing"}
              className="min-h-12 rounded-full border border-surface/35 px-4 py-3 text-sm font-bold text-white outline-none transition hover:bg-surface/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-surface/15 disabled:text-white/45 focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
            >
              Durdur
            </button>
            {hasLoadedAudio &&
            audioDay === drill.day &&
            (audioState === "playing" ||
              audioState === "paused" ||
              audioState === "ended") ? (
              <button
                type="button"
                onClick={() => {
                  void playExistingAudio(true);
                }}
                className="min-h-11 rounded-full border border-surface/25 px-4 py-2.5 text-sm font-bold text-sage outline-none transition hover:bg-surface/10 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss sm:col-span-2"
              >
                Baştan oynat
              </button>
            ) : null}
          </div>
        ) : null}

        {ttsConfigState === "checking" ? (
          <div className="mt-5 rounded-[1.25rem] border border-surface/25 bg-surface/10 p-4 text-sm font-semibold leading-6 text-sage">
            Ses servisi kontrol ediliyor.
          </div>
        ) : null}

        {ttsConfigState === "notConfigured" ? (
          <div className="mt-5 rounded-[1.25rem] border border-surface/25 bg-surface/10 p-4 text-sm font-semibold leading-6 text-sage">
            <p>Ses servisi henüz yapılandırılmadı.</p>
            <p className="mt-2 text-sage/85">
              ElevenLabs API anahtarı ve ses ayarları eklendiğinde bu bölüm
              gerçek ses dosyasıyla oynatılacak.
            </p>
          </div>
        ) : null}

        {audioError ? (
          <p className="mt-3 rounded-[1.25rem] border border-surface/25 bg-surface/10 p-4 text-sm font-semibold leading-6 text-sage">
            {audioError}
          </p>
        ) : null}

      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Ne yapacaksın?
        </p>
        <p className="mt-3 text-base leading-7 text-muted">
          Önce metni dinle. Sonra transcripti oku ve cümlelerin doğal sırasını
          fark et. Hedef ezber yapmak değil; kısa, gerçek İngilizceyi yakalayıp
          kendi cümleni kurmak.
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
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
            <button
              type="button"
              onClick={() => {
                void handleCompactAudioAction();
              }}
              disabled={compactAudioDisabled}
              aria-label={compactAudioAriaLabel}
              className="min-h-10 rounded-full bg-[#17201a] px-3.5 py-2 text-xs font-black text-white shadow-sm outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {compactAudioLabel}
            </button>
            <span className="rounded-full bg-linen px-3 py-2 text-xs font-bold text-moss">
              Day {drill.day}
            </span>
          </div>
        </div>
        <p className="mt-4 rounded-[1.4rem] bg-background/85 p-4 text-[1.03rem] leading-8 text-foreground">
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

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Yakalaman gereken cümleler
          </p>
          <h3 className="mt-1 text-2xl font-semibold leading-tight">
            Sesli tekrar et
          </h3>
        </div>
        <div className="grid gap-3">
          {drill.keyLines.map((line, index) => (
            <div
              key={line}
              className="rounded-[1.4rem] border border-foreground/10 bg-surface p-4 shadow-soft"
            >
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                  {index + 1}
                </span>
                <p className="pt-1 text-base font-semibold leading-7">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Mini task
        </p>
        <p className="mt-3 text-base leading-7 text-muted">{drill.miniTaskTr}</p>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <label
          htmlFor="listen-response"
          className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm"
        >
          Kısa cevabın
        </label>
        <p className="mt-2 text-base leading-7 text-muted">
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
          className="mt-4 w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
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
            Cevabın bu ekranda tutuldu. Şimdilik kalıcı kayıt yok.
          </p>
        ) : null}
      </section>
    </div>
  );
}
