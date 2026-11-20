import type { ComponentType } from "react";
import Link from "next/link";
import {
  IconAntenna,
  IconBolt,
  IconBuildingBank,
  IconBuildingFactory2,
  IconChevronRight,
  IconFlame,
  IconHeart,
  IconShoppingBag,
  IconChartLine,
  IconShield,
  IconChecks,
  IconCoins,
} from "@tabler/icons-react";
import { getSectors } from "@/lib/discover/sectors";
import { getSectorView } from "@/lib/discover/sector-view";
import { sectorSlug } from "@/lib/discover/slug";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import { TickerBadge } from "@/components/company/ticker-badge";
import { AppBackButton } from "@/components/app-shell/app-back-button";

const SECTOR_ICON: Record<
  string,
  ComponentType<{ size?: number; stroke?: number }>
> = {
  "building-bank": IconBuildingBank,
  antenna: IconAntenna,
  "shopping-bag": IconShoppingBag,
  flame: IconFlame,
  bolt: IconBolt,
  "building-factory-2": IconBuildingFactory2,
  heart: IconHeart,
};

const DIMENSION_ICON: Record<
  string,
  ComponentType<{ size?: number; stroke?: number; className?: string }>
> = {
  "chart-line": IconChartLine,
  shield: IconShield,
  checks: IconChecks,
  coins: IconCoins,
};

export default async function SectorViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sectors, sectorView] = await Promise.all([
    getSectors(),
    getSectorView(slug),
  ]);
  const discoverCompanies =
    slug === "banking" ? await getDiscoverCompanies() : [];
  const sectorMeta = sectors.find((sector) => sectorSlug(sector.name) === slug);
  const displayName = sectorView?.name ?? sectorMeta?.name ?? slug;
  const displayIcon = sectorView?.icon ?? sectorMeta?.icon;
  const Icon = displayIcon ? SECTOR_ICON[displayIcon] : undefined;

  return (
    <div className="px-5 pt-10 pb-10">
      <div className="mb-5 flex items-center gap-3">
        <AppBackButton fallbackHref="/discover" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-tint px-[13px] py-2 text-[12.5px] font-medium text-indigo-deep">
          {Icon && <Icon size={13} stroke={1.75} />}
          {displayName}
        </span>
      </div>

      {!sectorView ? (
        <div>
          <h1 className="mb-2 font-serif text-2xl font-medium tracking-tight">
            {displayName}
          </h1>
          <p className="text-[13px] leading-[1.55] text-ink-soft">
            This sector&apos;s dedicated page isn&apos;t built yet — check back
            once it&apos;s ready.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-5">
            <h1 className="mb-2.5 font-serif text-[26px] font-medium tracking-[-0.01em] leading-[1.2]">
              {sectorView.name}
            </h1>
            <p className="text-[13.5px] leading-[1.6] text-ink-soft">
              {sectorView.description}
            </p>
          </div>

          <div className="mb-6 rounded-[18px] border border-border bg-surface p-[18px_20px] shadow-card">
            <h2 className="mb-3.5 font-serif text-[16px] font-medium tracking-[-0.01em]">
              A simple way to compare banking.
            </h2>
            <p className="mb-3.5 text-[12px] leading-[1.5] text-ink-mute">
              Compare these areas where data is available.
            </p>
            <div className="flex flex-col gap-2.5">
              {sectorView.compareDimensions.map((dimension) => {
                const DimensionIcon = DIMENSION_ICON[dimension.icon];
                return (
                  <div
                    key={dimension.name}
                    className="flex items-start gap-2.5"
                  >
                    <div className="mt-0.5 flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[7px] bg-indigo-tint text-indigo-deep">
                      {DimensionIcon && (
                        <DimensionIcon size={12} stroke={1.75} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-ink">
                        {dimension.name}
                      </p>
                      <p className="text-[11.5px] leading-[1.4] text-ink-mute">
                        {dimension.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="font-serif text-[18px] font-medium tracking-[-0.01em]">
              All {sectorView.name.toLowerCase()} companies
            </h2>
            <p className="text-[12px] text-ink-mute">
              If you already have one in mind.
            </p>
          </div>
          <div className="divide-y divide-border overflow-hidden rounded-[18px] border border-border bg-surface shadow-card">
            {discoverCompanies.map((company) => (
              <Link
                key={company.companyId}
                href={`/company/${company.slug}`}
                className="flex items-center gap-3 p-[13px_15px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo"
              >
                <TickerBadge ticker={company.ngxSymbol} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">
                    {company.name}
                  </p>
                </div>
                <IconChevronRight
                  size={16}
                  stroke={1.75}
                  className="flex-shrink-0 text-ink-mute"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
