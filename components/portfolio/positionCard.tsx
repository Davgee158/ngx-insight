import {
  useEffect,
  useId,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";
import {
  IconPlayerPause,
  IconArchive,
  IconClock,
  IconCoin,
  IconNews,
  IconDotsVertical,
  IconPlus,
  IconMinus,
  IconTrash,
} from "@tabler/icons-react";
import { createPortal } from "react-dom";
import type { Position } from "@/lib/portfolio/types";
import { TickerBadge } from "@/components/company/ticker-badge";
import { BuySheet } from "@/components/company/buySheet";
import { SellSheet } from "@/components/company/sellSheet";

const SECTION_LABELS: Record<string, string> = {
  business: "The Business",
  "financial-health": "Financial Health",
  valuation: "Valuation",
  risks: "Risks",
};

const SWIPE_ACTION_THRESHOLD = 130;
const SWIPE_MAX_OFFSET = 160;
const POSITION_MENU_WIDTH = 144;

export function PositionCard({
  position,
  onBuyConfirm,
  onSellConfirm,
  onDelete,
}: {
  position: Position;
  onBuyConfirm: (shares: number, avgPrice: number) => void;
  onSellConfirm: (sharesSold: number) => void;
  onDelete: () => void;
}) {
  const [tradeAction, setTradeAction] = useState<"buy" | "sell" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const deleteTitleId = useId();
  const isSuspended = position.tradingStatus === "suspended";
  const isDelisted = position.tradingStatus === "delisted";
  const trigger = position.attentionTrigger;

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;
    if (confirmDeleteOpen && !dialog.open) dialog.showModal();
    else if (!confirmDeleteOpen && dialog.open) dialog.close();
  }, [confirmDeleteOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function closeForOutsidePointer(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Node &&
        (menuRef.current?.contains(target) ||
          menuButtonRef.current?.contains(target))
      ) {
        return;
      }
      setMenuOpen(false);
    }

    function closeForEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    function closeForViewportChange() {
      setMenuOpen(false);
    }

    document.addEventListener("pointerdown", closeForOutsidePointer);
    document.addEventListener("keydown", closeForEscape);
    window.addEventListener("scroll", closeForViewportChange, true);
    window.addEventListener("resize", closeForViewportChange);

    return () => {
      document.removeEventListener("pointerdown", closeForOutsidePointer);
      document.removeEventListener("keydown", closeForEscape);
      window.removeEventListener("scroll", closeForViewportChange, true);
      window.removeEventListener("resize", closeForViewportChange);
    };
  }, [menuOpen]);

  function togglePositionMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    const button = menuButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuHeight = !isSuspended && !isDelisted ? 132 : 48;
    const opensAbove = window.innerHeight - rect.bottom < menuHeight + 12;
    const maxRight = Math.max(8, window.innerWidth - POSITION_MENU_WIDTH - 8);

    setMenuPosition({
      top: opensAbove
        ? undefined
        : Math.min(rect.bottom + 8, window.innerHeight - menuHeight - 8),
      bottom: opensAbove ? window.innerHeight - rect.top + 8 : undefined,
      right: Math.max(8, Math.min(maxRight, window.innerWidth - rect.right)),
    });
    setMenuOpen(true);
  }

  const rowBgClass = isSuspended
    ? "bg-amber-tint"
    : isDelisted
      ? "bg-surface-tint opacity-70"
      : "bg-surface";

  function startSwipe(event: ReactTouchEvent<HTMLDivElement>) {
    const target = event.target;
    if (
      target instanceof Element &&
      target.closest("button, input, textarea, select, dialog")
    ) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  }

  function moveSwipe(event: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current || isSuspended || isDelisted) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      setSwipeOffset(
        Math.max(-SWIPE_MAX_OFFSET, Math.min(SWIPE_MAX_OFFSET, deltaX)),
      );
    }
  }

  function finishSwipe(event: ReactTouchEvent<HTMLDivElement>) {
    if (!touchStart.current || isSuspended || isDelisted) {
      setIsDragging(false);
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    setIsDragging(false);
    setSwipeOffset(0);
    if (
      Math.abs(deltaX) < SWIPE_ACTION_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.4
    ) {
      return;
    }
    setMenuOpen(false);
    setTradeAction(deltaX > 0 ? "sell" : "buy");
  }

  function cancelSwipe() {
    touchStart.current = null;
    setIsDragging(false);
    setSwipeOffset(0);
  }

  return (
    <>
      <div
        onTouchStart={startSwipe}
        onTouchMove={moveSwipe}
        onTouchEnd={finishSwipe}
        onTouchCancel={cancelSwipe}
        style={{ touchAction: "pan-y" }}
        className="relative overflow-hidden rounded-lg"
      >
        {swipeOffset !== 0 && !isSuspended && !isDelisted && (
          <div
            aria-hidden="true"
            className={`absolute inset-0 flex items-center px-5 ${
              swipeOffset > 0
                ? "justify-start bg-amber-tint text-amber-deep"
                : "justify-end bg-indigo-tint text-indigo-deep"
            }`}
          >
            <span className="flex items-center gap-2 text-[12px] font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/80">
                {swipeOffset > 0 ? (
                  <IconMinus size={17} stroke={2} />
                ) : (
                  <IconPlus size={17} stroke={2} />
                )}
              </span>
              {swipeOffset > 0 ? "Sell" : "Buy"}
            </span>
          </div>
        )}
        <div
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isDragging
              ? "none"
              : "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
          className={`relative flex gap-3.5 rounded-lg border border-border p-[14px_16px] ${rowBgClass} ${
            isSuspended || isDelisted || trigger ? "items-start" : "items-center"
          }`}
        >
          <TickerBadge
            ticker={position.ticker}
            size="large"
            className={isDelisted ? "grayscale opacity-75" : ""}
          />
          <div className="min-w-0 flex-1">
        {isSuspended && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-amber-tint px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide text-amber-deep">
            <IconPlayerPause size={12} stroke={1.75} />
            Trading suspended
          </span>
        )}
        {isDelisted && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-[3px] text-[9.5px] font-semibold uppercase tracking-wide text-ink-mute">
            <IconArchive size={12} stroke={1.75} />
            Delisted
          </span>
        )}
        <p className="text-[13.5px] font-semibold text-ink">
          {position.name}
        </p>
        <p className="mt-0.5 text-[11px] text-ink-mute">
          {position.sector} · {position.shares.toLocaleString()} shares
        </p>
        {position.statusNote && (
          <p className="mt-1.5 text-[11.5px] leading-[1.4] text-ink-soft">
            {position.statusNote}
          </p>
        )}
        {isDelisted && (
          <p className="mt-1.5 flex items-center gap-1 text-[10.5px] italic text-ink-mute">
            <IconClock size={12} stroke={1.75} />
            More detail on what this means — coming later
          </p>
        )}
        {trigger && (
          <>
            <p className="mt-2 flex items-start gap-1.5 text-[12px] font-medium text-ink">
              {trigger.reviewed ? (
                <IconCoin size={12} stroke={1.75} className="mt-0.5 flex-shrink-0 text-indigo-deep" />
              ) : (
                <IconNews size={12} stroke={1.75} className="mt-0.5 flex-shrink-0 text-indigo-deep" />
              )}
              {trigger.headline}
            </p>
            <p className="mt-1 pl-[18.5px] text-[11.5px] leading-[1.4] text-ink-soft">
              {trigger.reviewed ? (
                <>
                  Reviewed before you bought ·{" "}
                  <b className="font-medium text-indigo-deep">
                    worth checking if it still holds
                  </b>
                </>
              ) : (
                <>
                  You hadn&apos;t reviewed {SECTION_LABELS[trigger.section]}{" "}
                  before buying ·{" "}
                  <b className="font-medium text-amber">worth a first look</b>
                </>
              )}
            </p>
          </>
        )}
          </div>
          <div className="flex-shrink-0 text-right">
        <div className="relative mb-2 flex justify-end">
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={`Actions for ${position.name} position`}
              aria-controls={menuId}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={togglePositionMenu}
              className="rounded-full p-1.5 text-ink-mute hover:bg-surface-tint hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              <IconDotsVertical size={18} stroke={1.8} />
            </button>
            {menuOpen && menuPosition && typeof document !== "undefined" &&
              createPortal(
              <div
                id={menuId}
                ref={menuRef}
                className="fixed z-[60] min-w-36 rounded-md border border-border bg-surface p-1 text-left shadow-float"
                style={menuPosition}
              >
                {!isSuspended && !isDelisted && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setTradeAction("buy");
                      }}
                      className="block w-full rounded px-3 py-2 text-[12px] text-ink hover:bg-surface-tint"
                    >
                      Buy more
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setTradeAction("sell");
                      }}
                      className="block w-full rounded px-3 py-2 text-[12px] text-ink hover:bg-surface-tint"
                    >
                      Sell shares
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmDeleteOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-[12px] text-red hover:bg-surface-tint"
                >
                  <IconTrash size={14} stroke={1.75} />
                  Delete position
                </button>
              </div>,
              document.body,
            )}
          </div>
        <p className="font-mono text-[13px] font-semibold text-ink">
          {position.currentValue === null
            ? "—"
            : `₦${position.currentValue.toLocaleString()}`}
        </p>
        {position.currentValue === null && (
          <p className="mt-0.5 text-[9.5px] text-ink-mute">Value unavailable</p>
        )}
        {(isSuspended || isDelisted) && (
          <p className="mt-0.5 text-[9.5px] text-ink-mute">
            {isDelisted ? "final value" : "price frozen"}
          </p>
        )}
        {!isDelisted && position.returnPct !== null && (
          <p
            className={`mt-0.5 font-mono text-[11px] ${
              isSuspended
                ? "text-ink-mute"
                : position.returnPct >= 0
                  ? "text-green"
                  : "text-red"
            }`}
          >
            {position.returnPct >= 0 ? "+" : "−"}
            {Math.abs(position.returnPct)}%
          </p>
        )}
        {!isDelisted && position.returnPct === null && (
          <p className="mt-0.5 font-mono text-[11px] text-ink-mute">—</p>
        )}
          </div>
        </div>
      </div>
      {!isSuspended && !isDelisted && (
        <>
          <BuySheet
            companyName={position.name}
            currentPrice={position.currentPrice}
            triggerLabel="Buy more"
            open={tradeAction === "buy"}
            onOpenChange={(open) => setTradeAction(open ? "buy" : null)}
            hideTrigger
            onConfirm={onBuyConfirm}
          />
          <SellSheet
            companyName={position.name}
            currentPrice={position.currentPrice}
            position={{
              shares: position.shares,
              avgPrice: position.costBasis / position.shares,
            }}
            open={tradeAction === "sell"}
            onOpenChange={(open) => setTradeAction(open ? "sell" : null)}
            hideTrigger
            onConfirm={onSellConfirm}
          />
        </>
      )}
      <dialog
        ref={deleteDialogRef}
        onClose={() => setConfirmDeleteOpen(false)}
        onClick={(event) => {
          if (event.target === deleteDialogRef.current) {
            deleteDialogRef.current?.close();
          }
        }}
        aria-labelledby={deleteTitleId}
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40"
      >
        <div className="rounded-t-3xl bg-surface px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5 shadow-float">
          <h2
            id={deleteTitleId}
            className="mb-2 font-serif text-lg font-medium tracking-tight text-ink"
          >
            Delete {position.ticker} position?
          </h2>
          <p className="mb-5 text-[12.5px] leading-[1.5] text-ink-mute">
            This removes it from your Portfolio. It won&apos;t record a sale.
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => deleteDialogRef.current?.close()}
              className="flex-1 rounded-[12px] border border-border bg-surface py-3 text-[13px] font-medium text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              Keep position
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                deleteDialogRef.current?.close();
              }}
              className="flex-1 rounded-[12px] bg-red py-3 text-[13px] font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              Delete position
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
