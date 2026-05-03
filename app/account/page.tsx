"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamPrivacyNotice } from "@/components/team-privacy-notice";
import { Card, PageHeader } from "@/components/ui";
import {
  getClientAuthState,
  signOutClientUser,
  type AuthProfile,
} from "@/lib/auth/client";
import { getSupabaseConfigStatus } from "@/lib/supabase/env";

type AccountStatus = "checking" | "notConfigured" | "signedOut" | "signedIn";

export default function AccountPage() {
  const router = useRouter();
  const supabaseStatus = getSupabaseConfigStatus();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(
    supabaseStatus.configured ? "checking" : "notConfigured",
  );
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [profileMessage, setProfileMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (!supabaseStatus.configured) {
      return;
    }

    let isActive = true;

    async function loadAccount() {
      const authState = await getClientAuthState().catch(() => ({
        profile: null,
        profileMessage:
          "Oturum kontrolü geçici olarak başarısız oldu. Lütfen tekrar deneyin.",
        session: null,
        user: null,
      }));

      if (!isActive) {
        return;
      }

      if (!authState.user) {
        setAccountStatus("signedOut");
        return;
      }

      setEmail(authState.user.email ?? "");
      setProfile(authState.profile);
      setProfileMessage(authState.profileMessage);
      setAccountStatus("signedIn");
    }

    loadAccount();

    return () => {
      isActive = false;
    };
  }, [supabaseStatus.configured]);

  async function signOut() {
    setIsSigningOut(true);
    setActionMessage("");

    const errorMessage = await signOutClientUser();

    setIsSigningOut(false);

    if (errorMessage) {
      setActionMessage(errorMessage);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Account"
        title="Cloud account"
        description="Ekip hesabını ve cloud görünürlüğünü kontrol et. Yerel ilerleme cihazında kalır; admin panelinde yalnızca cloud’a senkronize edilen ilerleme görünür."
      />

      <TeamPrivacyNotice />

      {accountStatus === "notConfigured" ? (
        <Card className="space-y-4">
          <p className="rounded-[1.4rem] border border-clay/20 bg-linen p-4 text-sm font-semibold leading-6 text-[#2d261d]">
            {supabaseStatus.invalidMessage ||
              "Supabase bağlantısı yapılandırılmadı."}
          </p>
          <Link
            href="/settings"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-sm font-black text-white outline-none transition hover:bg-[#33493a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Settings’e dön
          </Link>
        </Card>
      ) : null}

      {accountStatus === "checking" ? (
        <Card>
          <p className="text-sm font-semibold leading-6 text-muted">
            Hesap durumu kontrol ediliyor.
          </p>
        </Card>
      ) : null}

      {accountStatus === "signedOut" ? (
        <Card className="space-y-4">
          <p className="text-sm font-semibold leading-6 text-muted">
            Şu anda giriş yapılmadı.
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17201a] px-4 py-3 text-sm font-black text-white outline-none transition hover:bg-[#33493a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface"
          >
            Login sayfasına git
          </Link>
        </Card>
      ) : null}

      {accountStatus === "signedIn" ? (
        <>
          <Card className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                  Email
                </p>
                <p className="mt-2 break-words text-lg font-semibold">
                  {email || profile?.email || "Email bulunamadı"}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                  Role
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {profile?.role || "member"}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                  Team status
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {profile?.teamStatus || "Not set"}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-foreground/10 bg-background/85 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
                  Cloud progress
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Manual sync available
                </p>
              </div>
            </div>

            {profileMessage ? (
              <p className="rounded-[1.25rem] border border-clay/25 bg-linen/80 p-4 text-sm font-semibold leading-6 text-[#2d261d]">
                {profileMessage}
              </p>
            ) : null}

            {profile?.role === "admin" ? (
              <Link
                href="/admin"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-foreground/20 bg-linen px-5 py-4 text-center text-sm font-black !text-[#17201a] outline-none transition visited:!text-[#17201a] hover:bg-sage hover:!text-[#17201a] active:scale-[0.98] active:!text-[#17201a] focus-visible:!text-[#17201a] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto [&_*]:!text-[#17201a]"
              >
                Admin panelini aç
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              disabled={isSigningOut}
              className="min-h-12 w-full rounded-full bg-[#17201a] px-5 py-4 text-sm font-black text-white shadow-soft outline-none transition hover:bg-[#33493a] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 focus-visible:ring-offset-surface sm:w-auto"
            >
              {isSigningOut ? "Çıkış yapılıyor" : "Çıkış yap"}
            </button>

            {actionMessage ? (
              <p className="rounded-[1.25rem] border border-clay/25 bg-linen/80 p-4 text-sm font-semibold leading-6 text-[#2d261d]">
                {actionMessage}
              </p>
            ) : null}
          </Card>

          <Card className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
              Senkronizasyon notu
            </p>
            <p className="text-sm font-semibold leading-6 text-muted">
              Admin panelinde yalnızca cloud’a senkronize edilen ilerleme
              görünür. Local kayıtların bu cihazda kalır; takım takibi için
              Settings içinden Cloud’a yedekle veya Senkronize et kullan.
            </p>
          </Card>
        </>
      ) : null}

      <Card className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
          Gizlilik notu
        </p>
        <p className="text-sm font-semibold leading-6 text-muted">
          Ekip kullanımında ilerleme verileri ileride yönetici tarafından eğitim
          takibi amacıyla görülebilir. Bu fazda yalnızca giriş altyapısı
          eklenmiştir.
        </p>
      </Card>
    </div>
  );
}
