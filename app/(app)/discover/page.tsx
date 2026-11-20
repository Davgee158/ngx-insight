import SearchBar from "@/components/discover/searchBar";
import {
  IconArrowRight,
  IconCoins,
  IconTrendingUp,
  IconShield,
  IconPoint,
  IconRefresh,
  IconLink,
} from "@tabler/icons-react";
import { getChosenForYou } from "@/lib/discover/chosen-for-you";
import { ChosenForYouRail } from "@/components/discover/chosenForYouRail";
import { getLenses } from "@/lib/discover/lenses";
import { getExploreData } from "@/lib/discover/explore";
import { getRecentUpdates } from "@/lib/discover/recent-updates";
import { sectorSlug, lensSlug } from "@/lib/discover/slug";
import { SavedLensToggle } from "@/components/discover/savedLensToggle";
import Link from "next/link";
import {
  IconBuildingBank,
  IconAntenna,
  IconShoppingBag,
  IconFlame,
  IconBuildingFactory2,
  IconHeart,
} from "@tabler/icons-react";
import { getDiscoverCompanies } from "@/lib/discover/companies";
import { getSectors } from "@/lib/discover/sectors";

const SECTOR_ICON: Record<
  string,
  React.ComponentType<{ size?: number; stroke?: number }>
> = {
  "building-bank": IconBuildingBank,
  antenna: IconAntenna,
  "shopping-bag": IconShoppingBag,
  flame: IconFlame,
  "building-factory-2": IconBuildingFactory2,
  heart: IconHeart,
};

const LENS_ICON: Record<
  string,
  React.ComponentType<{ size?: number; stroke?: number }>
> = {
  coins: IconCoins,
  "trending-up": IconTrendingUp,
  shield: IconShield,
};

export default async function DiscoverPage() {
  const chosenForYou = await getChosenForYou();
  const lenses = await getLenses();
  const exploreData = await getExploreData();
  const recentUpdates = await getRecentUpdates();
  const sectors = await getSectors();
  const discoverCompanies = await getDiscoverCompanies();
  const bankingCompanyCount = discoverCompanies.length;

  return (
    <div className="px-5 pt-10">
      <header>
        <h1 className="mb-1 text-2xl font-medium font-serif tracking-tight text-ink">
          Discover
        </h1>
        <p className="tracking-tight text-[12.5px] text-ink-mute">
          Explore business, market themes, and investing ideas.
        </p>
        <SearchBar companies={discoverCompanies} />
        <Link
          href="/discover/companies"
          className="mt-3 mb-6 flex w-full items-center gap-3 rounded-[14px] border border-border bg-surface px-3.5 py-3 shadow-card transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-surface-tint text-ink-soft">
            <IconBuildingBank size={17} stroke={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-ink">
              Browse all companies
            </span>
            <span className="mt-0.5 block text-[11px] text-ink-mute">
              View all {discoverCompanies.length} listed companies
            </span>
          </span>
          <IconArrowRight size={16} className="flex-shrink-0 text-ink-mute" />
        </Link>

      </header>

      <ChosenForYouRail
        anchorReason={chosenForYou.anchorReason}
        companies={chosenForYou.companies}
      />

      <div className="mt-8 ">
        <h2 className="font-serif text-lg font-medium tracking-tight text-ink">
          Explore by sector
        </h2>
        <p className="text-[12.5px] text-ink-mute">
          Different industries, different ways of making money
        </p>
        <div className="flex justify-end mb-2">
          <Link
            href="/discover/compare-sectors"
            className="flex items-center gap-1 rounded-sm text-[12.5px] font-medium text-indigo-deep whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            Compare Sectors
            <IconArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sectors.map((sector) => {
            const Icon = SECTOR_ICON[sector.icon];
            const companyCount =
              sector.name === "Banking" ? bankingCompanyCount : sector.count;
            return (
              <Link
                key={sector.name}
                href={`/discover/sector/${sectorSlug(sector.name)}`}
                className={`relative min-h-[88px] shadow-card rounded-md border p-4 transition-transform hover:-translate-y-0.5 hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo ${
                  sector.themedCue
                    ? "border-indigo-border-soft"
                    : "border-border"
                }`}
              >
                {sector.themedCue && (
                  <span className="absolute right-2.5 top-2.5 text-[9px] font-semibold text-indigo-deep uppercase tracking-wide">
                    {sector.themedCue}
                  </span>
                )}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-[8px] ${
                    sector.themedCue
                      ? "bg-indigo-tint text-indigo-deep"
                      : "bg-surface-tint text-ink-soft"
                  }`}
                >
                  <Icon size={15} stroke={1.75} />
                </div>
                <div className="text-[13px] font-semibold text-ink mt-1">
                  {sector.name}
                </div>
                <p className="text-[11px] text-ink-mute">
                  {companyCount} companies
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg font-medium tracking-tight text-ink">
          Explore through a lens
        </h2>
        <p className="text-[12.5px] text-ink-mute">
          Different ways of looking at the same market
        </p>

        <div className="scrollbar-hide flex overflow-x-auto gap-3.5 -mx-5 px-5 pb-1 mt-3.5">
          {lenses.map((lens) => {
            const Icon = LENS_ICON[lens.icon];
            return (
              <div
                key={lens.name}
                className="relative flex-shrink-0 w-[220px] shadow-card rounded-md border border-border bg-surface transition-transform hover:-translate-y-0.5 hover:shadow-float"
              >
                <SavedLensToggle
                  title={lens.name}
                  className="absolute right-3 top-3 h-6.5 w-6.5"
                />
                <Link
                  href={`/discover/lens/${lensSlug(lens.name)}`}
                  className="flex h-full flex-col gap-2.5 rounded-md p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
                >
                  <div
                    className={`flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-wide ${
                      lens.isThemed ? "text-indigo-deep" : "text-ink-mute"
                    }`}
                  >
                    {lens.isThemed ? (
                      <IconRefresh size={11} stroke={1.75} />
                    ) : (
                      <IconPoint size={11} stroke={1.75} />
                    )}
                    {lens.tag}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6.5 w-6.5 flex-shrink-0 items-center justify-center rounded-[8px] ${
                        lens.isThemed
                          ? "bg-indigo-tint text-indigo-deep"
                          : "bg-surface-tint text-ink-soft"
                      }`}
                    >
                      <Icon size={14} stroke={1.75} />
                    </div>
                    <h3 className="text-[13.5px] font-semibold text-ink">
                      {lens.name}
                    </h3>
                  </div>

                  <p className="text-[12px] leading-[1.45] text-ink-mute">
                    {lens.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
                    <span className="text-[11.5px] text-ink-mute">
                      {lens.companyCount} companies
                    </span>
                    <div className="flex items-center gap-1 text-[12.5px] font-medium text-indigo-deep">
                      Explore
                      <IconArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg font-medium tracking-tight text-ink">
          More ideas to explore
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] text-ink-mute">
            Other ways of thinking about businesses
          </p>
          <Link
            href="/discover/coming-soon"
            className="flex items-center gap-1 rounded-sm text-[12.5px] font-medium text-indigo-deep whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            See all
            <IconArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-3.5 flex flex-col gap-3">
          {exploreData.map((item) => (
            <div
              key={item.title}
              className="relative rounded-md border border-border bg-surface shadow-card"
            >
              <SavedLensToggle
                title={item.title}
                className="absolute right-3.5 top-3.5 h-6.5 w-6.5"
              />

              <Link
                href={`/discover/lens/${lensSlug(item.title)}`}
                className="block rounded-md p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
              >
                <div className="mb-1.5 pr-8 text-[10.5px] font-medium uppercase tracking-wide text-ink-mute">
                  {item.kicker}
                </div>
                <h3 className="mb-1.5 pr-8 font-serif text-[15px] font-medium leading-snug tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mb-3 text-[12px] leading-[1.5] text-ink-mute">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <span className="text-[11.5px] text-ink-mute">
                    {item.companyCount} companies
                  </span>
                  <div className="flex items-center gap-1 text-[12.5px] font-medium text-indigo-deep">
                    Explore
                    <IconArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-ink-soft">
            Recently updated
          </h2>
          <Link
            href="/discover/coming-soon"
            className="flex items-center gap-1 rounded-sm text-[12.5px] font-medium text-indigo-deep whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            See all
            <IconArrowRight size={13} />
          </Link>
        </div>

        <div className="flex flex-col">
          {recentUpdates.map((update, index) => (
            <div
              key={update.name}
              className={`flex items-center gap-2.5 py-2.5 ${
                index === 0 ? "" : "border-t border-border"
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-[12.5px] font-semibold text-ink">
                  {update.name}
                </span>
                {update.isThemed && (
                  <span className="ml-1.5 inline-flex items-center gap-1 align-middle text-[9px] font-semibold uppercase tracking-wide text-indigo-deep">
                    <IconLink size={10} stroke={1.75} />
                    Part of this week&apos;s theme
                  </span>
                )}
                <div className="mt-0.5 text-[11.5px] leading-[1.4] text-ink-mute">
                  {update.what}
                </div>
              </div>
              <div className="flex-shrink-0 text-[11px] text-ink-mute">
                {update.when}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
