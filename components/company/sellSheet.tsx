"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

const PERCENT_PICKS = [25, 50, 75, 100];

function formatNaira(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}₦${Math.abs(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

export function SellSheet({
  companyName,
  currentPrice,
  position,
  onConfirm,
  open,
  onOpenChange,
  hideTrigger = false,
}: {
  companyName: string;
  currentPrice: number | null;
  position: { shares: number; avgPrice: number };
  onConfirm?: (sharesSold: number) => void;
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

  const [quantity, setQuantity] = useState("");
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);
  const [priceSold, setPriceSold] = useState(currentPrice?.toFixed(2) ?? "");
  const [when, setWhen] = useState("Today");

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
    setQuantity("");
    setSelectedPercent(null);
    setPriceSold(currentPrice?.toFixed(2) ?? "");
    setWhen("Today");
  }

  function closeSheet() {
    changeOpen(false);
    resetForm();
  }

  function pickPercent(percent: number) {
    const count = Math.round((percent / 100) * position.shares);
    setSelectedPercent(percent);
    setQuantity(String(count));
  }

  const sharesSold = Number(quantity) || 0;
  const isValidQuantity = sharesSold > 0 && sharesSold <= position.shares;
  const proceeds = sharesSold * (Number(priceSold) || 0);
  const costBasis = sharesSold * position.avgPrice;
  const gainLoss = proceeds - costBasis;
  const remaining = position.shares - sharesSold;

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => changeOpen(true)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-border bg-transparent p-[13px] text-[13.5px] font-medium text-ink-soft ${FOCUS_RING}`}
        >
          <IconMinus size={15} stroke={1.75} />
          Sell some or all
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
            if (isValidQuantity) {
              onConfirm?.(sharesSold);
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
            Log your {companyName} sale
          </h2>
          <p className="mb-4 text-[12.5px] leading-[1.5] text-ink-mute">
            You held {position.shares} shares at ₦
            {position.avgPrice.toFixed(2)} average. How much did you sell?
          </p>

          <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
            How many shares did you sell?
          </span>
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {PERCENT_PICKS.map((percent) => (
              <button
                key={percent}
                type="button"
                aria-pressed={selectedPercent === percent}
                onClick={() => pickPercent(percent)}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium ${FOCUS_RING} ${
                  selectedPercent === percent
                    ? "border-transparent bg-indigo-tint text-indigo-deep"
                    : "border-border bg-surface text-ink-soft"
                }`}
              >
                {percent === 100
                  ? `All (${position.shares})`
                  : `${percent}% (${Math.round((percent / 100) * position.shares)})`}
              </button>
            ))}
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={quantity}
            onChange={(event) => {
              setQuantity(event.target.value);
              setSelectedPercent(null);
            }}
            placeholder="Or type a specific number"
            className={`mb-4 w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink ${FOCUS_RING}`}
          />

          <div className="mb-4 flex gap-2.5">
            <label className="flex-1">
              <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
                Avg price sold at (₦)
              </span>
              <input
                type="text"
                value={priceSold}
                onChange={(event) => setPriceSold(event.target.value)}
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

          {isValidQuantity && Number(priceSold) > 0 && (
            <div className="mb-4 rounded-md bg-surface-tint p-3.5">
              <div className="flex items-baseline justify-between py-1">
                <span className="text-[12px] text-ink-soft">
                  Realized proceeds
                </span>
                <span className="font-mono text-[14px] font-medium text-ink">
                  {formatNaira(proceeds)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-dashed border-border py-1">
                <span className="text-[12px] text-ink-soft">
                  Cost basis of sold shares
                </span>
                <span className="font-mono text-[12.5px] text-ink">
                  {formatNaira(costBasis)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-dashed border-border py-1">
                <span className="text-[12px] text-ink-soft">
                  Realized gain/loss
                </span>
                <span
                  className={`font-mono text-[14px] font-medium ${
                    gainLoss >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  {gainLoss >= 0 ? "+" : ""}
                  {formatNaira(gainLoss)}
                </span>
              </div>
              <p className="mt-2.5 border-t border-border pt-2.5 text-[12px] leading-[1.5] text-ink-soft">
                You&apos;d still hold{" "}
                <span className="font-semibold text-ink">
                  {remaining} shares
                </span>{" "}
                after this.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValidQuantity}
            className={`flex w-full items-center justify-center gap-1.5 rounded-sm bg-ink py-3 text-[13.5px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            Update position
            <IconCheck size={14} stroke={1.75} />
          </button>
          <p className="mt-3 text-center text-[11px] leading-[1.5] text-ink-mute">
            {currentPrice !== null
              ? "The sale price is pre-filled from the latest captured share price. Adjust it to what your broker paid you."
              : "Enter the price you received if you want to review the sale estimate."}
          </p>
        </form>
      </dialog>
    </>
  );
}
