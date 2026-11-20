"use client";

import { useEffect } from "react";

/** Prevents the page behind an open sheet/dialog from scrolling — native <dialog> scroll-blocking is unreliable on iOS Safari. */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);
}
