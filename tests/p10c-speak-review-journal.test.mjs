import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const speakSource = await readFile("components/speaking-practice.tsx", "utf8");
const reviewSource = await readFile("components/review-practice.tsx", "utf8");
const journalSource = await readFile("app/journal/page.tsx", "utf8");
const speakPage = await readFile("app/speak/page.tsx", "utf8");
const reviewPage = await readFile("app/review/page.tsx", "utf8");

test("P10C Speak uses one primary task area and stepped flow", () => {
  assert.match(speakSource, /data-speak-flow=\{step\}/);
  assert.match(speakSource, /data-speak-primary="prompt"/);
  assert.match(speakSource, /data-speak-primary="answer"/);
  assert.match(speakSource, /data-speak-primary="review"/);
  assert.match(speakSource, /data-speak-primary="complete"/);
  assert.match(speakSource, /type SpeakStep = "prompt" \| "answer" \| "review" \| "complete"/);
  assert.match(speakSource, /TaskStepper/);
  assert.match(speakSource, /Cevaba geç/);
  assert.match(speakSource, /Gözden geçirmeye geç/);
  assert.match(speakSource, /Tamamla/);
  assert.match(speakPage, /SpeakingPracticeView/);
  // Only one VoiceRecorder mount per step (not both first+second visible together).
  const firstRecorderBlocks = speakSource.split('label="First try ses kaydı"');
  const secondRecorderBlocks = speakSource.split('label="Second try ses kaydı"');
  assert.equal(firstRecorderBlocks.length, 2);
  assert.equal(secondRecorderBlocks.length, 2);
  assert.match(speakSource, /step === "answer"/);
  assert.match(speakSource, /step === "review"/);
});

test("P10C Speak preserves autosave, completion, TTS and session recording", () => {
  assert.match(speakSource, /speakFirstTry/);
  assert.match(speakSource, /speakSecondTry/);
  assert.match(speakSource, /saveDayProgress\(practice\.day, \{ speakFirstTry: value \}\)/);
  assert.match(speakSource, /saveDayProgress\(practice\.day, \{ speakSecondTry: value \}\)/);
  assert.match(speakSource, /markDayTaskCompleted\(practice\.day, "speak"\)/);
  assert.match(speakSource, /idleAriaLabel="Konuşma promptunu dinle"/);
  assert.match(speakSource, /VoiceRecorder/);
  assert.match(speakSource, /TtsAudioScope/);
  assert.doesNotMatch(speakSource, /autoPlay|autoplay/);
  assert.doesNotMatch(speakSource, /ELEVENLABS|apiKey|API_KEY/);
  assert.doesNotMatch(speakSource, /transcri(be|ption)|pronunciation score|AI score/i);
});

test("P10C Review shows one item flow without AI score/model answer copy", () => {
  assert.match(reviewSource, /data-review-flow=\{step\}/);
  assert.match(reviewSource, /data-review-primary=\{step\}/);
  assert.match(reviewSource, /activeIndex/);
  assert.match(reviewSource, /goNextAfterReview|Sonraki görev/);
  assert.match(reviewSource, /Kontrol et/);
  assert.match(reviewSource, /reviewAnswers/);
  assert.match(reviewSource, /markDayTaskCompleted|withCompletedTask\(progress\.completedTasks, "review"\)/);
  assert.match(reviewSource, /idleAriaLabel=\{`Review görevi \$\{activeIndex \+ 1\} promptunu dinle`\}/);
  assert.match(reviewSource, /shortAnswer/);
  assert.match(reviewSource, /Model cevap veya AI puanı yok|AI skor veya model cevap yok/);
  assert.doesNotMatch(reviewSource, /Model cevabı yardım içindir/);
  assert.doesNotMatch(reviewSource, /autoPlay|autoplay/);
  assert.doesNotMatch(reviewSource, /ELEVENLABS|apiKey|API_KEY/);
  assert.match(reviewPage, /ReviewPractice/);
});

test("P10C Journal is single primary note with autosave and preserved fields", () => {
  assert.match(journalSource, /data-journal-primary="note"/);
  assert.match(journalSource, /journal-daily-note/);
  assert.match(journalSource, /hasJournalNotes/);
  assert.match(journalSource, /dailyNote/);
  assert.match(journalSource, /difficultPart/);
  assert.match(journalSource, /nextReviewNote/);
  assert.match(journalSource, /Autosave/);
  assert.match(journalSource, /Tamamla/);
  assert.match(journalSource, /ExpandableCard/);
  assert.match(journalSource, /speakFirstTry/);
  assert.match(journalSource, /speakSecondTry/);
  // Primary stack should not render three always-visible note textareas.
  const primarySection = journalSource.split('data-journal-primary="note"')[1]?.split("ExpandableCard")[0] ?? "";
  const primaryTextareas = primarySection.match(/<textarea/g) ?? [];
  assert.equal(primaryTextareas.length, 1, "Journal primary area must expose one textarea");
  assert.doesNotMatch(journalSource, /completedTasks.*journal|"journal" as CompletedTask/);
});
