import { NextResponse } from "next/server";
import { getElevenLabsTtsProvider } from "@/lib/tts/provider";

const MAX_TEXT_LENGTH = 2_000;

export const runtime = "nodejs";

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
        code: "bad_request",
        message: "Ses oluşturmak için geçerli bir metin gönderilmedi.",
      },
      { status: 400 },
    );
  }

  if (!text) {
    return NextResponse.json(
      {
        code: "bad_request",
        message: "Ses oluşturmak için metin gerekli.",
      },
      { status: 400 },
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      {
        code: "bad_request",
        message: "Metin bu ses isteği için çok uzun.",
      },
      { status: 400 },
    );
  }

  const ttsProvider = getElevenLabsTtsProvider();

  if (!ttsProvider.isConfigured()) {
    const reason = ttsProvider.getConfigStatus();

    return NextResponse.json(
      {
        code: "not_configured",
        reason,
        message: "Ses servisi henüz yapılandırılmadı.",
      },
      { status: 503 },
    );
  }

  try {
    const audio = await ttsProvider.generateAudio({ text });

    return NextResponse.json(
      {
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
  } catch {
    return NextResponse.json(
      {
        code: "tts_failed",
        message: "Ses oluşturulamadı. Lütfen biraz sonra tekrar dene.",
      },
      { status: 502 },
    );
  }
}
