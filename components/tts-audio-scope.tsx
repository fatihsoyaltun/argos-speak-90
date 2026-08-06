"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AudioAction } from "@/components/audio-action";
import { createTtsCacheKey } from "@/lib/tts/audio-cache";
import { getTtsServiceStatus } from "@/lib/tts/client";
import { splitTtsText } from "@/lib/tts/text-chunks";
import {
  type AudioControllerRequest,
  useAudioController,
} from "@/lib/tts/use-audio-controller";

type TtsConfigState = "checking" | "configured" | "notConfigured";

type TtsAudioScopeValue = {
  audio: ReturnType<typeof useAudioController>;
  configState: TtsConfigState;
  createRequest: (id: string, text: string) => AudioControllerRequest;
};

const TtsAudioScopeContext = createContext<TtsAudioScopeValue | null>(null);

function useTtsAudioScope() {
  const value = useContext(TtsAudioScopeContext);

  if (!value) {
    throw new Error("TtsAudioAction must be rendered inside TtsAudioScope.");
  }

  return value;
}

export function TtsAudioScope({
  children,
  day,
  scope,
}: {
  children: ReactNode;
  day: number;
  scope: string;
}) {
  const audio = useAudioController();
  const stopAudio = audio.stop;
  const [configState, setConfigState] =
    useState<TtsConfigState>("checking");
  const [modelId, setModelId] = useState("");
  const [voiceId, setVoiceId] = useState("");

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

      setConfigState(status.configured ? "configured" : "notConfigured");
      setModelId(status.modelId ?? "");
      setVoiceId(status.voiceId ?? "");
    }

    void checkTtsStatus();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [day, scope, stopAudio]);

  const value = useMemo<TtsAudioScopeValue>(
    () => ({
      audio,
      configState,
      createRequest: (id, text) => ({
        cacheKey: createTtsCacheKey({
          day,
          includeAlignment: false,
          modelId,
          scope,
          text,
          voiceId,
        }),
        id,
        includeAlignment: false,
        text,
      }),
    }),
    [audio, configState, day, modelId, scope, voiceId],
  );

  return (
    <TtsAudioScopeContext.Provider value={value}>
      {children}
    </TtsAudioScopeContext.Provider>
  );
}

export function TtsAudioStatus({ className = "" }: { className?: string }) {
  const { configState } = useTtsAudioScope();

  if (configState === "configured") {
    return null;
  }

  return (
    <p
      role="status"
      className={`rounded-[1rem] border border-foreground/10 bg-linen/70 px-3 py-2 text-sm font-semibold leading-5 text-foreground ${className}`}
    >
      {configState === "checking"
        ? "Ses servisi kontrol ediliyor."
        : "Ses servisi şu anda kullanılamıyor."}
    </p>
  );
}

export function TtsAudioAction({
  className = "",
  id,
  idleAriaLabel,
  idleLabel = "Dinle",
  text,
  variant = "secondary",
}: {
  className?: string;
  id: string;
  idleAriaLabel: string;
  idleLabel?: string;
  text: string;
  variant?: "primary" | "secondary" | "soft" | "ghost";
}) {
  const { audio, configState, createRequest } = useTtsAudioScope();
  const chunks = useMemo(() => splitTtsText(text), [text]);

  if (chunks.length === 0) {
    return null;
  }

  async function handleAction(request: AudioControllerRequest) {
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
    <div className="grid min-w-0 gap-2">
      {chunks.length > 1 ? (
        <p className="text-xs font-semibold leading-5 text-muted">
          Metin {chunks.length} bölüme ayrıldı; her bölüm ayrı bir Dinle
          eylemiyle başlar.
        </p>
      ) : null}
      <div className="flex min-w-0 flex-wrap gap-2">
        {chunks.map((chunk, index) => {
          const actionId =
            chunks.length === 1 ? id : `${id}-part-${index + 1}`;
          const isActive = audio.activeId === actionId;
          const partLabel =
            chunks.length === 1
              ? idleLabel
              : `${idleLabel} ${index + 1}/${chunks.length}`;
          const unavailableLabel =
            configState === "checking"
              ? "Ses kontrol ediliyor…"
              : "Ses kullanılamıyor";
          const ariaLabel =
            chunks.length === 1
              ? idleAriaLabel
              : `${idleAriaLabel}, bölüm ${index + 1} / ${chunks.length}`;
          const request = createRequest(actionId, chunk);

          return (
            <AudioAction
              key={actionId}
              active={isActive}
              state={audio.state}
              disabled={configState !== "configured"}
              onAction={() => {
                void handleAction(request);
              }}
              idleAriaLabel={
                configState === "configured" ? ariaLabel : unavailableLabel
              }
              labels={{
                idle:
                  configState === "configured" ? partLabel : unavailableLabel,
                retry: "Tekrar dene",
              }}
              variant={variant}
              className={className}
            />
          );
        })}
      </div>
      {audio.error && chunks.some((_, index) => {
        const actionId = chunks.length === 1 ? id : `${id}-part-${index + 1}`;
        return audio.activeId === actionId;
      }) ? (
        <p
          role="alert"
          className="rounded-[1rem] border border-clay/20 bg-linen/70 p-3 text-sm font-semibold leading-5 text-foreground"
        >
          {audio.error.message}
        </p>
      ) : null}
    </div>
  );
}
