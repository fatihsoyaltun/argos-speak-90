import "server-only";

import { ElevenLabsTtsProvider } from "./elevenlabs";
import type { TtsProvider } from "./types";

export function getElevenLabsTtsProvider() {
  return new ElevenLabsTtsProvider({
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID,
    modelId: process.env.ELEVENLABS_MODEL_ID,
  });
}

export function getTtsProvider(): TtsProvider {
  return getElevenLabsTtsProvider();
}
