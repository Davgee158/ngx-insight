"use client";

import { IconBookmarkFilled } from "@tabler/icons-react";
import { useAppState } from "@/lib/app-state/app-state-context";

export function SavedLensesPreview() {
  const { state } = useAppState();
  const savedLenses = Object.values(state.savedLenses);

  return (
    <div className="mt-3 rounded-[12px] bg-surface-tint p-[12px_14px]">
      {savedLenses.length > 0 ? (
        savedLenses.map((lens) => (
          <div
            key={lens.id}
            className="flex items-center gap-2.5 border-b border-border py-1.5 last:border-b-0"
          >
            <IconBookmarkFilled
              size={14}
              stroke={1.75}
              className="flex-shrink-0 text-indigo-deep"
            />
            <p className="flex-1 text-[12px] text-ink">{lens.title}</p>
          </div>
        ))
      ) : (
        <p className="py-1.5 text-[12px] text-ink-mute">
          Nothing saved yet — tap the bookmark on any idea in Discover.
        </p>
      )}
      <p className="mt-2.5 border-t border-border pt-2.5 text-[11.5px] text-ink-mute">
        More saved lenses will show up here as you save them from Discover.
      </p>
    </div>
  );
}
