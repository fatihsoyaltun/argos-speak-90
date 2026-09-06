"use client";

import { useEffect, useState } from "react";
import { AudioAction } from "@/components/audio-action";
import {
  Button,
  ButtonLink,
  Card,
  ExpandableCard,
  Feedback,
  StatusPill,
} from "@/components/ui";
import {
  ACTIVE_DAILY_WORD_COUNT,
  TARGET_DAILY_WORD_COUNT,
  type WordItem,
} from "@/lib/words-content";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";
import { createTtsCacheKey } from "@/lib/tts/audio-cache";
import { getTtsServiceStatus } from "@/lib/tts/client";
import {
  type AudioControllerRequest,
  useAudioController,
} from "@/lib/tts/use-audio-controller";

type WordAudioKind = "word" | "example";
type TtsConfigState = "checking" | "configured" | "notConfigured";

function getAudioId(kind: WordAudioKind, index: number) {
  return `${kind}-${index}`;
}

export function WordsPractice({
  day,
  words,
}: {
  day: number;
  words: WordItem[];
}) {
  const [sentence, setSentence] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [showSupportWords, setShowSupportWords] = useState(false);
  const [practicedIndexes, setPracticedIndexes] = useState<number[]>([]);
  const [ttsConfigState, setTtsConfigState] =
    useState<TtsConfigState>("checking");
  const [ttsModelId, setTtsModelId] = useState("");
  const [ttsVoiceId, setTtsVoiceId] = useState("");
  const audio = useAudioController();
  const stopAudio = audio.stop;
  const canShowAudioControls = ttsConfigState === "configured";

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(day);
      setSentence(progress.wordsOutput);
      setSaveState(progress.wordsOutput.trim() ? "saved" : "idle");
      setShowSupportWords(false);
      setPracticedIndexes([]);
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [day]);

  useEffect(() => {
    let isActive = true;

    async function checkTtsStatus() {
      const status = await getTtsServiceStatus().catch(() => ({
        configured: false,
        modelId: "",
        voiceId: "",
      }));

      if (!isActive) {
        return;
      }

      const nextState = status.configured ? "configured" : "notConfigured";
      try {
        document.documentElement.dataset.ttsConfig = nextState;
      } catch {
        // ignore
      }
      setTtsConfigState(nextState);
      setTtsModelId(status.modelId ?? "");
      setTtsVoiceId(status.voiceId ?? "");
    }

    void checkTtsStatus();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [day, stopAudio]);

  function markPracticed(index: number) {
    setPracticedIndexes((current) =>
      current.includes(index) ? current : [...current, index],
    );
  }

  function saveSentence() {
    saveDayProgress(day, { wordsOutput: sentence });
    markDayTaskCompleted(day, "words");
    setSaveState("saved");
  }

  function createWordAudioRequest({
    id,
    kind,
    text,
  }: {
    id: string;
    kind: WordAudioKind;
    text: string;
  }): AudioControllerRequest {
    const cacheKey = createTtsCacheKey({
      day,
      includeAlignment: false,
      modelId: ttsModelId,
      scope: `words:${kind}`,
      text,
      voiceId: ttsVoiceId,
    });

    return {
      cacheKey,
      id,
      includeAlignment: false,
      text,
    };
  }

  async function handleWordAudio(
    request: AudioControllerRequest,
    wordIndex: number,
  ) {
    markPracticed(wordIndex);
    const isActive = audio.activeId === request.id;

    if (isActive && (audio.state === "loading" || audio.state === "playing")) {
      audio.cancel();
      return;
    }

    if (isActive && audio.state === "error") {
      await audio.retry();
      return;
    }

    await audio.play(request);
  }

  const activeWords = words
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) =>
      item.role ? item.role === "active" : index < ACTIVE_DAILY_WORD_COUNT,
    );
  const supportWords = words
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) =>
      item.role
        ? item.role === "support-review"
        : index >= ACTIVE_DAILY_WORD_COUNT,
    );

  const visibleWordCount = showSupportWords
    ? words.length
    : activeWords.length;
  const practicedCount = practicedIndexes.length;
  const completionCount =
    saveState === "saved" ? TARGET_DAILY_WORD_COUNT : practicedCount;

  function renderWordCard(item: WordItem, index: number) {
    const wordAudioId = getAudioId("word", index);
    const exampleAudioId = getAudioId("example", index);
    const wordIsActive = audio.activeId === wordAudioId;
    const exampleIsActive = audio.activeId === exampleAudioId;
    const isSupportWord = item.role === "support-review";
    const isPracticed = practicedIndexes.includes(index);

    return (
      <article
        key={item.word}
        className="rounded-[1.35rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.6rem] sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Word {index + 1} · {isSupportWord ? "Support / review" : "Active"}
              {isPracticed ? " · Dinlendi" : ""}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 text-2xl font-semibold leading-none tracking-tight sm:text-3xl">
                {item.word}
              </h3>
              <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
                {item.pronunciation}
              </span>
            </div>
          </div>
          {canShowAudioControls ? (
            <AudioAction
              active={wordIsActive}
              state={audio.state}
              onAction={() => {
                void handleWordAudio(
                  createWordAudioRequest({
                    id: wordAudioId,
                    kind: "word",
                    text: item.word,
                  }),
                  index,
                );
              }}
              idleAriaLabel="Kelimeyi dinle"
              className="min-h-11 min-w-[5.75rem] shrink-0 px-3.5 py-2 text-xs"
            />
          ) : null}
        </div>

        {wordIsActive && audio.error ? (
          <p
            role="alert"
            className="mt-3 rounded-[1rem] border border-clay/20 bg-linen/70 p-3 text-sm font-semibold leading-5 text-foreground"
          >
            {audio.error.message}
          </p>
        ) : null}

        <div className="mt-3 rounded-[1.15rem] bg-background/85 px-3 py-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Kısa anlam
          </p>
          <p className="mt-1 text-base font-semibold leading-6 text-foreground">
            {item.shortMeaningTr}
          </p>
        </div>

        <details className="group mt-3 rounded-[1.15rem] border border-foreground/10 bg-linen/60 px-3 py-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-linen [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Example
              </span>
              <span className="mt-0.5 block text-sm font-semibold leading-5 text-foreground">
                Örnek cümleyi aç
              </span>
            </span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-lg font-black leading-none text-[#17201a] transition group-open:rotate-45 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <div className="mt-3 border-t border-foreground/10 pt-3">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-base font-semibold leading-7 text-foreground">
                {item.exampleSentence}
              </p>
              {canShowAudioControls ? (
                <AudioAction
                  active={exampleIsActive}
                  state={audio.state}
                  onAction={() => {
                    void handleWordAudio(
                      createWordAudioRequest({
                        id: exampleAudioId,
                        kind: "example",
                        text: item.exampleSentence,
                      }),
                      index,
                    );
                  }}
                  idleAriaLabel="Örnek cümleyi dinle"
                  className="min-h-11 min-w-[5.75rem] shrink-0 px-3.5 py-2 text-xs"
                />
              ) : null}
            </div>
            {exampleIsActive && audio.error ? (
              <p
                role="alert"
                className="mt-3 rounded-[1rem] border border-clay/20 bg-surface/70 p-3 text-sm font-semibold leading-5 text-foreground"
              >
                {audio.error.message}
              </p>
            ) : null}
          </div>
        </details>
      </article>
    );
  }

  return (
    <div className="space-y-4">
      <ExpandableCard
        eyebrow="Ne yapacaksın?"
        title="Kelimeleri hızlı tara, sonra kullan"
        description="Anlamı görünür tut; örnek cümleyi ihtiyaç duyunca aç."
      >
        <p className="text-sm font-semibold leading-6 text-muted">
          Kelimeleri tek tek oku. Telaffuzu sesli dene, Türkçe anlamı kontrol
          et, sonra örnek cümleyi yüksek sesle tekrar et. Hedef kelimeyi pasif
          bilmek değil; kısa bir cümlede kullanmak.
        </p>
      </ExpandableCard>

      <Card className="space-y-3 !rounded-[1.45rem] !p-4 sm:!p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
              Day {day} words
            </p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight">
              Bugün kullanacağın kelimeler
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-text-secondary">
              İlk 5 aktif; sonraki 5 destek/review. Sayaç gerçek dinleme
              ilerlemesini gösterir.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <StatusPill
              status={
                completionCount >= TARGET_DAILY_WORD_COUNT ? "done" : "active"
              }
            >
              {completionCount}/{TARGET_DAILY_WORD_COUNT}
            </StatusPill>
            <ButtonLink
              href="#word-sentence-card"
              variant="secondary"
              className="min-h-11"
            >
              Yazma pratiğine geç
            </ButtonLink>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="h-2.5 overflow-hidden rounded-full bg-linen"
        >
          <div
            className="h-full rounded-full bg-moss transition-[width] motion-reduce:transition-none"
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  (completionCount / TARGET_DAILY_WORD_COUNT) * 100,
                ),
              )}%`,
            }}
          />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.12em] text-clay">
          Görünen {visibleWordCount}/{TARGET_DAILY_WORD_COUNT}
          {ttsConfigState === "checking"
            ? " · Audio checking"
            : ttsConfigState === "configured"
              ? " · Audio ready"
              : " · Audio off"}
        </p>

        {ttsConfigState === "notConfigured" ? (
          <Feedback tone="warning">
            Kelime seslendirme henüz yapılandırılmadı.
          </Feedback>
        ) : null}
      </Card>

      <section className="space-y-3" aria-label="Active words">
        <div className="grid gap-2.5">
          {activeWords.map(({ item, index }) => renderWordCard(item, index))}
        </div>

        <div className="rounded-[1.35rem] border border-foreground/10 bg-linen/65 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">
                Support / review
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
                Son 5 kelime, aktif seti yormadan tekrar ve destek sağlar.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowSupportWords((current) => !current)}
              aria-expanded={showSupportWords}
              aria-controls="support-review-words"
              className="w-full sm:w-auto"
            >
              {showSupportWords ? "Son 5'i gizle" : "Sonraki 5'i göster"}
            </Button>
          </div>

          <div
            id="support-review-words"
            className={showSupportWords ? "mt-4 grid gap-2.5" : "hidden"}
          >
            {supportWords.map(({ item, index }) => renderWordCard(item, index))}
          </div>
        </div>
      </section>

      <section
        id="word-sentence-card"
        className="scroll-mt-6 rounded-[1.45rem] border border-foreground/10 bg-surface p-4 shadow-soft sm:rounded-[1.75rem] sm:p-5"
      >
        <label
          htmlFor="word-sentence"
          className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm"
        >
          Yazma pratiği
        </label>
        <p className="mt-2 text-base leading-7 text-muted">
          Yukarıdaki kelimelerden en az birini seç. Kendi hayatınla ilgili kısa
          ve gerçek bir İngilizce cümle yaz.
        </p>
        <textarea
          id="word-sentence"
          value={sentence}
          onChange={(event) => {
            setSentence(event.target.value);
            setSaveState("idle");
          }}
          rows={5}
          placeholder="Example: I have a short meeting after work."
          className="mt-4 w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        <Button
          type="button"
          onClick={saveSentence}
          disabled={sentence.trim().length === 0}
          className="mt-4 w-full sm:w-auto"
        >
          Cümlemi kaydet
        </Button>
        {saveState === "saved" ? (
          <Feedback tone="success" className="mt-4">
            Cümlen bu cihazda kaydedildi.
          </Feedback>
        ) : null}
      </section>
    </div>
  );
}
