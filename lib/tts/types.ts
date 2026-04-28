export type TtsAudioFormat = "audio/mpeg";

export type TtsAudioRequest = {
  text: string;
};

export type TtsWordTiming = {
  index: number;
  text: string;
  start: number;
  end: number;
};

export type TtsAudioResponse = {
  audio: ArrayBuffer;
  contentType: TtsAudioFormat;
  alignment?: TtsWordTiming[];
  metadata: TtsAudioMetadata;
};

export type TtsAudioMetadata = {
  modelId: string;
  voiceId: string;
  hasAlignment: boolean;
};

export type TtsProvider = {
  isConfigured: () => boolean;
  generateAudio: (request: TtsAudioRequest) => Promise<TtsAudioResponse>;
};

export type TtsClientResult =
  | {
      ok: true;
      audio: Blob;
      alignment?: TtsWordTiming[];
      metadata?: TtsAudioMetadata;
    }
  | {
      ok: false;
      code: "aborted" | "not_configured" | "request_failed";
      reason?:
        | "missing_api_key"
        | "missing_voice_id"
        | "server_route_error"
        | "loading_timeout"
        | "request_failed";
      message: string;
    };

export type TtsServiceStatus = {
  configured: boolean;
  modelId?: string;
  reason?:
    | "configured"
    | "missing_api_key"
    | "missing_voice_id"
    | "server_route_error"
    | "loading_timeout"
    | "request_failed";
  voiceId?: string;
};
