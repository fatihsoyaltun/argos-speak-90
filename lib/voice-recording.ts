export const VOICE_RECORDING_MAX_SECONDS = 90;
export const VOICE_RECORDER_PERMISSION_TIMEOUT_MS = 15_000;

export const VOICE_RECORDER_MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
] as const;

export function selectVoiceRecorderMimeType(
  isTypeSupported?: (mimeType: string) => boolean,
): string | undefined {
  if (typeof isTypeSupported !== "function") {
    return undefined;
  }

  return VOICE_RECORDER_MIME_CANDIDATES.find((mimeType) =>
    isTypeSupported(mimeType),
  );
}

function getErrorName(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error
  ) {
    return getErrorName(error.error);
  }

  return "UnknownError";
}

export function getVoiceRecordingErrorMessage(error: unknown) {
  switch (getErrorName(error)) {
    case "NotAllowedError":
    case "SecurityError":
      return "Mikrofon izni verilmedi. Tarayıcı izinlerinden mikrofonu açıp yeniden deneyebilirsin.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "Kullanılabilir bir mikrofon bulunamadı. Bir mikrofon bağlayıp yeniden deneyebilirsin.";
    case "NotReadableError":
    case "TrackStartError":
      return "Mikrofon şu anda kullanılamıyor. Başka bir uygulamayı kapatıp yeniden deneyebilirsin.";
    case "PermissionTimeoutError":
      return "Mikrofon izni yanıtı zaman aşımına uğradı. İzin penceresini yanıtlayıp yeniden deneyebilirsin.";
    case "NotSupportedError":
      return "Bu tarayıcı desteklenen bir ses kayıt biçimi sunmuyor. Metin görevine devam edebilirsin.";
    case "AbortError":
      return "Ses kaydı başlatılamadı. Mikrofon bağlantısını kontrol edip yeniden deneyebilirsin.";
    default:
      return "Ses kaydı başlatılamadı. Metin görevine devam edebilir veya yeniden deneyebilirsin.";
  }
}
