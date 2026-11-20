"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const APP_ROUTE_HISTORY_KEY = "insight-app-route-history";

export function AppRouteHistory() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    try {
      if (!initialized.current) {
        sessionStorage.setItem(APP_ROUTE_HISTORY_KEY, JSON.stringify([pathname]));
        initialized.current = true;
        return;
      }

      const stored = sessionStorage.getItem(APP_ROUTE_HISTORY_KEY);
      const history: string[] = stored ? JSON.parse(stored) : [];
      const previousIndex = history.lastIndexOf(pathname);

      if (history.at(-1) === pathname) return;

      const nextHistory =
        previousIndex >= 0
          ? history.slice(0, previousIndex + 1)
          : [...history, pathname];

      sessionStorage.setItem(
        APP_ROUTE_HISTORY_KEY,
        JSON.stringify(nextHistory),
      );
    } catch {
      // If session storage is unavailable, AppBackButton uses its fallback route.
      initialized.current = true;
    }
  }, [pathname]);

  return null;
}
