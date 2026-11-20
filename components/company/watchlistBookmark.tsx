"use client";

import { useState } from "react";
import { IconBookmark } from "@tabler/icons-react";

export function WatchlistBookmark({
  companyName,
  initialSaved,
  onToggle,
}: {
  companyName: string;
  initialSaved: boolean;
  onToggle?: (nextSaved: boolean) => void;
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={
        isSaved
          ? `Remove ${companyName} from Watchlist`
          : `Add ${companyName} to Watchlist`
      }
      onClick={() =>
        setIsSaved((current) => {
          const next = !current;
          onToggle?.(next);
          return next;
        })
      }
      className={`flex w-full items-center justify-center gap-1.5 rounded-[12px] border p-[13px] text-[13.5px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
        isSaved
          ? "border-border bg-surface-tint text-ink-mute"
          : "border-border bg-transparent text-ink-soft hover:bg-surface-tint"
      }`}
    >
      <IconBookmark size={15} stroke={1.75} />
      {isSaved ? "Added to Watchlist" : "Add to Watchlist"}
    </button>
  );
}
