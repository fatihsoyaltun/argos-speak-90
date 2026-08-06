import Link from "next/link";
import { ActiveDayProvider } from "@/components/active-day";
import { BottomNavigation } from "@/components/bottom-navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ActiveDayProvider>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <header className="app-header sticky top-0 z-20 border-b border-border-subtle bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[var(--content-measure)] items-center px-4 py-3.5 sm:px-6">
            <Link
              href="/"
              className="min-w-0 rounded-2xl leading-none outline-none focus-visible:ring-[3px] focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <p className="truncate text-xs font-bold uppercase tracking-[0.16em] text-moss">
                Argos
              </p>
              <p className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
                Speak 90
              </p>
            </Link>
          </div>
        </header>

        <main className="app-main mx-auto w-full px-4 pt-7 sm:px-6 sm:pt-8">
          {children}
        </main>

        <BottomNavigation />
      </div>
    </ActiveDayProvider>
  );
}
