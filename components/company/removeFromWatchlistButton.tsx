"use client";

import { useState } from "react";

export function RemoveFromWatchlistButton({
  companyName,
  onToggle,
}: {
  companyName: string;
  onToggle?: (nextWatching: boolean) => void;
}) {
  const [isWatching, setIsWatching] = useState(true);

  return (
    <button
      type="button"
      onClick={() =>
        setIsWatching((current) => {
          const next = !current;
          onToggle?.(next);
          return next;
        })
      }
      aria-pressed={isWatching}
      aria-label={
        isWatching
          ? `Remove ${companyName} from Watchlist`
          : `Add ${companyName} to Watchlist`
      }
      className="flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-border bg-transparent p-[13px] text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
    >
      {isWatching ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
