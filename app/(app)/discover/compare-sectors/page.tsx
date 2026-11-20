import type { ComponentType } from "react";
import Link from "next/link";
import {
  IconArrowsRightLeft,
  IconAntenna,
  IconBuildingBank,
  IconBuildingFactory2,
  IconChevronRight,
  IconFlame,
  IconHeart,
  IconShoppingBag,
} from "@tabler/icons-react";
import { getSectorRankings } from "@/lib/discover/sector-comparison";
import { sectorSlug } from "@/lib/discover/slug";
import { AppBackButton } from "@/components/app-shell/app-back-button";

const SECTOR_ICON: Record<
  string,
  ComponentType<{ size?: number; stroke?: number; className?: string }>
> = {
  "building-bank": IconBuildingBank,
  antenna: IconAntenna,
  "shopping-bag": IconShoppingBag,
  flame: IconFlame,
  "building-factory-2": IconBuildingFactory2,
  heart: IconHeart,
};

export default async function CompareSectorsPage() {
  const rankings = await getSectorRankings();

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-5 flex items-center gap-3">
        <AppBackButton fallbackHref="/discover" />
      </div>

      <h1 className="mb-2.5 font-serif text-[24px] font-medium leading-[1.2] tracking-[-0.015em] text-ink">
        How Nigerian sectors compare.
      </h1>
      <p className="mb-5 text-[12.5px] leading-[1.5] text-ink-mute">
        Ranked by year-to-date total return. Tap any sector to explore it —
        rank doesn&apos;t limit what you can look into.
      </p>

      <div className="flex flex-col gap-2.5">
        {rankings.map((sector, index) => {
          const Icon = SECTOR_ICON[sector.icon];
          const isDown = sector.ytdReturnPct < 0;
          return (
            <Link
              key={sector.slug}
              href={`/discover/sector/${sectorSlug(sector.name)}`}
              className="flex items-start gap-[13px] rounded-[18px] border border-border bg-surface p-[15px_16px] shadow-card transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
            >
              <span className="w-[22px] flex-shrink-0 pt-[1px] font-mono text-[14px] font-semibold text-ink-mute">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-[3px] flex items-center gap-1.5">
                  {Icon && (
                    <Icon size={13} stroke={1.75} className="text-ink-mute" />
                  )}
                  <span className="text-[13.5px] font-semibold text-ink">
                    {sector.name}
                  </span>
                </div>
                <p
                  className={`mb-[5px] font-mono text-[11.5px] ${
                    isDown ? "text-red" : "text-green-deep"
                  }`}
                >
                  {isDown ? "" : "+"}
                  {sector.ytdReturnPct.toFixed(1)}% YTD
                </p>
                <p className="text-[12px] leading-[1.45] text-ink-soft">
                  {sector.reason}
                </p>
              </div>
              <IconChevronRight
                size={16}
                stroke={1.75}
                className="mt-0.5 flex-shrink-0 text-ink-mute"
              />
            </Link>
          );
        })}
      </div>

      <Link
        href="/discover/compare-sectors/banking-vs-energy"
        className="mt-[18px] flex items-center justify-center gap-1.5 rounded-[12px] bg-ink p-[13px] text-[13px] font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
      >
        <IconArrowsRightLeft size={14} stroke={1.75} />
        Compare two sectors
      </Link>
    </div>
  );
}
