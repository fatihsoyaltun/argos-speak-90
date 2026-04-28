import "server-only";

import type {
  TtsAudioRequest,
  TtsAudioResponse,
  TtsProvider,
  TtsWordTiming,
} from "./types";

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";
const DEFAULT_MODEL_ID = "eleven_flash_v2_5";
const OUTPUT_FORMAT = "mp3_44100_128";

export type ElevenLabsTtsConfig = {
  apiKey?: string;
  voiceId?: string;
  modelId?: string;
};

export type ElevenLabsConfigStatus =
  | "configured"
  | "missing_api_key"
  | "missing_voice_id";

type ElevenLabsCharacterAlignment = {
  characters?: unknown;
  character_start_times_seconds?: unknown;
  character_end_times_seconds?: unknown;
};

type ElevenLabsTimestampResponse = {
  audio_base64?: unknown;
  alignment?: ElevenLabsCharacterAlignment | null;
  normalized_alignment?: ElevenLabsCharacterAlignment | null;
};

type ValidElevenLabsCharacterAlignment = {
  characters: unknown[];
  character_start_times_seconds: unknown[];
  character_end_times_seconds: unknown[];
};

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy.buffer;
}

function isValidCharacterAlignment(
  alignment: ElevenLabsCharacterAlignment | null | undefined,
): alignment is ValidElevenLabsCharacterAlignment {
  return Boolean(
    alignment &&
    Array.isArray(alignment.characters) &&
    Array.isArray(alignment.character_start_times_seconds) &&
    Array.isArray(alignment.character_end_times_seconds) &&
    alignment.characters.length ===
      alignment.character_start_times_seconds.length &&
    alignment.characters.length === alignment.character_end_times_seconds.length
  );
}

function characterAlignmentToWords(
  alignment: ElevenLabsCharacterAlignment | null | undefined,
): TtsWordTiming[] | undefined {
  if (!isValidCharacterAlignment(alignment)) {
    return undefined;
  }

  const characters = alignment.characters as string[];
  const starts = alignment.character_start_times_seconds as number[];
  const ends = alignment.character_end_times_seconds as number[];
  const words: TtsWordTiming[] = [];
  let text = "";
  let start = 0;
  let end = 0;

  function pushWord() {
    if (!text.trim()) {
      text = "";
      return;
    }

    words.push({
      index: words.length,
      text,
      start,
      end,
    });
    text = "";
  }

  characters.forEach((character, index) => {
    if (typeof character !== "string" || /\s/.test(character)) {
      pushWord();
      return;
    }

    const characterStart = Number(starts[index]);
    const characterEnd = Number(ends[index]);

    if (!Number.isFinite(characterStart) || !Number.isFinite(characterEnd)) {
      pushWord();
      return;
    }

    if (!text) {
      start = characterStart;
    }

    text += character;
    end = characterEnd;
  });

  pushWord();

  return words.length > 0 ? words : undefined;
}

export class ElevenLabsTtsProvider implements TtsProvider {
  private readonly apiKey?: string;
  private readonly voiceId?: string;
  private readonly modelId: string;

  constructor(config: ElevenLabsTtsConfig) {
    this.apiKey = config.apiKey;
    this.voiceId = config.voiceId;
    this.modelId = config.modelId || DEFAULT_MODEL_ID;
  }

  isConfigured() {
    return this.getConfigStatus() === "configured";
  }

  getConfigStatus(): ElevenLabsConfigStatus {
    if (!this.apiKey?.trim()) {
      return "missing_api_key";
    }

    if (!this.voiceId?.trim()) {
      return "missing_voice_id";
    }

    return "configured";
  }

  private createMetadata(hasAlignment: boolean) {
    return {
      modelId: this.modelId,
      voiceId: this.voiceId ?? "",
      hasAlignment,
    };
  }

  getMetadata() {
    return this.createMetadata(false);
  }

  async generateAudio({
    text,
  }: TtsAudioRequest): Promise<TtsAudioResponse> {
    try {
      return await this.generateAudioWithTimestamps({ text });
    } catch {
      return this.generatePlainAudio({ text });
    }
  }

  private async generateAudioWithTimestamps({
    text,
  }: TtsAudioRequest): Promise<TtsAudioResponse> {
    if (!this.isConfigured()) {
      throw new Error("ElevenLabs TTS is not configured.");
    }

    const response = await fetch(
      `${ELEVENLABS_API_BASE}/text-to-speech/${this.voiceId}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey ?? "",
        },
        body: JSON.stringify({
          text,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            speed: 0.95,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `ElevenLabs TTS with timestamps failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as ElevenLabsTimestampResponse;

    if (typeof data.audio_base64 !== "string") {
      throw new Error("ElevenLabs timestamp response did not include audio.");
    }

    const audioBuffer = Buffer.from(data.audio_base64, "base64");

    const alignment = characterAlignmentToWords(data.alignment);

    return {
      audio: bufferToArrayBuffer(audioBuffer),
      contentType: "audio/mpeg",
      alignment,
      metadata: this.createMetadata(Boolean(alignment?.length)),
    };
  }

  private async generatePlainAudio({
    text,
  }: TtsAudioRequest): Promise<TtsAudioResponse> {
    if (!this.isConfigured()) {
      throw new Error("ElevenLabs TTS is not configured.");
    }

    const response = await fetch(
      `${ELEVENLABS_API_BASE}/text-to-speech/${this.voiceId}?output_format=${OUTPUT_FORMAT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey ?? "",
        },
        body: JSON.stringify({
          text,
          model_id: this.modelId,
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            speed: 0.95,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS failed with status ${response.status}.`);
    }

    return {
      audio: await response.arrayBuffer(),
      contentType: "audio/mpeg",
      metadata: this.createMetadata(false),
    };
  }
}
