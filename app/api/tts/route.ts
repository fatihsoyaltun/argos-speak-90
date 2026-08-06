import { NextResponse } from "next/server";
import { ElevenLabsTtsError } from "@/lib/tts/elevenlabs";
import { getElevenLabsTtsProvider } from "@/lib/tts/provider";
import { createTtsRequestGuard } from "@/lib/tts/request-guard";
import { TTS_MAX_TEXT_LENGTH } from "@/lib/tts/text-chunks";

const MAX_REQUEST_BYTES = 8_192;
const requestGuard = createTtsRequestGuard();

export const runtime = "nodejs";

function createErrorResponse({
  code,
  message,
  reason,
  retryAfterSeconds,
  status,
}: {
  code: string;
  message: string;
  reason?: string;
  retryAfterSeconds?: number;
  status: number;
}) {
  return NextResponse.json(
    { ok: false, code, reason, message },
    {
      headers: retryAfterSeconds
        ? { "Retry-After": String(retryAfterSeconds) }
        : undefined,
      status,
    },
  );
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local-client"
  );
}

function logTtsFailure(error: ElevenLabsTtsError) {
  console.error("[api/tts] provider request failed", {
    code: error.code,
    requestId: error.requestId,
    upstreamStatus: error.upstreamStatus,
  });
}

function createTimedJsonResponse(audio: {
  alignment?: unknown[];
  audio: ArrayBuffer;
  contentType: "audio/mpeg";
  metadata: {
    audioBytes: number;
    hasAlignment: boolean;
    modelId: string;
    transport: "base64-json" | "binary";
    transportBytes: number;
    voiceId: string;
  };
}) {
  const audioBase64 = Buffer.from(audio.audio).toString("base64");
  const payload = {
    ok: true,
    audioBase64,
    contentType: audio.contentType,
    alignment: audio.alignment ?? [],
    metadata: {
      ...audio.metadata,
      audioBytes: audio.audio.byteLength,
      transport: "base64-json" as const,
      transportBytes: 0,
    },
  };

  for (let pass = 0; pass < 2; pass += 1) {
    payload.metadata.transportBytes = Buffer.byteLength(
      JSON.stringify(payload),
    );
  }

  return new Response(JSON.stringify(payload), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function GET() {
  try {
    const provider = getElevenLabsTtsProvider();
    const reason = provider.getConfigStatus();
    const metadata = provider.getMetadata();

    return NextResponse.json(
      {
        configured: reason === "configured",
        modelId: metadata.modelId,
        reason,
        voiceId: metadata.voiceId,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { configured: false, reason: "server_route_error" },
      {
        headers: { "Cache-Control": "no-store" },
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return createErrorResponse({
      code: "bad_request",
      message: "Ses isteği JSON biçiminde olmalı.",
      status: 415,
    });
  }

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return createErrorResponse({
      code: "bad_request",
      message: "Ses isteği izin verilen boyutu aşıyor.",
      status: 413,
    });
  }

  let includeAlignment = false;
  let text = "";

  try {
    const body = (await request.json()) as {
      includeAlignment?: unknown;
      text?: unknown;
    };
    text = typeof body.text === "string" ? body.text.trim() : "";
    includeAlignment = body.includeAlignment === true;
  } catch {
    return createErrorResponse({
      code: "bad_request",
      message: "Ses oluşturmak için geçerli bir metin gönderilmedi.",
      status: 400,
    });
  }

  if (!text) {
    return createErrorResponse({
      code: "bad_request",
      message: "Ses oluşturmak için metin gerekli.",
      status: 400,
    });
  }

  if (
    text.length > TTS_MAX_TEXT_LENGTH ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
  ) {
    return createErrorResponse({
      code: "bad_request",
      message: "Metin bu ses isteği için geçersiz veya çok uzun.",
      status: 400,
    });
  }

  const ttsProvider = getElevenLabsTtsProvider();

  if (!ttsProvider.isConfigured()) {
    const reason = ttsProvider.getConfigStatus();

    return createErrorResponse({
      code: reason,
      message: "Ses servisi henüz yapılandırılmadı.",
      reason,
      status: 503,
    });
  }

  const guardResult = requestGuard.check(getClientKey(request), text.length);

  if (!guardResult.ok) {
    return createErrorResponse({
      code: "rate_limited",
      message:
        "Kısa sürede çok fazla ses isteği yapıldı. Biraz bekleyip tekrar dene.",
      retryAfterSeconds: guardResult.retryAfterSeconds,
      status: 429,
    });
  }

  try {
    const audio = await ttsProvider.generateAudio({ includeAlignment, text });

    if (includeAlignment) {
      return createTimedJsonResponse(audio);
    }

    return new Response(audio.audio, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Length": String(audio.audio.byteLength),
        "Content-Type": audio.contentType,
        "X-Argos-TTS-Audio-Bytes": String(audio.audio.byteLength),
        "X-Argos-TTS-Transport": "binary",
      },
    });
  } catch (error) {
    if (error instanceof ElevenLabsTtsError) {
      logTtsFailure(error);

      return createErrorResponse({
        code: error.code,
        message: error.userMessage,
        status: error.code === "upstream_timeout" ? 504 : 502,
      });
    }

    console.error("[api/tts] provider request failed", {
      code: "upstream_failed",
    });

    return createErrorResponse({
      code: "upstream_failed",
      message: "Ses oluşturulamadı. Lütfen biraz sonra tekrar dene.",
      status: 502,
    });
  }
}
