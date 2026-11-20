"use client";

import Link from "next/link";
import { IconBookmark, IconX } from "@tabler/icons-react";
import { useAppState } from "@/lib/app-state/app-state-context";
import { AppBackButton } from "@/components/app-shell/app-back-button";

export default function SavedLensesPage() {
  const { state, toggleSavedLens } = useAppState();
  const savedLenses = Object.values(state.savedLenses);

  return (
    <div className="px-5 pt-5 pb-10">
      <AppBackButton fallbackHref="/profile" className="mb-5 flex h-9 w-9 items-center justify-center rounded-[11px] border border-border bg-surface text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo" />

      <h1 className="mb-1 font-serif text-2xl font-medium tracking-tight">
        Saved lenses.
      </h1>
      <p className="mb-6 text-[12.5px] leading-[1.5] text-ink-mute">
        Ideas and ways of looking at the market that you&apos;ve bookmarked
        from Discover.
      </p>

      {savedLenses.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 rounded-[16px] border border-dashed border-border p-8 text-center">
          <IconBookmark size={22} stroke={1.5} className="text-ink-mute" />
          <p className="text-[13px] text-ink-soft">
            Nothing saved yet — tap the bookmark on any lens or idea in{" "}
            <Link href="/discover" className="font-medium text-indigo-deep">
              Discover
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border shadow-card">
          {savedLenses.map((lens) => (
            <div
              key={lens.id}
              className="flex items-center gap-3.5 bg-surface p-[14px_16px]"
            >
              <Link
                href={`/discover/lens/${lens.id}`}
                className="flex min-w-0 flex-1 items-center gap-3.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[8px] bg-indigo-tint text-indigo-deep">
                  <IconBookmark size={15} stroke={1.75} />
                </div>
                <p className="min-w-0 flex-1 text-[13.5px] font-medium text-ink">
                  {lens.title}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => toggleSavedLens(lens.id, lens.title)}
                aria-label={`Remove "${lens.title}" from saved lenses`}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] text-ink-mute hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                <IconX size={15} stroke={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
