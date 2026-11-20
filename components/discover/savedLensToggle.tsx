"use client";

import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { useAppState } from "@/lib/app-state/app-state-context";
import { lensSlug } from "@/lib/discover/slug";

export function SavedLensToggle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const { state, toggleSavedLens } = useAppState();
  const id = lensSlug(title);
  const isSaved = Boolean(state.savedLenses[id]);

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove "${title}" from saved lenses` : `Save "${title}"`}
      onClick={() => toggleSavedLens(id, title)}
      className={`flex items-center justify-center rounded-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
        isSaved
          ? "bg-indigo-tint text-indigo-deep"
          : "bg-surface-tint text-ink-soft hover:bg-indigo-tint hover:text-indigo-deep"
      } ${className ?? ""}`}
    >
      {isSaved ? (
        <IconBookmarkFilled size={13} stroke={1.75} />
      ) : (
        <IconBookmark size={13} stroke={1.75} />
      )}
    </button>
  );
}
