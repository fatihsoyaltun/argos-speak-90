"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import {
  getClientAuthState,
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from "@/lib/auth/client";
import {
  getSupabaseConfigStatus,
  logSupabaseConfigDiagnostics,
} from "@/lib/supabase/env";

type LoginMode = "signIn" | "signUp";
type AuthStatus = "checking" | "ready" | "notConfigured";

export default function LoginPage() {
  const router = useRouter();
  const supabaseStatus = getSupabaseConfigStatus();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    supabaseStatus.configured ? "checking" : "notConfigured",
  );
  const [mode, setMode] = useState<LoginMode>("signIn");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [technicalMessage, setTechnicalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logSupabaseConfigDiagnostics();
  }, []);

  useEffect(() => {
    if (!supabaseStatus.configured) {
      return;
    }

    let isActive = true;

    async function checkExistingSession() {
      const authState = await getClientAuthState();

      if (!isActive) {
        return;
      }

      if (authState.user) {
        router.replace("/account");
        return;
      }

      setAuthStatus("ready");
    }

    checkExistingSession();

    return () => {
      isActive = false;
    };
  }, [router, supabaseStatus.configured]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseStatus.configured) {
      setErrorMessage("Supabase bağlantısı yapılandırılmadı.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");
    setProfileMessage("");
    setTechnicalMessage("");

    const result =
      mode === "signIn"
        ? await signInWithEmailPassword({ email, password })
        : await signUpWithEmailPassword({ email, fullName, password });

    setIsSubmitting(false);

    if (result.errorMessage) {
      setErrorMessage(result.errorMessage);
      setTechnicalMessage(result.technicalMessage);
      return;
    }

    if (result.profileMessage) {
      setProfileMessage(result.profileMessage);
      setTechnicalMessage(result.technicalMessage);
    }

    if (result.session) {
      setMessage("Giriş başarılı. Hesap sayfasına yönlendiriliyorsun.");
      router.push("/account");
      return;
    }

    setMessage(
      "Hesap isteği alındı. E-posta doğrulaması açıksa gelen kutunu kontrol et, sonra giriş yap.",
    );
  }

  const canSubmit =
    email.trim().length > 3 &&
    password.trim().length >= 6 &&
    !isSubmitting &&
    authStatus === "ready";

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Cloud account"
        title="Team login"
        description="Ekip hesabıyla giriş yap. Bu faz yalnızca giriş altyapısını ekler; ilerleme senkronizasyonu henüz aktif değildir."
      />

      <Card className="space-y-5">
        {authStatus === "notConfigured" ? (
          <div className="rounded-[1.4rem] border border-clay/20 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            {supabaseStatus.invalidMessage ||
              "Supabase bağlantısı yapılandırılmadı."}{" "}
            Giriş için `NEXT_PUBLIC_SUPABASE_URL` ve
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` değerleri gerekir.
          </div>
        ) : null}

        {authStatus === "checking" ? (
          <div className="rounded-[1.4rem] bg-background/85 p-4 text-sm font-semibold leading-6 text-muted">
            Oturum kontrol ediliyor.
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-background/85 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode("signIn");
              setMessage("");
              setErrorMessage("");
              setProfileMessage("");
              setTechnicalMessage("");
            }}
            className={`min-h-11 rounded-[1rem] px-3 text-sm font-black outline-none transition focus-visible:ring-2 focus-visible:ring-clay ${
              mode === "signIn"
                ? "bg-[#17201a] text-white"
                : "bg-transparent text-[#3f493f]"
            }`}
          >
            Giriş yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signUp");
              setMessage("");
              setErrorMessage("");
              setProfileMessage("");
              setTechnicalMessage("");
            }}
            className={`min-h-11 rounded-[1rem] px-3 text-sm font-black outline-none transition focus-visible:ring-2 focus-visible:ring-clay ${
              mode === "signUp"
                ? "bg-[#17201a] text-white"
                : "bg-transparent text-[#3f493f]"
            }`}
          >
            Hesap oluştur
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signUp" ? (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Ad soyad
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Adını yaz"
                className="mt-2 min-h-12 w-full rounded-[1.25rem] border border-foreground/15 bg-background/85 px-4 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              E-posta
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-2 min-h-12 w-full rounded-[1.25rem] border border-foreground/15 bg-background/85 px-4 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Şifre
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="En az 6 karakter"
              autoComplete={mode === "signIn" ? "current-password" : "new-password"}
              className="mt-2 min-h-12 w-full rounded-[1.25rem] border border-foreground/15 bg-background/85 px-4 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/30"
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            {isSubmitting
              ? "İşleniyor"
              : mode === "signIn"
                ? "Giriş yap"
                : "Hesap oluştur"}
          </button>
        </form>

        {errorMessage ? (
          <p className="rounded-[1.25rem] border border-clay/25 bg-linen/80 p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            {errorMessage}
          </p>
        ) : null}

        {profileMessage ? (
          <p className="rounded-[1.25rem] border border-clay/25 bg-linen/80 p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            {profileMessage}
          </p>
        ) : null}

        {technicalMessage ? (
          <p className="rounded-[1.25rem] border border-foreground/10 bg-background/85 p-4 text-xs font-semibold leading-5 text-muted">
            {technicalMessage}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-[1.25rem] border border-moss/20 bg-sage p-4 text-sm font-semibold leading-6 text-foreground">
            {message}
          </p>
        ) : null}
      </Card>

      <Card className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
          Gizlilik notu
        </p>
        <p className="text-sm font-semibold leading-6 text-muted">
          Ekip kullanımında ilerleme verileri ileride yönetici tarafından eğitim
          takibi amacıyla görülebilir. Bu fazda yalnızca giriş altyapısı
          eklenmiştir.
        </p>
        <Link
          href="/settings"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-foreground/20 bg-surface px-4 py-3 text-sm font-black text-[#17201a] outline-none transition hover:bg-linen focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
        >
          Settings’e dön
        </Link>
      </Card>
    </div>
  );
}
