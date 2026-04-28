"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const MIN_DAY = 1;
const MAX_DAY = 90;
const STORAGE_KEY = "argos-active-day";

type ActiveDayContextValue = {
  activeDay: number;
  setActiveDay: (day: number | ((currentDay: number) => number)) => void;
  previousDay: () => void;
  nextDay: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

const ActiveDayContext = createContext<ActiveDayContextValue | null>(null);

function clampDay(day: number) {
  if (!Number.isFinite(day)) {
    return MIN_DAY;
  }

  return Math.min(MAX_DAY, Math.max(MIN_DAY, Math.round(day)));
}

export function ActiveDayProvider({ children }: { children: ReactNode }) {
  const [activeDay, setActiveDayState] = useState(MIN_DAY);
  const activeDayRef = useRef(MIN_DAY);
  const userChangedDayRef = useRef(false);

  const persistActiveDay = useCallback((day: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(day));
    } catch {
      // Keep navigation working even if localStorage is unavailable.
    }
  }, []);

  const commitActiveDay = useCallback(
    (day: number, options?: { persist?: boolean; markUserChange?: boolean }) => {
      const nextDay = clampDay(day);
      activeDayRef.current = nextDay;
      setActiveDayState(nextDay);

      if (options?.markUserChange) {
        userChangedDayRef.current = true;
      }

      if (options?.persist !== false) {
        persistActiveDay(nextDay);
      }
    },
    [persistActiveDay],
  );

  useEffect(() => {
    let hydrationTimer: number | undefined;

    try {
      hydrationTimer = window.setTimeout(() => {
        if (userChangedDayRef.current) {
          return;
        }

        try {
          const storedDay = window.localStorage.getItem(STORAGE_KEY);

          if (storedDay) {
            commitActiveDay(Number(storedDay), { persist: false });
          }
        } catch {
          commitActiveDay(MIN_DAY, { persist: false });
        }
      }, 0);
    } catch {
      hydrationTimer = window.setTimeout(() => {
        commitActiveDay(MIN_DAY, { persist: false });
      }, 0);
    }

    function syncFromStorage(event: StorageEvent) {
      try {
        if (event.key !== STORAGE_KEY || !event.newValue) {
          return;
        }

        commitActiveDay(Number(event.newValue), { persist: false });
      } catch {
        commitActiveDay(MIN_DAY, { persist: false });
      }
    }

    try {
      window.addEventListener("storage", syncFromStorage);
    } catch {
      // Local navigation remains available even if the storage listener fails.
    }

    return () => {
      if (hydrationTimer) {
        window.clearTimeout(hydrationTimer);
      }

      try {
        window.removeEventListener("storage", syncFromStorage);
      } catch {
        // Ignore cleanup failures in older mobile browsers.
      }
    };
  }, [commitActiveDay]);

  const setActiveDay = useCallback(
    (day: number | ((currentDay: number) => number)) => {
      const requestedDay =
        typeof day === "function" ? day(activeDayRef.current) : day;

      return commitActiveDay(requestedDay, { markUserChange: true });
    },
    [commitActiveDay],
  );

  const value = useMemo<ActiveDayContextValue>(
    () => ({
      activeDay,
      setActiveDay,
      previousDay: () => setActiveDay((currentDay) => currentDay - 1),
      nextDay: () => setActiveDay((currentDay) => currentDay + 1),
      canGoPrevious: activeDay > MIN_DAY,
      canGoNext: activeDay < MAX_DAY,
    }),
    [activeDay, setActiveDay],
  );

  return (
    <ActiveDayContext.Provider value={value}>
      {children}
    </ActiveDayContext.Provider>
  );
}

export function useActiveDay() {
  const context = useContext(ActiveDayContext);

  if (!context) {
    throw new Error("useActiveDay must be used inside ActiveDayProvider");
  }

  return context;
}

export function DayNavigator() {
  const { activeDay, previousDay, nextDay, canGoPrevious, canGoNext } =
    useActiveDay();

  return (
    <section className="rounded-[1.5rem] border border-foreground/10 bg-surface p-3 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={previousDay}
          disabled={!canGoPrevious}
          className="min-h-11 shrink-0 touch-manipulation whitespace-nowrap rounded-full bg-[#17201a] px-4 text-sm font-black text-white outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Previous
        </button>
        <div className="min-w-0 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">
            Active day
          </p>
          <p className="mt-1 text-lg font-semibold leading-none">
            Day {activeDay} / {MAX_DAY}
          </p>
        </div>
        <button
          type="button"
          onClick={nextDay}
          disabled={!canGoNext}
          className="min-h-11 shrink-0 touch-manipulation whitespace-nowrap rounded-full bg-[#17201a] px-4 text-sm font-black text-white outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Next
        </button>
      </div>
    </section>
  );
}
