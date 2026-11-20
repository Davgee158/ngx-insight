"use client";

import { useAppState } from "@/lib/app-state/app-state-context";

export function StorageWarning() {
  const { storageAvailable } = useAppState();

  if (storageAvailable) return null;

  return (
    <div
      className="mx-4 mt-3 rounded-xl border border-amber-border-soft bg-amber-tint px-4 py-3 text-sm text-amber-deep sm:mx-6"
      role="status"
      aria-live="polite"
    >
      Insight can’t save changes in this browser right now. They may be lost
      when you refresh or leave this page.
    </div>
  );
}
