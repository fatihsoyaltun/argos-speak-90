import "server-only";

import type {
  TtsFailureCode,
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

type ElevenLabsErrorDetail = {
  code?: string;
  message?: string;
  param?: string;
  requestId?: string;
  status?: string;
  type?: string;
};

type ElevenLabsErrorDiagnostics = ElevenLabsErrorDetail & {
  bodyExcerpt?: string;
  endpoint: string;
  fallbackFrom?: ElevenLabsErrorDiagnostics;
  modelId: string;
  upstreamStatus: number;
  voiceId: string;
};

const userMessages: Record<
  Exclude<TtsFailureCode, "aborted" | "bad_request" | "not_configured" | "request_failed">,
  string
> = {
  missing_api_key: "ElevenLabs API anahtarı eksik.",
  missing_voice_id: "ElevenLabs ses ID bilgisi eksik.",
  upstream_account_restricted:
    "ElevenLabs hesabı bu ses isteğini reddetti. Plan, hesap veya ağ kısıtını kontrol et.",
  upstream_failed:
    "ElevenLabs ses servisi yanıt vermedi. Lütfen biraz sonra tekrar dene.",
  upstream_model_error:
    "ElevenLabs model ayarı bu ses isteği için uygun değil.",
  upstream_quota_or_rate_limit:
    "ElevenLabs kullanım limiti veya hız sınırı nedeniyle ses oluşturulamadı.",
  upstream_unauthorized:
    "ElevenLabs API anahtarı bu ses isteği için yetkili değil.",
  upstream_voice_not_found:
    "ElevenLabs ses ID bulunamadı veya bu API anahtarıyla erişilemiyor.",
};

export class ElevenLabsTtsError extends Error {
  readonly bodyExcerpt?: string;
  readonly code: Exclude<TtsFailureCode, "aborted" | "bad_request" | "not_configured" | "request_failed">;
  readonly endpoint: string;
  readonly fallbackFrom?: ElevenLabsErrorDiagnostics;
  readonly modelId: string;
  readonly param?: string;
  readonly requestId?: string;
  readonly status?: string;
  readonly type?: string;
  readonly upstreamCode?: string;
  readonly upstreamMessage?: string;
  readonly upstreamStatus: number;
  readonly userMessage: string;
  readonly voiceId: string;

  constructor({
    bodyExcerpt,
    code,
    endpoint,
    fallbackFrom,
    modelId,
    param,
    requestId,
    status,
    type,
    upstreamCode,
    upstreamMessage,
    upstreamStatus,
    voiceId,
  }: {
    bodyExcerpt?: string;
    code: ElevenLabsTtsError["code"];
    endpoint: string;
    fallbackFrom?: ElevenLabsErrorDiagnostics;
    modelId: string;
    param?: string;
    requestId?: string;
    status?: string;
    type?: string;
    upstreamCode?: string;
    upstreamMessage?: string;
    upstreamStatus: number;
    voiceId: string;
  }) {
    super(upstreamMessage || userMessages[code]);
    this.name = "ElevenLabsTtsError";
    this.bodyExcerpt = bodyExcerpt;
    this.code = code;
    this.endpoint = endpoint;
    this.fallbackFrom = fallbackFrom;
    this.modelId = modelId;
    this.param = param;
    this.requestId = requestId;
    this.status = status;
    this.type = type;
    this.upstreamCode = upstreamCode;
    this.upstreamMessage = upstreamMessage;
    this.upstreamStatus = upstreamStatus;
    this.userMessage = userMessages[code];
    this.voiceId = voiceId;
  }

  toDiagnostics(): ElevenLabsErrorDiagnostics {
    return {
      bodyExcerpt: this.bodyExcerpt,
      code: this.upstreamCode,
      endpoint: this.endpoint,
      fallbackFrom: this.fallbackFrom,
      message: this.upstreamMessage,
      modelId: this.modelId,
      param: this.param,
      requestId: this.requestId,
      status: this.status,
      type: this.type,
      upstreamStatus: this.upstreamStatus,
      voiceId: this.voiceId,
    };
  }
}

function cleanConfigValue(value: string | undefined) {
  const trimmed = value?.trim().replace(/^["']|["']$/g, "");
  return trimmed || undefined;
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy.buffer;
}

function getStringProperty(source: unknown, key: string) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  const value = (source as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function normalizeElevenLabsErrorBody(body: unknown): ElevenLabsErrorDetail {
  const detail =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).detail
      : undefined;
  const source =
    detail && typeof detail === "object" ? detail : body;

  return {
    code: getStringProperty(source, "code"),
    message: getStringProperty(source, "message"),
    param: getStringProperty(source, "param"),
    requestId:
      getStringProperty(source, "request_id") ||
      getStringProperty(source, "requestId"),
    status: getStringProperty(source, "status"),
    type: getStringProperty(source, "type"),
  };
}

function classifyElevenLabsError({
  detail,
  httpStatus,
}: {
  detail: ElevenLabsErrorDetail;
  httpStatus: number;
}): ElevenLabsTtsError["code"] {
  const code = detail.code?.toLowerCase() ?? "";
  const status = detail.status?.toLowerCase() ?? "";
  const type = detail.type?.toLowerCase() ?? "";
  const message = detail.message?.toLowerCase() ?? "";
  const combined = `${code} ${status} ${type} ${message}`;

  if (combined.includes("detected_unusual_activity")) {
    return "upstream_account_restricted";
  }

  if (
    combined.includes("invalid_api_key") ||
    combined.includes("missing_api_key") ||
    combined.includes("missing_permissions") ||
    combined.includes("workspace_access_denied") ||
    combined.includes("workspace_not_found") ||
    combined.includes("permission") ||
    type === "authentication_error" ||
    httpStatus === 401 ||
    httpStatus === 403
  ) {
    return "upstream_unauthorized";
  }

  if (
    combined.includes("insufficient_credits") ||
    combined.includes("quota_exceeded") ||
    combined.includes("payment_required") ||
    combined.includes("rate_limit") ||
    combined.includes("concurrent_limit") ||
    combined.includes("system_busy") ||
    httpStatus === 402 ||
    httpStatus === 429
  ) {
    return "upstream_quota_or_rate_limit";
  }

  if (
    combined.includes("voice_not_found") ||
    combined.includes("invalid_voice_id") ||
    combined.includes("voice_access_denied") ||
    (combined.includes("voice") && httpStatus === 404)
  ) {
    return "upstream_voice_not_found";
  }

  if (
    combined.includes("unsupported_model") ||
    combined.includes("model_access_denied") ||
    combined.includes("model_not_found") ||
    combined.includes("invalid_model") ||
    combined.includes("model_id") ||
    detail.param === "model_id"
  ) {
    return "upstream_model_error";
  }

  return "upstream_failed";
}

async function readElevenLabsError(response: Response) {
  const bodyText = await response.text().catch(() => "");
  let body: unknown = bodyText;

  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }

  return {
    bodyExcerpt: bodyText.slice(0, 700),
    detail: normalizeElevenLabsErrorBody(body),
  };
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
    this.apiKey = cleanConfigValue(config.apiKey);
    this.voiceId = cleanConfigValue(config.voiceId);
    this.modelId = cleanConfigValue(config.modelId) || DEFAULT_MODEL_ID;
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
    let timestampError: ElevenLabsTtsError | undefined;

    try {
      return await this.generateAudioWithTimestamps({ text });
    } catch (error) {
      if (!(error instanceof ElevenLabsTtsError)) {
        throw error;
      }

      timestampError = error;

      if (error.code !== "upstream_failed") {
        throw error;
      }
    }

    try {
      return await this.generatePlainAudio({ text });
    } catch (error) {
      if (error instanceof ElevenLabsTtsError && timestampError) {
        throw new ElevenLabsTtsError({
          bodyExcerpt: error.bodyExcerpt,
          code: error.code,
          endpoint: error.endpoint,
          fallbackFrom: timestampError.toDiagnostics(),
          modelId: error.modelId,
          param: error.param,
          requestId: error.requestId,
          status: error.status,
          type: error.type,
          upstreamCode: error.upstreamCode,
          upstreamMessage: error.upstreamMessage,
          upstreamStatus: error.upstreamStatus,
          voiceId: error.voiceId,
        });
      }

      throw error;
    }
  }

  private async createElevenLabsFailure({
    endpoint,
    response,
  }: {
    endpoint: string;
    response: Response;
  }) {
    const { bodyExcerpt, detail } = await readElevenLabsError(response);
    const code = classifyElevenLabsError({
      detail,
      httpStatus: response.status,
    });

    return new ElevenLabsTtsError({
      bodyExcerpt,
      code,
      endpoint,
      modelId: this.modelId,
      param: detail.param,
      requestId:
        detail.requestId ||
        response.headers.get("request-id") ||
        response.headers.get("x-request-id") ||
        undefined,
      status: detail.status,
      type: detail.type,
      upstreamCode: detail.code,
      upstreamMessage: detail.message,
      upstreamStatus: response.status,
      voiceId: this.voiceId ?? "",
    });
  }

  private async generateAudioWithTimestamps({
    text,
  }: TtsAudioRequest): Promise<TtsAudioResponse> {
    if (!this.isConfigured()) {
      throw new Error("ElevenLabs TTS is not configured.");
    }

    const endpoint = "text-to-speech.with-timestamps";
    const response = await fetch(
      `${ELEVENLABS_API_BASE}/text-to-speech/${encodeURIComponent(
        this.voiceId ?? "",
      )}/with-timestamps?output_format=${OUTPUT_FORMAT}`,
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
      throw await this.createElevenLabsFailure({ endpoint, response });
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

    const endpoint = "text-to-speech";
    const response = await fetch(
      `${ELEVENLABS_API_BASE}/text-to-speech/${encodeURIComponent(
        this.voiceId ?? "",
      )}?output_format=${OUTPUT_FORMAT}`,
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
      throw await this.createElevenLabsFailure({ endpoint, response });
    }

    return {
      audio: await response.arrayBuffer(),
      contentType: "audio/mpeg",
      metadata: this.createMetadata(false),
    };
  }
}
