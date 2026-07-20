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
  showDot?: boolean;
}

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/discover", label: "Discover", icon: IconCompass },
  { href: "/watchlist", label: "Watchlist", icon: IconEye, showDot: true },
  { href: "/portfolio", label: "Portfolio", icon: IconWallet },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border bg-surface/90 px-2 pt-3 pb-6 backdrop-blur-md">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex w-14 flex-col items-center gap-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
              isActive ? "text-ink" : "text-ink-mute"
            }`}
          >
            <span className="relative flex items-center justify-center">
              <span
                className={
                  isActive
                    ? "flex items-center justify-center rounded-[10px] bg-indigo-tint px-3 py-0.5"
                    : ""
                }
              >
                <Icon
                  size={22}
                  stroke={1.75}
                  className={isActive ? "text-indigo-deep" : undefined}
                />
              </span>
              {tab.showDot && (
                <span className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-indigo" />
              )}
            </span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
