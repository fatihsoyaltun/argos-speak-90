import assert from "node:assert/strict";

const baseUrl = process.env.ARGOS_BASE_URL || "http://127.0.0.1:3000";
const endpoint = new URL("/api/tts", baseUrl);
const text = "Argos audio health check.";
const forbiddenResponseMarkers = [
  "authorization",
  "elevenlabs_api_key",
  "xi-api-key",
];

function assertNoCredentialLeak(response, bodyText) {
  assert.equal(response.headers.has("authorization"), false);
  assert.equal(response.headers.has("xi-api-key"), false);

  const normalizedBody = bodyText.toLowerCase();
  for (const marker of forbiddenResponseMarkers) {
    assert.equal(
      normalizedBody.includes(marker),
      false,
      `Response must not expose ${marker}`,
    );
  }
}

const statusResponse = await fetch(endpoint, {
  headers: { Accept: "application/json" },
});
assert.equal(statusResponse.status, 200, "TTS status route must respond");
const statusBody = await statusResponse.text();
assertNoCredentialLeak(statusResponse, statusBody);
const status = JSON.parse(statusBody);
assert.equal(
  status.configured,
  true,
  `TTS is not configured: ${status.reason || "unknown reason"}`,
);

const binaryResponse = await fetch(endpoint, {
  method: "POST",
  headers: {
    Accept: "audio/mpeg",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ includeAlignment: false, text }),
});
assert.equal(binaryResponse.status, 200, "Binary TTS request must succeed");
assert.match(
  binaryResponse.headers.get("content-type") || "",
  /^audio\/mpeg/,
  "Binary response must be MP3",
);
const binaryAudio = await binaryResponse.arrayBuffer();
assert.ok(binaryAudio.byteLength > 0, "Binary TTS response must contain audio");
assertNoCredentialLeak(binaryResponse, "");

const timedResponse = await fetch(endpoint, {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ includeAlignment: true, text }),
});
assert.equal(timedResponse.status, 200, "Timed TTS request must succeed");
assert.match(
  timedResponse.headers.get("content-type") || "",
  /^application\/json/,
  "Timed response must preserve JSON alignment transport",
);
const timedBody = await timedResponse.text();
assertNoCredentialLeak(timedResponse, timedBody);
const timed = JSON.parse(timedBody);
const timedAudioBytes = Buffer.from(timed.audioBase64, "base64").byteLength;
assert.ok(timedAudioBytes > 0, "Timed TTS response must contain audio");
assert.equal(timed.contentType, "audio/mpeg");
assert.ok(
  Array.isArray(timed.alignment) && timed.alignment.length > 0,
  "Timed TTS response must contain word alignment",
);
assert.equal(timed.metadata.hasAlignment, true);
for (const timing of timed.alignment) {
  assert.equal(typeof timing.text, "string");
  assert.ok(timing.text.length > 0, "Aligned words must contain text");
  assert.ok(Number.isFinite(timing.start), "Alignment start must be finite");
  assert.ok(Number.isFinite(timing.end), "Alignment end must be finite");
  assert.ok(timing.start >= 0, "Alignment start must not be negative");
  assert.ok(timing.end >= timing.start, "Alignment end must follow start");
}
assert.ok(
  timed.metadata.transportBytes > timed.metadata.audioBytes,
  "Measured JSON/base64 transport must exceed raw audio bytes",
);

console.log(
  JSON.stringify(
    {
      binaryAudioBytes: binaryAudio.byteLength,
      timedAudioBytes,
      timedAlignmentWords: timed.alignment.length,
      timedTransportBytes: timed.metadata.transportBytes,
      timedTransportOverheadPercent: Number(
        (
          ((timed.metadata.transportBytes - timed.metadata.audioBytes) /
            timed.metadata.audioBytes) *
          100
        ).toFixed(1),
      ),
    },
    null,
    2,
  ),
);
