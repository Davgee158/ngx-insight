"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { InsightLoaderMark } from "./insight-loader-mark";
import {
  getRouteFallbackVisibility,
  subscribeToRouteLoading,
} from "@/lib/app-shell/route-loading-state";

type LoaderPhase = "hidden" | "visible" | "exiting";
const MINIMUM_DISPLAY_MS = 900;
const EXIT_FADE_MS = 280;
const READY_SETTLE_MS = 150;

export function NavigationLoadingOverlay() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<LoaderPhase>("hidden");
  const phaseRef = useRef<LoaderPhase>("hidden");
  const loadingStartedAt = useRef(0);
  const routeChanged = useRef(false);
  const pathnameRef = useRef(pathname);
  const fallbackVisible = useSyncExternalStore(
    subscribeToRouteLoading,
    getRouteFallbackVisibility,
    () => false,
  );
  const exitTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);

  function beginLoading() {
    if (phaseRef.current === "visible") return;
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    if (removeTimer.current) window.clearTimeout(removeTimer.current);
    loadingStartedAt.current = Date.now();
    routeChanged.current = false;
    phaseRef.current = "visible";
    setPhase("visible");
  }

  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      routeChanged.current = true;
    }
    if (phaseRef.current !== "visible" || !routeChanged.current || fallbackVisible) {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
      return;
    }

    const settleTimer = window.setTimeout(() => {
      const remainingMinimum = Math.max(
        0,
        MINIMUM_DISPLAY_MS - (Date.now() - loadingStartedAt.current),
      );
      exitTimer.current = window.setTimeout(() => {
        phaseRef.current = "exiting";
        setPhase("exiting");
        removeTimer.current = window.setTimeout(() => {
          phaseRef.current = "hidden";
          setPhase("hidden");
        }, EXIT_FADE_MS);
      }, remainingMinimum);
    }, READY_SETTLE_MS);

    return () => {
      window.clearTimeout(settleTimer);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, [pathname, fallbackVisible]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-navigation-back]")) {
        beginLoading();
        return;
      }

      const anchor = target.closest("a[href]");
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin === window.location.origin &&
        destination.pathname !== pathnameRef.current
      ) {
        beginLoading();
      }
    }

    function handlePopState() {
      if (window.location.pathname !== pathnameRef.current) beginLoading();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
      if (removeTimer.current) window.clearTimeout(removeTimer.current);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`navigation-loader-overlay${phase === "exiting" ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading page…</span>
      <InsightLoaderMark gradientId="insight-navigation-loader-gradient" />
    </div>
  );
}
