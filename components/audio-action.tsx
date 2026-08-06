"use client";

import { Button } from "@/components/ui";
import type { AudioControllerState } from "@/lib/tts/use-audio-controller";

type AudioActionLabels = Partial<
  Record<AudioControllerState, string> & { retry: string }
>;

export function AudioAction({
  active = false,
  className = "",
  disabled = false,
  idleAriaLabel,
  labels = {},
  onAction,
  state,
  variant = "primary",
}: {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  idleAriaLabel?: string;
  labels?: AudioActionLabels;
  onAction: () => void;
  state: AudioControllerState;
  variant?: "primary" | "secondary" | "soft" | "ghost";
}) {
  const visibleState = active ? state : "idle";
  const label =
    visibleState === "loading"
      ? labels.loading ?? "Hazırlanıyor…"
      : visibleState === "playing"
        ? labels.playing ?? "Duraklat"
        : visibleState === "paused"
          ? labels.paused ?? "Devam et"
          : visibleState === "error"
            ? labels.retry ?? "Tekrar dene"
            : labels.idle ?? "Dinle";
  const ariaLabel =
    visibleState === "loading"
      ? "Ses isteğini durdur"
      : visibleState === "playing"
        ? "Sesi duraklat"
        : visibleState === "paused"
          ? "Sesi devam ettir"
          : visibleState === "error"
            ? "Sesi tekrar dene"
            : idleAriaLabel ?? label;

  return (
    <Button
      type="button"
      variant={variant}
      onClick={onAction}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-busy={visibleState === "loading" || undefined}
      className={`focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-offset-[3px] focus-visible:outline-clay ${className}`}
    >
      <span aria-live="polite">{label}</span>
    </Button>
  );
}
