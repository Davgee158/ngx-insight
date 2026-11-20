/* Hallmark · component: nav (N5 floating pill) · genre: editorial (inherited)
 * states: default · hover · focus-visible · active(press) · current(selected)
 * loading / error / success: n/a — a nav tab has no such semantics
 * tokens: existing project tokens only (app/globals.css) — no new theme
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCompass,
  IconEye,
  IconHome,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import type { Icon as TablerIcon } from "@tabler/icons-react";

interface Tab {
  href: string;
  label: string;
  icon: TablerIcon;
}

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/discover", label: "Discover", icon: IconCompass },
  { href: "/watchlist", label: "Watchlist", icon: IconEye },
  { href: "/portfolio", label: "Portfolio", icon: IconWallet },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full bg-ink-deep p-1.5 shadow-float backdrop-blur-md"
      >
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center rounded-full transition-colors duration-150 ease-out active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-light ${
                isActive
                  ? "gap-1.5 bg-white/15 px-3.5 py-2.5 text-white"
                  : "h-11 w-11 justify-center text-white/62 hover:text-white/80"
              }`}
            >
              <span className="relative flex items-center justify-center">
                <Icon size={19} stroke={1.75} />
              </span>
              {isActive ? (
                <span className="text-[12.5px] font-medium tracking-tight">
                  {tab.label}
                </span>
              ) : (
                <span className="sr-only">{tab.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
