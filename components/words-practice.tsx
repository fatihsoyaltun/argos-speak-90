"use client";

import { useEffect, useState } from "react";
import type { WordItem } from "@/lib/words-content";
import {
  getDayProgress,
  markDayTaskCompleted,
  saveDayProgress,
} from "@/lib/practice-storage";

export function WordsPractice({
  day,
  words,
}: {
  day: number;
  words: WordItem[];
}) {
  const [sentence, setSentence] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const progress = getDayProgress(day);
      setSentence(progress.wordsOutput);
      setSaveState("idle");
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, [day]);

  function saveSentence() {
    saveDayProgress(day, { wordsOutput: sentence });
    markDayTaskCompleted(day, "words");
    setSaveState("saved");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Ne yapacaksın?
        </p>
        <p className="mt-3 text-base leading-7 text-muted">
          Kelimeleri tek tek oku. Telaffuzu sesli dene, Türkçe anlamı kontrol
          et, sonra örnek cümleyi yüksek sesle tekrar et. Hedef kelimeyi pasif
          bilmek değil; kısa bir cümlede kullanmak.
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Day {day} words
          </p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">
            Bugün kullanacağın kelimeler
          </h2>
        </div>

        <div className="grid gap-3">
          {words.map((item, index) => (
            <article
              key={item.word}
              className="rounded-[1.6rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                    Word {index + 1}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold leading-none tracking-tight">
                    {item.word}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-sage px-3 py-1.5 text-xs font-black text-moss">
                  {item.pronunciation}
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.25rem] bg-background/85 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    Kısa anlam
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {item.shortMeaningTr}
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-foreground/10 bg-linen/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                    Example
                  </p>
                  <p className="mt-2 text-base font-semibold leading-7 text-foreground">
                    {item.exampleSentence}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
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
        <button
          type="button"
          onClick={saveSentence}
          disabled={sentence.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
        >
          Cümlemi kaydet
        </button>
        {saveState === "saved" ? (
          <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            Cümlen bu cihazda kaydedildi.
          </p>
        ) : null}
      </section>
    </div>
  );
}
