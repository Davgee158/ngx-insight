"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { APP_ROUTE_HISTORY_KEY } from "@/components/app-shell/app-route-history";

const DEFAULT_CLASS_NAME =
  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[11px] border border-border bg-surface text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo";

export function AppBackButton({
  fallbackHref,
  className = DEFAULT_CLASS_NAME,
  label = "Go back",
}: {
  fallbackHref: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    try {
      const stored = sessionStorage.getItem(APP_ROUTE_HISTORY_KEY);
      const routeHistory: unknown = stored ? JSON.parse(stored) : [];

      if (Array.isArray(routeHistory)) {
        const currentIndex = routeHistory.lastIndexOf(pathname);
        if (currentIndex > 0) {
          router.back();
          return;
        }
      }
    } catch {
      // Fall back to the page's in-app destination if history cannot be read.
    }

    router.replace(fallbackHref);
  }

  return (
    <button
      type="button"
      aria-label={label}
      data-navigation-back
      onClick={handleBack}
      className={className}
    >
      <IconArrowLeft size={18} stroke={1.75} />
    </button>
  );
}
