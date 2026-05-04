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

export type TtsFailureCode =
  | "aborted"
  | "bad_request"
  | "missing_api_key"
  | "missing_voice_id"
  | "not_configured"
  | "request_failed"
  | "upstream_account_restricted"
  | "upstream_failed"
  | "upstream_model_error"
  | "upstream_quota_or_rate_limit"
  | "upstream_unauthorized"
  | "upstream_voice_not_found";

export type TtsStatusReason =
  | "configured"
  | "loading_timeout"
  | "missing_api_key"
  | "missing_voice_id"
  | "request_failed"
  | "server_route_error";

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
      code: TtsFailureCode;
      reason?: TtsStatusReason;
      message: string;
    };

export type TtsServiceStatus = {
  configured: boolean;
  modelId?: string;
  reason?: TtsStatusReason;
  voiceId?: string;
};
