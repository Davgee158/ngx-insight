"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

const QUICK_REASONS = [
  "Valuation feels stretched",
  "Not enough conviction yet",
  "Prefer to compare with peers",
  "Risks concern me",
  "Not right for my portfolio",
];

export function PassSheet({
  companyName,
  triggerLabel = "Save my reasoning and pass",
  triggerVariant = "link",
}: {
  companyName: string;
  triggerLabel?: string;
  triggerVariant?: "link" | "button";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useBodyScrollLock(isOpen);

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function closeSheet() {
    setIsOpen(false);
    setSelectedReason(null);
    setNotes("");
  }

  const canSave = selectedReason !== null || notes.trim().length > 0;

  return (
    <>
      {triggerVariant === "button" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-[12px] border border-ink bg-transparent p-[13px] text-[13.5px] font-medium text-ink ${FOCUS_RING}`}
        >
          <IconX size={15} stroke={1.75} />
          {triggerLabel}
        </button>
      ) : (
        <p className="mt-0.5 text-center text-[12.5px] text-ink-mute">
          Not the right fit?{" "}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`rounded-sm font-medium text-indigo-deep ${FOCUS_RING}`}
          >
            {triggerLabel}
          </button>
        </p>
      )}

      <dialog
        ref={dialogRef}
        onClose={closeSheet}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeSheet();
        }}
        aria-labelledby="pass-sheet-title"
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none bg-transparent p-0 backdrop:bg-ink/40"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            closeSheet();
          }}
          className="rounded-t-3xl bg-surface px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 shadow-float"
        >
          <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
          <h2
            id="pass-sheet-title"
            className="mb-1 font-serif text-lg font-medium tracking-tight text-ink"
          >
            Save your reasoning
          </h2>
          <p className="mb-4 text-[12.5px] leading-[1.5] text-ink-mute">
            Deciding not to invest in {companyName} is a real decision too. A
            short note now makes it easier to remember why later — or skip it
            entirely.
          </p>

          <span className="mb-1.5 block text-[11.5px] font-medium text-ink-soft">
            What led you to pass?
          </span>
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {QUICK_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedReason(isSelected ? null : reason)
                  }
                  className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium ${FOCUS_RING} ${
                    isSelected
                      ? "border-transparent bg-indigo-tint text-indigo-deep"
                      : "border-border bg-surface text-ink-soft"
                  }`}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              "Add your own words (optional)\n\ne.g. 'Solid business but the multiple is too rich for me right now.'"
            }
            className={`mb-4 min-h-[90px] w-full resize-none rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-ink ${FOCUS_RING}`}
          />

          <button
            type="submit"
            disabled={!canSave}
            className={`flex w-full items-center justify-center gap-1.5 rounded-sm bg-ink py-3 text-[13.5px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
          >
            Save to Decision Journal
            <IconCheck size={14} stroke={1.75} />
          </button>
          <button
            type="button"
            onClick={closeSheet}
            className={`mt-3 block w-full rounded-sm py-2 text-center text-[12.5px] text-ink-mute underline ${FOCUS_RING}`}
          >
            Skip — just record my pass
          </button>
        </form>
      </dialog>
    </>
  );
}
