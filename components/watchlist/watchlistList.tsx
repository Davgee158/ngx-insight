"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconCheck,
  IconEye,
  IconX,
} from "@tabler/icons-react";
import { TickerBadge } from "@/components/company/ticker-badge";
import { useAppState } from "@/lib/app-state/app-state-context";
import type { WatchlistCompany } from "@/lib/watchlist/types";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

interface ToastState {
  company: WatchlistCompany;
}

const TOAST_DURATION_MS = 5000;

function formatSharePrice(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function WatchlistList({
  initialCompanies,
}: {
  initialCompanies: WatchlistCompany[];
}) {
  const { addToWatchlist, removeFromWatchlist } = useAppState();
  const [removalTarget, setRemovalTarget] = useState<WatchlistCompany | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (removalTarget && !dialog.open) dialog.showModal();
    if (!removalTarget && dialog.open) dialog.close();
  }, [removalTarget]);

  function removeCompany(company: WatchlistCompany) {
    removeFromWatchlist(company.stateKey);
    setRemovalTarget(null);
    setToast({ company });
  }

  function undoRemoval() {
    if (!toast) return;
    addToWatchlist({
      companyId: toast.company.companyId,
      ticker: toast.company.stateKey,
      name: toast.company.name,
      sector: toast.company.sector,
    });
    setToast(null);
  }

  return (
    <div className="relative">
      {toast && (
        <div className="mb-3.5 flex items-center gap-2.5 rounded-md bg-surface p-4 shadow-float">
          <IconCheck
            size={16}
            stroke={1.75}
            className="flex-shrink-0 text-indigo-deep"
          />
          <p className="flex-1 text-[12.5px] leading-[1.4] text-ink-soft">
            <b className="font-medium text-ink">Removed {toast.company.ticker}.</b>{" "}
            It&apos;s off your Watchlist.
          </p>
          <button
            type="button"
            onClick={undoRemoval}
            className={`flex-shrink-0 rounded-sm text-[12.5px] font-medium text-indigo-deep ${FOCUS_RING}`}
          >
            Undo
          </button>
        </div>
      )}

      {initialCompanies.length === 0 ? (
        <div className="mt-10 flex flex-col items-center px-4 text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-tint text-indigo-deep">
            <IconEye size={20} stroke={1.75} />
          </div>
          <h1 className="mb-2 font-serif text-xl font-medium tracking-tight text-ink">
            No companies saved yet.
          </h1>
          <p className="mb-5 max-w-[280px] text-[13px] leading-[1.5] text-ink-mute">
            Save a company from its analysis page and it will appear here.
          </p>
          <Link
            href="/discover"
            className={`flex items-center gap-1 rounded-sm text-[13px] font-medium text-indigo-deep ${FOCUS_RING}`}
          >
            Explore companies
            <IconArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          <h1 className="mb-1 font-serif text-2xl font-medium tracking-tight text-ink">
            Saved companies
          </h1>
          <p className="mb-5 text-[12.5px] text-ink-mute">
            {initialCompanies.length} {initialCompanies.length === 1 ? "company" : "companies"} on your Watchlist.
          </p>

          <div className="flex flex-col gap-2.5">
            {initialCompanies.map((company) => {
              return (
                <article
                  key={company.companyId}
                  className="rounded-md border border-border bg-surface p-4 shadow-card"
                >
                  <div className="flex items-start gap-3.5">
                    <TickerBadge ticker={company.ticker} size="large" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold leading-[1.2] text-ink">
                            {company.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-ink-mute">
                            {company.sector}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-[13px] font-semibold text-ink">
                            {formatSharePrice(company.sharePrice)}
                          </p>
                          <p className="text-[10.5px] text-ink-mute">Share price</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                        <Link
                          href={`/company/${company.slug}`}
                          className={`flex items-center gap-1 text-[12px] font-medium text-indigo-deep ${FOCUS_RING}`}
                        >
                          Open analysis
                          <IconArrowRight size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setRemovalTarget(company)}
                          className={`flex items-center gap-1 text-[11.5px] text-ink-mute ${FOCUS_RING}`}
                        >
                          <IconX size={13} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setRemovalTarget(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setRemovalTarget(null);
        }}
        aria-labelledby="removal-sheet-title"
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40"
      >
        {removalTarget && (
          <div className="rounded-t-3xl bg-surface px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 shadow-float">
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
            <h2
              id="removal-sheet-title"
              className="mb-1 font-serif text-lg font-medium tracking-tight text-ink"
            >
              Remove {removalTarget.ticker} from Watchlist?
            </h2>
            <p className="mb-4 text-[12.5px] text-ink-mute">
              You can add it again from its analysis page.
            </p>
            <button
              type="button"
              onClick={() => removeCompany(removalTarget)}
              className={`flex w-full items-center justify-center gap-1.5 rounded-sm bg-ink py-3 text-[13.5px] font-medium text-white ${FOCUS_RING}`}
            >
              Remove from Watchlist
              <IconCheck size={14} stroke={1.75} />
            </button>
            <button
              type="button"
              onClick={() => setRemovalTarget(null)}
              className={`mt-2.5 w-full rounded-sm py-2.5 text-center text-[12px] text-ink-mute ${FOCUS_RING}`}
            >
              Keep on Watchlist
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
