import { NextResponse } from "next/server";
import { getElevenLabsTtsProvider } from "@/lib/tts/provider";
import { ElevenLabsTtsError } from "@/lib/tts/elevenlabs";

const MAX_TEXT_LENGTH = 2_000;
const isDevelopment = process.env.NODE_ENV !== "production";

export const runtime = "nodejs";

function createErrorResponse({
  code,
  devDetail,
  message,
  reason,
  status,
}: {
  code: string;
  devDetail?: unknown;
  message: string;
  reason?: string;
  status: number;
}) {
  return NextResponse.json(
    {
      ok: false,
      code,
      reason,
      message,
      ...(isDevelopment && devDetail ? { devDetail } : {}),
    },
    { status },
  );
}

function logTtsFailure(code: string, detail: unknown) {
  if (!isDevelopment) {
    return;
  }

  console.error("[api/tts] TTS request failed", {
    code,
    detail,
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
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        configured: false,
        reason: "server_route_error",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  let text = "";

  try {
    const body = (await request.json()) as { text?: unknown };
    text = typeof body.text === "string" ? body.text.trim() : "";
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_request",
        message: "Ses oluşturmak için geçerli bir metin gönderilmedi.",
      },
      { status: 400 },
    );
  }

  if (!text) {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_request",
        message: "Ses oluşturmak için metin gerekli.",
      },
      { status: 400 },
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      {
        ok: false,
        code: "bad_request",
        message: "Metin bu ses isteği için çok uzun.",
      },
      { status: 400 },
    );
  }

  const ttsProvider = getElevenLabsTtsProvider();

  if (!ttsProvider.isConfigured()) {
    const reason = ttsProvider.getConfigStatus();

    return createErrorResponse({
      code: reason,
      devDetail: {
        hasApiKey: reason !== "missing_api_key",
        hasVoiceId: reason !== "missing_voice_id",
      },
      message: "Ses servisi henüz yapılandırılmadı.",
      reason,
      status: 503,
    });
  }

  try {
    const audio = await ttsProvider.generateAudio({ text });

    return NextResponse.json(
      {
        ok: true,
        audioBase64: Buffer.from(audio.audio).toString("base64"),
        contentType: audio.contentType,
        alignment: audio.alignment ?? [],
        metadata: audio.metadata,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    if (error instanceof ElevenLabsTtsError) {
      const devDetail = error.toDiagnostics();

      logTtsFailure(error.code, devDetail);

      return createErrorResponse({
        code: error.code,
        devDetail,
        message: error.userMessage,
        status: 502,
      });
    }

    const message =
      error instanceof Error ? error.message : "Unknown TTS route error.";

    logTtsFailure("upstream_failed", { message });

    return createErrorResponse({
      code: "upstream_failed",
      devDetail: { message },
      message: "Ses oluşturulamadı. Lütfen biraz sonra tekrar dene.",
      status: 502,
    });
  }
}
