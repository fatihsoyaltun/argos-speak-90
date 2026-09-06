import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const listenSource = await readFile("components/listening-drill.tsx", "utf8");
const wordsSource = await readFile("components/words-practice.tsx", "utf8");
const listenPage = await readFile("app/listen/page.tsx", "utf8");
const wordsPage = await readFile("app/words/page.tsx", "utf8");

test("P10B Listen keeps a single primary Metni dinle control", () => {
  const primaryLabels = listenSource.match(/idleAriaLabel="Metni dinle"/g) ?? [];
  assert.equal(primaryLabels.length, 1, "Listen must expose exactly one primary transcript audio control.");
  assert.match(listenSource, /labels=\{\{[\s\S]*idle:[\s\S]*"Dinle"/);
  assert.match(listenSource, /Baştan oynat/);
  assert.equal(
    (listenSource.match(/idleAriaLabel="Metni dinle"/g) ?? []).length,
    1,
  );
  // No second transcript-header Dinle control beside the primary.
  assert.doesNotMatch(
    listenSource,
    /Transcript[\s\S]{0,400}idleAriaLabel="Metni dinle"/,
  );
});

test("P10B Listen preserves highlight, completion, and key-line TTS", () => {
  assert.match(listenSource, /activeTranscriptTokenClass/);
  assert.match(listenSource, /currentWordIndex/);
  assert.match(listenSource, /includeAlignment: true/);
  assert.match(listenSource, /markDayTaskCompleted\(drill\.day, "listen"\)/);
  assert.match(listenSource, /listenOutput/);
  assert.match(listenSource, /Hedef cümle \$\{index \+ 1\} sesini dinle/);
  assert.match(listenSource, /ExpandableCard/);
  assert.match(listenPage, /ListeningDrillView/);
});

test("P10B Words keeps progressive 5+5 and real N/10 counter", () => {
  assert.match(wordsSource, /Sonraki 5'i göster/);
  assert.match(wordsSource, /Son 5'i gizle/);
  assert.match(wordsSource, /showSupportWords/);
  assert.match(wordsSource, /ACTIVE_DAILY_WORD_COUNT/);
  assert.match(wordsSource, /TARGET_DAILY_WORD_COUNT/);
  assert.match(wordsSource, /\{completionCount\}\/\{TARGET_DAILY_WORD_COUNT\}/);
  assert.match(wordsSource, /practicedIndexes/);
  assert.match(wordsSource, /Word \{index \+ 1\}/);
  assert.match(wordsSource, /Support \/ review/);
  assert.match(wordsSource, /Bugün kullanacağın kelimeler/);
  assert.match(wordsSource, /Kelimeyi dinle/);
  assert.match(wordsSource, /Örnek cümleyi dinle/);
  assert.match(wordsSource, /Örnek cümleyi aç/);
  assert.match(wordsSource, /markDayTaskCompleted\(day, "words"\)/);
  assert.match(wordsSource, /wordsOutput/);
  assert.match(wordsPage, /WordsPractice/);
});

test("P10B does not reintroduce autoplay or client secrets", () => {
  for (const source of [listenSource, wordsSource]) {
    assert.doesNotMatch(source, /autoPlay|autoplay/);
    assert.doesNotMatch(source, /ELEVENLABS|apiKey|API_KEY/);
    assert.doesNotMatch(source, /transcri(be|ption)|pronunciation score|AI score/i);
  }
});
