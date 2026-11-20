"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

export function BuySheet({
  companyName,
  currentPrice,
  triggerLabel = "Buy",
  triggerVariant = "primary",
  muted = false,
  onConfirm,
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  companyName: string;
  currentPrice: number | null;
  triggerLabel?: string;
  triggerVariant?: "primary" | "secondary";
  muted?: boolean;
  onConfirm?: (shares: number, avgPrice: number) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  function changeOpen(nextOpen: boolean) {
    if (open === undefined) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useBodyScrollLock(isOpen);

  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState(currentPrice?.toFixed(2) ?? "");
  const [when, setWhen] = useState("Today");

  const [showCalculator, setShowCalculator] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function resetForm() {
    setShares("");
    setAvgPrice(currentPrice?.toFixed(2) ?? "");
    setWhen("Today");
    setShowCalculator(false);
    setAmount("");
  }

  function closeSheet() {
    changeOpen(false);
    resetForm();
  }

  const parsedAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const estimatedShares =
    parsedAmount > 0 && currentPrice !== null && currentPrice > 0
      ? Math.floor(parsedAmount / currentPrice)
      : null;

  function useEstimate() {
    if (estimatedShares) {
      setShares(String(estimatedShares));
      setShowCalculator(false);
    }
  }

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => changeOpen(true)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-[12px] p-[13px] text-[13.5px] font-medium ${FOCUS_RING} ${
            triggerVariant === "primary"
              ? "bg-ink text-white"
              : "border border-border bg-transparent text-ink-soft"
          } ${muted ? "opacity-60" : ""}`}
        >
          <IconPlus size={15} stroke={1.75} />
          {triggerLabel}
        </button>
      )}

      <dialog
        ref={dialogRef}
        onClose={closeSheet}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeSheet();
        }}
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const parsedShares = Number(shares);
            const parsedAvgPrice = Number(avgPrice);
            if (parsedShares > 0 && parsedAvgPrice > 0) {
              onConfirm?.(parsedShares, parsedAvgPrice);
            }
            closeSheet();
          }}
          className="rounded-t-3xl bg-surface px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 shadow-float"
        >
          <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
          <h2
            id={titleId}
            className="mb-1 font-serif text-lg font-medium tracking-tight text-ink"
          >
            Log your {companyName} purchase
          </h2>
          <p className="mb-4 text-[12.5px] leading-[1.5] text-ink-mute">
            Just enough to keep your Portfolio in sync with what you actually
            own.
          </p>

          <label className="mb-2.5 block">
            <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
              How many shares?
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={shares}
              onChange={(event) => setShares(event.target.value)}
              placeholder="e.g. 100"
              className={`w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink ${FOCUS_RING}`}
            />
          </label>

          {!showCalculator && currentPrice !== null ? (
            <button
              type="button"
              onClick={() => setShowCalculator(true)}
              className={`mb-3.5 rounded-sm text-[12px] font-medium text-indigo-deep ${FOCUS_RING}`}
            >
              Not sure how many? Calculate from an amount
            </button>
          ) : (
            <div className="mb-3.5 rounded-sm bg-surface-tint p-3.5">
              <label className="mb-2 block">
                <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
                  How much do you want to invest?
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="e.g. ₦50,000"
                  className={`w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink ${FOCUS_RING}`}
                />
              </label>
              {estimatedShares !== null && (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] text-ink-soft">
                    ≈{" "}
                    <span className="font-mono font-medium text-ink">
                      {estimatedShares.toLocaleString()}
                    </span>{" "}
                    shares at ₦{currentPrice?.toFixed(2) ?? "—"}
                  </p>
                  <button
                    type="button"
                    onClick={useEstimate}
                    className={`flex-shrink-0 rounded-sm text-[12px] font-medium text-indigo-deep ${FOCUS_RING}`}
                  >
                    Use this
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mb-4 flex gap-2.5">
            <label className="flex-1">
              <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
                Avg price paid (₦)
              </span>
              <input
                type="text"
                value={avgPrice}
                onChange={(event) => setAvgPrice(event.target.value)}
                className={`w-full rounded-sm border border-border bg-surface-tint px-3.5 py-2.5 text-[13.5px] text-ink ${FOCUS_RING}`}
              />
            </label>
            <label className="flex-1">
              <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
                When?
              </span>
              <input
                type="text"
                value={when}
                onChange={(event) => setWhen(event.target.value)}
                className={`w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink ${FOCUS_RING}`}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!shares || Number(avgPrice) <= 0}
            className={`flex w-full items-center justify-center gap-1.5 rounded-sm bg-ink py-3 text-[13.5px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            Add to Portfolio
            <IconCheck size={14} stroke={1.75} />
          </button>
          <p className="mt-3 text-center text-[11px] leading-[1.5] text-ink-mute">
            {currentPrice !== null
              ? "Price is pre-filled from the latest captured share price. Adjust it to what your broker charged."
              : "Enter the price you paid to keep your average purchase price accurate."}
          </p>
        </form>
      </dialog>
    </>
  );
}
