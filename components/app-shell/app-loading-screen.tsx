"use client";

import { useEffect } from "react";
import { InsightLoaderMark } from "./insight-loader-mark";
import { setRouteFallbackVisibility } from "@/lib/app-shell/route-loading-state";

export function AppLoadingScreen() {
  useEffect(() => {
    setRouteFallbackVisibility(true);
    return () => setRouteFallbackVisibility(false);
  }, []);

  return (
    <div
      className="app-route-loading-screen"
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Loading page…</span>
      <InsightLoaderMark gradientId="insight-route-loader-gradient" />
    </div>
  );
}
