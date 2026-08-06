import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  splitTtsText,
  TTS_MAX_TEXT_LENGTH,
} from "../lib/tts/text-chunks.ts";

test("TTS text stays in one chunk through the server limit", () => {
  const text = "a".repeat(TTS_MAX_TEXT_LENGTH);

  assert.deepEqual(splitTtsText(text), [text]);
  assert.deepEqual(splitTtsText("   "), []);
});

test("long TTS text is split at readable boundaries without exceeding the limit", () => {
  const sentence = "This is a short learning sentence. ";
  const text = sentence.repeat(90).trim();
  const chunks = splitTtsText(text);

  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.length <= TTS_MAX_TEXT_LENGTH));
  assert.equal(
    chunks.join(" ").replace(/\s+/g, " "),
    text.replace(/\s+/g, " "),
  );
  assert.ok(chunks.slice(0, -1).every((chunk) => /[.!?;:]$/.test(chunk)));
});

test("an unbroken long token is split deterministically and finitely", () => {
  const text = "x".repeat(TTS_MAX_TEXT_LENGTH * 2 + 17);
  const chunks = splitTtsText(text);

  assert.deepEqual(
    chunks.map((chunk) => chunk.length),
    [TTS_MAX_TEXT_LENGTH, TTS_MAX_TEXT_LENGTH, 17],
  );
  assert.equal(chunks.join(""), text);
});

test("P7 route components cover only the planned English learning objects", async () => {
  const expectations = [
    {
      file: "components/listening-drill.tsx",
      required: ["drill.transcriptExcerpt", "drill.keyLines.map", "keyLineRequest"],
    },
    {
      file: "components/words-practice.tsx",
      required: ["item.word", "item.exampleSentence", "AudioAction"],
    },
    {
      file: "components/speaking-practice.tsx",
      required: ["text={practice.prompt}", "text={line}", "TtsAudioScope"],
    },
    {
      file: "components/review-practice.tsx",
      required: ["text={item.prompt}", "text={item.expectedAnswer}", "TtsAudioScope"],
    },
    {
      file: "app/device-lab/[deviceSlug]/[moduleId]/page.tsx",
      required: [
        "text={intro}",
        "text={claim.text}",
        "text={item.termEn}",
        "text={learningModule.listeningTextEn}",
        "text={learningModule.speakingPrompt.promptEn ?? \"\"}",
      ],
    },
  ];

  for (const expectation of expectations) {
    const source = await readFile(expectation.file, "utf8");

    for (const marker of expectation.required) {
      assert.ok(source.includes(marker), `${expectation.file} is missing ${marker}`);
    }
  }

  const journalSource = await readFile("app/journal/page.tsx", "utf8");
  assert.equal(journalSource.includes("TtsAudioAction"), false);
});
