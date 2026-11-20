"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { Section } from "@/lib/home/types";
import {
  EMPTY_APP_STATE,
  type AppState,
  type EngagementEntryBase,
} from "./types";
import { COMPANY_ROUTE_CONFIGS } from "@/lib/company/company-config";

const STORAGE_KEY = "ngx-insight:app-state";

const listeners = new Set<() => void>();
interface AppStateSnapshot {
  state: AppState;
  storageAvailable: boolean;
}

const EMPTY_SNAPSHOT: AppStateSnapshot = {
  state: EMPTY_APP_STATE,
  storageAvailable: true,
};

let snapshot: AppStateSnapshot = EMPTY_SNAPSHOT;
let initialized = false;

function readStoredSnapshot(): AppStateSnapshot {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SNAPSHOT;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const legacyCompanyIds = new Map(
      COMPANY_ROUTE_CONFIGS.map((company) => [
        company.appStateKey.toLowerCase(),
        company.companyId,
      ]),
    );
    const storedEntries =
      parsed.entries && typeof parsed.entries === "object"
        ? parsed.entries
        : EMPTY_APP_STATE.entries;
    const entries = Object.fromEntries(
      Object.entries(storedEntries).flatMap(([key, entry]) => {
        if (!entry || typeof entry !== "object") return [];
        const stateKey =
          typeof entry.ticker === "string"
            ? entry.ticker.toLowerCase()
            : key.toLowerCase();
        return [[
          stateKey,
          {
            ...entry,
            ticker: stateKey,
            companyId:
              entry.companyId ?? legacyCompanyIds.get(stateKey) ?? undefined,
          },
        ] as const];
      }),
    );

    return {
      state: {
        ...EMPTY_APP_STATE,
        ...parsed,
        entries,
        savedLenses:
          parsed.savedLenses && typeof parsed.savedLenses === "object"
            ? parsed.savedLenses
            : EMPTY_APP_STATE.savedLenses,
      },
      storageAvailable: true,
    };
  } catch {
    // Keep the app usable in memory and expose that browser storage failed.
    return { state: EMPTY_APP_STATE, storageAvailable: false };
  }
}

function getSnapshot(): AppStateSnapshot {
  if (typeof window !== "undefined" && !initialized) {
    snapshot = readStoredSnapshot();
    initialized = true;
  }
  return snapshot;
}

function getServerSnapshot(): AppStateSnapshot {
  return EMPTY_SNAPSHOT;
}

function notifySubscribers() {
  listeners.forEach((listener) => listener());
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  snapshot = readStoredSnapshot();
  initialized = true;
  notifySubscribers();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

function updateState(updater: (current: AppState) => AppState) {
  const current = getSnapshot();
  const next = updater(current.state);
  if (next === current.state) return;

  initialized = true;
  let storageAvailable = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    storageAvailable = false;
  }
  snapshot = { state: next, storageAvailable };
  notifySubscribers();
}

interface AppStateContextValue {
  state: AppState;
  storageAvailable: boolean;
  addToWatchlist: (entry: EngagementEntryBase) => void;
  removeFromWatchlist: (ticker: string) => void;
  markSectionReviewed: (entry: EngagementEntryBase, section: Section) => void;
  toggleSavedLens: (id: string, title: string) => void;
  recordBuy: (entry: EngagementEntryBase, shares: number, avgPrice: number) => void;
  recordSell: (ticker: string, sharesSold: number) => void;
  removePosition: (ticker: string) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const currentSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const state = currentSnapshot.state;

  function addToWatchlist(entry: EngagementEntryBase) {
    updateState((current) => {
      const existingByCompanyId = entry.companyId
        ? Object.entries(current.entries).find(
            ([, existing]) => existing.companyId === entry.companyId,
          )
        : undefined;
      const stateKey = existingByCompanyId?.[0] ?? entry.ticker;
      const existing = current.entries[stateKey];

      return {
        ...current,
        entries: {
          ...current.entries,
          [stateKey]: {
            ...entry,
            ticker: stateKey,
            relationship: "watching",
            reviewedSections: existing?.reviewedSections ?? [],
          },
        },
      };
    });
  }

  function removeFromWatchlist(ticker: string) {
    updateState((current) => {
      const existing = current.entries[ticker];
      if (!existing) return current;
      return {
        ...current,
        entries: {
          ...current.entries,
          [ticker]: { ...existing, relationship: "none" },
        },
      };
    });
  }

  function markSectionReviewed(entry: EngagementEntryBase, section: Section) {
    updateState((current) => {
      const existing = current.entries[entry.ticker];
      if (existing?.reviewedSections.includes(section)) return current;
      return {
        ...current,
        entries: {
          ...current.entries,
          [entry.ticker]: {
            ...entry,
            relationship: existing?.relationship ?? "none",
            reviewedSections: [
              ...(existing?.reviewedSections ?? []),
              section,
            ],
          },
        },
      };
    });
  }

  function recordBuy(entry: EngagementEntryBase, shares: number, avgPrice: number) {
    updateState((current) => {
      const existing = current.entries[entry.ticker];
      const existingPosition = existing?.position;
      const newShares = (existingPosition?.shares ?? 0) + shares;
      const newAvgPrice = existingPosition
        ? (existingPosition.shares * existingPosition.avgPrice + shares * avgPrice) /
          newShares
        : avgPrice;
      return {
        ...current,
        entries: {
          ...current.entries,
          [entry.ticker]: {
            ...entry,
            relationship: "held",
            reviewedSections: existing?.reviewedSections ?? [],
            position: { shares: newShares, avgPrice: newAvgPrice },
          },
        },
      };
    });
  }

  function recordSell(ticker: string, sharesSold: number) {
    updateState((current) => {
      const existing = current.entries[ticker];
      if (!existing?.position) return current;
      const remainingShares = existing.position.shares - sharesSold;
      if (remainingShares <= 0) {
        return {
          ...current,
          entries: {
            ...current.entries,
            [ticker]: { ...existing, relationship: "none", position: undefined },
          },
        };
      }
      return {
        ...current,
        entries: {
          ...current.entries,
          [ticker]: {
            ...existing,
            position: { ...existing.position, shares: remainingShares },
          },
        },
      };
    });
  }

  function removePosition(ticker: string) {
    updateState((current) => {
      const existing = current.entries[ticker];
      if (!existing?.position) return current;
      return {
        ...current,
        entries: {
          ...current.entries,
          [ticker]: {
            ...existing,
            relationship: "none",
            position: undefined,
          },
        },
      };
    });
  }

  function toggleSavedLens(id: string, title: string) {
    updateState((current) => {
      const next = { ...current.savedLenses };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = { id, title };
      }
      return { ...current, savedLenses: next };
    });
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        storageAvailable: currentSnapshot.storageAvailable,
        addToWatchlist,
        removeFromWatchlist,
        markSectionReviewed,
        toggleSavedLens,
        recordBuy,
        recordSell,
        removePosition,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
