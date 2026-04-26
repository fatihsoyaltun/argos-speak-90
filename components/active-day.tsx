"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const MIN_DAY = 1;
const MAX_DAY = 42;
const STORAGE_KEY = "argos-active-day";
const DAY_CHANGE_EVENT = "argos-active-day-change";

let memoryActiveDay = MIN_DAY;

type ActiveDayContextValue = {
  activeDay: number;
  setActiveDay: (day: number) => void;
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

function getServerActiveDay() {
  return MIN_DAY;
}

function getStoredActiveDay() {
  if (typeof window === "undefined") {
    return MIN_DAY;
  }

  try {
    const storedDay = window.localStorage.getItem(STORAGE_KEY);

    if (storedDay) {
      memoryActiveDay = clampDay(Number(storedDay));
    }
  } catch {
    return memoryActiveDay;
  }

  return memoryActiveDay;
}

function subscribeToActiveDay(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(DAY_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(DAY_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function ActiveDayProvider({ children }: { children: ReactNode }) {
  const activeDay = useSyncExternalStore(
    subscribeToActiveDay,
    getStoredActiveDay,
    getServerActiveDay,
  );

  const setActiveDay = useCallback((day: number) => {
    const nextDay = clampDay(day);
    memoryActiveDay = nextDay;

    try {
      window.localStorage.setItem(STORAGE_KEY, String(nextDay));
    } catch {
      // Keep navigation working even if localStorage is unavailable.
    }

    window.dispatchEvent(new Event(DAY_CHANGE_EVENT));
  }, []);

  const value = useMemo<ActiveDayContextValue>(
    () => ({
      activeDay,
      setActiveDay,
      previousDay: () => setActiveDay(activeDay - 1),
      nextDay: () => setActiveDay(activeDay + 1),
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
          className="min-h-11 shrink-0 whitespace-nowrap rounded-full bg-[#17201a] px-4 text-sm font-black text-white outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
          className="min-h-11 shrink-0 whitespace-nowrap rounded-full bg-[#17201a] px-4 text-sm font-black text-white outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d7d0c6] disabled:text-[#3f493f] focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Next
        </button>
      </div>
    </section>
  );
}
