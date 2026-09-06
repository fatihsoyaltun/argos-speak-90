import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

async function importWordsContent() {
  const directory = await mkdtemp(join(tmpdir(), "argos-p9-words-"));
  const files = [
    "lib/phase-seven-content.ts",
    "lib/phase-eight-content.ts",
    "lib/words-content.ts",
  ];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const patchedSource = source
      .replace("./phase-eight-content", "./phase-eight-content.ts")
      .replace("./phase-seven-content", "./phase-seven-content.ts");
    await writeFile(join(directory, file.split("/").at(-1)), patchedSource);
  }

  return import(`${join(directory, "words-content.ts")}?v=${Date.now()}`);
}

function assertFilledString(value, message) {
  assert.equal(typeof value, "string", message);
  assert.ok(value.trim().length > 0, message);
}

test("P9 Words runtime produces deterministic 90 x 10 content with roles", async () => {
  const firstImport = await importWordsContent();
  const secondImport = await importWordsContent();
  const { ACTIVE_DAILY_WORD_COUNT, TARGET_DAILY_WORD_COUNT, dayWords } =
    firstImport;

  assert.equal(ACTIVE_DAILY_WORD_COUNT, 5);
  assert.equal(TARGET_DAILY_WORD_COUNT, 10);
  assert.equal(dayWords.length, 90);
  assert.equal(
    dayWords.reduce((total, day) => total + day.words.length, 0),
    900,
  );
  assert.deepEqual(
    dayWords.map((day) => day.day),
    Array.from({ length: 90 }, (_, index) => index + 1),
  );
  assert.deepEqual(dayWords, secondImport.dayWords);

  for (const dayContent of dayWords) {
    assert.equal(dayContent.words.length, TARGET_DAILY_WORD_COUNT);

    const seenWords = new Set();
    const roles = dayContent.words.map((item) => item.role);

    assert.equal(
      roles.filter((role) => role === "active").length,
      ACTIVE_DAILY_WORD_COUNT,
      `Day ${dayContent.day} must have five active words.`,
    );
    assert.equal(
      roles.filter((role) => role === "support-review").length,
      TARGET_DAILY_WORD_COUNT - ACTIVE_DAILY_WORD_COUNT,
      `Day ${dayContent.day} must have five support/review words.`,
    );

    for (const item of dayContent.words) {
      const key = item.word.trim().toLowerCase();
      assert.equal(seenWords.has(key), false, `Duplicate ${item.word} on day ${dayContent.day}`);
      seenWords.add(key);
      assertFilledString(item.word, "word is required");
      assertFilledString(item.pronunciation, "pronunciation is required");
      assertFilledString(item.shortMeaningTr, "shortMeaningTr is required");
      assertFilledString(item.exampleSentence, "exampleSentence is required");
    }
  }
});

test("P9 theme/stage samples use appropriate boosters without storage key churn", async () => {
  const { dayWords } = await importWordsContent();
  const samples = [
    { day: 1, title: "Morning and Routine", expected: "foundation" },
    { day: 21, title: "Clarification", expected: "A2/theme" },
    { day: 50, title: "Early B1", expected: "early B1" },
    { day: 78, title: "Confident speaking", expected: "confident speaking" },
  ];
  const storageKeysSource = await readFile("lib/local-storage-keys.ts", "utf8");

  assert.ok(storageKeysSource.includes("argos-practice-progress"));
  assert.ok(storageKeysSource.includes("argos-active-day"));

  for (const sample of samples) {
    const dayContent = dayWords[sample.day - 1];
    const supportWords = dayContent.words
      .filter((item) => item.role === "support-review")
      .map((item) => item.word);

    assert.equal(dayContent.day, sample.day);
    assert.ok(dayContent.title.length > 0);
    assert.equal(supportWords.length, 5, `${sample.expected} sample has support/review words.`);
  }
});
