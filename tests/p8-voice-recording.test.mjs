import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getVoiceRecordingErrorMessage,
  selectVoiceRecorderMimeType,
  VOICE_RECORDER_PERMISSION_TIMEOUT_MS,
  VOICE_RECORDING_MAX_SECONDS,
} from "../lib/voice-recording.ts";

test("recorder MIME selection prefers WebM/Opus, falls back to MP4, then browser default", () => {
  assert.equal(selectVoiceRecorderMimeType(() => true), "audio/webm;codecs=opus");
  assert.equal(
    selectVoiceRecorderMimeType((mimeType) => mimeType === "audio/mp4"),
    "audio/mp4",
  );
  assert.equal(selectVoiceRecorderMimeType(() => false), undefined);
  assert.equal(selectVoiceRecorderMimeType(undefined), undefined);
});

test("recording limits stay inside the P8 privacy and duration contract", () => {
  assert.equal(VOICE_RECORDING_MAX_SECONDS, 90);
  assert.ok(VOICE_RECORDING_MAX_SECONDS >= 60);
  assert.ok(VOICE_RECORDING_MAX_SECONDS <= 120);
  assert.equal(VOICE_RECORDER_PERMISSION_TIMEOUT_MS, 15_000);
});

test("permission, device, busy-device, timeout, and unsupported failures are understandable", () => {
  const failures = [
    ["NotAllowedError", "izni verilmedi"],
    ["NotFoundError", "mikrofon bulunamadı"],
    ["NotReadableError", "kullanılamıyor"],
    ["PermissionTimeoutError", "zaman aşımına uğradı"],
    ["NotSupportedError", "desteklenen bir ses kayıt biçimi"],
  ];

  for (const [name, expectedText] of failures) {
    assert.match(
      getVoiceRecordingErrorMessage({ name }),
      new RegExp(expectedText, "i"),
    );
  }

  assert.match(
    getVoiceRecordingErrorMessage({ error: { name: "NotReadableError" } }),
    /kullanılamıyor/i,
  );
});

test("VoiceRecorder remains session-only and is integrated only in planned tasks", async () => {
  const component = await readFile("components/voice-recorder.tsx", "utf8");
  const speak = await readFile("components/speaking-practice.tsx", "utf8");
  const deviceLab = await readFile(
    "app/device-lab/[deviceSlug]/[moduleId]/page.tsx",
    "utf8",
  );

  for (const marker of [
    "navigator.mediaDevices.getUserMedia",
    "new MediaRecorder",
    "URL.createObjectURL",
    "URL.revokeObjectURL",
    "track.stop()",
    "Kaydı başlat",
    "Kaydı durdur",
    "Kaydı dinle",
    "Yeniden kaydet",
    "Kaydı sil",
    "buluta yüklenmez",
    "yazıya dökülmez",
    "puanlanmaz",
  ]) {
    assert.ok(component.includes(marker), `VoiceRecorder is missing ${marker}`);
  }

  for (const forbidden of [
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "fetch(",
    "FormData",
    "/api/",
  ]) {
    assert.equal(
      component.includes(forbidden),
      false,
      `VoiceRecorder must not use ${forbidden}`,
    );
  }

  assert.match(speak, /VoiceRecorder label="First try ses kaydı"/);
  assert.match(speak, /VoiceRecorder label="Second try ses kaydı"/);
  assert.match(deviceLab, /VoiceRecorder label="Okuma denemesi"/);
  assert.match(deviceLab, /VoiceRecorder label="Say it ses kaydı"/);
});
