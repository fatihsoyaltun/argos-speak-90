"use client";

import { useEffect, useState } from "react";
import type { ListeningDrill } from "@/lib/listening-content";

export function ListeningDrillView({ drill }: { drill: ListeningDrill }) {
  const [response, setResponse] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const speechSupported =
    typeof window === "undefined" || "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak(rate: number) {
    if (!speechSupported) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(drill.transcriptExcerpt);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }

  function stopPlayback() {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }

  function saveResponse() {
    setSaveState("saved");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-moss/15 bg-moss p-5 text-white shadow-soft sm:p-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage sm:text-sm">
            Bugünkü çalışma
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-balance">
            {drill.title}
          </h2>
          <p className="text-sm leading-6 text-sage/95">{drill.focus}</p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => speak(1)}
            disabled={!speechSupported}
            className="min-h-12 rounded-full bg-white px-4 py-3 text-sm font-bold text-[#17201a] shadow-sm outline-none transition hover:bg-[#efe5d6] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
          >
            Metni dinle
          </button>
          <button
            type="button"
            onClick={() => speak(0.72)}
            disabled={!speechSupported}
            className="min-h-12 rounded-full bg-[#dce8d8] px-4 py-3 text-sm font-bold text-[#17201a] shadow-sm outline-none transition hover:bg-[#efe5d6] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
          >
            Yavaş dinle
          </button>
          <button
            type="button"
            onClick={stopPlayback}
            disabled={!speechSupported || !isPlaying}
            className="min-h-12 rounded-full border border-surface/35 px-4 py-3 text-sm font-bold text-white outline-none transition hover:bg-surface/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-surface/15 disabled:text-white/45 focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-moss"
          >
            Durdur
          </button>
        </div>

        {!speechSupported ? (
          <p className="mt-3 text-xs font-semibold text-sage/90">
            Tarayıcı sesli okumayı desteklemiyorsa metni kendin yüksek sesle oku.
          </p>
        ) : null}
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Ne yapacaksın?
        </p>
        <p className="mt-3 text-base leading-7 text-muted">
          Önce metni dinle. Sonra transcripti oku ve cümlelerin doğal sırasını
          fark et. Hedef ezber yapmak değil; kısa, gerçek İngilizceyi yakalayıp
          kendi cümleni kurmak.
        </p>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
              Transcript
            </p>
            <h3 className="mt-1 text-xl font-semibold leading-tight">
              Listen, then read
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-linen px-3 py-1.5 text-xs font-bold text-moss">
            Day {drill.day}
          </span>
        </div>
        <p className="mt-4 rounded-[1.4rem] bg-background/85 p-4 text-[1.03rem] leading-8 text-foreground">
          {drill.transcriptExcerpt}
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
            Yakalaman gereken cümleler
          </p>
          <h3 className="mt-1 text-2xl font-semibold leading-tight">
            Sesli tekrar et
          </h3>
        </div>
        <div className="grid gap-3">
          {drill.keyLines.map((line, index) => (
            <div
              key={line}
              className="rounded-[1.4rem] border border-foreground/10 bg-surface p-4 shadow-soft"
            >
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sage text-sm font-black text-moss">
                  {index + 1}
                </span>
                <p className="pt-1 text-base font-semibold leading-7">{line}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm">
          Mini task
        </p>
        <p className="mt-3 text-base leading-7 text-muted">{drill.miniTaskTr}</p>
      </section>

      <section className="rounded-[1.75rem] border border-foreground/10 bg-surface p-5 shadow-soft sm:p-6">
        <label
          htmlFor="listen-response"
          className="text-xs font-bold uppercase tracking-[0.16em] text-clay sm:text-sm"
        >
          Kısa cevabın
        </label>
        <p className="mt-2 text-base leading-7 text-muted">
          {drill.outputPrompt}
        </p>
        <textarea
          id="listen-response"
          value={response}
          onChange={(event) => {
            setResponse(event.target.value);
            setSaveState("idle");
          }}
          rows={5}
          placeholder="Example: I have a slow morning. First, I need coffee."
          className="mt-4 w-full resize-none rounded-[1.4rem] border border-foreground/15 bg-background/85 p-4 text-base leading-7 text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
        />
        <button
          type="button"
          onClick={saveResponse}
          disabled={response.trim().length === 0}
          className="mt-4 min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
        >
          Cevabımı kaydet
        </button>
        {saveState === "saved" ? (
          <p className="mt-4 rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            Cevabın bu ekranda tutuldu. Şimdilik kalıcı kayıt yok.
          </p>
        ) : null}
      </section>
    </div>
  );
}
