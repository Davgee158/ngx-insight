import Link from "next/link";
import {
  IconAntenna,
  IconArrowRight,
  IconBookmark,
  IconBolt,
  IconBriefcase,
  IconBuildingBank,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react";
import type { HomeCompanyItem, HomeData } from "@/lib/home/home-data-adapter";

function formatPrice(value: number | null): string {
  if (value === null) return "—";
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function CompanyRows({
  companies,
  includeShares = false,
}: {
  companies: HomeCompanyItem[];
  includeShares?: boolean;
}) {
  return (
    <div className="mt-4 border-t border-border pt-1">
      {companies.map((company) => (
        <Link
          key={company.companyId}
          href={company.analysisHref}
          className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-3 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-ink">
              {company.name}
            </span>
            <span className="mt-0.5 block text-xs text-ink-mute">
              {company.ticker}
              {includeShares && company.shares !== undefined &&
                ` · ${company.shares.toLocaleString("en-NG")} shares`}
            </span>
          </span>
          <span className="shrink-0 text-[13px] font-medium tabular-nums text-ink-soft">
            {formatPrice(company.sharePrice)}
          </span>
        </Link>
      ))}
    </div>
  );
}

function HomeCard({
  icon: Icon,
  kicker,
  title,
  copy,
  ctaLabel,
  ctaHref,
  children,
}: {
  icon: typeof IconSearch;
  kicker: string;
  title: string;
  copy: string;
  ctaLabel: string;
  ctaHref: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-surface p-5 shadow-hero">
      <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-indigo-tint px-2.5 py-1.5 text-[11px] font-medium text-indigo-deep">
        <Icon size={12} stroke={2} />
        {kicker}
      </div>
      <h2 className="mb-3.5 font-serif text-[21px] font-semibold leading-[1.26] tracking-tight text-ink">
        {title}
      </h2>
      <p className="text-[13px] leading-[1.55] text-ink-soft">{copy}</p>
      {children}
      <div className="mt-[18px] flex justify-end border-t border-border pt-4">
        <Link
          href={ctaHref}
          className="flex items-center gap-1.5 rounded-xl bg-ink px-[18px] py-3 text-[13px] font-medium text-white transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          {ctaLabel}
          <IconArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function TimelineItem({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-3.5">
      <div className="flex w-4 flex-shrink-0 flex-col items-center">
        <span className="mt-1.5 h-[9px] w-[9px] flex-shrink-0 rounded-full bg-indigo" />
        {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
      </div>
      <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-6"}`}>
        {children}
      </div>
    </div>
  );
}

const DISCOVERY_INDUSTRIES = [
  { name: "Banking", icon: IconBuildingBank, href: "/discover/sector/banking" },
  { name: "Telecom", icon: IconAntenna, href: "/discover/coming-soon?sector=Telecom&from=%2F" },
  { name: "Consumer", icon: IconShoppingBag, href: "/discover/coming-soon?sector=Consumer&from=%2F" },
  { name: "Energy", icon: IconBolt, href: "/discover/coming-soon?sector=Energy&from=%2F" },
] as const;

function IndustryLinks() {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {DISCOVERY_INDUSTRIES.map(({ name, icon: Icon, href }) => (
        <Link
          key={name}
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-medium text-ink-soft transition-colors hover:border-indigo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
        >
          <Icon size={13} stroke={1.75} />
          {name}
        </Link>
      ))}
    </div>
  );
}

export function HomeView({ homeData }: { homeData: HomeData }) {
  const hasCompanies =
    homeData.watchlistCompanies.length > 0 || homeData.holdings.length > 0;

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_50%_0%,var(--color-indigo-glow),transparent_55%)] px-5 pb-8 pt-16">
      <header className="mb-6">
        <h1 className="mb-1 font-serif text-[23px] font-medium tracking-tight text-ink">
          Welcome
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-mute">
          Your saved companies and holdings, together in one place.
        </p>
      </header>

      {!hasCompanies ? (
        <HomeCard
          icon={IconSearch}
          kicker="Where curiosity begins"
          title="Find a company worth understanding."
          copy="Explore the listed banks, then save a company to your Watchlist or add a holding to your Portfolio."
          ctaLabel="Explore companies"
          ctaHref="/discover"
        >
          <IndustryLinks />
        </HomeCard>
      ) : (
        <div className="flex flex-col">
          {homeData.watchlistCompanies.length > 0 && (
            <TimelineItem>
              <HomeCard
                icon={IconBookmark}
                kicker="Your Watchlist"
                title="Companies you’re following."
                copy="Open a company to continue reviewing its available information."
                ctaLabel="Open Watchlist"
                ctaHref="/watchlist"
              >
                <CompanyRows companies={homeData.watchlistCompanies} />
              </HomeCard>
            </TimelineItem>
          )}
          {homeData.holdings.length > 0 && (
            <TimelineItem isLast>
              <HomeCard
                icon={IconBriefcase}
                kicker="Your Portfolio"
                title="Companies you hold."
                copy="Review your recorded positions and the prices available in the app."
                ctaLabel="Open Portfolio"
                ctaHref="/portfolio"
              >
                <CompanyRows companies={homeData.holdings} includeShares />
              </HomeCard>
            </TimelineItem>
          )}
          <Link
            href="/discover"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3 text-[13px] font-medium text-ink-soft hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo"
          >
            Explore other companies <IconArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
