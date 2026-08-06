"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getOrRequestTtsAudio,
  type CachedTtsAudio,
} from "./audio-cache";
import type {
  TtsAudioFormat,
  TtsAudioMetadata,
  TtsFailureCode,
  TtsWordTiming,
} from "./types";

export type AudioControllerState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "error";

export type AudioControllerRequest = {
  cacheKey: string;
  id: string;
  includeAlignment?: boolean;
  text: string;
};

export type AudioControllerError = {
  code: TtsFailureCode;
  message: string;
};

type AudioControllerSnapshot = {
  activeId: string;
  alignment: TtsWordTiming[];
  currentTime: number;
  contentType?: TtsAudioFormat;
  duration: number;
  error: AudioControllerError | null;
  hasEnded: boolean;
  metadata?: TtsAudioMetadata;
  state: AudioControllerState;
};

const MEDIA_READY_TIMEOUT_MS = 6_000;

function waitForAudioMetadata(audio: HTMLAudioElement) {
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new DOMException("Audio metadata timed out", "TimeoutError"));
    }, MEDIA_READY_TIMEOUT_MS);

    function cleanup() {
      window.clearTimeout(timeout);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("error", handleError);
    }

    function handleLoaded() {
      cleanup();
      resolve();
    }

    function handleError() {
      cleanup();
      reject(new DOMException("Audio metadata failed", "NotSupportedError"));
    }

    audio.addEventListener("loadedmetadata", handleLoaded, { once: true });
    audio.addEventListener("error", handleError, { once: true });
    audio.load();
  });
}

function playbackError(error: unknown): AudioControllerError {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return {
      code: "playback_blocked",
      message:
        "Tarayıcı ses oynatmayı engelledi. Dinle düğmesine tekrar basabilirsin.",
    };
  }

  if (error instanceof DOMException && error.name === "TimeoutError") {
    return {
      code: "timeout",
      message: "Ses yüklenemedi. Bağlantını kontrol edip tekrar dene.",
    };
  }

  return {
    code: "playback_failed",
    message: "Ses oynatılamadı. Lütfen tekrar dene.",
  };
}

export function useAudioController() {
  const [snapshot, setSnapshot] = useState<AudioControllerSnapshot>({
    activeId: "",
    alignment: [],
    currentTime: 0,
    duration: 0,
    error: null,
    hasEnded: false,
    state: "idle",
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<AudioControllerRequest | null>(null);
  const runRef = useRef(0);

  const releaseAudio = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    const audio = audioRef.current;
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audioRef.current = null;
  }, []);

  const dispose = useCallback(() => {
    runRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    releaseAudio();
  }, [releaseAudio]);

  const stop = useCallback(() => {
    dispose();
    setSnapshot({
      activeId: "",
      alignment: [],
      currentTime: 0,
      duration: 0,
      error: null,
      hasEnded: false,
      state: "idle",
    });
  }, [dispose]);

  useEffect(() => dispose, [dispose]);

  const playExisting = useCallback(
    async (fromStart = false) => {
      const audio = audioRef.current;

      if (!audio) {
        return false;
      }

      const runId = runRef.current;

      try {
        if (fromStart) {
          audio.currentTime = 0;
        }

        setSnapshot((current) => ({
          ...current,
          currentTime: fromStart ? 0 : current.currentTime,
          error: null,
          hasEnded: false,
          state: "loading",
        }));
        await audio.play();

        if (runRef.current !== runId) {
          return false;
        }

        setSnapshot((current) => ({
          ...current,
          error: null,
          state: "playing",
        }));
        return true;
      } catch (error) {
        if (runRef.current !== runId) {
          return false;
        }

        setSnapshot((current) => ({
          ...current,
          error: playbackError(error),
          state: "error",
        }));
        return false;
      }
    },
    [],
  );

  const play = useCallback(
    async (request: AudioControllerRequest, forceReload = false) => {
      lastRequestRef.current = request;

      if (
        !forceReload &&
        snapshot.activeId === request.id &&
        audioRef.current &&
        (snapshot.state === "paused" || snapshot.hasEnded)
      ) {
        return playExisting(snapshot.hasEnded);
      }

      runRef.current += 1;
      const runId = runRef.current;
      abortControllerRef.current?.abort();
      releaseAudio();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setSnapshot({
        activeId: request.id,
        alignment: [],
        currentTime: 0,
        duration: 0,
        error: null,
        hasEnded: false,
        state: "loading",
      });

      const result = await getOrRequestTtsAudio({
        cacheKey: request.cacheKey,
        includeAlignment: request.includeAlignment,
        signal: controller.signal,
        text: request.text,
      });

      if (controller.signal.aborted || runRef.current !== runId) {
        return false;
      }

      abortControllerRef.current = null;

      if ("ok" in result && !result.ok) {
        if (result.code === "aborted") {
          setSnapshot((current) => ({ ...current, state: "idle" }));
          return false;
        }

        setSnapshot((current) => ({
          ...current,
          error: { code: result.code, message: result.message },
          state: "error",
        }));
        return false;
      }

      const cached = result as CachedTtsAudio;
      const audio = new Audio(cached.objectUrl);
      audio.preload = "auto";
      audioRef.current = audio;
      audio.ontimeupdate = () => {
        if (runRef.current === runId) {
          setSnapshot((current) => ({
            ...current,
            currentTime: audio.currentTime,
          }));
        }
      };
      audio.onended = () => {
        if (runRef.current === runId) {
          setSnapshot((current) => ({
            ...current,
            currentTime: 0,
            hasEnded: true,
            state: "idle",
          }));
        }
      };
      audio.onerror = () => {
        if (runRef.current === runId) {
          setSnapshot((current) => ({
            ...current,
            error: playbackError(null),
            state: "error",
          }));
        }
      };

      try {
        await waitForAudioMetadata(audio);

        if (
          runRef.current !== runId ||
          !Number.isFinite(audio.duration) ||
          audio.duration <= 0
        ) {
          throw new DOMException("Invalid audio duration", "NotSupportedError");
        }

        setSnapshot((current) => ({
          ...current,
          alignment: cached.alignment ?? [],
          contentType: cached.contentType,
          duration: audio.duration,
          metadata: cached.metadata,
        }));
        await audio.play();

        if (runRef.current !== runId) {
          return false;
        }

        setSnapshot((current) => ({
          ...current,
          error: null,
          state: "playing",
        }));
        return true;
      } catch (error) {
        if (runRef.current !== runId || controller.signal.aborted) {
          return false;
        }

        setSnapshot((current) => ({
          ...current,
          error: playbackError(error),
          state: "error",
        }));
        return false;
      }
    },
    [playExisting, releaseAudio, snapshot.activeId, snapshot.hasEnded, snapshot.state],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || snapshot.state !== "playing") {
      return;
    }

    audio.pause();
    setSnapshot((current) => ({
      ...current,
      currentTime: audio.currentTime,
      state: "paused",
    }));
  }, [snapshot.state]);

  const cancel = useCallback(() => {
    if (snapshot.state === "loading") {
      stop();
      return;
    }

    pause();
  }, [pause, snapshot.state, stop]);

  const retry = useCallback(async () => {
    if (!lastRequestRef.current) {
      return false;
    }

    return play(lastRequestRef.current, true);
  }, [play]);

  return {
    ...snapshot,
    cancel,
    pause,
    play,
    playExisting,
    retry,
    stop,
  };
}
