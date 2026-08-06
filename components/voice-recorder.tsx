"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button, Feedback } from "@/components/ui";
import {
  getVoiceRecordingErrorMessage,
  selectVoiceRecorderMimeType,
  VOICE_RECORDER_PERMISSION_TIMEOUT_MS,
  VOICE_RECORDING_MAX_SECONDS,
} from "@/lib/voice-recording";

type RecorderPhase =
  | "checking"
  | "idle"
  | "requesting"
  | "recording"
  | "stopping"
  | "ready"
  | "error"
  | "unsupported";

type ActiveRecorder = {
  id: string;
  stop: () => void;
};

let activeRecorder: ActiveRecorder | null = null;
const recorderButtonClassName = "voice-recorder-control";
const recorderButtonStyle = { outlineColor: "var(--focus-ring)" } as const;

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

async function requestMicrophoneWithTimeout() {
  let didTimeOut = false;
  let timeoutId: number | null = null;
  const mediaPromise = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      didTimeOut = true;
      reject({ name: "PermissionTimeoutError" });
    }, VOICE_RECORDER_PERMISSION_TIMEOUT_MS);
  });

  try {
    return await Promise.race([mediaPromise, timeoutPromise]);
  } catch (error) {
    if (didTimeOut) {
      void mediaPromise.then(stopStream).catch(() => undefined);
    }
    throw error;
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}

export function VoiceRecorder({
  label,
  maxSeconds = VOICE_RECORDING_MAX_SECONDS,
}: {
  label: string;
  maxSeconds?: number;
}) {
  const recorderId = useId();
  const statusId = `${recorderId}-status`;
  const privacyId = `${recorderId}-privacy`;
  const [phase, setPhase] = useState<RecorderPhase>("checking");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingUrlRef = useRef<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const limitTimerRef = useRef<number | null>(null);
  const requestGenerationRef = useRef(0);
  const mountedRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const safeMaxSeconds = Math.min(120, Math.max(60, maxSeconds));

  const clearRecordingTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (limitTimerRef.current !== null) {
      window.clearTimeout(limitTimerRef.current);
      limitTimerRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    stopStream(streamRef.current);
    streamRef.current = null;
  }, []);

  const revokeRecordingUrl = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = null;
    }
    setRecordingUrl(null);
    setIsPlaying(false);
  }, []);

  const stopRecording = useCallback(() => {
    clearRecordingTimers();
    const recorder = recorderRef.current;

    if (activeRecorder?.id === recorderId) {
      activeRecorder = null;
    }

    if (recorder && recorder.state !== "inactive") {
      setPhase("stopping");
      recorder.stop();
    } else {
      releaseStream();
    }
  }, [clearRecordingTimers, recorderId, releaseStream]);

  useEffect(() => {
    mountedRef.current = true;
    const isSupported =
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof window.MediaRecorder !== "undefined";
    const supportTimer = window.setTimeout(() => {
      setPhase(isSupported ? "idle" : "unsupported");
    }, 0);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(supportTimer);
      requestGenerationRef.current += 1;
      clearRecordingTimers();
      if (activeRecorder?.id === recorderId) {
        activeRecorder = null;
      }

      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.ondataavailable = null;
        recorder.onerror = null;
        recorder.onstop = null;
        recorder.stop();
      }
      recorderRef.current = null;
      releaseStream();
      if (recordingUrlRef.current) {
        URL.revokeObjectURL(recordingUrlRef.current);
        recordingUrlRef.current = null;
      }
    };
  }, [clearRecordingTimers, recorderId, releaseStream]);

  async function startRecording() {
    const requestGeneration = requestGenerationRef.current + 1;
    requestGenerationRef.current = requestGeneration;
    setErrorMessage("");
    setPhase("requesting");

    try {
      const stream = await requestMicrophoneWithTimeout();

      if (
        !mountedRef.current ||
        requestGeneration !== requestGenerationRef.current
      ) {
        stopStream(stream);
        return;
      }

      activeRecorder?.stop();
      revokeRecordingUrl();
      streamRef.current = stream;
      chunksRef.current = [];

      const selectedMimeType = selectVoiceRecorderMimeType(
        window.MediaRecorder.isTypeSupported?.bind(window.MediaRecorder),
      );
      const recorder = new MediaRecorder(
        stream,
        selectedMimeType ? { mimeType: selectedMimeType } : undefined,
      );
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onerror = (event) => {
        clearRecordingTimers();
        releaseStream();
        recorderRef.current = null;
        if (activeRecorder?.id === recorderId) {
          activeRecorder = null;
        }
        if (mountedRef.current) {
          setErrorMessage(getVoiceRecordingErrorMessage(event));
          setPhase("error");
        }
      };
      recorder.onstop = () => {
        clearRecordingTimers();
        releaseStream();
        recorderRef.current = null;
        if (activeRecorder?.id === recorderId) {
          activeRecorder = null;
        }

        if (!mountedRef.current) {
          chunksRef.current = [];
          return;
        }

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || selectedMimeType || undefined,
        });
        chunksRef.current = [];

        if (blob.size === 0) {
          setErrorMessage(
            "Kayıt boş döndü. Mikrofonu kontrol edip yeniden deneyebilirsin.",
          );
          setPhase("error");
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        recordingUrlRef.current = objectUrl;
        setRecordingUrl(objectUrl);
        setPhase("ready");
      };

      recorder.start(250);
      activeRecorder = { id: recorderId, stop: stopRecording };
      const startedAt = Date.now();
      setElapsedSeconds(0);
      setPhase("recording");
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds(
          Math.min(
            safeMaxSeconds,
            Math.floor((Date.now() - startedAt) / 1000),
          ),
        );
      }, 250);
      limitTimerRef.current = window.setTimeout(
        stopRecording,
        safeMaxSeconds * 1000,
      );
    } catch (error) {
      releaseStream();
      if (mountedRef.current) {
        setErrorMessage(getVoiceRecordingErrorMessage(error));
        setPhase("error");
      }
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !recordingUrl) {
      return;
    }

    setErrorMessage("");
    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      setErrorMessage(getVoiceRecordingErrorMessage(error));
    }
  }

  function deleteRecording() {
    revokeRecordingUrl();
    setErrorMessage("");
    setElapsedSeconds(0);
    setPhase("idle");
  }

  if (phase === "unsupported") {
    return (
      <div data-voice-recorder={label} className="mt-4">
        <Feedback tone="warning">
          Bu tarayıcı yerel ses kaydını desteklemiyor. Mikrofon gerektirmeden
          metin görevine devam edebilirsin.
        </Feedback>
      </div>
    );
  }

  return (
    <div
      data-voice-recorder={label}
      className="mt-4 rounded-[1.2rem] border border-foreground/10 bg-background/80 p-4"
      aria-describedby={`${statusId} ${privacyId}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-foreground">{label}</p>
          <p id={statusId} aria-live="polite" className="mt-1 text-sm font-semibold text-muted">
            {phase === "checking" ? "Kayıt desteği kontrol ediliyor…" : null}
            {phase === "idle" ? `En fazla ${safeMaxSeconds} saniye.` : null}
            {phase === "requesting" ? "Mikrofon izni bekleniyor…" : null}
            {phase === "recording"
              ? `Kayıt sürüyor · ${formatDuration(elapsedSeconds)} / ${formatDuration(safeMaxSeconds)}`
              : null}
            {phase === "stopping" ? "Kayıt hazırlanıyor…" : null}
            {phase === "ready" ? "Kayıt hazır. Dinleyebilir veya yeniden deneyebilirsin." : null}
            {phase === "error" ? "Kayıt kullanılamadı." : null}
          </p>
        </div>
        {phase === "recording" ? (
          <span className="inline-flex min-h-8 items-center rounded-full border border-danger bg-danger-soft px-3 py-1.5 text-xs font-black text-danger">
            ● Kayıt
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {phase === "checking" ? (
          <Button
            disabled
            variant="secondary"
            className={recorderButtonClassName}
            style={recorderButtonStyle}
          >
            Kontrol ediliyor
          </Button>
        ) : null}
        {phase === "idle" || phase === "error" ? (
          <Button
            className={recorderButtonClassName}
            style={recorderButtonStyle}
            onClick={() => void startRecording()}
          >
            Kaydı başlat
          </Button>
        ) : null}
        {phase === "requesting" ? (
          <Button
            className={recorderButtonClassName}
            style={recorderButtonStyle}
            isLoading
            loadingLabel="Mikrofon bekleniyor…"
          >
            Kaydı başlat
          </Button>
        ) : null}
        {phase === "recording" ? (
          <Button
            className={recorderButtonClassName}
            style={recorderButtonStyle}
            variant="danger"
            onClick={stopRecording}
          >
            Kaydı durdur
          </Button>
        ) : null}
        {phase === "stopping" ? (
          <Button
            className={recorderButtonClassName}
            style={recorderButtonStyle}
            isLoading
            loadingLabel="Kayıt hazırlanıyor…"
          >
            Kaydı durdur
          </Button>
        ) : null}
        {phase === "ready" ? (
          <>
            <Button
              className={recorderButtonClassName}
              style={recorderButtonStyle}
              variant="soft"
              onClick={() => void togglePlayback()}
            >
              {isPlaying ? "Dinlemeyi duraklat" : "Kaydı dinle"}
            </Button>
            <Button
              className={recorderButtonClassName}
              style={recorderButtonStyle}
              variant="secondary"
              onClick={() => void startRecording()}
            >
              Yeniden kaydet
            </Button>
            <Button
              className={recorderButtonClassName}
              style={recorderButtonStyle}
              variant="danger"
              onClick={deleteRecording}
            >
              Kaydı sil
            </Button>
          </>
        ) : null}
      </div>

      {errorMessage ? (
        <Feedback tone="error" className="mt-3">
          {errorMessage}
        </Feedback>
      ) : null}

      <p id={privacyId} className="mt-3 text-xs font-semibold leading-5 text-muted">
        Yalnız bu sekmede tutulur; yenilemede silinir. Cihaza kalıcı kaydedilmez,
        buluta yüklenmez, yazıya dökülmez ve puanlanmaz.
      </p>

      {recordingUrl ? (
        <audio
          ref={audioRef}
          src={recordingUrl}
          preload="metadata"
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      ) : null}
    </div>
  );
}
